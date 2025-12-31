import { NextResponse } from "next/server";
import { SIGNUP_TEMPLATE, FORGOT_PASSWORD_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "./templates";
import { APP_NAME } from "../constants/app";

export async function SendEmail(to: string, subject: string, type: string, data?: string) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY as string;
  if (!BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is not set in environment variables");
  }

  let html = "";
  if (type === "signup") {
    html = SIGNUP_TEMPLATE;
  } else if (type === "forgot-password") {
    // TODO: Implement forgot password template
    html = data ? FORGOT_PASSWORD_TEMPLATE.replace("{{token}}", data) : FORGOT_PASSWORD_TEMPLATE;
  } else if (type === "password-reset") {
    // TODO: Implement password reset template
    html = PASSWORD_RESET_TEMPLATE;
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: APP_NAME,
        email: "kashyapkrlucky@gmail.com",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
