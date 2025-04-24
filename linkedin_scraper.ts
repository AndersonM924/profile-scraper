import { Stagehand } from "@browserbasehq/stagehand";
import StagehandConfig from "./stagehand.config"; // Asume que tienes un archivo de configuración
import { z } from "zod";
import dotenv from "dotenv"; // Import dotenv
import fs from "fs"; // Import the Node.js file system module
import path from "path"; // Import path module for cross-platform compatibility

dotenv.config(); // Load environment variables from .env file at the start

// Asegúrate de tener un archivo .env o configurar estas variables de entorno
const linkedinEmail = process.env.LINKEDIN_EMAIL;
const linkedinPassword = process.env.LINKEDIN_PASSWORD;
const googleApiKey = process.env.GOOGLE_API_KEY; // Make sure this is also checked

// Define the path to the urls file
const urlsFilePath = path.join(__dirname, "urls.json");

async function scrapeLinkedIn() {
  if (!linkedinEmail || !linkedinPassword || !googleApiKey) {
    // Check for Google API Key too
    console.error(
      "Error: LINKEDIN_EMAIL, LINKEDIN_PASSWORD, and GOOGLE_API_KEY environment variables must be set.",
    );
    process.exit(1);
  }

  console.log("Initializing Stagehand...");
  const stagehand = new Stagehand(StagehandConfig);
  await stagehand.init();

  const page = stagehand.page;
  const context = stagehand.context;

  try {
    console.log("Navigating to LinkedIn...");
    await page.goto("https://www.linkedin.com/login");

    console.log("Successfully navigated to LinkedIn login page.");

    // --- Lógica de login ---
    console.log("Attempting to log in...");

    // Usar page.act con descripciones claras.
    // NOTA: Para mayor robustez, considera usar page.observe primero y luego page.act(observedResult)
    await page.act(
      `Type '${linkedinEmail}' into the email or phone number field`,
    );
    await page.act(`Type '${linkedinPassword}' into the password field`); // Include the actual password variable in the instruction
    await page.act("Click the Sign in button");

    // Esperar un poco para que la página cargue después del login (ajusta según sea necesario)
    await page.waitForTimeout(5000);

    console.log("Login successful (assumed).");

    // --- Leer URLs del archivo ---
    let targetUrl: string | undefined;
    try {
      if (fs.existsSync(urlsFilePath)) {
        const urlsFileContent = fs.readFileSync(urlsFilePath, "utf-8");
        const urls: string[] = JSON.parse(urlsFileContent);
        if (urls.length > 0) {
          targetUrl = urls[0]; // Get the first URL
          console.log(
            `Found ${urls.length} URLs. Navigating to the first one: ${targetUrl}`,
          );
        } else {
          console.warn("urls.json is empty. No URL to navigate to.");
        }
      } else {
        console.warn(
          `urls.json not found at ${urlsFilePath}. No URL to navigate to.`,
        );
      }
    } catch (err) {
      console.error("Error reading or parsing urls.json:", err);
    }

    // --- Navegar a la URL del archivo ---
    if (targetUrl) {
      console.log(`Navigating to profile: ${targetUrl}...`);
      await page.goto(targetUrl);
      console.log("Successfully navigated to the profile URL.");
      console.log(
        "Script finished. Browser will remain open. Press Ctrl+C to exit.",
      );
      // Keep the browser open indefinitely until manually closed or script is stopped
      await new Promise(() => {}); // This creates a promise that never resolves
    } else {
      console.log("No target URL found from urls.json. Script will finish.");
    }

    // --- Aquí podría ir futura lógica de scraping ---
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    console.log("Closing Stagehand... (Commented out to keep browser open)");
    // await stagehand.close(); // Commented out to keep the browser open
  }
}

scrapeLinkedIn();
