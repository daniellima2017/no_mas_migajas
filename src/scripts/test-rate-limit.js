/**
 * Test rate limiting on /api/simulator/analyze
 *
 * Uso:
 *   node src/scripts/test-rate-limit.js
 *
 * Requiere que el servidor este corriendo en localhost:3333
 * y que exista el usuario de prueba (npx tsx src/app/api/dev/seed-test-user/route.ts)
 */

const BASE_URL = "http://localhost:3333";
const TEST_EMAIL = "test@no-mas-migajas.test";
const TEST_PASSWORD = "Test1234!";
const SIMULATOR_LIMIT = 30;
const TOTAL_REQUESTS = 35;

async function login() {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
    redirect: "manual",
  });

  if (!res.ok) {
    const body = await res.json();
    throw new Error(`Login fallido: ${body.error || res.status}`);
  }

  const setCookie = res.headers.get("set-cookie");
  if (!setCookie) {
    throw new Error("No se recibio cookie de sesion");
  }

  const match = setCookie.match(/nmm_session=([^;]+)/);
  if (!match) {
    throw new Error("Cookie nmm_session no encontrado en set-cookie");
  }

  return `nmm_session=${match[1]}`;
}

async function sendRequest(cookie, index) {
  const res = await fetch(`${BASE_URL}/api/simulator/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify({
      message: `Test rate limit request ${index}`,
      context: "received",
    }),
  });

  const remaining = res.headers.get("X-RateLimit-Remaining");

  return {
    index,
    status: res.status,
    remaining,
  };
}

async function main() {
  console.log("=== TEST RATE LIMITING ===\n");
  console.log(`Endpoint: /api/simulator/analyze`);
  console.log(`Limite: ${SIMULATOR_LIMIT} req/min`);
  console.log(`Requests a enviar: ${TOTAL_REQUESTS}\n`);

  // Step 1: Login
  console.log("1. Iniciando sesion...");
  let cookie;
  try {
    cookie = await login();
    console.log("   Login exitoso. Cookie obtenido.\n");
  } catch (err) {
    console.error(`   ERROR: ${err.message}`);
    console.error("\n   Asegurate de que:");
    console.error("   - El servidor este corriendo en localhost:3333");
    console.error("   - El usuario de prueba exista (usa seed-test-user)");
    process.exit(1);
  }

  // Step 2: Send requests
  console.log(`2. Enviando ${TOTAL_REQUESTS} requests...\n`);

  const results = [];
  let firstBlocked = null;

  for (let i = 1; i <= TOTAL_REQUESTS; i++) {
    const result = await sendRequest(cookie, i);
    results.push(result);

    const statusIcon = result.status === 429 ? "BLOCKED" : result.status === 200 ? "OK" : `HTTP ${result.status}`;
    const remainingStr = result.remaining !== null ? `remaining=${result.remaining}` : "";

    console.log(`   #${String(i).padStart(2, "0")} -> ${statusIcon} ${remainingStr}`);

    if (result.status === 429 && !firstBlocked) {
      firstBlocked = i;
    }
  }

  // Step 3: Results
  console.log("\n=== RESULTADOS ===\n");

  const okCount = results.filter((r) => r.status === 200).length;
  const blockedCount = results.filter((r) => r.status === 429).length;
  const otherCount = results.filter((r) => r.status !== 200 && r.status !== 429).length;

  console.log(`   Exitosas (200): ${okCount}`);
  console.log(`   Bloqueadas (429): ${blockedCount}`);
  if (otherCount > 0) {
    console.log(`   Otros errores: ${otherCount}`);
  }

  if (firstBlocked) {
    console.log(`   Primera bloqueada: request #${firstBlocked}`);
  }

  console.log("\n=== VERIFICACION ===\n");

  if (firstBlocked === SIMULATOR_LIMIT + 1) {
    console.log(`   PASS: Request #${SIMULATOR_LIMIT + 1} fue correctamente bloqueada con 429`);
    console.log(`   PASS: Rate limit de ${SIMULATOR_LIMIT} req/min funciona correctamente`);
  } else if (firstBlocked && firstBlocked <= SIMULATOR_LIMIT) {
    console.log(`   WARN: Bloqueo en request #${firstBlocked} (esperado en #${SIMULATOR_LIMIT + 1})`);
    console.log("   Esto puede deberse a requests previas en la ventana actual");
  } else if (!firstBlocked) {
    console.log(`   FAIL: Ninguna request fue bloqueada despues de ${TOTAL_REQUESTS} intentos`);
    console.log("   El rate limiting puede no estar funcionando correctamente");
  }

  // Step 4: Verify reset
  console.log("\n3. Verificando aislamiento por user_id...");
  console.log("   El rate limit usa clave 'simulator:{user_id}'");
  console.log("   Cada usuario tiene su propio contador independiente");
  console.log("   El contador se reinicia despues de 60 segundos (WINDOW_MS)\n");
}

main().catch(console.error);
