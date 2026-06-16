import React, { useState } from 'react';

interface FinancingPageProps {
  onBackToHome: () => void;
  onScheduleClick: () => void;
  onEstimateClick: () => void;
}

const FinancingPage: React.FC<FinancingPageProps> = ({ onBackToHome, onScheduleClick, onEstimateClick }) => {
  const [roofCost, setRoofCost] = useState<number>(14500);
  const [termMonths, setTermMonths] = useState<number>(120); // 10 years
  const [interestRate, setInterestRate] = useState<number>(8.99); // 8.99% standard rate

  // Calculate monthly amortization payment: P * (r * (1 + r)^n) / ((1 + r)^n - 1)
  const calculateMonthlyPayment = (cost: number, rate: number, months: number) => {
    const r = (rate / 100) / 12;
    if (r === 0) return (cost / months).toFixed(2);
    const payment = cost * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    return isNaN(payment) ? '0.00' : payment.toFixed(2);
  };

  const currentPayment = calculateMonthlyPayment(roofCost, interestRate, termMonths);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      {/* Premium Hero Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white pt-10 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <pattern id="grid-finance" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-finance)" />
          </svg>
        </div>

        <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-blue-300 mb-8 font-medium">
            <button onClick={onBackToHome} className="hover:text-white transition-colors flex items-center gap-1">
              ← Home
            </button>
            <span>/</span>
            <span className="text-gray-300">Financing Solutions</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                0% APR Promotional Plans Available
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Flexible Home <br />
                <span className="text-blue-400">Roofing Financing</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-200 font-light max-w-2xl leading-relaxed">
                Protect your home now, pay comfortably over time. We partner with premier home improvement lenders like <strong className="text-white">Hearth</strong> and <strong className="text-white">GreenSky</strong> to offer instant pre-qualifications, low fixed APRs, and seamless paperless management.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                  <div className="text-emerald-400 text-3xl font-black">0%</div>
                  <div className="text-xs text-gray-300">Interest options for up to 12 months with prompt payoff</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                  <div className="text-blue-400 text-3xl font-black">60s</div>
                  <div className="text-xs text-gray-300">Soft pull pre-approval with absolutely zero credit score impact</div>
                </div>
              </div>
            </div>

            {/* Interactive Calculator Card */}
            <div className="lg:col-span-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-gray-800 dark:text-gray-100 relative">
              <h3 className="text-xl font-black mb-1 text-gray-900 dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Roof Payment Estimator
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 font-medium">
                Drag the sliders to preview your possible monthly payments
              </p>

              <div className="space-y-5">
                {/* Cost Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    <span>Estimated Project Cost</span>
                    <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">${roofCost.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="45000"
                    step="500"
                    value={roofCost}
                    onChange={(e) => setRoofCost(Number(e.target.value))}
                    className="w-full accent-blue-600 dark:accent-blue-500 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                    <span>$5,000 (Repair)</span>
                    <span>$14,500 (Modest)</span>
                    <span>$45,000 (Premium Slate)</span>
                  </div>
                </div>

                {/* Terms Selection */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    <span>Repayment Term</span>
                    <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">{termMonths / 12} Years ({termMonths} mo)</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[36, 60, 84, 120].map((months) => (
                      <button
                        key={months}
                        type="button"
                        onClick={() => setTermMonths(months)}
                        className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                          termMonths === months
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {months / 12} Yrs
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interest Rate Selector */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    <span>Fixed APR Estimation</span>
                    <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">{interestRate}% APR</span>
                  </div>
                  <input
                    type="range"
                    min="5.99"
                    max="15.99"
                    step="0.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-blue-600 dark:accent-blue-500 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                    <span>5.99% (Excellent Credit)</span>
                    <span>15.99% (Fair Credit)</span>
                  </div>
                </div>

                {/* Monthly Payment Output Screen */}
                <div className="bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl p-5 text-center space-y-1.5 mt-2">
                  <span className="text-xs text-emerald-800 dark:text-emerald-400 font-bold uppercase tracking-widest block">Estimated Payment</span>
                  <div className="text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 font-mono flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-light align-top mr-0.5">$</span>
                    {parseInt(currentPayment).toLocaleString()}
                    <span className="text-lg font-normal">/mo*</span>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    Based on a ${roofCost.toLocaleString()} loan at {interestRate}% APR for {termMonths} months. Subject to lender approval.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 pt-2">
                  <button
                    onClick={onEstimateClick}
                    className="w-full py-3 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all text-sm tracking-wide text-center"
                  >
                    PRE-QUALIFY NOW (NO SCORES AFFECTED)
                  </button>
                  <button
                    onClick={onScheduleClick}
                    className="w-full py-2 px-4 rounded-xl font-bold text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-xs"
                  >
                    Consult with our Finance Specialist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lenders Partnership Block */}
      <section className="py-16 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12">
          {/* Logo / Badge section */}
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs uppercase font-black tracking-widest text-emerald-600 dark:text-emerald-400">Our Trusted Program Lenders</h2>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Seamlessly Integrated for Instant Approvals</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              We coordinate directly with leading home construction loan networks so that your approval turns into active materials and schedules without bank branch delays.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* GreenSky Card */}
            <div className="border border-gray-150 dark:border-gray-800 rounded-3xl p-8 space-y-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950/80 hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-center">
                <span className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-10 bg-emerald-500 rounded-full"></span>
                  GreenSky®
                </span>
                <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider py-1 px-2.5 rounded-full">
                  Promotional Expert
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                GreenSky programs provide exceptionally sturdy credit limits and some of the country\'s most active promotional interest structures, helpful for homeowners with excellent or building credit profiles.
              </p>
              
              <ul className="space-y-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  No Interest, No Payment Plans (6 to 12-Month terms)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  Repayment options with fixed APR starting at 5.99%
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  Credit limits up to $65,000 for complete high-end structural overhauls
                </li>
              </ul>
            </div>

            {/* Hearth Card */}
            <div className="border border-gray-150 dark:border-gray-800 rounded-3xl p-8 space-y-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950/80 hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-center">
                <span className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-10 bg-blue-500 rounded-full"></span>
                  Hearth Financing
                </span>
                <span className="bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider py-1 px-2.5 rounded-full">
                  Instant Soft Pull
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Hearth aggregates quotes from multiple top-tier institutional lenders to deliver rapid, personal, unsecured home improvement loan offers within minutes. No equity required.
              </p>

              <ul className="space-y-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span>
                  Soft pull approvals that leave your credit score completely unaffected
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span>
                  Loans ranging from 2 to 12 years with predictable fixed monthly fees
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span>
                  Flexible profiles allowing scores down to 500 FICO
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Examples & Use Cases Block */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-5xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-xs uppercase font-black tracking-widest text-blue-600 dark:text-blue-400">Fixed Program Real-World Guides</h2>
            <p className="text-3xl font-extrabold text-gray-1000 dark:text-white tracking-tight">Typical Monthly Roofing Scenarios</p>
            <p className="text-gray-650 dark:text-gray-300 text-sm">Below are some standard budgets designed in our system, showing estimated Hearth/GreenSky loan breakdowns.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Minor Storm Repairs',
                price: '$5,000',
                costText: 'Wind damage repairs or flashing updates',
                moCost: '$65',
                period: '84 Months',
                apr: '8.99%',
                suitText: 'Ideal for prompt deductibles'
              },
              {
                title: 'Complete Roof Replacement',
                price: '$14,500',
                costText: 'Standard residential architectural asphalt shingles',
                moCost: '$189',
                period: '120 Months',
                apr: '8.99%',
                suitText: 'Our most popular protective choice',
                featured: true
              },
              {
                title: 'Lifetime Custom System',
                price: '$28,000',
                costText: 'Heavy-duty designer shingles or complete metal system',
                moCost: '$365',
                period: '120 Months',
                apr: '8.99%',
                suitText: 'For maximum durability & resale value'
              }
            ].map((pkg, idx) => (
              <div 
                key={idx} 
                className={`rounded-2xl p-6 relative flex flex-col justify-between ${
                  pkg.featured 
                    ? 'bg-gradient-to-b from-blue-900 to-indigo-950 text-white shadow-xl scale-105 border-2 border-blue-500 z-10' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 shadow-sm'
                }`}
              >
                {pkg.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] uppercase font-black px-3 py-1 rounded-full tracking-wider shadow">
                    Most Selected Program
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className={`text-lg font-black ${pkg.featured ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {pkg.title}
                    </h3>
                    <p className={`text-xs mt-1 leading-relaxed ${pkg.featured ? 'text-blue-200' : 'text-gray-400'}`}>
                      {pkg.costText}
                    </p>
                  </div>

                  <div className="py-2 border-y border-gray-120 dark:border-gray-700">
                    <span className="text-[10px] uppercase tracking-wider font-bold block mb-1">Estimated Principal</span>
                    <span className="text-3xl font-black font-mono">{pkg.price}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold block mb-1">Monthly Payment</span>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-extrabold font-mono ${pkg.featured ? 'text-emerald-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {pkg.moCost}
                      </span>
                      <span className="text-xs font-medium">/mo*</span>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 bg-gray-50/50 dark:bg-black/20 p-3 rounded-lg border border-gray-100/10">
                    <p className="flex justify-between">
                      <span className="text-gray-400">Total Term:</span>
                      <strong className="font-mono">{pkg.period}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-400">Estimated Rate:</span>
                      <strong className="font-mono">{pkg.apr} APR</strong>
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={onEstimateClick}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wide transition-all ${
                      pkg.featured 
                        ? 'bg-white text-blue-900 hover:bg-slate-100 shadow-md' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Select Estimated Loan
                  </button>
                  <p className="text-[8px] text-center mt-2 opacity-60">
                    *Subject to credit authorization. Soft check only.
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-xs mt-12 text-gray-400 max-w-2xl mx-auto leading-relaxed">
            * Disclaimer: Monthly prices provided are illustrative estimations computed using fixed rate loans at 8.99% fixed APR. Your actual APR, loan term limits, and monthly payments will vary depending on your credit profile, selected loan lender network, downpayment sizes, and final contract quotes.
          </div>
        </div>
      </section>

      {/* Program Benefits checklist section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold text-gray-910 dark:text-white tracking-tight">Why Finance Your Roofing Replacement?</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Roofing emergencies rarely choose polite timings. Deferring structural work can lead to mold development, cosmetic structural decay, and escalating dry-rot repair costs. Choosing our finance program protects your house immediately while keeping capital liquid.
              </p>

              <div className="pt-4">
                <button
                  onClick={onEstimateClick}
                  className="bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/25 text-sm"
                >
                  PRE-QUALIFY IN 60 SECARDS
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Hold Capital Liquid', desc: 'Avoid liquidating stocks, high-yield cash vaults, or contingency funds.' },
                { title: 'Upgrade Core Shingles', desc: 'Step up to heavy-duty Class 4 Impact protection systems that lower yearly insurance premiums.' },
                { title: 'Predictable Monthly Costs', desc: 'Lock in stable budget amortization instead of facing sudden double-digit cash hits.' },
                { title: 'No Home Equity Risk', desc: 'Unsecured construction lines carry absolutely zero lien impact on your deed.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                  <span className="text-emerald-500 font-bold text-lg">✓</span>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{item.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FinancingPage;
