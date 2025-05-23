const { GoogleSpreadsheet } = require("google-spreadsheet");

const SPREADSHEET_ID = "1bFJpTypB0ctm2gWwzQXVh1Rqfb7N_qnzkNuDZrhZqFM";
const SHEET_NAME = "Sheet1";

// List of allowed origins
const ALLOWED_ORIGINS = [
  "http://localhost:5173", // Development
  "http://localhost:3000", // Alternative development port
  "https://event-reg-460713.web.app", // Production Firebase hosting
  "https://event-reg-460713.firebaseapp.com", // Alternative Firebase hosting
];

exports.saveRegistration = async (req, res) => {
  // Get the origin from the request
  const origin = req.headers.origin;

  // Check if the origin is allowed
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Accept");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
    return;
  }

  // Validate request method
  if (req.method !== "POST") {
    res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
    return;
  }

  // Validate request body
  if (!req.body || typeof req.body !== "object") {
    res.status(400).json({
      success: false,
      error: "Invalid request body",
    });
    return;
  }

  try {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });

    await doc.loadInfo();

    let sheet = doc.sheetsByTitle[SHEET_NAME];
    if (!sheet) {
      sheet = await doc.addSheet({ title: SHEET_NAME });
    }

    // Add the row to the sheet
    await sheet.addRow(req.body);

    res.status(200).json({
      success: true,
      message: "Registration saved successfully",
    });
  } catch (error) {
    console.error("Error saving to Google Sheet:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to save registration",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};
