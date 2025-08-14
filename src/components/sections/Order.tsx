"use client";
import { useState } from "react";
import Image from "next/image";
import { IMAGES } from "@/content/images";

export default function Order() {
  const [size, setSize] = useState<string>("");
  const [shake, setShake] = useState<boolean>(false);

  const sizes = ["S", "M", "L", "XL"];
  const price = 299;
  const wa = (process.env.NEXT_PUBLIC_WA_NUMBER || "+971000000000").replace(/\s/g, "");

  const openWA = () => {
    if (!size) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    const msg = encodeURIComponent(`ZOLAR Borderline Drop — Size: ${size}`);
    window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");
  };

  return (
    <section className="section px-6">
      <div className="w-full max-w-4xl mx-auto text-center">
        {/* Product thumbnail - 1:1 aspect ratio */}
        <div className="w-32 h-32 mx-auto mb-8 rounded-2xl overflow-hidden">
          <Image
            src={IMAGES.thumb}
            alt="Black t-shirt flatlay"
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
        </div>
        
        <h3 className="text-4xl md:text-6xl font-extrabold">BORDERLINE DROP</h3>
        <p className="mt-3 text-white/80">Heavy knit essentials engineered for the modern world</p>
        
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`px-5 py-3 rounded-full border transition-all ${
                size === s 
                  ? "border-emerald-400 bg-white/10 shadow-lg shadow-emerald-400/20" 
                  : "border-white/20 hover:border-white/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        
        <div className="mt-8 text-2xl font-bold">AED {price}</div>
        
        <button
          id="buyBtn"
          onClick={openWA}
          className={`mt-6 px-8 py-4 rounded-full text-black font-semibold transition-all hover:scale-105 ${
            shake ? "animate-shake" : ""
          }`}
          style={{ backgroundImage: "var(--zolar-grad)" }}
        >
          Order on WhatsApp
        </button>
        
        {!size && shake && (
          <p className="mt-4 text-red-400 text-sm animate-pulse">Please select a size</p>
        )}
      </div>
      
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.25s ease-in-out;
        }
      `}</style>
    </section>
  );
}
