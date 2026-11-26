import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { formatBdt } from "../../utils/formatters";
import type { PaymentMethod } from "../../types";
import {
  sanitizeInput,
  validateBdPhone,
  validateEmail,
  validateTrxId,
  checkRateLimit,
  recordRateLimitAttempt,
} from "../../utils/security";
import {
  X,
  MapPin,
  Clock,
  Banknote,
  AlertCircle,
  Truck,
  Check,
  CreditCard,
  Smartphone,
} from "lucide-react";

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
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

  if (!isCheckoutOpen) return null;

  const selectedZone =
    deliveryZones.find((z) => z.id === selectedZoneId) || deliveryZones[0];
  const freeThreshold = selectedZone.freeAboveBdt ?? selectedZone.freeAboveQar ?? 3000;
  const zoneFee = selectedZone.feeBdt ?? selectedZone.feeQar ?? 70;
  const deliveryFee = cartSubtotal >= freeThreshold ? 0 : zoneFee;
  const total = cartSubtotal + deliveryFee;

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setErrorMessage("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (honeypot) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        handleClose();
      }, 500);
      return;
    }

    const rateCheck = checkRateLimit("vf_checkout_modal_submission", 5, 60000);
    if (!rateCheck.allowed) {
      setErrorMessage(
        isBn
          ? `অতিরিক্ত রিকোয়েস্ট শনাক্ত হয়েছে। অনুগ্রহ করে ${rateCheck.retryAfterSec} সেকেন্ড অপেক্ষা করুন।`
          : `Too many checkout attempts. Please wait ${rateCheck.retryAfterSec}s before retrying.`
      );
      return;
    }

    const sanitizedName = sanitizeInput(name, 80);
    if (!sanitizedName || sanitizedName.length < 2) {
      setErrorMessage(
        isBn
          ? "অনুগ্রহ করে আপনার পুরো নাম সঠিকভাবে লিখুন (কমপক্ষে ২ অক্ষর)"
          : "Please enter a valid full name (at least 2 characters)"
      );
      return;
    }

    const phoneCheck = validateBdPhone(phone);
    if (!phoneCheck.isValid) {
      setErrorMessage(
        isBn
          ? "অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন"
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
            ? "বিকল্প মোবাইল নম্বরটি সঠিক নয়"
            : "The alternative phone number is invalid"
        );
        return;
      }
      sanitizedAltPhone = altCheck.normalized;
    }

    if (email.trim() && !validateEmail(email)) {
      setErrorMessage(
        isBn
          ? "অনুগ্রহ করে একটি সঠিক ইমেইল এড্রেস লিখুন"
          : "Please enter a valid email address format"
      );
      return;
    }

    const sanitizedAddress = sanitizeInput(address, 250);
    if (!sanitizedAddress || sanitizedAddress.length < 5) {
      setErrorMessage(
        isBn
          ? "অনুগ্রহ করে বিস্তারিত ঠিকানা দিন (নূন্যতম ৫ অক্ষর)"
          : "Please enter your full delivery address (at least 5 characters)"
      );
      return;
    }

    const sanitizedTrxId = sanitizeInput(trxId, 20).toUpperCase();
    if (paymentMethod === "bkash" || paymentMethod === "nagad") {
      if (!sanitizedTrxId || !validateTrxId(sanitizedTrxId)) {
        setErrorMessage(
          isBn
            ? `অনুগ্রহ করে সঠিক ৮-১৬ অক্ষরের ${paymentMethod === "bkash" ? "বিকাশ" : "নগদ"} ট্রানজেকশন আইডি দিন`
            : `Please enter a valid 8-16 character ${paymentMethod.toUpperCase()} TrxID`
        );
        return;
      }
    }

    const sanitizedNotes = sanitizeInput(orderNotes, 300);

    setIsSubmitting(true);
    recordRateLimitAttempt("vf_checkout_modal_submission");

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
    })
      .then((result) => {
        setIsSubmitting(false);
        if (result.success) {
          handleClose();
          window.location.hash = `/order/${result.lookupToken || result.orderId}`;
        } else {
          setErrorMessage(
            isBn
              ? (result.error || "অর্ডার সম্পন্ন করা যায়নি")
              : (result.error || "Failed to process order")
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#ECE4D4] my-8 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECE4D4] bg-[#FAF8F5]">
          <div>
            <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#24030B]">
              {isBn ? "ক্যাশ অন ডেলিভারি ও দ্রুত চেকআউট" : "Express Checkout"}
            </h3>
            <p className="text-xs text-stone-500">
              {isBn ? "সঠিক ডেলিভারি তথ্য প্রদান করুন" : "Please provide your delivery information"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-full transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="vf_company_fax"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#3E0713]">
              {isBn ? "১. গ্রাহকের তথ্য" : "1. Customer Information"}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isBn ? "আপনার পুরো নাম *" : "Full Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isBn ? "যেমন: তানভীর আহমেদ" : "e.g., Tanvir Ahmed"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#3E0713] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isBn ? "মোবাইল নম্বর (১১ ডিজিট) *" : "Phone Number (11 digits) *"}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01712-345678"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#3E0713] focus:border-transparent outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isBn ? "বিকল্প মোবাইল নম্বর (ঐচ্ছিক)" : "Alternative Phone (Optional)"}
                </label>
                <input
                  type="tel"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  placeholder="01812-345678"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#3E0713] focus:border-transparent outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isBn ? "ইমেইল এড্রেস (ঐচ্ছিক)" : "Email Address (Optional)"}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#3E0713] focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#3E0713] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#88652A]" />
              <span>{isBn ? "২. ডেলিভারি এলাকা ও ঠিকানা" : "2. Delivery Zone & Address"}</span>
            </h4>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isBn ? "ডেলিভারি জোন নির্বাচন করুন *" : "Select Delivery Zone *"}
              </label>
              <select
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:ring-2 focus:ring-[#3E0713] outline-none"
              >
                {deliveryZones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {isBn ? z.name_bn : z.name_en} — {formatBdt(z.feeBdt ?? z.feeQar ?? 70)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isBn ? "সম্পূর্ণ ঠিকানা (বাসা/রোড/এলাকা/থানা) *" : "Full Street Address *"}
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={isBn ? "যেমন: বাড়ি ১২, রোড ৫, সেক্টর ৩, উত্তরা, ঢাকা" : "e.g., House 12, Road 5, Sector 3, Uttara, Dhaka"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#3E0713] outline-none resize-none"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#3E0713] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#88652A]" />
              <span>{isBn ? "৩. সুবিধাজনক সময়" : "3. Delivery Preference"}</span>
            </h4>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:ring-2 focus:ring-[#3E0713] outline-none"
            >
              <option value="Evening (3:00 PM - 8:00 PM)">Evening (3:00 PM - 8:00 PM)</option>
              <option value="Morning (10:00 AM - 2:00 PM)">Morning (10:00 AM - 2:00 PM)</option>
              <option value="Anytime (Standard Dispatch)">Anytime (Standard Dispatch)</option>
            </select>
          </div>

          <div className="space-y-3 pt-2 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#3E0713] flex items-center gap-1.5">
              <Banknote className="w-3.5 h-3.5 text-[#88652A]" />
              <span>{isBn ? "৪. মূল্য পরিশোধের মাধ্যম" : "4. Payment Method"}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <label
                className={`p-3 rounded-xl border cursor-pointer flex flex-col gap-1 transition ${
                  paymentMethod === "cod"
                    ? "border-[#3E0713] bg-[#3E0713]/5"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                    <Truck className="w-3.5 h-3.5 text-[#3E0713]" />
                    <span>ক্যাশ অন ডেলিভারি</span>
                  </div>
                  <input
                    type="radio"
                    name="modal_paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-[#3E0713]"
                  />
                </div>
                <span className="text-[10px] text-stone-500">পণ্য বুঝে পেয়ে মূল্য দিন</span>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer flex flex-col gap-1 transition ${
                  paymentMethod === "bkash"
                    ? "border-[#E2136E] bg-[#E2136E]/5"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                    <Smartphone className="w-3.5 h-3.5 text-[#E2136E]" />
                    <span>বিকাশ (bKash)</span>
                  </div>
                  <input
                    type="radio"
                    name="modal_paymentMethod"
                    value="bkash"
                    checked={paymentMethod === "bkash"}
                    onChange={() => setPaymentMethod("bkash")}
                    className="accent-[#E2136E]"
                  />
                </div>
                <span className="text-[10px] text-stone-500">{siteSettings.bkashMerchantNumber}</span>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer flex flex-col gap-1 transition ${
                  paymentMethod === "nagad"
                    ? "border-[#F7941D] bg-[#F7941D]/5"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                    <CreditCard className="w-3.5 h-3.5 text-[#F7941D]" />
                    <span>নগদ (Nagad)</span>
                  </div>
                  <input
                    type="radio"
                    name="modal_paymentMethod"
                    value="nagad"
                    checked={paymentMethod === "nagad"}
                    onChange={() => setPaymentMethod("nagad")}
                    className="accent-[#F7941D]"
                  />
                </div>
                <span className="text-[10px] text-stone-500">{siteSettings.nagadMerchantNumber}</span>
              </label>
            </div>

            {(paymentMethod === "bkash" || paymentMethod === "nagad") && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                <label className="block font-semibold text-stone-700">
                  {paymentMethod === "bkash" ? "বিকাশ" : "নগদ"} ট্রানজেকশন আইডি (TrxID) *
                </label>
                <input
                  type="text"
                  required
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  placeholder="যেমন: 9K28XLP41M"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono uppercase text-xs"
                />
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-stone-100">
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {isBn ? "বিশেষ কোনো নির্দেশনা (ঐচ্ছিক)" : "Order Notes (Optional)"}
            </label>
            <input
              type="text"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder={isBn ? "যেমন: আসার আগে ফোন দেবেন" : "e.g., Call before arrival"}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#3E0713] outline-none"
            />
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#ECE4D4] space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>{isBn ? "পোশাকের মূল্য (সাবটোটাল):" : "Items Subtotal:"}</span>
              <span>{formatBdt(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>{isBn ? "ডেলিভারি চার্জ:" : "Delivery Fee:"}</span>
              <span>{deliveryFee === 0 ? (isBn ? "ফ্রি" : "Free") : formatBdt(deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-[#24030B] pt-2 border-t border-stone-200">
              <span>{isBn ? "সর্বমোট প্রদেয়:" : "Total Payable:"}</span>
              <span className="font-mono text-[#88652A]">{formatBdt(total)}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition"
            >
              {isBn ? "বাতিল করুন" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-7 py-2.5 rounded-full bg-[#3E0713] hover:bg-[#520B1C] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>{isBn ? "অর্ডার প্রসেস হচ্ছে..." : "Processing..."}</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isBn ? "অর্ডার নিশ্চিত করুন" : "Confirm Order"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
