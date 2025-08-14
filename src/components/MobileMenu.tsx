"use client";
import { useState } from "react";
import { product } from "@/content/product";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Shop", href: "#order" },
    { label: "Lookbook", href: "#lookbook" },
    { label: "Story", href: "#story" },
    { label: "Contact", href: "#contact" },
  ];

  const scrollToSection = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 z-[60] md:hidden p-3 rounded-full bg-black/50 backdrop-blur-sm border border-white/10"
        aria-label="Menu"
      >
        <div className="w-6 h-5 relative flex flex-col justify-between">
          <span
            className={`block h-0.5 w-full bg-white transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-white transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-white transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </div>
      </button>

      {/* Menu overlay */}
      <div
        className={`fixed inset-0 z-[50] bg-black/95 backdrop-blur-md transition-all duration-500 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="h-full flex flex-col items-center justify-center px-6">
          {/* Logo */}
          <div className="mb-12">
            <h2 className="text-4xl font-extrabold text-white">ZOLAR</h2>
            <div className="h-0.5 w-20 mx-auto mt-2 bg-zolar-grad rounded-full" />
          </div>

          {/* Menu items */}
          <nav className="space-y-6">
            {menuItems.map((item, i) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className={`block text-2xl font-medium text-white/80 hover:text-white transition-all duration-300 ${
                  isOpen ? "animate-fade-in-up" : ""
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA */}
          <button
            onClick={() => scrollToSection("#order")}
            className="mt-12 px-8 py-3 bg-zolar-grad rounded-full text-black font-semibold"
          >
            Order Now - AED {product.priceAED}
          </button>

          {/* Social links */}
          <div className="mt-12 flex gap-6">
            <a href="#" className="text-white/50 hover:text-white transition-colors">
              Instagram
            </a>
            <a href="#" className="text-white/50 hover:text-white transition-colors">
              Twitter
            </a>
            <a href="#" className="text-white/50 hover:text-white transition-colors">
              TikTok
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
}
