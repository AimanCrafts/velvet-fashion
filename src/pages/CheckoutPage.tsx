import React, { useState } from "react";
import { useRouter, Link } from "../router/Router";
import { useStore } from "../context/StoreContext";
import { formatBdt } from "../utils/formatters";
import type { PaymentMethod } from "../types";
import {
  sanitizeInput,
  validateBdPhone,
  validateEmail,
  validateTrxId,
} from "../utils/security";
import {
  ShieldCheck,
  MapPin,
  User,
  Clock,
  Banknote,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  Truck,
  Check,
  CreditCard,
  Smartphone,
} from "lucide-react";

export const CheckoutPage: React.FC = () => {
  const { navigate } = useRouter();
  const {
    cartItems,
    cartSubtotal,
    deliveryZones,
    isBn,
    submitOrderSecure,
    siteSettings,
  } = useStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedZoneId, setSelectedZoneId] = useState(
    deliveryZones[0]?.id || "dhaka_metro"
  );
  const [address, setAddress] = useState("");
  const [timeSlot, setTimeSlot] = useState("Evening (3:00 PM - 8:00 PM)");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [trxId, setTrxId] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedZone =
    deliveryZones.find((z) => z.id === selectedZoneId) || deliveryZones[0];
  const freeThreshold = selectedZone.freeAboveBdt ?? selectedZone.freeAboveQar ?? 3000;
  const zoneFee = selectedZone.feeBdt ?? selectedZone.feeQar ?? 70;
  const deliveryFee = cartSubtotal >= freeThreshold ? 0 : zoneFee;
  const total = cartSubtotal + deliveryFee;
  const amountToFree = Math.max(0, freeThreshold - cartSubtotal);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-[#3E0713]/10 flex items-center justify-center mx-auto mb-4 text-[#3E0713]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#24030B] mb-2">
          {isBn ? "আপনার শপিং ব্যাগ খালি" : "Your Shopping Bag is Empty"}
        </h2>
        <p className="text-xs text-stone-500 mb-6 leading-relaxed">
          {isBn
            ? "আপনি এখনও কোনো পোশাক ব্যাগে যুক্ত করেননি। আমাদের এক্সক্লুসিভ কালেকশন থেকে আপনার পছন্দের পোশাক নির্বাচন করুন।"
            : "Explore our seasonal curation of velvet kaftans, handcrafted panjabis, sarees, and cashmere shawls."}
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#3E0713] text-[#FAF8F5] rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#520B1C] transition shadow-md"
        >
          <span>{isBn ? "কালেকশন ব্রাউজ করুন" : "Explore Collections"}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (honeypot) {
      setErrorMessage(
        isBn
          ? "অনাকাঙ্ক্ষিত বট ফিল্টার সক্রিয় হয়েছে। অনুগ্রহ করে পেজ রিফ্রেশ করে আবার চেষ্টা করুন।"
          : "Submission flagged by anti-abuse filter. Please reload and try again."
      );
      return;
    }

    const sanitizedName = sanitizeInput(name, 80);
    if (!sanitizedName || sanitizedName.length < 2) {
      setErrorMessage(
        isBn ? "অনুগ্রহ করে আপনার পুরো নাম সঠিকভাবে লিখুন (কমপক্ষে ২ অক্ষর)" : "Please enter a valid full name (at least 2 characters)"
      );
      return;
    }

    const phoneCheck = validateBdPhone(phone);
    if (!phoneCheck.isValid) {
      setErrorMessage(
        isBn
          ? "অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 01712-345678)"
          : (phoneCheck.error || "Please enter a valid 11-digit Bangladesh mobile number")
      );
      return;
    }

    let sanitizedAltPhone = "";
    if (altPhone.trim()) {
      const altCheck = validateBdPhone(altPhone);
      if (!altCheck.isValid) {
        setErrorMessage(
          isBn
            ? "বিকল্প মোবাইল নম্বরটি সঠিক ১১ ডিজিটের বাংলাদেশী নম্বর নয়"
            : "The alternative phone number is not a valid 11-digit Bangladesh mobile number"
        );
        return;
      }
      sanitizedAltPhone = altCheck.normalized;
    }

    if (email.trim() && !validateEmail(email)) {
      setErrorMessage(
        isBn
          ? "অনুগ্রহ করে একটি সঠিক ইমেইল এড্রেস লিখুন (যেমন: name@example.com)"
          : "Please enter a valid email address format"
      );
      return;
    }

    const sanitizedAddress = sanitizeInput(address, 250);
    if (!sanitizedAddress || sanitizedAddress.length < 5) {
      setErrorMessage(
        isBn
          ? "অনুগ্রহ করে বিস্তারিত ঠিকানা দিন (বাড়ি/রোড/এলাকা/থানা/জেলা - নূন্যতম ৫ অক্ষর)"
          : "Please enter your full delivery address (House, Road, Area, Thana/District - at least 5 chars)"
      );
      return;
    }

    const sanitizedTrxId = sanitizeInput(trxId, 20).toUpperCase();
    if (paymentMethod === "bkash" || paymentMethod === "nagad") {
      if (!sanitizedTrxId || !validateTrxId(sanitizedTrxId)) {
        setErrorMessage(
          isBn
            ? `অনুগ্রহ করে সঠিক ৮-১৬ অক্ষরের ${paymentMethod === "bkash" ? "বিকাশ" : "নগদ"} ট্রানজেকশন আইডি (TrxID) লিখুন`
            : `Please enter a valid 8-16 character alphanumeric ${paymentMethod.toUpperCase()} Transaction ID (TrxID)`
        );
        return;
      }
    }

    const sanitizedNotes = sanitizeInput(orderNotes, 300);

    setIsSubmitting(true);

    const idempotencyKey = `vf_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    submitOrderSecure({
      customerName: sanitizedName,
      customerPhone: phoneCheck.normalized,
      customerAltPhone: sanitizedAltPhone || undefined,
      customerEmail: email.trim() ? sanitizeInput(email, 80) : undefined,
      zoneId: selectedZone.id,
      address: sanitizedAddress,
      timeSlot: sanitizeInput(timeSlot, 50),
      paymentMethod,
      paymentTrxId: sanitizedTrxId || undefined,
      orderNotes: sanitizedNotes,
      idempotencyKey,
    })
      .then((result) => {
        setIsSubmitting(false);
        if (result.success) {
          navigate(`/order/${result.lookupToken || result.orderId}`);
        } else {
          setErrorMessage(
            isBn
              ? (result.error || "অর্ডার সম্পন্ন করা যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।")
              : (result.error || "Failed to process order. Please verify your details.")
          );
        }
      })
      .catch((err: unknown) => {
        setIsSubmitting(false);
        const msg = err instanceof Error ? err.message : "Error submitting order";
        setErrorMessage(msg);
      });
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 animate-fade-in">
      <div className="flex items-center gap-2 text-xs text-stone-500 mb-8 pb-4 border-b border-[#ECE4D4]">
        <Link to="/shop" className="hover:text-[#3E0713]">
          {isBn ? "কালেকশন" : "Collections"}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="font-semibold text-stone-900">
          {isBn ? "অর্ডার সম্পন্ন ও ডেলিভারি বিবরণ (বাংলাদেশ)" : "Express Checkout (Bangladesh)"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="hidden opacity-0 pointer-events-none absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="company_code">Security Verification - Leave Blank</label>
              <input
                id="company_code"
                name="company_code"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div className="bg-white rounded-2xl border border-[#ECE4D4] p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                <div className="w-7 h-7 rounded-full bg-[#3E0713] text-[#F4E2B5] font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <h3 className="font-['Playfair_Display'] text-base font-bold text-[#24030B] flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#88652A]" />
                  <span>{isBn ? "গ্রাহকের নাম ও মোবাইল নম্বর" : "Customer Information"}</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    {isBn ? "আপনার সম্পূর্ণ নাম *" : "Full Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={80}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isBn ? "যেমন: তাহসিন রহমান / ফারহানা চৌধুরী" : "e.g. Farhana Chowdhury"}
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#E0D7C6] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    {isBn ? "মোবাইল নম্বর (১১ ডিজিট) *" : "Bangladesh Mobile (+880) *"}
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={18}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01712-345678"
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#E0D7C6] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059] focus:bg-white transition font-mono"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    {isBn
                      ? "ডেলিভারি রাইডার এই নম্বরে কল দিয়ে পার্সেল পৌঁছাবে"
                      : "The courier will call this number before arrival"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    {isBn ? "বিকল্প মোবাইল নম্বর (ঐচ্ছিক)" : "Alternative Phone (Optional)"}
                  </label>
                  <input
                    type="tel"
                    maxLength={18}
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    placeholder="01819-000000"
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#E0D7C6] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059] focus:bg-white transition font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    {isBn ? "ইমেইল এড্রেস (রিসিপ্ট পাওয়ার জন্য)" : "Email Address (Optional)"}
                  </label>
                  <input
                    type="email"
                    maxLength={80}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#E0D7C6] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059] focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#ECE4D4] p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                <div className="w-7 h-7 rounded-full bg-[#3E0713] text-[#F4E2B5] font-bold text-xs flex items-center justify-center">
                  2
                </div>
                <h3 className="font-['Playfair_Display'] text-base font-bold text-[#24030B] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#88652A]" />
                  <span>{isBn ? "ডেলিভারি এলাকা ও ঠিকানা" : "Delivery Zone & Destination"}</span>
                </h3>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  {isBn ? "আপনার ডেলিভারি জোন নির্বাচন করুন:" : "Select Delivery Zone:"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {deliveryZones.map((zone) => {
                    const isSelected = selectedZoneId === zone.id;
                    const freeAbove = zone.freeAboveBdt ?? zone.freeAboveQar ?? 3000;
                    const isFree = cartSubtotal >= freeAbove;
                    const fee = zone.feeBdt ?? zone.feeQar ?? 70;
                    return (
                      <button
                        key={zone.id}
                        type="button"
                        onClick={() => setSelectedZoneId(zone.id)}
                        className={`p-3.5 rounded-xl border text-start transition flex flex-col justify-between ${
                          isSelected
                            ? "border-[#3E0713] bg-[#FAF8F5] ring-1 ring-[#3E0713]"
                            : "border-[#ECE4D4] hover:border-stone-400 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-stone-900">
                            {isBn ? zone.name_bn : zone.name_en}
                          </span>
                          <span
                            className={`text-xs font-bold font-mono ${
                              isFree ? "text-emerald-700 font-bold" : "text-[#3E0713]"
                            }`}
                          >
                            {isFree ? (isBn ? "ফ্রি" : "FREE") : `৳ ${fee}`}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-500">
                          {isBn ? zone.eta_bn : zone.eta_en}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  {isBn ? "পূর্ণাঙ্গ ঠিকানা (বাড়ি, রোড, ব্লক, এলাকা, থানা ও জেলা) *" : "Full Street Address, House, Road, Thana & District *"}
                </label>
                <textarea
                  required
                  rows={2}
                  maxLength={250}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={
                    isBn
                      ? "যেমন: বাসা ১২, রোড ৭, সেক্টর ৪, উত্তরা, ঢাকা অথবা হাউজ ২৫, রোড ২, ওআর নিজাম রোড, চট্টগ্রাম"
                      : "e.g. House 14, Road 71, Gulshan-2, Dhaka-1212 or House 25, Road 2, Nasirabad, Chittagong"
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#E0D7C6] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059] focus:bg-white transition"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#ECE4D4] p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                <div className="w-7 h-7 rounded-full bg-[#3E0713] text-[#F4E2B5] font-bold text-xs flex items-center justify-center">
                  3
                </div>
                <h3 className="font-['Playfair_Display'] text-base font-bold text-[#24030B] flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-[#88652A]" />
                  <span>{isBn ? "পেমেন্ট মাধ্যম নির্বাচন" : "Payment Method in Bangladesh"}</span>
                </h3>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-3.5 rounded-xl border text-start transition flex flex-col justify-between ${
                      paymentMethod === "cod"
                        ? "border-[#3E0713] bg-[#FAF8F5] ring-1 ring-[#3E0713]"
                        : "border-[#ECE4D4] hover:border-stone-400 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-stone-900">
                        {isBn ? "ক্যাশ অন ডেলিভারি" : "Cash on Delivery"}
                      </span>
                      <Banknote className="w-4 h-4 text-[#88652A]" />
                    </div>
                    <span className="text-[10px] text-stone-500">
                      {isBn ? "পণ্য দেখে বুঝে নিয়ে মূল্য পরিশোধ" : "Pay in cash upon inspection"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bkash")}
                    className={`p-3.5 rounded-xl border text-start transition flex flex-col justify-between ${
                      paymentMethod === "bkash"
                        ? "border-[#E2136E] bg-pink-50/40 ring-1 ring-[#E2136E]"
                        : "border-[#ECE4D4] hover:border-stone-400 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-[#E2136E]">
                        bKash (বিকাশ)
                      </span>
                      <Smartphone className="w-4 h-4 text-[#E2136E]" />
                    </div>
                    <span className="text-[10px] text-stone-500">
                      {isBn ? "বিকাশ মার্চেন্ট পেমেন্ট" : "Direct bKash Payment"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("nagad")}
                    className={`p-3.5 rounded-xl border text-start transition flex flex-col justify-between ${
                      paymentMethod === "nagad"
                        ? "border-[#F7941D] bg-amber-50/40 ring-1 ring-[#F7941D]"
                        : "border-[#ECE4D4] hover:border-stone-400 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-[#D96B00]">
                        Nagad (নগদ)
                      </span>
                      <CreditCard className="w-4 h-4 text-[#D96B00]" />
                    </div>
                    <span className="text-[10px] text-stone-500">
                      {isBn ? "নগদ মার্চেন্ট পেমেন্ট" : "Direct Nagad Payment"}
                    </span>
                  </button>
                </div>

                {(paymentMethod === "bkash" || paymentMethod === "nagad") && (
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#ECE4D4] space-y-3 animate-fade-in text-xs">
                    <div className="flex items-center gap-2 font-bold text-stone-900">
                      <Smartphone className="w-4 h-4 text-[#C5A059]" />
                      <span>
                        {paymentMethod === "bkash" ? "বিকাশ মার্চেন্ট নম্বর:" : "নগদ মার্চেন্ট নম্বর:"}{" "}
                        <span className="font-mono text-[#3E0713]">
                          {paymentMethod === "bkash" ? siteSettings.bkashMerchantNumber : siteSettings.nagadMerchantNumber}
                        </span>
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      {isBn
                        ? `আপনার ${paymentMethod === "bkash" ? "বিকাশ" : "নগদ"} অ্যাপ থেকে 'Make Payment' অপশনে গিয়ে উক্ত নম্বরে মোট ${formatBdt(total, "bn")} সেন্ড করুন এবং নিচের ঘরে ট্রানজেকশন আইডি (TrxID) দিন:`
                        : `Please make payment of ${formatBdt(total, "en")} to our merchant account and enter the Transaction ID (TrxID) below:`}
                    </p>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Transaction ID (TrxID) *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={20}
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        placeholder="e.g. 9K28XLP41M"
                        className="w-full text-xs px-3 py-2 rounded-lg border border-[#E0D7C6] bg-white font-mono uppercase focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#88652A]" />
                  <span>{isBn ? "পছন্দের ডেলিভারি সময়সূচি:" : "Preferred Delivery Window:"}</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: "Morning (10:00 AM - 2:00 PM)",
                      en: "Morning Window (10:00 AM – 2:00 PM)",
                      bn: "সকাল ১০:০০ – দুপুর ২:০০",
                    },
                    {
                      id: "Evening (3:00 PM - 8:00 PM)",
                      en: "Evening Window (3:00 PM – 8:00 PM)",
                      bn: "বিকাল ৩:০০ – রাত ৮:০০",
                    },
                  ].map((slot) => {
                    const isSelected = timeSlot === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setTimeSlot(slot.id)}
                        className={`p-3 rounded-xl border text-start transition flex items-center gap-3 ${
                          isSelected
                            ? "border-[#3E0713] bg-[#FAF8F5] ring-1 ring-[#3E0713]"
                            : "border-[#ECE4D4] hover:border-stone-400 bg-white"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? "border-[#3E0713] bg-[#3E0713]" : "border-stone-300"
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-xs font-semibold text-stone-800">
                          {isBn ? slot.bn : slot.en}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  {isBn ? "ডেলিভারি রাইডারের জন্য বিশেষ নির্দেশনা (ঐচ্ছিক)" : "Delivery Instructions / Notes (Optional)"}
                </label>
                <input
                  type="text"
                  maxLength={300}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder={
                    isBn
                      ? "যেমন: পৌঁছানোর ১০ মিনিট আগে কল দিবেন, অথবা সিকিউরিটি গার্ডের কাছে রাখবেন"
                      : "e.g. Call 10 minutes before arrival or leave with apartment security"
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-[#E0D7C6] bg-[#FAF8F5] focus:outline-none focus:border-[#C5A059] focus:bg-white transition"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </form>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-[#ECE4D4] p-6 shadow-sm sticky top-24 space-y-6">
            <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#24030B] pb-3 border-b border-[#ECE4D4]">
              {isBn ? "অর্ডার সামারি" : "Order Summary"}
            </h3>

            <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item) => {
                const itemPrice = item.variant.priceBdt ?? item.variant.priceQar ?? 0;
                return (
                  <div key={item.variant.id} className="py-3 flex items-center gap-3">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name_en}
                      className="w-14 h-18 object-cover rounded-lg border border-[#ECE4D4] bg-[#F2ECE4] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {isBn ? item.product.name_bn : item.product.name_en}
                      </h4>
                      <p className="text-[11px] text-[#88652A]">
                        {item.variant.size} • {item.variant.color}
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {isBn ? "পরিমাণ:" : "Qty:"} {item.quantity} × {formatBdt(itemPrice, isBn ? "bn" : "en")}
                      </p>
                    </div>
                    <div className="text-end font-bold text-xs text-[#3E0713] font-['Plus_Jakarta_Sans'] shrink-0">
                      {formatBdt(itemPrice * item.quantity, isBn ? "bn" : "en")}
                    </div>
                  </div>
                );
              })}
            </div>

            {amountToFree > 0 ? (
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#ECE4D4] text-xs text-stone-600 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#88652A] shrink-0" />
                <span>
                  {isBn
                    ? `আর মাত্র ${formatBdt(amountToFree, "bn")} টাকার অর্ডারে ফ্রি ডেলিভারি!`
                    : `Add ${formatBdt(amountToFree, "en")} more for complimentary delivery!`}
                </span>
              </div>
            ) : (
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {isBn
                    ? "অভিনন্দন! আপনার অর্ডারে ফ্রি ডেলিভারি যুক্ত হয়েছে।"
                    : "Your order qualifies for complimentary delivery."}
                </span>
              </div>
            )}

            <div className="space-y-2 pt-2 border-t border-[#ECE4D4] text-xs">
              <div className="flex justify-between text-stone-600">
                <span>{isBn ? "সাবটোটাল:" : "Subtotal:"}</span>
                <span className="font-semibold">{formatBdt(cartSubtotal, isBn ? "bn" : "en")}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>{isBn ? "হোম ডেলিভারি ফি:" : "Home Delivery Fee:"}</span>
                <span className="font-semibold">
                  {deliveryFee === 0
                    ? isBn ? "ফ্রি" : "FREE"
                    : formatBdt(deliveryFee, isBn ? "bn" : "en")}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#3E0713] pt-2 border-t border-[#ECE4D4]">
                <span>{isBn ? "সর্বমোট প্রদেয় মূল্য:" : "Total (BDT):"}</span>
                <span className="font-['Plus_Jakarta_Sans']">{formatBdt(total, isBn ? "bn" : "en")}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#C5A059]/40 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#3E0713]">
                <ShieldCheck className="w-4 h-4 text-[#88652A]" />
                <span>
                  {isBn
                    ? `নির্বাচিত পেমেন্ট: ${paymentMethod === "cod" ? "ক্যাশ অন ডেলিভারি (COD)" : paymentMethod === "bkash" ? "বিকাশ পেমেন্ট" : "নগদ পেমেন্ট"}`
                    : `Selected Payment: ${paymentMethod.toUpperCase()}`}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 leading-snug">
                {isBn
                  ? "কুরিয়ার রাইডার পার্সেল পৌঁছে দিলে আপনি পণ্য দেখে নিশ্চিত হয়ে মূল্য পরিশোধ করতে পারবেন।"
                  : "Inspect your luxury garments securely at your doorstep before paying in cash or mobile wallet."}
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-[#3E0713] hover:bg-[#520B1C] disabled:bg-stone-400 text-[#FAF8F5] text-xs font-bold uppercase tracking-wider transition shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>
                {isSubmitting
                  ? isBn
                    ? "অর্ডার প্রক্রিয়াধীন..."
                    : "Placing Order..."
                  : isBn
                  ? `অর্ডার নিশ্চিত করুন (${formatBdt(total, "bn")})`
                  : `Confirm Order (${formatBdt(total, "en")})`}
              </span>
            </button>

            <p className="text-[10px] text-center text-stone-400">
              {isBn
                ? "বাণিজ্য মন্ত্রণালয় বাংলাদেশ ডিজিটাল কমার্স নির্দেশিকা অনুযায়ী নিবন্ধিত ও পরিচালিত"
                : "DBID Registered & Ministry of Commerce Digital Commerce Compliant"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
