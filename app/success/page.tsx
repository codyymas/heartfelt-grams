'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function SuccessPage() {
  useEffect(() => {
    const raw = localStorage.getItem('pendingOrder');
    if (!raw) return;

    const order = JSON.parse(raw);

    fetch('/api/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    })
      .then(() => localStorage.removeItem('pendingOrder'))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-5">💌</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">You&apos;re all set!</h1>
        <p className="text-gray-500 mb-8">
          Your payment was received. We&apos;ll start crafting your Heartfelt Gram and be in touch soon.
        </p>
        <Link
          href="https://heartfeltcraftsco.com"
          className="text-rose-500 text-sm hover:underline"
        >
          ← Back to Heartfelt Co.
        </Link>
      </div>
    </div>
  );
}
