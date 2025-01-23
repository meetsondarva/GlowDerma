import express from "express";
const app = express();

let PORT = process.env.PORT || 5000;

let items = [
    {
        name: "Hydrating Serum",
        price: "$25",
        description: "A lightweight serum that deeply hydrates and plumps the skin."
    },
    {
        name: "Vitamin C Cream",
        price: "$30",
        description: "Brightens skin tone and reduces the appearance of dark spots."
    }
];

app.get("/", (req, res) => {
    res.send("Welcome to GlowDerma - Your Skincare Journey Begins Here.");
});

app.get("/about", (req, res) => {
    res.send("<h3>We are a premium skincare brand committed to bringing you dermatologist-approved, clean beauty products.</h3>");
});

app.get("/contact", (req, res) => {
    res.json({
        email: "care@glowderma.com",
        instagram: "http://instagram.com/glowderma",
        consultation: "http://glowderma.com/book-appointment"
    });
});

app.get("/products", (req, res) => {
    res.json(items);
});

// Route Parameter
app.get("/product/:pid", (req, res) => {
    let pid = parseInt(req.params.pid);
    let product = items[pid - 1];
    if (product) {
        res.status(200).send(`Your requested product is ${product.name}`);
    } else {
        res.status(404).send("Product not found");
    }
});

// Wildcard Route: Handle undefined routes
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
