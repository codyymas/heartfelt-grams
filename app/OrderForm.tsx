'use client';

import { useState } from 'react';

export default function OrderForm() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [fileCount, setFileCount] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    recipientName: '',
    occasion: '',
    theme: '',
    additionalNotes: '',
    memory: '',
    compliment1: '',
    compliment2: '',
    compliment3: '',
    message: '',
    missingFiles: '',
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;

    if (selected.length > 15) {
      alert('You can upload a maximum of 15 files.');
      e.target.value = '';
      return;
    }

    for (const file of Array.from(selected)) {
      const isVideo = /\.(mov|mp4|avi|wmv|mkv|m4v|webm)$/i.test(file.name) || file.type.startsWith('video/');
      const limitMB = isVideo ? 100 : 10;
      if (file.size > limitMB * 1024 * 1024) {
        alert(`"${file.name}" exceeds the ${limitMB}MB limit for ${isVideo ? 'videos' : 'images'}.`);
        e.target.value = '';
        return;
      }
    }

    setFileCount(selected.length);
    setUploading(true);
    setUploadedUrls([]);
    setUploadError('');

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const urls: string[] = [];

    for (const file of Array.from(selected)) {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', uploadPreset!);
      const resourceType = /\.(mov|mp4|avi|wmv|mkv|m4v|webm)$/i.test(file.name) || file.type.startsWith('video/') ? 'video' : 'image';
      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
          { method: 'POST', body: data }
        );
        const json = await res.json();
        if (json.secure_url) {
          urls.push(json.secure_url);
        } else {
          const reason = json.error?.message || JSON.stringify(json);
          console.error('Cloudinary error:', reason);
          setUploadError(`Upload failed: ${reason}`);
        }
      } catch {
        setUploadError(`Failed to upload "${file.name}". Please check your connection and try again.`);
      }
    }

    setUploadedUrls(urls);
    setUploading(false);
  };

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (uploading) return;
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('recipientName', formData.recipientName);
  data.append('occasion', formData.occasion);
  data.append('theme', formData.theme);
      data.append('memory', formData.memory);
      data.append('compliment1', formData.compliment1);
      data.append('compliment2', formData.compliment2);
      data.append('compliment3', formData.compliment3);
  data.append('additionalNotes', formData.additionalNotes);
      data.append('missingFiles', formData.missingFiles);
      data.append('message', formData.message);
      uploadedUrls.forEach((url) => data.append('fileUrls', url));

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

        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-1">Your Phone Number</label>
          <input
            type="tel"
            placeholder="(123) 456-7890"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
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
        
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Occasion</label>
            <select
              value={formData.occasion}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-200"
              onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
            >
              <option value="">Select an occasion</option>
              <option value="birthday">Birthday</option>
              <option value="anniversary">Anniversary</option>
              <option value="valentines-day">Valentine&apos;s Day</option>
              <option value="mothers-day">Mother&apos;s Day</option>
              <option value="fathers-day">Father&apos;s Day</option>
              <option value="wedding">Wedding</option>
              <option value="graduation">Graduation</option>
              <option value="baby-shower">Baby Shower</option>
              <option value="christmas">Christmas / Holiday</option>
              <option value="easter">Easter</option>
              <option value="retirement">Retirement</option>
              <option value="get-well">Get Well Soon</option>
              <option value="sympathy">Sympathy</option>
              <option value="just-because">Just Because</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Theme (optional)</label>
            <input
              type="text"
              placeholder="e.g. Star Wars, Beach, Floral"
              value={formData.theme}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
            />
          </div>
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
          <label className="block text-xs text-gray-500 mb-1">Upload Photos & Videos <span className="text-gray-300">(Max 15 files · Photos up to 10MB · Videos up to 100MB)</span></label>
          <label className={`cursor-pointer block border-2 border-dashed rounded-xl p-8 text-center transition-colors ${uploadedUrls.length > 0 ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50 hover:bg-rose-50 hover:border-rose-200'}`}>
            <div className="flex flex-col items-center gap-2">
              {uploadedUrls.length > 0 ? (
                <svg className="w-9 h-9 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-9 h-9 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              )}
              {uploading ? (
                <p className="text-rose-500 text-sm font-medium">Uploading {fileCount} file(s)...</p>
              ) : uploadError ? (
                <>
                  <p className="text-red-500 text-sm font-semibold">{uploadError}</p>
                  <p className="text-gray-400 text-xs">Click to try again</p>
                </>
              ) : uploadedUrls.length > 0 ? (
                <>
                  <p className="text-green-600 text-base font-semibold">{uploadedUrls.length} file{uploadedUrls.length > 1 ? 's' : ''} uploaded successfully!</p>
                  <p className="text-green-500 text-xs">Click here to replace your files</p>
                </>
              ) : (
                <>
                  <p className="text-rose-500 text-sm font-medium">Click to upload your favorite moments</p>
                  <p className="text-gray-400 text-xs">Photos (JPG, PNG) & Videos (MP4, MOV) · Hold Cmd (Mac) or Ctrl (Windows) to select multiple</p>
                </>
              )}
            </div>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">Did all of your files fit in the box above? <span className="font-normal text-gray-500">(Max 15 photos &amp; videos combined — if you submit more than 15, we will choose the 15 for you)</span> If not, we will reach out for any photos or videos that did not fit via text.</label>
          <textarea
            placeholder="e.g. Yes, please reach out for more — or — No, I included all my files!"
            rows={2}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 resize-none"
            onChange={(e) => setFormData({ ...formData, missingFiles: e.target.value })}
          />
        </div>

        <div className="mt-4">
          <label className="block text-xs text-gray-500 mb-1">Your Message <span className="text-gray-300">(optional — we can make a message for you, just let us know!)</span></label>
          <textarea
            placeholder="Write something heartfelt..."
            rows={5}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 resize-none"
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </div>

        <div className="mt-4">
          <label className="block text-xs text-gray-500 mb-1">Additional Notes <span className="text-gray-300">(optional)</span></label>
          <textarea
            placeholder="Any extra details or special instructions..."
            rows={3}
            value={formData.additionalNotes}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 resize-none"
            onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
          />
        </div>
      </div>

      {/* Section 3 — A Favorite Memory */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 text-sm font-bold flex items-center justify-center shrink-0">
            3
          </div>
          <h2 className="font-semibold text-gray-800">A Favorite Memory <span className="text-gray-400 font-normal text-sm">(optional — we can make one for you, just let us know!)</span></h2>
        </div>

        <textarea
          placeholder="Share a special moment or memory you have with this person..."
          rows={4}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 resize-none"
          onChange={(e) => setFormData({ ...formData, memory: e.target.value })}
        />
      </div>

      {/* Section 4 — 3 Compliments */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 text-sm font-bold flex items-center justify-center shrink-0">
            4
          </div>
          <h2 className="font-semibold text-gray-800">3 Compliments <span className="text-gray-400 font-normal text-sm">(optional — we can make these for you, just let us know!)</span></h2>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Compliment 1</label>
            <input
              type="text"
              placeholder="e.g. You always know how to make me laugh"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
              onChange={(e) => setFormData({ ...formData, compliment1: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Compliment 2</label>
            <input
              type="text"
              placeholder="e.g. Your kindness is truly one of a kind"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
              onChange={(e) => setFormData({ ...formData, compliment2: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Compliment 3</label>
            <input
              type="text"
              placeholder="e.g. I admire how hard you work every day"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
              onChange={(e) => setFormData({ ...formData, compliment3: e.target.value })}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || uploading}
        className="w-full bg-rose-500 text-white py-3 rounded-full font-semibold hover:bg-rose-600 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Submitting...' : uploading ? 'Uploading files...' : 'Continue to Payment →'}
      </button>

    </form>
  );
}
