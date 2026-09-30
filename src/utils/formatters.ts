import { Currency } from '../types';

export function formatCurrency(amount: number, currency: Currency = 'INR'): string {
  const sym = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
  return `${sym}${Math.round(amount).toLocaleString()}`;
}

export function getPlatformSearchUrl(platform: string, query: string): string {
  const encoded = encodeURIComponent(query);
  const plat = platform.toLowerCase();

  if (plat.includes('ikea')) {
    return `https://www.ikea.com/in/en/search/?q=${encoded}`;
  }
  if (plat.includes('amazon')) {
    return `https://www.amazon.in/s?k=${encoded}`;
  }
  if (plat.includes('flipkart')) {
    return `https://www.flipkart.com/search?q=${encoded}`;
  }
  if (plat.includes('swiggy')) {
    return `https://www.swiggy.com/search?query=${encoded}`;
  }
  if (plat.includes('zomato')) {
    return `https://www.zomato.com/search?q=${encoded}`;
  }
  if (plat.includes('oyo')) {
    return `https://www.oyorooms.com/search?location=${encoded}`;
  }
  if (plat.includes('pepperfry')) {
    return `https://www.pepperfry.com/site_product/search?q=${encoded}`;
  }
  if (plat.includes('myntra')) {
    return `https://www.myntra.com/${encoded}`;
  }
  if (plat.includes('tanishq')) {
    return `https://www.tanishq.co.in/shop/${encoded}`;
  }
  return `https://www.google.com/search?q=${encoded}+buy+online`;
}

export function getPlatformBadgeStyle(platform: string): { bg: string; text: string; border: string; accent: string } {
  const p = platform.toLowerCase();
  if (p.includes('ikea')) {
    return { bg: 'bg-blue-50 text-blue-800', text: 'text-blue-800', border: 'border-blue-200', accent: '#0058A3' };
  }
  if (p.includes('amazon')) {
    return { bg: 'bg-amber-50 text-amber-900', text: 'text-amber-900', border: 'border-amber-200', accent: '#FF9900' };
  }
  if (p.includes('flipkart')) {
    return { bg: 'bg-sky-50 text-sky-800', text: 'text-sky-800', border: 'border-sky-200', accent: '#2874F0' };
  }
  if (p.includes('swiggy')) {
    return { bg: 'bg-orange-50 text-orange-800', text: 'text-orange-800', border: 'border-orange-200', accent: '#FC8019' };
  }
  if (p.includes('zomato')) {
    return { bg: 'bg-red-50 text-red-800', text: 'text-red-800', border: 'border-red-200', accent: '#CB202D' };
  }
  if (p.includes('oyo')) {
    return { bg: 'bg-rose-50 text-rose-800', text: 'text-rose-800', border: 'border-rose-200', accent: '#EE2E24' };
  }
  if (p.includes('pepperfry')) {
    return { bg: 'bg-yellow-50 text-yellow-900', text: 'text-yellow-900', border: 'border-yellow-200', accent: '#E26D29' };
  }
  return { bg: 'bg-emerald-50 text-emerald-800', text: 'text-emerald-800', border: 'border-emerald-200', accent: '#0F766E' };
}
