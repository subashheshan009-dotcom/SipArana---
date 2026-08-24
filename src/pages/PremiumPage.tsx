import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Crown,
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  Award,
  Video,
  MessageCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function PremiumPage() {
  const { profile, updateProfile, addXP } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'SIPARANA2026' || code === 'TOPRANK') {
      setCouponApplied(true);
      setDiscountPercent(25);
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch {}
      addXP(50);
    } else {
      alert('Invalid coupon code. Try "SIPARANA2026" for 25% off!');
    }
  };

  const handleUpgrade = (tierName: string) => {
    updateProfile({ isPremium: true });
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } catch {}
    addXP(200);
    alert(`🎉 සාදරයෙන් පිළිගනිමු! You are now subscribed to ${tierName}. Enjoy all VIP resources!`);
  };

  const pricePro = billingCycle === 'annual' ? 1450 : 1950;
  const priceRanker = billingCycle === 'annual' ? 2600 : 3400;

  const finalPricePro = couponApplied ? Math.round(pricePro * (1 - discountPercent / 100)) : pricePro;
  const finalPriceRanker = couponApplied ? Math.round(priceRanker * (1 - discountPercent / 100)) : priceRanker;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold">
          <Crown className="w-3.5 h-3.5" />
          <span>SipArana Pro Scholar Pass</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100">
          A/L & O/L විභාග ජයග්‍රහණයට <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            අසීමිත වරප්‍රසාද (Pro Access)
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          24/7 AI Doubt Solver, දිවයිනේ ප්‍රමුඛතම ගුරුවරුන්ගේ වීඩියෝ පාඩම් මාලා සහ අනාවැකි ප්‍රශ්න පත්‍ර එකතුව.
        </p>

        {/* Billing Switch */}
        <div className="pt-3 flex items-center justify-center gap-3 text-xs font-bold">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-xl transition ${
              billingCycle === 'monthly'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Monthly Plan
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              billingCycle === 'annual'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <span>Annual Plan</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-900 text-[10px]">
              Save 30%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier 1: Free */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Free Scholar</span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">LKR 0</h3>
              <p className="text-xs text-slate-500">Free forever with basic study utilities</p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Standard Past Papers (2015-2022)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Pomodoro Focus Timer & GPA Tool</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Full Official Syllabi & PDF Downloads</span>
              </li>
            </ul>
          </div>

          <button
            disabled
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-xs"
          >
            Current Active Plan
          </button>
        </div>

        {/* Tier 2: Pro Scholar (Popular) */}
        <div className="bg-gradient-to-b from-blue-900/40 via-slate-900 to-slate-900 border-2 border-blue-500 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 relative shadow-2xl">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider shadow-md">
            Most Popular for A/L
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Pro Scholar</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-white">LKR {finalPricePro}</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <p className="text-xs text-slate-400">Full curriculum revision & AI solutions</p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Unlimited 24/7 AI Doubt Solver</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Full Past Papers 2015-2024 with Schemes</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Full HD Video Lecture Masterclasses</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Download Printable PDF Short Notes</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleUpgrade('Pro Scholar')}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition"
          >
            <span>Upgrade to Pro Scholar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tier 3: Island Ranker */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Island Ranker Pass</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-slate-800 dark:text-slate-100">LKR {finalPriceRanker}</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <p className="text-xs text-slate-500">1-on-1 Mentorship & Predicted Papers</p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Everything in Pro Scholar</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Weekly Live Paper Discussions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>1-on-1 Medical/Engineering Senior Mentorship</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Island Ranker Predicted Model Paper Series</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleUpgrade('Island Ranker Pass')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-xs shadow-md transition"
          >
            Get Island Ranker Pass
          </button>
        </div>
      </div>

      {/* Coupon Code Section */}
      <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200 block">
            Have a Student Promo Code? (ශිෂ්‍ය වට්ටම් කූපන් කේතයක් තිබේද?)
          </span>
          <p className="text-slate-500 text-[11px]">
            Use code <code className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono font-bold text-blue-600">SIPARANA2026</code> for 25% discount!
          </p>
        </div>

        <form onSubmit={handleApplyCoupon} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter promo code"
            className="px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-xl font-mono text-xs uppercase"
          />
          <button
            type="submit"
            className="px-4 py-1.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white font-bold rounded-xl transition"
          >
            Apply
          </button>
        </form>
      </div>
    </div>
  );
}
