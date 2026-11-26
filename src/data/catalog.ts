import type { Product, ProductVariant } from '../types';

type SeasonalEntry = {
  id: string;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  audience: Product['audience'];
  category: string;
  categoryBn: string;
  collection: string;
  collectionBn: string;
  fabric: string;
  fabricBn: string;
  imageUrl: string;
  altImageUrl?: string;
  color: string;
  colorHex: string;
  price: number;
  sizes: string[];
  occasions: NonNullable<Product['occasions']>;
};

const seasonalEntries: SeasonalEntry[] = [
  {
    id: 'prod-07',
    name: 'Deep Plum Off-Shoulder Velvet Evening Gown',
    nameBn: 'ডিপ প্লাম অফ-শোল্ডার ভেলভেট ইভনিং গাউন',
    description: 'Sculpted off-shoulder evening gown crafted in rich plum stretch velvet with pleated bodice detailing.',
    descriptionBn: 'গাঢ় প্লাম স্ট্রেচ ভেলভেটে তৈরি অফ-শোল্ডার ইভনিং গাউন, রিসেপশন ও সন্ধ্যার পার্টির জন্য।',
    audience: 'women',
    category: 'Evening Gowns',
    categoryBn: 'ইভনিং গাউন',
    collection: 'Winter Royale 2026/27',
    collectionBn: 'রয়্যাল উইন্টার কালেকশন',
    fabric: 'Sculpted Stretch Velvet',
    fabricBn: 'স্কাল্পটেড স্ট্রেচ ভেলভেট',
    imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=85',
    altImageUrl: './products/kaftan-burgundy-velvet.jpg',
    color: 'Deep Plum',
    colorHex: '#510935',
    price: 9200,
    sizes: ['S', 'M', 'L', 'XL'],
    occasions: ['evening', 'wedding'],
  },
  {
    id: 'prod-08',
    name: 'Crimson Flowing Satin Reception Gown',
    nameBn: 'ক্রিমসন ফ্লোয়িং সাটিন রিসেপশন গাউন',
    description: 'Full-skirt crimson satin evening gown cut with a clean fitted bodice and sweeping flare for grand receptions.',
    descriptionBn: 'গাঢ় লাল সাটিনে তৈরি ফ্লোয়িং রিসেপশন গাউন, বিবাহোত্তর সংবর্ধনা ও উৎসবের সন্ধ্যার জন্য।',
    audience: 'women',
    category: 'Evening Gowns',
    categoryBn: 'ইভনিং গাউন',
    collection: 'Winter Royale 2026/27',
    collectionBn: 'রয়্যাল উইন্টার কালেকশন',
    fabric: 'Heavy Silk Satin',
    fabricBn: 'ভারী সিল্ক সাটিন',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85',
    color: 'Crimson Red',
    colorHex: '#C81D25',
    price: 9800,
    sizes: ['S', 'M', 'L', 'XL'],
    occasions: ['wedding', 'evening'],
  },
  {
    id: 'prod-09',
    name: 'Midnight Navy Jacquard Festive Panjabi',
    nameBn: 'মিডনাইট নেভি জ্যাকার্ড ফেস্টিভ পাঞ্জাবি',
    description: 'A tailored panjabi in deep navy tonal jacquard, finished with a crisp band collar and covered placket buttons.',
    descriptionBn: 'গভীর নেভি জ্যাকার্ড কাপড়ে নিখুঁত ব্যান্ড কলার ও ম্যাচিং বোতামের উৎসবের পাঞ্জাবি।',
    audience: 'men',
    category: 'Panjabis',
    categoryBn: 'পাঞ্জাবি',
    collection: 'Festive Signature',
    collectionBn: 'সিগনেচার ফেস্টিভ এডিট',
    fabric: 'Woven Cotton Jacquard',
    fabricBn: 'বোনা কটন জ্যাকার্ড',
    imageUrl: './products/panjabi-navy-jacquard.jpg',
    altImageUrl: './products/panjabi-champagne-silk.jpg',
    color: 'Midnight Navy',
    colorHex: '#17243B',
    price: 5200,
    sizes: ['38', '40', '42', '44'],
    occasions: ['festive', 'wedding'],
  },
  {
    id: 'prod-10',
    name: 'Heritage Tailored Cotton-Silk Dress Shirt',
    nameBn: 'হেরিটেজ টেইলর্ড কটন-সিল্ক শার্ট',
    description: 'Crisp tailored long-sleeve shirt in fine breathable weave with mother-of-pearl buttons, offered in Slate, Ivory, and Burgundy.',
    descriptionBn: 'স্লেট ব্লু, আইভরি ও বার্গান্ডি রঙে সূক্ষ্ম কটন-সিল্কের নিখুঁত ফরমাল ও সেমি-ফরমাল শার্ট।',
    audience: 'men',
    category: 'Tailored Shirts',
    categoryBn: 'টেইলর্ড শার্ট',
    collection: 'Everyday Heirlooms',
    collectionBn: 'হ্যান্ডলুম এডিট',
    fabric: 'Long-Staple Cotton-Silk Twill',
    fabricBn: 'লং-স্ট্যাপল কটন-সিল্ক টুইল',
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85',
    color: 'Burgundy / Ivory / Slate',
    colorHex: '#4E1D2D',
    price: 3900,
    sizes: ['38', '40', '42', '44'],
    occasions: ['everyday', 'festive'],
  },
  {
    id: 'prod-11',
    name: 'Crimson & Gold Woven Silk Saree',
    nameBn: 'ক্রিমসন ও সোনালী বুনন সিল্ক শাড়ি',
    description: 'Traditional crimson and antique-gold woven buti silk saree paired with a vibrant magenta contrast puff-sleeve blouse.',
    descriptionBn: 'সোনালী বুটি ও জরির পাড়যুক্ত ঐতিহ্যবাহী লাল সিল্ক শাড়ি, ম্যাজেন্টা পাফ-স্লিভ ব্লাউজসহ।',
    audience: 'women',
    category: 'Sarees',
    categoryBn: 'শাড়ি',
    collection: 'Festive Signature',
    collectionBn: 'সিগনেচার ফেস্টিভ এডিট',
    fabric: 'Katan Silk with Gold Zari Border',
    fabricBn: 'সোনালী জরি পাড়ের কাতান সিল্ক',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=85',
    altImageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85',
    color: 'Crimson & Gold',
    colorHex: '#B31B2C',
    price: 11800,
    sizes: ['Free Size (5.5m)'],
    occasions: ['wedding', 'festive'],
  },
  {
    id: 'prod-12',
    name: 'Ivory Embroidered Festive Kameez & Emerald Dupatta',
    nameBn: 'আইভরি এমব্রয়ডার্ড কামিজ ও পান্না সবুজ ওড়না',
    description: 'Printed geometric and floral cotton-silk kameez accented with a solid emerald green chiffon dupatta.',
    descriptionBn: 'রঙিন জ্যামিতিক ও ফ্লোরাল নকশার আইভরি কামিজ, সাথে উজ্জ্বল পান্না সবুজ শিফন ওড়না।',
    audience: 'women',
    category: 'Salwar Kameez',
    categoryBn: 'সালোয়ার কামিজ',
    collection: 'Festive Signature',
    collectionBn: 'সিগনেচার ফেস্টিভ এডিট',
    fabric: 'Cotton-Silk with Chiffon Dupatta',
    fabricBn: 'কটন-সিল্ক ও শিফন ওড়না',
    imageUrl: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=900&q=85',
    color: 'Ivory & Emerald',
    colorHex: '#1A8A56',
    price: 5400,
    sizes: ['S', 'M', 'L', 'XL'],
    occasions: ['festive', 'everyday'],
  },
  {
    id: 'prod-13',
    name: 'Royal Navy Tailored Formal Blazer Suit',
    nameBn: 'রয়্যাল নেভি টেইলর্ড ফরমাল ব্লেজার স্যুট',
    description: 'Two-piece slim tailored royal navy suit with peak lapels, crisp cotton shirting, and burgundy pocket square styling.',
    descriptionBn: 'নিখুঁত কাটিংয়ের রয়্যাল নেভি ফরমাল ব্লেজার স্যুট, বিবাহোত্তর অনুষ্ঠান ও কর্পোরেট ইভেন্টের জন্য।',
    audience: 'men',
    category: 'Blazers & Suits',
    categoryBn: 'ব্লেজার ও স্যুট',
    collection: 'Winter Royale 2026/27',
    collectionBn: 'রয়্যাল উইন্টার কালেকশন',
    fabric: 'Super 120s Wool Blend',
    fabricBn: 'সুপার ১২০এস উল ব্লেন্ড',
    imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=900&q=85',
    altImageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=85',
    color: 'Royal Navy',
    colorHex: '#1D3566',
    price: 13500,
    sizes: ['38', '40', '42', '44'],
    occasions: ['wedding', 'evening'],
  },
  {
    id: 'prod-14',
    name: 'Obsidian Satin-Lapel Double-Breasted Tuxedo',
    nameBn: 'অবসিডিয়ান সাটিন-ল্যাপেল ডাবল-ব্রেস্টেড টাক্সিডো',
    description: 'Sharp double-breasted black evening tuxedo finished with wide silk-satin peak lapels and covered formal buttons.',
    descriptionBn: 'প্রশস্ত সাটিন ল্যাপেল ও ডাবল-ব্রেস্টেড কাটিংয়ে তৈরি কালো ইভনিং টাক্সিডো।',
    audience: 'men',
    category: 'Blazers & Suits',
    categoryBn: 'ব্লেজার ও টাক্সিডো',
    collection: 'Winter Royale 2026/27',
    collectionBn: 'রয়্যাল উইন্টার কালেকশন',
    fabric: 'Wool Gabardine with Silk Satin Lapels',
    fabricBn: 'উল গ্যাবার্ডিন ও সিল্ক সাটিন ল্যাপেল',
    imageUrl: 'https://images.unsplash.com/photo-1711385533096-83bd6d587530?auto=format&fit=crop&w=900&q=85',
    color: 'Obsidian Black',
    colorHex: '#141416',
    price: 14800,
    sizes: ['38', '40', '42', '44'],
    occasions: ['evening', 'wedding'],
  },
  {
    id: 'prod-15',
    name: 'Slate Wool Waistcoat & Navy Shirt Set',
    nameBn: 'স্লেট উল ওয়েস্টকোট ও নেভি শার্ট সেট',
    description: 'Textured heather-slate waistcoat tailored for clean layering over a deep navy formal shirt.',
    descriptionBn: 'ডিপ নেভি শার্টের ওপর পরার উপযোগী নিখুঁত ফিটিংয়ের স্লেট গ্রে উল ওয়েস্টকোট।',
    audience: 'men',
    category: 'Waistcoats',
    categoryBn: 'ওয়েস্টকোট',
    collection: 'Everyday Heirlooms',
    collectionBn: 'হ্যান্ডলুম এডিট',
    fabric: 'Brushed Wool-Blend Vest & Cotton Poplin Shirt',
    fabricBn: 'ব্রাশড উল ওয়েস্টকোট ও কটন পপলিন শার্ট',
    imageUrl: 'https://images.unsplash.com/photo-1576533247967-79124db83e48?auto=format&fit=crop&w=900&q=85',
    color: 'Slate Grey',
    colorHex: '#6F7780',
    price: 5800,
    sizes: ['38', '40', '42', '44'],
    occasions: ['everyday', 'evening'],
  },
  {
    id: 'prod-16',
    name: 'Midnight Charcoal Two-Piece Tailored Suit',
    nameBn: 'মিডনাইট চারকোল টু-পিস টেইলর্ড স্যুট',
    description: 'Classic midnight charcoal wool-blend notch-lapel suit cut for wedding receptions and formal dinners.',
    descriptionBn: 'ওয়েডিং রিসেপশন ও ফরমাল ডিনারের জন্য মিডনাইট চারকোল টু-পিস টেইলর্ড স্যুট।',
    audience: 'men',
    category: 'Blazers & Suits',
    categoryBn: 'ব্লেজার ও স্যুট',
    collection: 'Winter Royale 2026/27',
    collectionBn: 'রয়্যাল উইন্টার কালেকশন',
    fabric: 'Fine Worsted Wool Blend',
    fabricBn: 'ফাইন ওরস্টেড উল ব্লেন্ড',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=85',
    color: 'Midnight Charcoal',
    colorHex: '#1E242B',
    price: 12900,
    sizes: ['38', '40', '42', '44'],
    occasions: ['wedding', 'evening'],
  },
  {
    id: 'prod-17',
    name: 'Little Gentleman Navy Cardigan & Bow-Tie Set',
    nameBn: 'লিটল জেন্টলম্যান নেভি কার্ডিগান ও বো-টাই সেট',
    description: 'Soft knit navy cardigan trimmed with sky-blue piping over a crisp white collar shirt, black bow tie, and tailored shorts.',
    descriptionBn: 'সাদা কলার শার্ট, কালো বো-টাই ও স্কাই-ব্লু বর্ডারসহ নরম নেভি নিট কার্ডিগান সেট।',
    audience: 'kids',
    category: 'Kids Wear',
    categoryBn: 'শিশুদের পোশাক',
    collection: 'Festive & Eid Edit',
    collectionBn: 'উৎসবের কালেকশন',
    fabric: 'Combed Cotton Knit & Crisp Poplin',
    fabricBn: 'কম্বড কটন নিট ও পপলিন',
    imageUrl: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=85',
    color: 'Navy & Sky',
    colorHex: '#1B2E59',
    price: 3400,
    sizes: ['Age 2-3 Yrs', 'Age 4-5 Yrs', 'Age 6-7 Yrs'],
    occasions: ['festive', 'everyday'],
  },
  {
    id: 'prod-18',
    name: 'Little Princess Block-Dot Cotton Festive Top',
    nameBn: 'লিটল প্রিন্সেস ব্লক-ডট কটন ফেস্টিভ টপ',
    description: 'Breathable ivory cotton gathered peasant top patterned with artisanal charcoal block-printed dots.',
    descriptionBn: 'হাতে ব্লক-প্রিন্ট করা কোমল আইভরি সুতি টপ, দিনের বেলার পারিবারিক অনুষ্ঠানের জন্য।',
    audience: 'kids',
    category: 'Kids Wear',
    categoryBn: 'শিশুদের পোশাক',
    collection: 'Everyday Heirlooms',
    collectionBn: 'হ্যান্ডলুম এডিট',
    fabric: '100% Soft Handloom Cotton',
    fabricBn: '১০০% নরম হ্যান্ডলুম কটন',
    imageUrl: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=85',
    color: 'Ivory & Charcoal',
    colorHex: '#EDE9DF',
    price: 2600,
    sizes: ['Age 2-3 Yrs', 'Age 4-5 Yrs', 'Age 6-7 Yrs'],
    occasions: ['everyday', 'festive'],
  },
  {
    id: 'prod-19',
    name: 'Alabaster Scallop Off-Shoulder Midi Dress',
    nameBn: 'অ্যালাবাস্টার স্ক্যালপ অফ-শোল্ডার মিডি ড্রেস',
    description: 'Breezy alabaster cotton dress with embroidered scalloped ruffle neckline and tiered hem for daytime gatherings.',
    descriptionBn: 'এমব্রয়ডার্ড স্ক্যালপ রাফল নেকলাইন ও আরামদায়ক সুতি কাপড়ের সাদা মিডি ড্রেস।',
    audience: 'women',
    category: 'Dresses',
    categoryBn: 'সামার ও ডে-ওয়্যার',
    collection: 'Everyday Heirlooms',
    collectionBn: 'হ্যান্ডলুম এডিট',
    fabric: '100% Embroidered Cotton Eyelet',
    fabricBn: '১০০% এমব্রয়ডার্ড কটন আইলেট',
    imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=85',
    color: 'Alabaster White',
    colorHex: '#F5F2EB',
    price: 4600,
    sizes: ['S', 'M', 'L', 'XL'],
    occasions: ['everyday', 'festive'],
  },
  {
    id: 'prod-20',
    name: 'Oatmeal Cable-Knit & Rust Wool Winter Capsule',
    nameBn: 'ওটমিল কেবল-নিট ও রাস্ট উল উইন্টার ক্যাপসুল',
    description: 'Curated winter layering piece pairing heavy oatmeal cable-knit textures with warm rust wool-blend drape.',
    descriptionBn: 'ওটমিল কেবল-নিট ও উষ্ণ রাস্ট উল-ব্লেন্ডের শীতকালীন আরামদায়ক লেয়ারিং পোশাক।',
    audience: 'unisex',
    category: 'Shawls',
    categoryBn: 'শীতকালীন লেয়ারিং',
    collection: 'Winter Royale 2026/27',
    collectionBn: 'রয়্যাল উইন্টার কালেকশন',
    fabric: 'Brushed Wool & Textured Cotton Knit',
    fabricBn: 'ব্রাশড উল ও টেক্সচার্ড কটন নিট',
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=85',
    altImageUrl: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=900&q=85',
    color: 'Oatmeal & Rust',
    colorHex: '#B68A5A',
    price: 6800,
    sizes: ['One Size (Oversized)'],
    occasions: ['everyday', 'evening'],
  },
];

