import React, { useEffect, useRef, useState } from "react";

const Home = () => {
  const videoRef = useRef(null);
  const [barcode, setBarcode] = useState("");

  useEffect(() => {
    startCamera();
    loadQuagga();
  }, []);

  // Kamera ishga tushirish
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Orqa kamera
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Kameraga ruxsat berilmadi:", error);
      alert("Iltimos, kameraga ruxsat bering!");
    }
  };

  // QuaggaJS yuklash
  const loadQuagga = () => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/quagga/0.12.1/quagga.min.js";
    script.onload = initQuagga;
    document.body.appendChild(script);
  };

  // QuaggaJS boshlash
  const initQuagga = () => {
    if (!window.Quagga) return;

    window.Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: videoRef.current, // video tagga oqim
          constraints: {
            facingMode: "environment", // Orqa kamerani tanlash
          },
          area: { // Bu yerda kamera oynasining o‘lchamini belgilash mumkin
            top: "0%",    // Kamera yuqori qismidan boshlab
            left: "0%",
            right: "0%",
            bottom: "0%",
          },
          willReadFrequently: true, // QuaggaJS tez ishlashi uchun
        },
        decoder: {
          readers: ["ean_reader", "code_128_reader"], // Skanner turini belgilash
        },
        locate: true, // QR kod yoki barcode joylashuvini aniqlashni yaxshilash
        locator: {
          patchSize: "medium", // Patrondagi tasvirni yaxshilash
          halfSample: true, // Tasvirni yarmiga qisqartirish
        },
      },
      (err) => {
        if (err) {
          console.error("QuaggaJS xatosi:", err);
          return;
        }
        window.Quagga.start();
      }
    );

    // 📌 Skaner aniqlanganda natijani olish
    window.Quagga.onDetected((result) => {
      setBarcode(result.codeResult.code); // Barcode ni olish
      window.Quagga.stop(); // Skanning tugatish
    });
  };

  return (
    <section className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-semibold mb-5 text-center text-gray-700">📷 Barcode Skanner</h2>

      {/* Kamera */}
      <video ref={videoRef} className="w-full h-60 border rounded-lg shadow-sm bg-black" autoPlay muted></video>

      {/* Skaner natijasi */}
      {barcode && (
        <div className="mt-4 p-3 border rounded-lg bg-gray-100">
          <h3 className="text-lg font-semibold">Topilgan barcode:</h3>
          <p className="text-xl font-bold text-blue-600">{barcode}</p>
        </div>
      )}
    </section>
  );
};

export default Home;
