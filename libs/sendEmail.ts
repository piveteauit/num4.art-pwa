"use server";
import config from "@/config";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { JSXElementConstructor, ReactElement } from "react";

const server = {
  host: "smtp-relay.brevo.com" ,//process?.env?.MAIL_AUTH_HOST || "ssl0.ovh.net",
  port: 587,//Number(process?.env?.MAIL_AUTH_PORT || "465"),
  secure: false,//process?.env?.MAIL_AUTH_SECURE == "true",
  auth: {
    user: "piveteauit@gmail.com",//process?.env?.MAIL_AUTH_USER || "noreply@myreklam.fr",
    pass: "xsmtpsib-a7b196bb1049e4d5653379abb74983a24794a555d24394ed01d6b12fea694a7e-dpsaDvgVZt5MA8hy",//process?.env?.MAIL_AUTH_PASS || "noreply.mrk.2023"
  }
};
type SendEmailParams = {
  /**
   *
   * Default : "noreply@myreklam.fr"
   * @type {?string}
   */
  from?: string;
  /**
   *
   * Recipient email
   * @type {string}
   */
  to: string;
  /**
   *
   * Text Subject of email
   * @type {string}
   */
  subject: string;
  /**
   *
   * Text format of email
   * @type {?string}
   */
  text?: string;
  /**
   *
   * HTML format of email
   * @type {?string}
   */
  html?: ReactElement<string, string | JSXElementConstructor<any>> | string;
  /**
   *
   *  Attachments
   *
   */
  attachments?: { filename: string; path: string }[];
};

export async function sendEmail({
  from = process?.env?.MRK_MAIL_AUTH_USER,
  to,
  text,
  html,
  subject,
  attachments
}: SendEmailParams) {
  const transporter = nodemailer.createTransport(server);

  transporter.sendMail({
    from,
    to,
    subject,
    html: html
      ? typeof html === "string"
        ? html
        : render(html)
      : undefined,
    text,
    attachments
  });
}
