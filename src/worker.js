const customFieldKeys = [
  "contact.client_type",
  "contact.service_requested",
  "contact.project_details",
];

function resultPage(status, title, message) {
  return new Response(
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | GHL Megaminds</title><style>body{margin:0;background:#f5f7f6;color:#17221f;font:16px/1.6 system-ui,sans-serif;display:grid;min-height:100vh;place-items:center}.content{max-width:34rem;padding:3rem 1.5rem}h1{font-size:2rem;line-height:1.15}a{color:#087f69;text-underline-offset:3px}</style><main class="content"><p>GHL MEGAMINDS</p><h1>${title}</h1><p>${message}</p><a href="/contact">Back to contact</a></main></html>`,
    {
      status,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

function getString(formData, key, maxLength) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function ghlHeaders(apiKey) {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    Version: "v3",
  };
}

function logGhlFailure(stage, details = {}) {
  console.error("[contact-form] GoHighLevel request failed", {
    stage,
    ...details,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/contact") return env.ASSETS.fetch(request);
    if (request.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { Allow: "POST" },
      });
    }

    const apiKey = env.GHL_SUBACCOUNT_API_KEY;
    const rawLocationId = env.GHL_SUBACCOUNT_LOCATION_ID;

    if (!apiKey || !rawLocationId) {
      return resultPage(503, "Form unavailable", "Please try again later.");
    }

    let formData;
    try {
      formData = await request.formData();
    } catch {
      return resultPage(
        400,
        "Check your details",
        "Please submit the contact form again.",
      );
    }

    const name = getString(formData, "name", 200);
    const email = getString(formData, "email", 320);
    const businessName = getString(formData, "businessName", 200);
    const website = getString(formData, "website", 500);
    const clientType = getString(formData, "clientType", 200);
    const serviceRequested = getString(formData, "serviceRequested", 200);
    const projectDetails = getString(formData, "projectDetails", 5000);

    if (
      !name ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !clientType ||
      !serviceRequested
    ) {
      return resultPage(
        400,
        "Check your details",
        "Please enter your name and a valid email address, then try again.",
      );
    }

    const headers = ghlHeaders(apiKey);
    const locationId = encodeURIComponent(rawLocationId);

    // Attempt custom fields lookup (if configured via env or discoverable via API)
    let customFields = [];

    const envCustomFieldMap = {
      "contact.client_type": env.GHL_CUSTOM_FIELD_CLIENT_TYPE,
      "contact.service_requested": env.GHL_CUSTOM_FIELD_SERVICE_REQUESTED,
      "contact.project_details": env.GHL_CUSTOM_FIELD_PROJECT_DETAILS,
    };

    const fieldValues = [clientType, serviceRequested, projectDetails];

    if (customFieldKeys.every((key) => !!envCustomFieldMap[key])) {
      customFields = customFieldKeys.map((key, index) => ({
        id: envCustomFieldMap[key],
        key,
        fieldValue: fieldValues[index],
      }));
    } else {
      try {
        const fieldsResponse = await fetch(
          `https://services.leadconnectorhq.com/locations/${locationId}/customFields?model=contact`,
          { headers, signal: AbortSignal.timeout(10000) },
        );
        if (fieldsResponse.ok) {
          const fieldsPayload = await fieldsResponse.json();
          const fields = fieldsPayload.customFields ?? fieldsPayload.fields ?? [];
          const mapped = customFieldKeys.map((key, index) => {
            const field = fields.find(
              (item) => item.key === key || item.fieldKey === key,
            );
            if (!field?.id) return null;
            return {
              id: field.id,
              key: field.key ?? field.fieldKey ?? key,
              fieldValue: fieldValues[index],
            };
          });

          if (mapped.every((f) => f !== null)) {
            customFields = mapped;
          } else {
            console.warn(
              "[contact-form] Some custom fields could not be matched in GoHighLevel account. Proceeding with contact upsert and note.",
            );
          }
        } else {
          console.warn(
            `[contact-form] GoHighLevel custom fields lookup returned ${fieldsResponse.status} (token may lack locations/customFields.readonly scope). Proceeding with contact upsert and note.`,
          );
        }
      } catch (err) {
        console.warn("[contact-form] Custom fields lookup error:", err);
      }
    }

    const [firstName, ...lastNameParts] = name.split(/\s+/);
    let failureStage = "contact_upsert";
    try {
      const upsertBody = {
        firstName,
        lastName: lastNameParts.join(" "),
        name,
        email,
        companyName: businessName || undefined,
        website: website || undefined,
        locationId: rawLocationId,
        source: "Website contact form",
        tags: ["website-lead"],
      };

      if (customFields.length > 0) {
        upsertBody.customFields = customFields;
      }

      const contactResponse = await fetch(
        "https://services.leadconnectorhq.com/contacts/upsert",
        {
          method: "POST",
          headers,
          signal: AbortSignal.timeout(15000),
          body: JSON.stringify(upsertBody),
        },
      );

      if (!contactResponse.ok) {
        logGhlFailure(failureStage, { status: contactResponse.status });
        return resultPage(
          502,
          "We could not send your message",
          "Please try again in a little while.",
        );
      }

      const contactPayload = await contactResponse.json();
      const contactId = contactPayload?.contact?.id;

      // Attach full submission details as a contact note so no data is lost
      if (contactId) {
        try {
          const noteContent = [
            "Website Contact Form Submission",
            "--------------------------------",
            `Name: ${name}`,
            `Email: ${email}`,
            businessName ? `Business Name: ${businessName}` : null,
            website ? `Website: ${website}` : null,
            `Client Type: ${clientType}`,
            `Service Requested: ${serviceRequested}`,
            projectDetails ? `\nProject Details:\n${projectDetails}` : null,
          ]
            .filter(Boolean)
            .join("\n");

          await fetch(
            `https://services.leadconnectorhq.com/contacts/${contactId}/notes`,
            {
              method: "POST",
              headers,
              signal: AbortSignal.timeout(10000),
              body: JSON.stringify({ body: noteContent }),
            },
          );
        } catch (noteErr) {
          console.warn("[contact-form] Note creation warning:", noteErr);
        }
      }

      return resultPage(
        200,
        "Thanks for reaching out",
        "Your details have been sent. We will be in touch soon.",
      );
    } catch (error) {
      logGhlFailure(failureStage, {
        errorName: error instanceof Error ? error.name : "UnknownError",
      });
      return resultPage(
        502,
        "We could not send your message",
        "Please try again in a little while.",
      );
    }
  },
};
