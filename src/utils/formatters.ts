import type { Language } from '../types';

export const toBengaliNumerals = (val: number | string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return val.toString().replace(/\d/g, (d) => bengaliDigits[parseInt(d, 10)]);
};

export const formatBdt = (amount: number, lang: Language = 'en'): string => {
  const formattedEn = amount.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  });

  if (lang === 'bn') {
    return `৳ ${toBengaliNumerals(formattedEn)}`;
  }
  return `৳ ${formattedEn}`;
};

// Backwards-compatible alias for existing components
export const formatQar = (amount: number, lang: 'en' | 'bn' | 'ar' | string = 'en'): string => {
  return formatBdt(amount, lang === 'bn' ? 'bn' : 'en');
};

export const sanitizeBdPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('880')) {
    return `+${digits}`;
  }
  if (digits.startsWith('0')) {
    return `+88${digits}`;
  }
  return `+880 ${digits}`;
};

export const sanitizeQatarPhone = (phone: string): string => sanitizeBdPhone(phone);

export const buildWhatsAppUrl = (phone: string, text: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
};

export const formatShortDate = (dateStr: string, lang: Language = 'en'): string => {
  try {
    const d = new Date(dateStr);
    const formatted = d.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    return formatted;
  } catch {
    return dateStr;
  }
};
