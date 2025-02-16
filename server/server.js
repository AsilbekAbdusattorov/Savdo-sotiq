import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const __dirname = path.resolve();
const filePath = path.join(__dirname, "products.json");
const salesPath = path.join(__dirname, "sales.json");

// 📌 CORS konfiguratsiyasi
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 📌 Statik fayllarni qo‘llab-quvvatlash
app.use(express.static(path.join(__dirname, "public")));

// 📌 Mahsulotlarni saqlash uchun JSON faylni tekshirish
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "[]", "utf-8");
}

// 📌 Sotuvlarni saqlash uchun JSON faylni tekshirish
if (!fs.existsSync(salesPath)) {
  fs.writeFileSync(salesPath, "[]", "utf-8");
}

// 📌 JSON fayldan o‘qish va yozish
const readProducts = () => {
  const data = fs.readFileSync(filePath, "utf-8");
  return data ? JSON.parse(data) : [];
};

const writeProducts = (products) => {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2), "utf-8");
};

const readSales = () => {
  const data = fs.readFileSync(salesPath, "utf-8");
  return data ? JSON.parse(data) : [];
};

const writeSales = (sales) => {
  fs.writeFileSync(salesPath, JSON.stringify(sales, null, 2), "utf-8");
};

// 🏠 **Asosiy yo‘nalish**
app.get("/", (req, res) => {
  res.send("✅ Server ishlayapti!");
});

// 🛒 Mahsulotlarni olish
app.get("/products", (req, res) => {
  res.json(readProducts());
});

// 📦 Sotuvlarni saqlash
app.post("/sales", (req, res) => {
  const saleData = req.body;
  const sales = readSales();
  sales.push(saleData);
  writeSales(sales);
  res.status(201).json({ message: "Sotuv muvaffaqiyatli saqlandi" });
});

// 📌 **Barcha boshqa yo‘nalishlar uchun 404 xato**
app.use((req, res) => {
  res.status(404).json({ message: "Sahifa topilmadi" });
});

// 📌 Serverni ishga tushirish
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server ${PORT}-portda ishlayapti...`);
});
