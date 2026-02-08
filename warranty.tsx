
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ShieldCheckIcon, HomeIcon, WrenchScrewdriverIcon, BoltIcon, XMarkIcon, SparkleIcon, PrinterIcon } from './components/Icon';

const WarrantyPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Pop-up Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 no-print">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <HomeIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-gray-900 dark:text-white uppercase italic">Elite Roofing</span>
              <p className="text-[9px] text-blue-600 dark:text-blue-400 uppercase font-black tracking-widest leading-none mt-0.5">Premier Protection Standard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
                onClick={() => window.print()}
                className="hidden sm:flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider hover:bg-gray-200 transition-all active:scale-95"
            >
                <PrinterIcon className="w-4 h-4" />
                Print Document
            </button>
            <button 
                onClick={() => window.close()}
                className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Close Window"
            >
                <XMarkIcon className="w-7 h-7" />
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 py-12 md:py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header Section */}
          <header className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
               <ShieldCheckIcon className="w-4 h-4" />
               <span>Industry-Leading Certification</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter leading-[1.1]">
              Warranties that last <br/><span className="text-blue-600">5x longer.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
              While most roofers offer a 2-year workmanship warranty, <strong className="text-gray-900 dark:text-white font-black">we give you 10.</strong> We stand behind our craft so you can sleep soundly through every storm.
            </p>
          </header>

          <div className="space-y-10">
            {/* Main Promise */}
            <section className="bg-gray-900 text-white p-8 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                  <WrenchScrewdriverIcon className="w-80 h-80 text-blue-500" />
              </div>
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/40">
                      <WrenchScrewdriverIcon className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">10-Year Workmanship Warranty</h2>
                        <p className="text-blue-400 font-bold uppercase tracking-widest text-xs">The Elite Roofing Difference</p>
                    </div>
                </div>
                
                <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
                  <p className="text-lg leading-relaxed">
                    Elite Roofing Solutions guarantees all labor and workmanship for a full <strong className="text-white">ten (10) years</strong> from completion. This coverage protects you against defects in the installation process that could lead to leaks or structural issues.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    {[
                      "All installation-related leaks covered",
                      "Zero-cost repair of damaged flashing",
                      "Guaranteed vent & pipe boot integrity",
                      "Elite-certified material handling"
                    ].map(item => (
                      <div key={item} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                        <span className="text-sm font-bold tracking-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Manufacturer Material */}
            <section className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden relative">
               <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl flex items-center justify-center">
                            <BoltIcon className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">Manufacturer Coverage</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                      As <strong className="text-gray-900 dark:text-white">GAF Preferred</strong> and <strong className="text-gray-900 dark:text-white">Owens Corning Certified</strong> contractors, we offer premium lifetime material warranties that simple "un-certified" roofers cannot access.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-full text-[10px] font-black uppercase text-gray-500 tracking-widest border border-gray-200 dark:border-gray-600">GAF Lifetime</div>
                        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-full text-[10px] font-black uppercase text-gray-500 tracking-widest border border-gray-200 dark:border-gray-600">Owens Corning Preferred</div>
                        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-full text-[10px] font-black uppercase text-gray-500 tracking-widest border border-gray-200 dark:border-gray-600">Storm-Guard Ready</div>
                    </div>
                  </div>
                  <div className="w-full md:w-64 bg-gray-100 dark:bg-gray-900 aspect-square rounded-[2rem] flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                      <ShieldCheckIcon className="w-12 h-12 text-blue-600 mb-4 opacity-30" />
                      <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Authentic Material Certification</p>
                  </div>
               </div>
            </section>

            {/* Transferability Section */}
            <section className="bg-blue-600 text-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
               <div className="absolute -bottom-12 -left-12 opacity-10">
                   <SparkleIcon className="w-64 h-64" />
               </div>
               <div className="relative z-10">
                <h2 className="text-2xl md:text-4xl font-black mb-6">Fully Transferable Coverage</h2>
                <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-2xl">
                    Selling your property? Our workmanship warranty moves with the home. This adds significant resale value and peace of mind to the new owner, provided the transfer is registered within 30 days of closing.
                </p>
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 inline-block">
                    <p className="text-xs font-black uppercase tracking-widest mb-1">Transfer Rule</p>
                    <p className="font-bold text-sm">Must be filed within 30 days of home title transfer.</p>
                </div>
              </div>
            </section>

            {/* Exclusions Section */}
            <section className="py-12 border-t border-gray-100 dark:border-gray-800">
               <div className="flex flex-col md:flex-row gap-12">
                   <div className="md:w-1/3">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">Standard Exclusions</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Transparency is key. Here are the items that fall outside our workmanship guarantee.</p>
                   </div>
                   <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { title: "Acts of God", desc: "Hail, high winds over shingle rating, tornado, or lightning." },
                        { title: "Structural Settling", desc: "Cracked foundations or significant house movement." },
                        { title: "Third-Party Alterations", desc: "Solar, HVAC, or satellite dish installs by others." },
                        { title: "Neglect", desc: "Failure to clear debris or gutters causing ice damming." }
                      ].map(ex => (
                        <div key={ex.title} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
                            <h4 className="font-black text-xs uppercase tracking-widest text-red-500 mb-2">{ex.title}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{ex.desc}</p>
                        </div>
                      ))}
                   </div>
               </div>
            </section>
          </div>

          {/* CTA Footer */}
          <footer className="mt-24 text-center no-print">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Need to file a claim?</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-md mx-auto">Our claims department is standing by. We respond to all verified warranty requests within 48 business hours.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                    href="mailto:claims@eliteroof.ai"
                    className="w-full sm:w-auto bg-blue-600 text-white font-black py-5 px-12 rounded-[2rem] shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                    <ShieldCheckIcon className="w-5 h-5" />
                    Email Claims Department
                </a>
                <button 
                    onClick={() => window.close()}
                    className="w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-black py-5 px-12 rounded-[2rem] border-2 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95"
                >
                    Close Document
                </button>
            </div>
          </footer>
        </div>
      </main>

      <footer className="py-16 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 text-center">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center gap-2 mb-4 opacity-40">
                <ShieldCheckIcon className="w-5 h-5" />
                <p className="font-black text-[10px] uppercase tracking-[0.3em]">Elite Roofing Solutions HQ</p>
            </div>
            <p className="text-[10px] text-gray-400 font-medium">© {new Date().getFullYear()} Elite Roofing Solutions. Professional Quality & Absolute Integrity.</p>
            <p className="mt-4 text-[9px] text-gray-400 max-w-sm mx-auto opacity-50">This document is a summary of coverage. Specific terms are provided in the signed contract for each specific property address.</p>
          </div>
      </footer>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <WarrantyPage />
    </React.StrictMode>
  );
}
