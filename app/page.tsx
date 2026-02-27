import OrderForm from './OrderForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-pink-50">

      {/* Navigation */}
      <nav className="bg-white border-b border-pink-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-rose-500 text-xl">❤</span>
            <span className="font-semibold text-gray-800 text-lg tracking-tight">Heartfelt Co.</span>
          </div>
          <div className="hidden sm:flex items-center gap-8 text-sm text-gray-500">
            <a href="https://heartfeltcraftsco.com" className="hover:text-gray-900 transition-colors">How It Works</a>
            <a href="https://heartfeltcraftsco.com" className="hover:text-gray-900 transition-colors">Portfolio</a>
            <a href="https://heartfeltcraftsco.com" className="hover:text-gray-900 transition-colors">Testimonials</a>
          </div>
          <a
            href="#form"
            className="bg-rose-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-rose-600 transition-colors"
          >
            Order Now
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-b from-pink-300 to-pink-100 pt-16 pb-28 text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 drop-shadow-sm">
          Start Your Custom Gram
        </h1>
        <p className="text-pink-50 text-lg">
          Tell us your story. We&apos;ll weave it into a digital masterpiece.
        </p>
      </div>

      {/* Form card */}
      <div id="form" className="max-w-2xl mx-auto px-4 -mt-14 pb-28">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <OrderForm />
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-pink-100 py-3 px-6 flex items-center justify-between z-20 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎁</span>
          <div>
            <p className="font-bold text-rose-600 text-sm">$15 Flat Price</p>
            <p className="text-gray-400 text-xs">Limited time Valentine&apos;s offer</p>
          </div>
        </div>
        <a
          href="#form"
          className="bg-rose-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-rose-600 transition-colors"
        >
          Order Now
        </a>
      </div>

    </div>
  );
}
