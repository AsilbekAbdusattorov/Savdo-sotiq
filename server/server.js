import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();

// 📌 CORS konfiguratsiyasi
app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST"] }));
app.use(express.json({ limit: "10mb" })); // JSON hajmini oshirish
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Fayl yuklash hajmini oshirish

const filePath = "products.json";

// 📌 JSON fayldan o‘qish va yozish
const readProducts = () => {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf-8");
  return data ? JSON.parse(data) : [];
};

const writeProducts = (products) => {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2), "utf-8");
};

// 🛒 Mahsulot qo‘shish
app.post("/add-product", (req, res) => {
    const { name, barcode, price, image } = req.body;
  
    if (!name || !barcode || !price || !image) {
      return res.status(400).json({ message: "Barcha maydonlarni to‘ldiring" });
    }
  
    const products = readProducts();
    products.push({ name, barcode, price, image });  // Base64 rasmni saqlash
    writeProducts(products);
  
    res.status(201).json({ message: "Mahsulot muvaffaqiyatli qo‘shildi" });
  });
  

// 📌 Qo‘shilgan barcha mahsulotlarni olish
app.get("/products", (req, res) => {
  res.json(readProducts());
});

// 📌 Serverni ishga tushirish
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server ${PORT}-portda ishlayapti...`);
});
