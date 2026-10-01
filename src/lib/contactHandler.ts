const customFieldKeys = [
  "contact.client_type",
  "contact.service_requested",
  "contact.project_details",
];

export function getEnvCredentials(
  runtimeEnv?: Record<string, string | undefined>,
) {
  const apiKey =
    runtimeEnv?.GHL_SUBACCOUNT_API_KEY ||
    process.env.GHL_SUBACCOUNT_API_KEY ||
    (import.meta as any).env?.GHL_SUBACCOUNT_API_KEY;

  const locationId =
    runtimeEnv?.GHL_SUBACCOUNT_LOCATION_ID ||
    process.env.GHL_SUBACCOUNT_LOCATION_ID ||
    (import.meta as any).env?.GHL_SUBACCOUNT_LOCATION_ID;

  return { apiKey, locationId };
}

export function resultPage(status: number, title: string, message: string) {
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

export function resultResponse(
  request: Request,
  status: number,
  title: string,
  message: string,
) {
  const acceptsJson = request.headers
    .get("accept")
    ?.includes("application/json");
  if (acceptsJson) {
    return new Response(
      JSON.stringify({
        success: status >= 200 && status < 300,
        title,
        message,
      }),
      {
        status,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    );
  }
  return resultPage(status, title, message);
}

function getString(formData: FormData, key: string, maxLength: number): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function ghlHeaders(apiKey: string) {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    Version: "v3",
  };
}

function logGhlFailure(stage: string, details: Record<string, unknown> = {}) {
  console.error("[contact-form] GoHighLevel request failed", {
    stage,
    ...details,
  });
}

export async function handleContactRequest(
  request: Request,
  runtimeEnv?: Record<string, string | undefined>,
): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "POST" },
    });
  }

  const { apiKey, locationId } = getEnvCredentials(runtimeEnv);

  if (!apiKey || !locationId) {
    logGhlFailure("missing_credentials", {
      hasApiKey: !!apiKey,
      hasLocationId: !!locationId,
    });
    return resultResponse(
      request,
      503,
      "Form unavailable",
      "Please try again later.",
    );
  }

  let name = "";
  let email = "";
  let businessName = "";
  let website = "";
  let clientType = "";
  let serviceRequested = "";
  let projectDetails = "";

  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const json = await request.json();
      name =
        typeof json.name === "string" ? json.name.trim().slice(0, 200) : "";
      email =
        typeof json.email === "string" ? json.email.trim().slice(0, 320) : "";
      businessName =
        typeof json.businessName === "string"
          ? json.businessName.trim().slice(0, 200)
          : "";
      website =
        typeof json.website === "string"
          ? json.website.trim().slice(0, 500)
          : "";
      clientType =
        typeof json.clientType === "string"
          ? json.clientType.trim().slice(0, 200)
          : "";
      serviceRequested =
        typeof json.serviceRequested === "string"
          ? json.serviceRequested.trim().slice(0, 200)
          : "";
      projectDetails =
        typeof json.projectDetails === "string"
          ? json.projectDetails.trim().slice(0, 5000)
          : "";
    } else {
      const formData = await request.formData();
      name = getString(formData, "name", 200);
      email = getString(formData, "email", 320);
      businessName = getString(formData, "businessName", 200);
      website = getString(formData, "website", 500);
      clientType = getString(formData, "clientType", 200);
      serviceRequested = getString(formData, "serviceRequested", 200);
      projectDetails = getString(formData, "projectDetails", 5000);
    }
  } catch {
    return resultResponse(
      request,
      400,
      "Check your details",
      "Please submit the contact form again.",
    );
  }

  if (
    !name ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !clientType ||
    !serviceRequested
  ) {
    return resultResponse(
      request,
      400,
      "Check your details",
      "Please enter your name and a valid email address, then try again.",
    );
  }

  const headers = ghlHeaders(apiKey);
  const encodedLocationId = encodeURIComponent(locationId);

  let failureStage = "custom_fields_lookup";
  try {
    const fieldsResponse = await fetch(
      `https://services.leadconnectorhq.com/locations/${encodedLocationId}/customFields?model=contact`,
      { headers, signal: AbortSignal.timeout(15000) },
    );
    if (!fieldsResponse.ok) {
      logGhlFailure(failureStage, { status: fieldsResponse.status });
      return resultResponse(
        request,
        502,
        "We could not send your message",
        "Please try again in a little while.",
      );
    }

    failureStage = "custom_fields_response";
    const fieldsPayload: any = await fieldsResponse.json();
    const fields = fieldsPayload.customFields ?? fieldsPayload.fields ?? [];
    const customFields = customFieldKeys.map((key, index) => {
      const field = fields.find(
        (item: any) => item.key === key || item.fieldKey === key,
      );
      if (!field?.id) return null;
      return {
        id: field.id,
        key: field.key ?? field.fieldKey ?? key,
        fieldValue: [clientType, serviceRequested, projectDetails][index],
      };
    });

    if (customFields.some((field) => field === null)) {
      const missingFieldKeys = customFieldKeys.filter((key) => {
        const field = fields.find(
          (item: any) => item.key === key || item.fieldKey === key,
        );
        return !field?.id;
      });
      logGhlFailure("custom_fields_missing", { missingFieldKeys });
      return resultResponse(
        request,
        502,
        "We could not send your message",
        "Please try again in a little while.",
      );
    }

    const [firstName, ...lastNameParts] = name.split(/\s+/);
    failureStage = "contact_upsert";
    const contactResponse = await fetch(
      "https://services.leadconnectorhq.com/contacts/upsert",
      {
        method: "POST",
        headers,
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({
          firstName,
          lastName: lastNameParts.join(" "),
          name,
          email,
          companyName: businessName || undefined,
          website: website || undefined,
          locationId,
          source: "Website contact form",
          customFields,
        }),
      },
    );

    if (!contactResponse.ok) {
      logGhlFailure(failureStage, { status: contactResponse.status });
      return resultResponse(
        request,
        502,
        "We could not send your message",
        "Please try again in a little while.",
      );
    }

    return resultResponse(
      request,
      200,
      "Thanks for reaching out",
      "Your details have been sent. We will be in touch soon.",
    );
  } catch (error) {
    logGhlFailure(failureStage, {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return resultResponse(
      request,
      502,
      "We could not send your message",
      "Please try again in a little while.",
    );
  }
}
