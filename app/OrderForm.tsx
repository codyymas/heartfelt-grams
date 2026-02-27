'use client';

import { useState } from 'react';

export default function OrderForm() {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    recipientName: '',
    message: '',
  });

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('recipientName', formData.recipientName);
      data.append('message', formData.message);

      if (files) {
        Array.from(files).forEach((file) => data.append('files', file));
      }

      const res = await fetch('/api/submit', { method: 'POST', body: data });
      if (!res.ok) throw new Error('Submission failed');

      window.location.href =
        'https://flow.heartfeltcraftsco.com/checkout?checkoutId=ca727402-8f10-45af-9562-cc36d518d9fa&currency=USD&contentAppId=324cf725-53d9-4bb2-b8f6-0c8ec9a77f45&contentComponentId=4ca49999-12ba-46d7-8dca-03ee4a6c1b7c';
    } catch (err) {
      console.error('Submission error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Section 1 — The Basics */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 text-sm font-bold flex items-center justify-center shrink-0">
            1
          </div>
          <h2 className="font-semibold text-gray-800">The Basics</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Your Name</label>
            <input
              type="text"
              placeholder="Jane Doe"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Your Email</label>
            <input
              type="email"
              placeholder="jane@example.com"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Recipient&apos;s Name</label>
          <input
            type="text"
            placeholder="Who is this lucky person?"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
            onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
          />
        </div>
      </div>

      {/* Section 2 — The Heart */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 text-sm font-bold flex items-center justify-center shrink-0">
            2
          </div>
          <h2 className="font-semibold text-gray-800">The Heart</h2>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Upload Photos &amp; Videos (Max 15)</label>
          <label className="cursor-pointer block border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50 hover:bg-rose-50 hover:border-rose-200 transition-colors">
            <div className="flex flex-col items-center gap-2">
              <svg className="w-9 h-9 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <p className="text-rose-500 text-sm font-medium">Click to upload your favorite moments</p>
              <p className="text-gray-400 text-xs">JPG, PNG, MP4 up to 5GB</p>
              {files && files.length > 0 && (
                <p className="text-rose-600 text-xs font-semibold mt-1">{files.length} file(s) selected</p>
              )}
            </div>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => setFiles(e.target.files)}
            />
          </label>
        </div>

        <div className="mt-4">
          <label className="block text-xs text-gray-500 mb-1">Your Message</label>
          <textarea
            placeholder="Write something heartfelt..."
            required
            rows={5}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 resize-none"
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-rose-500 text-white py-3 rounded-full font-semibold hover:bg-rose-600 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Submitting...' : 'Continue to Payment →'}
      </button>

    </form>
  );
}
