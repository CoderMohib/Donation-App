#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// This script writes the GOOGLE_SERVICES_JSON environment variable to a file
// It runs before the build starts on EAS

const googleServicesJson = process.env.GOOGLE_SERVICES_JSON;

if (!googleServicesJson) {
  console.error("Error: GOOGLE_SERVICES_JSON environment variable is not set");
  process.exit(1);
}

const outputPath = path.join(process.cwd(), "google-services.json");

try {
  fs.writeFileSync(outputPath, googleServicesJson);
  console.log(
    "✅ Successfully wrote GOOGLE_SERVICES_JSON to google-services.json"
  );
} catch (error) {
  console.error("❌ Failed to write google-services.json:", error);
  process.exit(1);
}
