import React from "react";

export default function QRModel({ linkUrl, onClose }) {
  if (!linkUrl) return null;

  const src = `/api/payments/qr?url=${encodeURIComponent(linkUrl)}&size=300`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-[#121218] border border-white/10 rounded-2xl p-6 w-[340px] text-center">
        <h3 className="text-white text-lg font-semibold">Scan to Pay (UPI)</h3>
        <p className="text-gray-400 text-xs mt-1">Works with any UPI app</p>

        <div className="mt-4 p-3 rounded-xl bg-black/30 border border-white/10 flex items-center justify-center">
          <img src={src} alt="payment-qr" className="w-[260px] h-[260px]" />
        </div>

        <div className="mt-3 text-gray-500 text-xs break-all line-clamp-2">
          {linkUrl}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
