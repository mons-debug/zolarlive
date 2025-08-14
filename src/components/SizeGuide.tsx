"use client";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { product, ProductUnit } from "@/content/product";

interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuide({ isOpen, onClose }: SizeGuideProps) {
  const [unit, setUnit] = useState<ProductUnit>("cm");

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all border border-white/10">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold leading-6 text-ink mb-4"
                >
                  Size Guide
                </Dialog.Title>

                {/* Unit toggle */}
                <div className="flex gap-2 mb-6">
                  {product.sizeChart.units.map((u) => (
                    <button
                      key={u}
                      onClick={() => setUnit(u)}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        unit === u
                          ? "bg-white/10 text-ink"
                          : "bg-transparent text-ink-70 hover:text-ink"
                      }`}
                    >
                      {u.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Size table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-ink-70">Size</th>
                        <th className="text-left py-3 px-4 text-ink-70">
                          Chest ({unit})
                        </th>
                        <th className="text-left py-3 px-4 text-ink-70">
                          Length ({unit})
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.sizes.map((size) => (
                        <tr
                          key={size}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-3 px-4 font-semibold text-ink">{size}</td>
                          <td className="py-3 px-4 text-ink-90">
                            {product.sizeChart.sizes[size].chest[unit]}
                          </td>
                          <td className="py-3 px-4 text-ink-90">
                            {product.sizeChart.sizes[size].length[unit]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Fit info */}
                <div className="mt-6 p-4 bg-white/5 rounded-lg">
                  <p className="text-small">
                    <strong className="text-ink">Fit:</strong>{" "}
                    <span className="text-ink-90">{product.fit}</span>
                  </p>
                  <p className="text-small mt-2 text-ink-70">
                    Model is 6&apos;0&quot; (183cm) wearing size M
                  </p>
                </div>

                {/* Close button */}
                <div className="mt-6">
                  <button
                    type="button"
                    className="btn-secondary w-full"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
