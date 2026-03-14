/**
 * Simula un reembolso/cancelacion para probar el kill-switch.
 *
 * Uso:
 *   npx tsx src/scripts/simulate-refund.ts <email> [reactivate]
 *
 * Ejemplos:
 *   npx tsx src/scripts/simulate-refund.ts test@no-mas-migajas.test          # desactiva
 *   npx tsx src/scripts/simulate-refund.ts test@no-mas-migajas.test reactivate # reactiva
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("ERROR: Variables de entorno SUPABASE no configuradas.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const email = process.argv[2];
  const reactivate = process.argv[3] === "reactivate";

  if (!email) {
    console.error("Uso: npx tsx src/scripts/simulate-refund.ts <email> [reactivate]");
    process.exit(1);
  }

  const newStatus = reactivate ? "active" : "inactive";

  const { data: user, error: findError } = await supabase
    .from("users")
    .select("id, email, subscription_status")
    .eq("email", email)
    .single();

  if (findError || !user) {
    console.error(`ERROR: Usuario con email "${email}" no encontrado.`);
    process.exit(1);
  }

  console.log(`Usuario encontrado: ${user.email} (${user.id})`);
  console.log(`Estado actual: ${user.subscription_status}`);
  console.log(`Nuevo estado: ${newStatus}`);

  const { error: updateError } = await supabase
    .from("users")
    .update({ subscription_status: newStatus })
    .eq("id", user.id);

  if (updateError) {
    console.error("ERROR al actualizar:", updateError.message);
    process.exit(1);
  }

  console.log(`\nSubscription actualizada a "${newStatus}" exitosamente.`);

  if (!reactivate) {
    console.log("\nPrueba del kill-switch:");
    console.log("1. Abre el navegador en el dashboard");
    console.log("2. Recarga la pagina (F5)");
    console.log("3. Deberia redirigir a /access-expired en maximo 5 minutos");
    console.log("\nPara reactivar:");
    console.log(`   npx tsx src/scripts/simulate-refund.ts ${email} reactivate`);
  } else {
    console.log("\nUsuario reactivado. El acceso se restaurara al iniciar sesion nuevamente.");
  }
}

main();
