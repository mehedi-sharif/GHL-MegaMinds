import type { APIRoute } from "astro";
import { handleContactRequest } from "@/lib/contactHandler";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  return handleContactRequest(request, (locals as any)?.runtime?.env);
};

export const ALL: APIRoute = async ({ request, locals }) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "POST" },
    });
  }
  return handleContactRequest(request, (locals as any)?.runtime?.env);
};
