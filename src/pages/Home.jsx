import React, { useEffect, useRef, useState } from "react";

const Home = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [barcode, setBarcode] = useState("");

  useEffect(() => {
    startCamera();
    loadQuagga();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Kamera xatosi:", error);
      alert("Kamera ochib bo‘lmadi!");
    }
  };

  const loadQuagga = () => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/quagga/0.12.1/quagga.min.js";
    script.onload = initQuagga;
    document.body.appendChild(script);
  };

  const initQuagga = () => {
    if (!window.Quagga) return;

    window.Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: videoRef.current,
          constraints: {
            facingMode: "environment",
          },
        },
        decoder: {
          readers: ["ean_reader", "code_128_reader"], // EAN va Code-128 formatlarini o‘qiydi
        },
      },
      (err) => {
        if (err) {
          console.error("Quagga xatosi:", err);
          return;
        }
        window.Quagga.start();
      }
    );

    window.Quagga.onDetected((result) => {
      setBarcode(result.codeResult.code);
      window.Quagga.stop(); // Skanerlash tugagach to‘xtatish
    });
  };

  return (
    <section className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-semibold mb-5 text-center text-gray-700">Barcode Skanner</h2>

      {/* Kamera */}
      <video ref={videoRef} className="w-full h-60 border rounded-lg shadow-sm bg-black"></video>

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
