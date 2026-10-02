import { NextResponse } from "next/server";
import { site } from "@/data/site";

const LIMITS = { name: 100, email: 254, subject: 200, message: 5000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RecaptchaResult = { success: boolean; hostname?: string };

function fail(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

async function verifyRecaptcha(secret: string, token: string, ip: string | null) {
  const params = new URLSearchParams({ secret, response: token });
  if (ip) params.set("remoteip", ip);

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    body: params,
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return false;

  const result = (await res.json()) as RecaptchaResult;
  if (!result.success) return false;

  const allowedHost = new URL(site.url).hostname;
  const isDev = process.env.NODE_ENV !== "production";
  return (
    result.hostname === allowedHost ||
    result.hostname === `www.${allowedHost}` ||
    (isDev && result.hostname === "localhost")
  );
}

export async function POST(request: Request) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const formEndpoint = process.env.FORMSPREE_ENDPOINT;
  if (!secret || !formEndpoint) {
    console.error("Contact form misconfigured: RECAPTCHA_SECRET_KEY / FORMSPREE_ENDPOINT missing.");
    return fail("Contact form is not available right now.", 500);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request.", 400);
  }

  // Honeypot: bots fill hidden fields. Pretend success and drop the message.
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const fields: Record<string, string> = {};
  for (const key of Object.keys(LIMITS) as (keyof typeof LIMITS)[]) {
    const value = body[key];
    if (typeof value !== "string" || !value.trim() || value.length > LIMITS[key]) {
      return fail("Please check the form fields and try again.", 400);
    }
    fields[key] = value.trim();
  }
  if (!EMAIL_RE.test(fields.email)) {
    return fail("Please enter a valid email address.", 400);
  }

  const token = body.token;
  if (typeof token !== "string" || !token) {
    return fail("reCAPTCHA verification failed. Please try again.", 400);
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? null;
  let verified = false;
  try {
    verified = await verifyRecaptcha(secret, token, ip);
  } catch {
    return fail("Could not verify reCAPTCHA. Please try again.", 502);
  }
  if (!verified) {
    return fail("reCAPTCHA verification failed. Please try again.", 400);
  }

  try {
    const res = await fetch(formEndpoint, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(fields),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`Formspree responded ${res.status}`);
  } catch (error) {
    console.error("Formspree submission failed:", error);
    return fail("Something went wrong sending your message.", 502);
  }

  return NextResponse.json({ ok: true });
}
