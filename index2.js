import express from "express";
import fs from "fs";
import path from "path";
import rateLimit from "express-rate-limit"; // Import rate-limit package
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

// Resolving __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware to handle JSON request bodies with a size limit (e.g., 1 MB max)
app.use(express.json({ limit: "1mb" }));

// Global Logging Middleware
app.use((req, res, next) => {
  const logData = `${new Date().toISOString()} | ${req.method} | ${req.path}\n`;
  fs.appendFile("server.logs", logData, (err) => {
    if (err) {
      console.error("Failed to write log data:", err);
    }
  });
  console.log(logData.trim());
  next();
});

// Middleware to serve static files from the "public" folder
app.use("/assets", express.static(path.join(__dirname, "public")));

// Handle favicon request (to prevent 404 errors)
app.get("/favicon.ico", (req, res) => res.status(204)); // Return no content

// Rate Limiting: Allow 100 requests per IP per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  headers: true,
});

// Apply rate limiting to all requests
app.use(limiter);

// Welcome route
app.get("/", (req, res) => {
  res.send("Welcome to GlowDerma - Your Skincare Journey Begins Here.");
});

// About route
app.get("/about", (req, res) => {
  res.send(
    "<h3>We are a premium skincare brand committed to bringing you dermatologist-approved, clean beauty products.</h3>"
  );
});

// Contact route
app.get("/contact", (req, res) => {
  res.json({
    email: "care@glowderma.com",
    instagram: "http://instagram.com/glowderma",
    consultation: "http://glowderma.com/book-appointment",
  });
});

// Products route
let items = [
  {
    name: "Hydrating Serum",
    price: "$25",
    description:
      "A lightweight serum that deeply hydrates and plumps the skin.",
  },
  {
    name: "Vitamin C Cream",
    price: "$30",
    description:
      "Brightens skin tone and reduces the appearance of dark spots.",
  },
];

app.get("/products", (req, res) => {
  res.json(items);
});

// Route with parameter: Fetch specific product by its ID
app.get("/product/:pid", (req, res) => {
  let pid = parseInt(req.params.pid, 10);
  
  if (isNaN(pid) || pid <= 0 || pid > items.length) {
    return res.status(404).send("Product not found");
  }
  
  let product = items[pid - 1];
  res.status(200).send(
    `Your requested product is ${product.name} - ${product.description}`
  );
});

// Order route (new route added)
app.get("/orders/:orderId", (req, res) => {
  const { orderId } = req.params;
  // Placeholder logic for order
  res.json({ message: `Order details for ${orderId}` });
});

// Route to Simulate a 500 Error
app.get("/error-test", (req, res, next) => {
  next(new Error("Test Error")); // Simulates an error
});

// Random route (new route added to handle random)
app.get("/random", (req, res) => {
  res.status(404).send("Random route not found.");
});

// Wildcard Route: Handle undefined routes
app.use((req, res) => {
  res.status(404).json({
    message: "We don't have this page yet!",
  });
});

// Middleware for error handling
app.use((err, req, res, next) => {
  console.error("Error:", err.message); // Log the error to the terminal
  res.status(500).json({ message: "Sorry! Something went wrong." });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
