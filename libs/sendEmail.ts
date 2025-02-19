"use server";
import config, { server } from "@/config";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { JSXElementConstructor, ReactElement } from "react";

type SendEmailParams = {
  /**
   * Default : "noreply@myreklam.fr"
   * @type {?string}
   */
  from?: string;
  /**
   * Recipient email
   * @type {string}
   */
  to: string;
  /**
   * Text Subject of email
   * @type {string}
   */
  subject: string;
  /**
   * Text format of email
   * @type {?string}
   */
  text?: string;
  /**
   * HTML format of email
   * @type {?string}
   */
  html?: ReactElement<string, string | JSXElementConstructor<any>> | string;
  /**
   * Email priority (high, normal, low)
   * @type {?string}
   */
  priority?: "high" | "normal" | "low";
  /**
   * Attachments
   */
  attachments?: { filename: string; path: string }[];
};

export async function sendEmail({
  from = process?.env?.MAIL_AUTH_USER,
  to,
  text,
  html,
  subject,
  priority = "normal",
  attachments
}: SendEmailParams) {
  try {
    console.log("Configuration SMTP:", {
      host: server.host,
      port: server.port,
      secure: server.secure,
      auth: {
        user: server.auth.user ? "défini" : "non défini",
        pass: server.auth.pass ? "défini" : "non défini"
      }
    });

    const transporter = nodemailer.createTransport(server);

    // Vérifier la connexion SMTP
    await transporter.verify();
    console.log("Connexion SMTP vérifiée avec succès");

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html: html ? (typeof html === "string" ? html : render(html)) : undefined,
      text,
      priority,
      attachments
    });

    console.log("Email envoyé avec succès:", {
      messageId: info.messageId,
      to,
      subject
    });

    return info;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", {
      error,
      to,
      subject,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}
