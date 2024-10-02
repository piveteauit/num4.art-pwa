"use server";
import config, { server }  from "@/config";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { JSXElementConstructor, ReactElement } from "react";


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
  from = process?.env?.MAIL_AUTH_USER,
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