export const additionalProducts: Product[] = seasonalEntries.map((item) => {
  const productNumber = item.id.slice(-2);
  const prefix =
    item.category === 'Kaftans' || item.category === 'Evening Gowns'
      ? 'KAF'
      : item.category === 'Panjabis' || item.category === 'Tailored Shirts'
      ? 'PAN'
      : item.category === 'Blazers & Suits' || item.category === 'Waistcoats'
      ? 'SUIT'
      : item.category === 'Sarees'
      ? 'SAR'
      : item.category === 'Salwar Kameez' || item.category === 'Dresses'
      ? 'WOM'
      : item.category === 'Kids Wear'
      ? 'KID'
      : 'SHW';

  const variants: ProductVariant[] = item.sizes.map((size, index) => {
    const sizeCode = size.startsWith('Free Size')
      ? 'free'
      : size.startsWith('One Size')
      ? 'one'
      : size.startsWith('Age')
      ? `${size.match(/\d+/)?.[0]}y`
      : size.match(/\d+/)?.[0] ?? size.split(' ')[0];

    return {
      id: `v-${productNumber}-${String(sizeCode).toLowerCase()}`,
      sku: `VF-${prefix}-${productNumber}-${String(sizeCode).toUpperCase()}`,
      size,
      color: item.color,
      colorHex: item.colorHex,
      priceBdt: item.price,
      stockQty: 8 + index * 2,
    };
  });

  return {
    id: item.id,
    name_en: item.name,
    name_bn: item.nameBn,
    description_en: item.description,
    description_bn: item.descriptionBn,
    audience: item.audience,
    category: item.category,
    category_bn: item.categoryBn,
    collection: item.collection,
    collection_bn: item.collectionBn,
    imageUrl: item.imageUrl,
    additionalImages: item.altImageUrl ? [item.altImageUrl] : undefined,
    status: 'live' as const,
    featured: true,
    newArrival: true,
    fabric_en: item.fabric,
    fabric_bn: item.fabricBn,
    occasions: item.occasions,
    variants,
  };
});
