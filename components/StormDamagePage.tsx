import React, { useState, useEffect } from 'react';

interface StormDamagePageProps {
  onBackToHome: () => void;
  onScheduleClick: () => void;
}

const StormDamagePage: React.FC<StormDamagePageProps> = ({ onBackToHome, onScheduleClick }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    damageType: 'hail',
    description: '',
    hasLeaking: 'no'
  });

  // Inject SEO / AI AEO Schema on mount
  useEffect(() => {
    // Scroll to top when page is mounted
    window.scrollTo({ top: 0, behavior: 'instant' });

    // FAQ Schema
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How long do I have to file an insurance claim for hail damage to my roof in Kansas and Missouri?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "In the Kansas City metro area (Missouri and Kansas), most homeowners insurance policies require claims to be filed within 1 to 2 years from the date of the storm. However, we strongly recommend filing as soon as possible, as weathering can mask original storm impacts, complicating the adjustment process."
          }
        },
        {
          "@type": "Question",
          "name": "Will my home insurance rates go up if I file a storm damage roofing claim?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "By law in Missouri and Kansas, insurance companies cannot raise your individual premium rates for filing a claim caused by an 'Act of God' (such as hail, windstorms, or tornadoes). Premium adjustments are instead made on a zip-code or regional level based on overall storm severity."
          }
        },
        {
          "@type": "Question",
          "name": "What is the difference between hail bruising and wind shingle lifting?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Hail damage creates distinct physical 'bruises' or dark circular indentations that break the fiberglass backing mat, leading to rapid granule loss. Wind damage lifts shingles or breaks the self-sealing adhesive strip, leaving creases, tears, or completely missing shingles that immediately expose the wood sheathing."
          }
        }
      ]
    };

    // Brand LocalBusiness Schema
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "RoofingContractor",
      "name": "Elite Roofing Solutions - Storm Restoration Division",
      "image": "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=1200&q=80",
      "telephone": "(800) 555-ROOF",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1546 Roofing Ave",
        "addressLocality": "Kansas City",
        "addressRegion": "MO",
        "postalCode": "64082",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 38.9130,
        "longitude": -94.3804
      },
      "url": window.location.href,
      "areaServed": ["Kansas City", "Lee's Summit", "Overland Park", "Liberty", "Lenexa", "Olathe", "Blue Springs"]
    };

    const faqScript = document.createElement('script');
    faqScript.type = 'application/ld+json';
    faqScript.id = 'storm-faq-schema';
    faqScript.innerHTML = JSON.stringify(faqSchema);
    document.head.appendChild(faqScript);

    const bizScript = document.createElement('script');
    bizScript.type = 'application/ld+json';
    bizScript.id = 'storm-biz-schema';
    bizScript.innerHTML = JSON.stringify(localBusinessSchema);
    document.head.appendChild(bizScript);

    return () => {
      const existingFaq = document.getElementById('storm-faq-schema');
      const existingBiz = document.getElementById('storm-biz-schema');
      if (existingFaq) existingFaq.remove();
      if (existingBiz) existingBiz.remove();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please fill in Name, Phone, and Property Address so we can inspect your home.");
      return;
    }
    setFormSubmitted(true);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Dynamic SEO Meta Header Section */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white pt-10 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center gap-2 text-sm text-blue-300 mb-8 font-medium">
            <button onClick={onBackToHome} className="hover:text-white transition-colors flex items-center gap-1">
              ← Home
            </button>
            <span>/</span>
            <span className="text-gray-300">Storm Damage Center</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/25 border border-red-500/50 text-red-300 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Emergency Rapid Response Area
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Storm, Wind & Hail <br />
                <span className="text-blue-400">Damage Restoration</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-200 font-light max-w-2xl leading-relaxed">
                Severe Midwestern storms strike fast, compromising shingles, seals, and structures. Our HAAG-certified estimators protect your home with high-definition digital photo audits, comprehensive loss documentation, and complete insurance claim navigation.
              </p>

              {/* Geo list for SEO/AEO */}
              <div className="pt-2">
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Proudly Serving Our Communities:</p>
                <div className="flex flex-wrap gap-2 text-sm text-gray-300">
                  {['Kansas City', "Lee's Summit", 'Overland Park', 'Liberty', 'Lenexa', 'Olathe'].map((city) => (
                    <span key={city} className="bg-white/10 px-3 py-1 rounded-md border border-white/5 font-medium">
                      {city}
                    </span>
                  ))}
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 max-w-lg">
                <div className="text-center sm:text-left">
                  <p className="text-2xl font-black text-blue-400">100%</p>
                  <p className="text-xs text-gray-400">Insurance Approved</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-2xl font-black text-blue-400">HAAG</p>
                  <p className="text-xs text-gray-400">Certified Inspectors</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-2xl font-black text-blue-400">24hr</p>
                  <p className="text-xs text-gray-400">Emergency Dispatch</p>
                </div>
              </div>
            </div>

            {/* Right Form Container */}
            <div className="lg:col-span-5 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 relative">
              <h3 className="text-2xl font-black mb-1 flex items-center gap-2 text-gray-900 dark:text-white">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                Fast Claim Intake
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
                Skip the hold loops. Submit your info for instant call dispatch.
              </p>

              {formSubmitted ? (
                <div className="text-center py-12 space-y-6 animate-fade-in">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/45 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black text-gray-900 dark:text-white">Intake Enqueued!</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 px-4">
                      Thank you <span className="font-bold text-blue-600 dark:text-blue-400">{formData.name}</span>. Your {isUrgent ? 'URGENT dispatch' : 'priority storm inquiry'} has been logged at <span className="font-bold font-mono">{formData.address}, {formData.city || 'KC Metro'}</span>.
                    </p>
                    <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/20 py-2 px-3 rounded-md mt-4 max-w-sm mx-auto font-bold animate-pulse">
                      Status: Our storm coordinator is dialing you back right now on: {formData.phone}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        address: '',
                        city: '',
                        damageType: 'hail',
                        description: '',
                        hasLeaking: 'no'
                      });
                      setIsUrgent(false);
                    }}
                    className="text-xs text-blue-600 dark:text-blue-400 font-bold underline hover:text-blue-800 transition-colors"
                  >
                    Submit another property report
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Urgent selector */}
                  <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden font-bold">
                    <button
                      type="button"
                      onClick={() => setIsUrgent(false)}
                      className={`flex-1 py-2 text-xs transition-colors uppercase tracking-wider ${
                        !isUrgent
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-600'
                      }`}
                    >
                      Priority Assessment
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsUrgent(true)}
                      className={`flex-1 py-2 text-xs transition-colors uppercase tracking-wider flex items-center justify-center gap-1.5 ${
                        isUrgent
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-white dark:bg-gray-800 text-red-400 dark:text-red-500/70 hover:bg-red-50/50'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      24Hr Emergency Leak
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Jane Doe"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(816) 555-0199"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="jane@outlook.com"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                      Full Property Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="1204 Pine Tree Lane"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Lee's Summit"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                        Primary Storm Type
                      </label>
                      <select
                        name="damageType"
                        value={formData.damageType}
                        onChange={handleInputChange}
                        className="w-full px-2 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                      >
                        <option value="hail">Hail Strikes</option>
                        <option value="wind">Wind / Lifted Shingles</option>
                        <option value="tree">Downed Tree Branch</option>
                        <option value="aged">Weathering / Slow Leak</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                      Are you currently experiencing an active ceiling leak?
                    </label>
                    <div className="flex gap-4 mt-1">
                      <label className="flex items-center gap-1.5 cursor-pointer text-sm font-semibold">
                        <input
                          type="radio"
                          name="hasLeaking"
                          value="yes"
                          checked={formData.hasLeaking === 'yes'}
                          onChange={() => setFormData(prev => ({ ...prev, hasLeaking: 'yes' }))}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        Yes, immediate leak
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-sm font-semibold">
                        <input
                          type="radio"
                          name="hasLeaking"
                          value="no"
                          checked={formData.hasLeaking === 'no'}
                          onChange={() => setFormData(prev => ({ ...prev, hasLeaking: 'no' }))}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        No, pre-emptive review
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                      Brief description of roof damage (optional)
                    </label>
                    <textarea
                      name="description"
                      rows={2}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="e.g., several shingles blown off in backyard, or water spot in dining room..."
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-white shadow-lg  transition-all duration-300 transform active:scale-[0.98] ${
                      isUrgent 
                        ? 'bg-red-600 hover:bg-red-700 shadow-red-600/30' 
                        : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
                    }`}
                  >
                    {isUrgent ? '🚨 REQUEST EMERGENCY TARPING DISPATCH' : 'SCHEDULE STORM DAMAGE ASSESSMENT'}
                  </button>

                  <p className="text-[10px] text-center text-gray-400 leading-normal">
                    By submitting, you authorize Elite Roofing to dispatch an estimator & contact you via phone or SMS. Standard messaging rates may apply.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Hail & Wind Diagnostics Block */}
      <section className="py-20 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-base font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              Hail vs. Wind Structural Diagnostics
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Rebuilding Hail & Wind Damage Awareness
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Not all storm impact is obvious from your turf. Our HAAG certified teams deploy specialized thermal cameras, drone-based aerial modeling, and manual high-precision inspection to diagnose compromise layers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Hail Damage Diagnostic */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 space-y-6">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center font-black">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">Hail Impact Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Large hail stones impact roofs at speeds exceeding 40-70 MPH. This does not always breach shingles outright, but creates structural bruising.
              </p>
              
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">!</span>
                  <div>
                    <strong className="text-gray-800 dark:text-gray-200">Fiberglass Mat Rupture:</strong>
                    <p className="text-sm text-gray-500 dark:text-gray-400">The high speed hit fractures the underlying weave structure on asphalt shingles, exposing your home substrate to slow thermal water leaks.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">!</span>
                  <div>
                    <strong className="text-gray-800 dark:text-gray-200">Granule Shedding:</strong>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Hail strips away protective minerals. Solar ultraviolet radiation then directly cooks the raw asphalt, causing rapid decay in 3 to 6 months.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">!</span>
                  <div>
                    <strong className="text-gray-800 dark:text-gray-200">Fractured Underlayments:</strong>
                    <p className="text-sm text-gray-500 dark:text-gray-400">In severe hail segments, shingle backs are pushed directly into deck boards, creating sub-layer cracks that allow moisture to pool behind ceilings.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Wind Damage Diagnostic */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 space-y-6">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center font-black">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">Wind Lift & Tear Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                High Midwestern windstorms generate immense uplift pressures. Even moderate winds (40-60 MPH) exploit small seal breaches to shear off shingle courses.
              </p>

              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">!</span>
                  <div>
                    <strong className="text-gray-800 dark:text-gray-200">Seal Strip De-lamination:</strong>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Wind lifts the shingle tab, tearing the sticky sealant line. Once broken, the shingle can flap permanently, creasing or flying off in subsequent storms.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">!</span>
                  <div>
                    <strong className="text-gray-800 dark:text-gray-200">Exposed Nails & Fasteners:</strong>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Lifted tabs expose fastener crowns to rainfall. Water migrates down nail shanks directly into plywood sheathing, rotting your deck core.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">!</span>
                  <div>
                    <strong className="text-gray-800 dark:text-gray-200">Creased Tabs:</strong>
                    <p className="text-sm text-gray-500 dark:text-gray-400">A classic sign of high wind—a dark linear folding crease across the shingle head. This represents structural compromise and qualifies for full replacement under key insurance guidelines.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Homeowner's Insurance Guide */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Guide Step Listing */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <span className="text-xs uppercase font-black text-blue-600 dark:text-blue-400 tracking-wider">
                  No-Stress Claim Navigator
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-905 dark:text-white tracking-tight">
                  Homeowner’s Insurance Guide to Storm Replacement
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Navigating an insurance claim can be highly overwhelming. Insurance adjusters are trained to minimize payouts. We represent you—providing precise engineering reports, HAAG standards, and structural measurements to ensure your property is restored to code, fully paid.
                </p>
              </div>

              {/* Step checklist */}
              <div className="space-y-6">
                {[
                  {
                    step: '01',
                    title: 'Strategic Free Inspection',
                    desc: 'Before calling your insurance agent, we inspect the roof, gutters, screens, and siding. We verify whether the damage crosses the qualifying claim threshold so you avoid filing unnecessary non-paying zero claims.'
                  },
                  {
                    step: '02',
                    title: 'Digital High-Definition Evidence Bundle',
                    desc: 'We generate an engineering pack containing drone maps, thermal moisture diagnostics, hail bruising close-ups, and wind flight vectors. This is uploaded directly to your claim adjuster portal.'
                  },
                  {
                    step: '03',
                    title: 'Direct Claims Coordination',
                    desc: 'We assist you in filing. When the insurance adjuster coordinates the site visit, our senior inspector meets them in person, step-by-step on the roof, pointing out structural fractures to ensure they approve all segments.'
                  },
                  {
                    step: '04',
                    title: 'Complete Midwest Code Restoration',
                    desc: 'Once approved, we rebuild your roof with high-grade, impact-resistant shingles. We install advanced ice and water shields and drip edges required under regional building codes—at $0 out of pocket beyond your deductible.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
                    <span className="text-3xl font-black text-blue-600 dark:text-blue-500 font-mono leading-none">
                      {item.step}
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">{item.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insurance Warning / Advice Callout */}
            <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[500px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="space-y-6 relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black">Critical Industry Advice</h3>
                <p className="text-sm text-blue-100 leading-relaxed font-light">
                  Most insurance companies have a strict time limit (usually 365 days from the date of the hail or wind storm) to file a claim.
                </p>
                <p className="text-sm text-blue-100 leading-relaxed font-light">
                  Filing a claim for storm damage is considered an <strong className="text-white">"Act of God."</strong> Regulatory agencies protect consumers in Missouri and Kansas. It is illegal for insurance providers to raise insurance premiums on an individual home policy due to Act of God damage files.
                </p>
                
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-xs text-blue-200">
                  <span className="font-extrabold text-blue-300 block mb-1">Check Deductible:</span>
                  Ask if you have a separate "hail/wind" percentage deductible vs. a standard flat $1,000 deductible. We guide you through this breakdown on our initial consultation call.
                </div>
              </div>

              <div className="pt-8 relative z-10">
                <button
                  type="button"
                  onClick={onScheduleClick}
                  className="w-full bg-white text-blue-900 font-bold py-3.5 px-6 rounded-xl hover:bg-slate-100 transition-colors shadow-lg shadow-blue-950/40 text-center text-sm tracking-wide"
                >
                  SCHEDULE ADJUSMENT CHECK UP
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 24-Hr Emergency CTA Block */}
      <section className="bg-red-700 dark:bg-red-900 text-white py-16 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600 dark:bg-red-800 rounded-full blur-3xl opacity-50"></div>
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 text-center max-w-4xl relative z-10 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 border border-white/30">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            Leaking? Downed Tree? Active Hole?
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
            24 / 7 Emergency Storm Response
          </h2>
          <p className="text-lg sm:text-xl text-red-100 font-light max-w-2xl mx-auto leading-relaxed">
            Do not let water destroy your ceilings, drywalls, and electric systems. Our fully insured roofing teams are on call 24 hours a day to install emergency thick thermal tarp limits. We secure your roof in hours and log immediate insurance claims.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <a
              href="tel:8005557663"
              className="w-full sm:w-auto bg-white text-red-700 dark:text-red-900 font-black py-4 px-8 rounded-full shadow-2xl hover:bg-gray-150 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Call (800) 555-ROOF Now</span>
            </a>
            <button
              onClick={onScheduleClick}
              className="w-full sm:w-auto bg-transparent border-2 border-white text-white font-bold py-3.5 px-8 rounded-full hover:bg-white/10 active:scale-[0.98] transition-all text-lg"
            >
              Book Tarp Dispatch
            </button>
          </div>
          
          <p className="text-xs text-red-200">
            * Emergency responsive tarping qualifies under standard homeowners insurance mitigation clauses. Usually 100% reimbursed!
          </p>
        </div>
      </section>

      {/* SEO GEP / AI AEO FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-4xl">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs uppercase font-black text-blue-600 dark:text-blue-400 tracking-wider">
              Knowledge Center
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-901 dark:text-white tracking-tight">
              Storm Damage Claims FAQ
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              Find direct, accurate, code-compliant answers. Geographically targeted and audit-vetted for Kansas City homeowners.
            </p>
          </div>

          <div className="space-y-8 divide-y divide-gray-100 dark:divide-gray-800">
            {[
              {
                q: 'What local building codes apply to storm roof replacements in the KC Metro?',
                a: 'Under the IRC (International Residential Code) used across Jackson County, MO, and Johnson County, KS (including Overland Park, Lee\'s Summit, Overland Park, Lenexa, and Liberty), you are legally limited to a maximum of 2 roofing layers. If code-compliant drip edges or ice-and-water block barriers are absent, our HAAG inspectors require your insurance carrier to pay for a modern code-conforming complete roof tear-off and rebuild.'
              },
              {
                q: 'How long do I have to file a roof claim for hail or wind damage in Missouri or Kansas?',
                a: 'Most carriers allow up to 1 to 2 years from date of loss. However, we strongly recommend requesting an inspection within 30-60 days of the windstorm. Late filings often get denied as weathering can blur original hail indentation fractures, making it hard to prove damage occurred during target storm window.'
              },
              {
                q: 'My roof is old. Will insurance cover a replacement if it gets hit by hail?',
                a: 'Yes! While some older policies utilize an ACV (Actual Cash Value) clause which depreciates the payout based on age, most standard premium policies utilize RCV (Replacement Cost Value). Under RCV, your insurance provider pays for the full retail cost of a brand new roof replacement, minus only your personal deductible amount.'
              },
              {
                q: 'The insurance adjuster inspected my roof and denied my claim. Is that final?',
                a: 'No. Adjusters often miss fractures or categorize lift creases as simple aging wear-and-tear. If you get denied, Elite Roofing provides a professional re-inspection. We produce thermal moisture scans, photo evidence binders, and formal HAAG write-ups, and we coordinate with your carrier to request a re-adjustment visit with our roofing specialist on the deck.'
              }
            ].map((faq, idx) => (
              <div key={idx} className={`${idx > 0 ? 'pt-6' : ''} space-y-2`}>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-500 font-mono">Q:</span>
                  {faq.q}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed pl-7">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 text-center space-y-4">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">Need a Second Opinion or HAAG Certified Certificate?</h4>
            <p className="text-sm text-gray-650 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
              Do not leave money on the table. If you feel your storm damage was miscategorized or your claim was denied, consult with our estimators for a free code review.
            </p>
            <div className="flex justify-center flex-wrap gap-4 pt-2">
              <button
                type="button"
                onClick={onScheduleClick}
                className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-md"
              >
                Schedule Free Code Audit
              </button>
              <button
                type="button"
                onClick={onBackToHome}
                className="bg-white dark:bg-gray-850 text-gray-700 dark:text-gray-200 font-bold py-2.5 px-6 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border dark:border-gray-800"
              >
                Return to Home Page
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StormDamagePage;
