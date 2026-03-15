import { Resend } from "resend";

interface SendWelcomeEmailParams {
  email: string;
  name: string | null;
  password: string;
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY no esta configurado");
    return null;
  }
  return new Resend(apiKey);
}

interface SendPasswordResetEmailParams {
  email: string;
  password: string;
}

export async function sendPasswordResetEmail({ email, password }: SendPasswordResetEmailParams): Promise<boolean> {
  const resend = getResendClient();

  if (!resend) {
    console.warn("Email no enviado: Resend no configurado");
    return false;
  }

  const appName = "No Mas Migajas";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3333";
  const loginUrl = `${baseUrl}/login`;
  const logoUrl = `${baseUrl}/logo_lp.png`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recuperacion de contrasena - ${appName}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #09090b; border-radius: 12px; border: 1px solid #27272a;">
              <tr>
                <td style="padding: 40px 40px 20px 40px; text-align: center;">
                  <img src="${logoUrl}" alt="${appName}" width="180" style="display: inline-block; max-width: 180px; height: auto;" />
                  <p style="margin: 10px 0 0 0; color: #a1a1aa; font-size: 14px;">Recuperacion de contrasena</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 40px;">
                  <p style="margin: 0 0 20px 0; color: #d4d4d8; font-size: 15px; line-height: 1.6;">
                    Recibimos tu solicitud de recuperacion de contrasena. Tu nueva contrasena temporal es:
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 40px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #18181b; border-radius: 8px; border: 1px solid #27272a;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0 0 8px 0; color: #a1a1aa; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Nueva contrasena</p>
                        <p style="margin: 0; color: #D4AF37; font-size: 18px; font-weight: 600; letter-spacing: 1px;">${password}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 40px;">
                  <p style="margin: 0; color: #a1a1aa; font-size: 13px; line-height: 1.5;">
                    Te recomendamos cambiar esta contrasena desde tu perfil despues de iniciar sesion.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 40px 40px 40px;">
                  <a href="${loginUrl}" style="display: inline-block; background-color: #ffffff; color: #0a0a0a; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600;">
                    Iniciar Sesion
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 40px 40px 40px; border-top: 1px solid #27272a;">
                  <p style="margin: 20px 0 0 0; color: #71717a; font-size: 13px; line-height: 1.5;">
                    Si no solicitaste este cambio, puedes ignorar este mensaje. Tu contrasena anterior ya no es valida.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: "No Mas Migajas <noreply@nomasmigajas.site>",
      to: email,
      subject: "Recuperacion de contrasena - No Mas Migajas",
      html,
    });

    return true;
  } catch (error) {
    console.error("Error enviando email de recuperacion:", error);
    return false;
  }
}

export async function sendWelcomeEmail({ email, name, password }: SendWelcomeEmailParams): Promise<boolean> {
  const resend = getResendClient();
  
  if (!resend) {
    console.warn("Email no enviado: Resend no configurado");
    return false;
  }
  
  const appName = "No Mas Migajas";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3333";
  const loginUrl = `${baseUrl}/login`;
  const logoUrl = `${baseUrl}/logo_lp.png`;

  const greeting = name ? `Hola, ${name}` : "Hola";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tu acceso a ${appName}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #09090b; border-radius: 12px; border: 1px solid #27272a;">
              <tr>
                <td style="padding: 40px 40px 20px 40px; text-align: center;">
                  <img src="${logoUrl}" alt="${appName}" width="180" style="display: inline-block; max-width: 180px; height: auto;" />
                  <p style="margin: 10px 0 0 0; color: #a1a1aa; font-size: 14px;">Tu camino hacia la dignidad comienza aqui</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 40px;">
                  <p style="margin: 0 0 20px 0; color: #ffffff; font-size: 16px; line-height: 1.6;">
                    ${greeting},
                  </p>
                  <p style="margin: 0 0 20px 0; color: #d4d4d8; font-size: 15px; line-height: 1.6;">
                    Tu acceso ha sido liberado. Ya puedes comenzar tu proceso de recuperacion emocional.
                  </p>
                  <p style="margin: 0 0 30px 0; color: #d4d4d8; font-size: 15px; line-height: 1.6;">
                    A continuacion encontraras tus credenciales de acceso:
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 40px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #18181b; border-radius: 8px; border: 1px solid #27272a;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0 0 8px 0; color: #a1a1aa; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                        <p style="margin: 0 0 16px 0; color: #ffffff; font-size: 15px; font-weight: 500;">${email}</p>
                        <p style="margin: 0 0 8px 0; color: #a1a1aa; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Contrasena</p>
                        <p style="margin: 0; color: #D4AF37; font-size: 15px; font-weight: 600;">${password}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 30px 40px 40px 40px;">
                  <a href="${loginUrl}" style="display: inline-block; background-color: #ffffff; color: #0a0a0a; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600;">
                    Iniciar Sesion
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 40px 40px 40px; border-top: 1px solid #27272a;">
                  <p style="margin: 20px 0 0 0; color: #71717a; font-size: 13px; line-height: 1.5;">
                    Este email fue enviado porque realizaste una compra en nuestra plataforma. Si no reconoces esta accion, puedes ignorar este mensaje.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: "No Mas Migajas <noreply@nomasmigajas.site>",
      to: email,
      subject: "Tu acceso a No Mas Migajas",
      html,
    });

    return true;
  } catch (error) {
    console.error("Error enviando email:", error);
    return false;
  }
}