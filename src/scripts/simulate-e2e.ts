async function seedTestUser() {
  const DEV_SECRET = process.env.DEV_SECRET_KEY || "dev-secret-12345";
  const API_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3333";

  console.log("Creando usuario de prueba...");
  console.log(`API URL: ${API_URL}`);

  try {
    const response = await fetch(`${API_URL}/api/dev/seed-test-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEV_SECRET}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error:", data);
      process.exit(1);
    }

    console.log("\n✅ Usuario de prueba creado exitosamente!\n");
    console.log("Credenciales de prueba:");
    console.log(`  Email: ${data.test_user.email}`);
    console.log(`  Password: ${data.test_user.password}`);
    console.log(`  User ID: ${data.test_user.id}`);
    console.log(`\nIr a: ${API_URL}${data.login_url}`);
  } catch (error) {
    console.error("Error al crear usuario de prueba:", error);
    process.exit(1);
  }
}

seedTestUser();