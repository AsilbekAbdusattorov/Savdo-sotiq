import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const __dirname = path.resolve();
const filePath = path.join(__dirname, "products.json");
const salesPath = path.join(__dirname, "sales.json");

app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]", "utf-8");
if (!fs.existsSync(salesPath)) fs.writeFileSync(salesPath, "[]", "utf-8");

const readProducts = () => JSON.parse(fs.readFileSync(filePath, "utf-8") || "[]");
const writeProducts = (products) => fs.writeFileSync(filePath, JSON.stringify(products, null, 2), "utf-8");
const readSales = () => JSON.parse(fs.readFileSync(salesPath, "utf-8") || "[]");
const writeSales = (sales) => fs.writeFileSync(salesPath, JSON.stringify(sales, null, 2), "utf-8");

// 🏠 Asosiy yo‘nalish
app.get("/", (req, res) => {
  res.send("✅ Server ishlayapti!");
});

// 🛒 Mahsulotlarni olish
app.get("/products", (req, res) => {
  res.json(readProducts());
});

// 🛍 Sotuvlarni saqlash
app.post("/sales", (req, res) => {
  const saleData = req.body;
  const sales = readSales();
  sales.push(saleData);
  writeSales(sales);
  res.status(201).json({ message: "Sotuv muvaffaqiyatli saqlandi" });
});

// 🆕 Yangi mahsulot qo‘shish **(FIXED!)**
app.post("/add-product", (req, res) => {
  const { name, barcode, price, image } = req.body;
  if (!name || !barcode || !price || !image) {
    return res.status(400).json({ message: "Barcha maydonlarni to‘ldiring" });
  }
  const products = readProducts();
  products.push({ name, barcode, price, image });
  writeProducts(products);
  res.status(201).json({ message: "Mahsulot muvaffaqiyatli qo‘shildi" });
});

// 🚨 404 sahifa topilmadi
app.use((req, res) => {
  res.status(404).json({ message: "Sahifa topilmadi" });
});

// 🔥 Serverni ishga tushirish
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server ${PORT}-portda ishlayapti...`);
});
