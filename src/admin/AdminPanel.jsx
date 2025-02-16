import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const AdminPanel = () => {
  const [product, setProduct] = useState({ name: "", barcode: "", price: "", image: "" });
  const [scanner, setScanner] = useState(null);
  
  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [scanner]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct({ ...product, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch("http://localhost:5000/add-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (response.ok) {
      alert("Mahsulot qo‘shildi!");
      setProduct({ name: "", barcode: "", price: "", image: "" });
    } else {
      alert("Xatolik yuz berdi!");
    }
  };

  const startScanner = () => {
    if (!scanner) {
      const newScanner = new Html5QrcodeScanner("barcode-scanner", { fps: 10, qrbox: 250 });
      
      newScanner.render((decodedText) => {
        setProduct((prev) => ({ ...prev, barcode: decodedText }));
        newScanner.clear();
        setScanner(null);
      });
      setScanner(newScanner);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-semibold mb-5 text-center text-gray-700">Mahsulot qo‘shish</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input 
          type="text" 
          name="name" 
          placeholder="Mahsulot nomi" 
          value={product.name} 
          onChange={handleChange} 
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
          required
        />
        <div className="flex gap-3 items-center">
          <input 
            type="text" 
            name="barcode" 
            placeholder="Barcode" 
            value={product.barcode} 
            onChange={handleChange} 
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
            required
          />
          <button 
            type="button" 
            onClick={startScanner} 
            className="bg-green-500 text-white px-5 py-3 rounded-lg shadow hover:bg-green-600">
            Scan
          </button>
        </div>
        <input 
          type="number" 
          name="price" 
          placeholder="Narx" 
          value={product.price} 
          onChange={handleChange} 
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
          required
        />
        <input 
          type="file" 
          onChange={handleFileChange} 
          className="w-full p-3 border rounded-lg cursor-pointer" 
          required
        />
        {product.image && (
          <img src={product.image} alt="Mahsulot rasmi" className="w-full h-40 object-cover rounded-lg shadow" />
        )}
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white py-3 rounded-lg shadow-lg hover:bg-blue-600">
          Mahsulotni qo‘shish
        </button>
      </form>
      <div id="barcode-scanner" className="mt-5 p-3 border rounded-lg shadow-sm bg-gray-100"></div>
    </div>
  );
};

export default AdminPanel;
