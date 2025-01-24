import express from "express";
const app = express();
app.use(express.json());

const PORT = 1000;

// Orders Array
let orders = [
  { id: 1, product: 'Anti-Aging Serum', quantity: 2 },
  { id: 2, product: 'Vitamin C Moisturizer', quantity: 1 },
  { id: 3, product: 'Hyaluronic Acid', quantity: 3 }
];

// Products Array
let products = [
  { id: 11, name: "Retinol Serum", price: 1200, availableQty: 50 },
  { id: 12, name: "Niacinamide Solution", price: 800, availableQty: 30 },
  { id: 14, name: "Peptide Moisturizer", price: 1500, availableQty: 100 },
  { id: 15, name: "Glycolic Acid Toner", price: 900, availableQty: 20 }
];

// Shopping Cart
let shoppingCart = [];

// Orders Route
app.get("/orders/:orderID", (req, res) => {
  const orderID = parseInt(req.params.orderID);
  const order = orders.find((o) => o.id === orderID);

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404).json({ message: "Order Not Found" });
  }
});

// Products Route
app.get("/products", (req, res) => {
  const { name, maxPrice } = req.query;

  let filteredProducts = products;

  if (name) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter((p) => p.price <= parseFloat(maxPrice));
  }

  res.status(200).json(filteredProducts);
});

// Cart Routes
app.get("/cart", (req, res) => {
  res.status(200).json(shoppingCart);
});

app.post("/cart", (req, res) => {
  const { id, name, price, qty } = req.body;

  if (!id || !name || !price || !qty) {
    return res.status(400).json({ message: "All fields (id, name, price, qty) are required" });
  }

  const cartItem = { id, name, price, qty };
  shoppingCart.push(cartItem);
  res.status(201).json(cartItem );
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});