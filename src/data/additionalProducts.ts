import type { Product, ProductVariant } from '../types';

type NewProduct = {
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
  image: string;
  altImage: string;
  color: string;
  colorHex: string;
  price: number;
  sizes: string[];
  occasions: NonNullable<Product['occasions']>;
};

const catalog: NewProduct[] = [
  {
    id: 'prod-07',
    name: 'Rosewood Zardozi Evening Kaftan',
    nameBn: 'রোজউড জারদৌসি ইভনিং কাফতান',
    description: 'A flowing velvet kaftan finished with fine zardozi around the neckline and cuffs.',
    descriptionBn: 'নেকলাইন ও হাতায় সূক্ষ্ম জারদৌসি কাজের রোজউড ভেলভেট কাফতান, সন্ধ্যার উৎসবের জন্য উপযোগী।',
    audience: 'women',
    category: 'Kaftans',
    categoryBn: 'কাফতান',
    collection: 'Winter Royale 2026/27',
    collectionBn: 'রয়্যাল উইন্টার কালেকশন',
    fabric: 'Velvet with hand-finished zardozi',
    fabricBn: 'ভেলভেট ও হাতের জারদৌসি কারুকাজ',
    image: 'photo-1566174053879-31528523f8ae',
    altImage: 'photo-1595777457583-95e059d581b8',
    color: 'Rosewood',
    colorHex: '#713044',
    price: 9200,
    sizes: ['S', 'M', 'L', 'XL'],
    occasions: ['wedding', 'evening'],
  },
  {
    id: 'prod-08',
    name: 'Ivory Pearl Embroidered Kaftan',
    nameBn: 'আইভরি পার্ল এমব্রয়ডার্ড কাফতান',
    description: 'Soft ivory occasionwear with pearl-toned threadwork and a relaxed, graceful drape.',
    descriptionBn: 'মুক্তার রঙের সুতোয় নকশা করা কোমল আইভরি কাফতান, বিয়ে ও পারিবারিক অনুষ্ঠানের জন্য।',
    audience: 'women',
    category: 'Kaftans',
    categoryBn: 'কাফতান',
    collection: 'Winter Royale 2026/27',
    collectionBn: 'রয়্যাল উইন্টার কালেকশন',
    fabric: 'Silk-touch velvet and pearl thread',
    fabricBn: 'সিল্ক-টাচ ভেলভেট ও মুক্তা সুতোর কাজ',
    image: 'photo-1595777457583-95e059d581b8',
    altImage: 'photo-1558769132-cb1aea458c5e',
    color: 'Ivory Pearl',
    colorHex: '#E8DDC8',
    price: 8900,
    sizes: ['S', 'M', 'L', 'XL'],
    occasions: ['wedding', 'festive'],
  },
  {
    id: 'prod-09',
    name: 'Midnight Jacquard Festive Panjabi',
    nameBn: 'মিডনাইট জ্যাকার্ড ফেস্টিভ পাঞ্জাবি',
    description: 'A tailored panjabi in deep navy jacquard, finished with a neat band collar.',
    descriptionBn: 'গভীর নেভি জ্যাকার্ড কাপড়ে নিখুঁত ব্যান্ড কলারের উৎসবের পাঞ্জাবি।',
    audience: 'men',
    category: 'Panjabis',
    categoryBn: 'পাঞ্জাবি',
    collection: 'Festive Signature',
    collectionBn: 'সিগনেচার ফেস্টিভ এডিট',
    fabric: 'Cotton jacquard',
    fabricBn: 'প্রিমিয়াম কটন জ্যাকার্ড',
    image: 'photo-1597983073493-88cd35cf93b0',
    altImage: 'photo-1602810318383-e386cc2a3ccf',
    color: 'Midnight Navy',
    colorHex: '#17243B',
    price: 5200,
    sizes: ['38', '40', '42', '44'],
    occasions: ['festive', 'wedding'],
  },
  {
    id: 'prod-10',
    name: 'Sandstone Handloom Cotton Panjabi',
    nameBn: 'স্যান্ডস্টোন হ্যান্ডলুম কটন পাঞ্জাবি',
    description: 'A breathable handloom cotton panjabi with understated tonal stitching.',
    descriptionBn: 'আরামদায়ক হ্যান্ডলুম কটনে তৈরি স্যান্ডস্টোন পাঞ্জাবি, সূক্ষ্ম টোনাল সেলাইয়ের কাজসহ।',
    audience: 'men',
    category: 'Panjabis',
    categoryBn: 'পাঞ্জাবি',
    collection: 'Everyday Heirlooms',
    collectionBn: 'হ্যান্ডলুম এডিট',
    fabric: 'Handloom cotton',
    fabricBn: 'খাঁটি হ্যান্ডলুম কটন',
    image: 'photo-1602810318383-e386cc2a3ccf',
    altImage: 'photo-1597983073493-88cd35cf93b0',
    color: 'Sandstone',
    colorHex: '#B99B75',
    price: 3900,
    sizes: ['38', '40', '42', '44'],
    occasions: ['everyday', 'festive'],
  },
  {
    id: 'prod-11',
    name: 'Ruby Garden Silk Saree',
    nameBn: 'রুবি গার্ডেন সিল্ক শাড়ি',
    description: 'A rich ruby silk saree with a delicate woven border for celebrations and receptions.',
    descriptionBn: 'উৎসব ও রিসেপশনের জন্য সূক্ষ্ম বুনন পাড়ের সমৃদ্ধ রুবি সিল্ক শাড়ি।',
    audience: 'women',
    category: 'Sarees',
    categoryBn: 'শাড়ি',
    collection: 'Festive Signature',
    collectionBn: 'সিগনেচার ফেস্টিভ এডিট',
    fabric: 'Silk blend with woven border',
    fabricBn: 'সিল্ক ব্লেন্ড ও বুনন পাড়',
    image: 'photo-1610030469983-98e550d6193c',
    altImage: 'photo-1583391733956-6c78276477e2',
    color: 'Ruby',
    colorHex: '#8A1838',
    price: 10800,
    sizes: ['Free Size (5.5m)'],
    occasions: ['wedding', 'festive'],
  },
  {
    id: 'prod-12',
    name: 'Champagne Tissue Organza Saree',
    nameBn: 'শ্যাম্পেন টিস্যু অর্গানজা শাড়ি',
    description: 'Lightweight champagne organza with a fine metallic edge and matching blouse piece.',
    descriptionBn: 'হালকা শ্যাম্পেন অর্গানজা শাড়ি, সূক্ষ্ম মেটালিক পাড় ও ম্যাচিং ব্লাউজ পিসসহ।',
    audience: 'women',
    category: 'Sarees',
    categoryBn: 'শাড়ি',
    collection: 'Winter Royale 2026/27',
    collectionBn: 'রয়্যাল উইন্টার কালেকশন',
    fabric: 'Tissue organza with metallic trim',
    fabricBn: 'টিস্যু অর্গানজা ও মেটালিক ট্রিম',
    image: 'photo-1583391733956-6c78276477e2',
    altImage: 'photo-1610030469983-98e550d6193c',
    color: 'Champagne',
    colorHex: '#D8C59B',
    price: 9800,
    sizes: ['Free Size (5.5m)'],
    occasions: ['wedding', 'evening'],
  },
  {
    id: 'prod-13',
    name: 'Little Heirloom Cotton Panjabi Set',
    nameBn: 'লিটল হেয়ারলুম কটন পাঞ্জাবি সেট',
    description: 'A comfortable cotton panjabi set for little ones, with neat contrast piping.',
    descriptionBn: 'ছোটদের জন্য আরামদায়ক কটন পাঞ্জাবি সেট, সুন্দর কনট্রাস্ট পাইপিং ফিনিশিংসহ।',
    audience: 'kids',
    category: 'Kids Wear',
    categoryBn: 'শিশুদের পোশাক',
    collection: 'Festive & Eid Edit',
    collectionBn: 'উৎসবের কালেকশন',
    fabric: 'Soft cotton with contrast piping',
    fabricBn: 'নরম কটন ও কনট্রাস্ট পাইপিং',
    image: 'photo-1503919545889-aef636e10ad4',
    altImage: 'photo-1519238263530-99bdd11df2ea',
    color: 'Ivory & Burgundy',
    colorHex: '#7A1930',
    price: 2900,
    sizes: ['Age 2-3 Yrs', 'Age 4-5 Yrs', 'Age 6-7 Yrs'],
    occasions: ['festive', 'wedding'],
  },
  {
    id: 'prod-14',
    name: 'Emerald Velvet Koti Festive Set',
    nameBn: 'এমারেল্ড ভেলভেট কোটি ফেস্টিভ সেট',
    description: 'A festive children’s outfit pairing an embroidered velvet koti with a soft cotton panjabi.',
    descriptionBn: 'নরম সুতি পাঞ্জাবির সাথে কারুকাজ করা পান্না সবুজ ভেলভেট কোটির উৎসবের সেট।',
    audience: 'kids',
    category: 'Kids Wear',
    categoryBn: 'শিশুদের পোশাক',
    collection: 'Festive & Eid Edit',
    collectionBn: 'উৎসবের কালেকশন',
    fabric: 'Cotton panjabi with velvet koti',
    fabricBn: 'কটন পাঞ্জাবি ও ভেলভেট কোটি',
    image: 'photo-1519238263530-99bdd11df2ea',
    altImage: 'photo-1503919545889-aef636e10ad4',
    color: 'Emerald',
    colorHex: '#14513A',
    price: 4200,
    sizes: ['Age 4-5 Yrs', 'Age 6-7 Yrs', 'Age 8-9 Yrs'],
    occasions: ['festive', 'wedding'],
  },
  {
    id: 'prod-15',
    name: 'Camel Border Cashmere Winter Shawl',
    nameBn: 'ক্যামেল বর্ডার ক্যাশমিয়ার শীতের শাল',
    description: 'A warm, lightweight shawl with a soft hand and a contrasting woven border.',
    descriptionBn: 'উষ্ণ ও হালকা কাশ্মীরি শীতের শাল, মসৃণ টেক্সচার ও বুনন পাড়সহ।',
    audience: 'unisex',
    category: 'Shawls',
    categoryBn: 'শাল',
    collection: 'Winter Royale 2026/27',
    collectionBn: 'রয়্যাল উইন্টার কালেকশন',
    fabric: 'Cashmere blend with woven border',
    fabricBn: 'ক্যাশমিয়ার ব্লেন্ড ও বুনন পাড়',
    image: 'photo-1520903920243-00d872a2d1c9',
    altImage: 'photo-1601924994987-69e26d50dc26',
    color: 'Camel',
    colorHex: '#B68A5A',
    price: 6800,
    sizes: ['One Size (210x75cm)'],
    occasions: ['everyday', 'evening'],
  },
  {
    id: 'prod-16',
    name: 'Mulberry Velvet Reversible Shawl',
    nameBn: 'মালবেরি ভেলভেট রিভার্সিবল শাল',
    description: 'A reversible winter wrap with a smooth velvet face and a soft, warm reverse.',
    descriptionBn: 'একপাশে মসৃণ মালবেরি ভেলভেট ও অন্যপাশে উষ্ণ ক্যাশমিয়ার সমৃদ্ধ রিভার্সিবল শাল।',
    audience: 'unisex',
    category: 'Shawls',
    categoryBn: 'শাল',
    collection: 'Winter Royale 2026/27',
    collectionBn: 'রয়্যাল উইন্টার কালেকশন',
    fabric: 'Mulberry velvet and cashmere blend',
    fabricBn: 'মালবেরি ভেলভেট ও ক্যাশমিয়ার ব্লেন্ড',
    image: 'photo-1601924994987-69e26d50dc26',
    altImage: 'photo-1520903920243-00d872a2d1c9',
    color: 'Mulberry',
    colorHex: '#5A1934',
    price: 7400,
    sizes: ['One Size (210x75cm)'],
    occasions: ['everyday', 'evening'],
  },
];

export const additionalProducts: Product[] = catalog.map((item) => {
  const productNumber = item.id.slice(-2);
  const prefix =
    item.category === 'Kaftans'
      ? 'KAF'
      : item.category === 'Panjabis'
      ? 'PAN'
      : item.category === 'Sarees'
      ? 'SAR'
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
    imageUrl: `https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=900&q=85`,
    additionalImages: [
      `https://images.unsplash.com/${item.altImage}?auto=format&fit=crop&w=900&q=85`,
    ],
    status: 'live' as const,
    featured: true,
    newArrival: true,
    fabric_en: item.fabric,
    fabric_bn: item.fabricBn,
    occasions: item.occasions,
    variants,
  };
});
