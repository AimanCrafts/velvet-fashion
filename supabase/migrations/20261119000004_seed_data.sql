-- Baseline seed data for delivery zones, initial catalog, and store settings

-- 1. Insert Delivery Zones
INSERT INTO public.delivery_zones (id, name_en, name_bn, fee_bdt, free_above_bdt, eta_en, eta_bn, display_order)
VALUES
    ('dhaka_metro', 'Dhaka Metro (Gulshan, Banani, Dhanmondi, Uttara, Mirpur)', 'ঢাকা মেট্রো (গুলশান, বনানী, ধানমন্ডি, উত্তরা, মিরপুর)', 70, 3000, 'Next Day Delivery (within 24 hours)', '২৪ ঘণ্টার মধ্যে দ্রুত ডেলিভারি', 1),
    ('dhaka_suburbs', 'Dhaka Suburbs (Savar, Gazipur, Narayanganj, Keraniganj)', 'ঢাকার পার্শ্ববর্তী এলাকা (সাভার, গাজীপুর, নারায়ণগঞ্জ, কেরানীগঞ্জ)', 100, 3500, '24-48 Hours Delivery', '২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি', 2),
    ('chittagong_sylhet', 'Chittagong & Sylhet Divisional Metro', 'চট্টগ্রাম ও সিলেট বিভাগীয় শহর', 130, 4000, '2-3 Days via Express Courier', '২-৩ দিনের মধ্যে হোম ডেলিভারি', 3),
    ('nationwide_express', 'Rest of Bangladesh (All 64 Districts Express Courier)', 'সারাদেশের সকল জেলা ও উপজেলা (৬৪ জেলা কুরিয়ার সার্ভিস)', 150, 5000, '3-4 Days Doorstep Courier', '৩-৪ দিনে ক্যাশ অন ডেলিভারি', 4)
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_bn = EXCLUDED.name_bn,
    fee_bdt = EXCLUDED.fee_bdt,
    free_above_bdt = EXCLUDED.free_above_bdt;

-- 2. Insert Products
INSERT INTO public.products (id, name_en, name_bn, category, audience, description_en, description_bn, fabric, origin, badge, image_url)
VALUES
    ('prod-01', 'Imperial Burgundy Velvet Party Kaftan', 'ইম্পেরিয়াল বার্গান্ডি ভেলভেট পার্টি কাফতান', 'Kaftans', 'women', 'Tailored from heavyweight velvet with hand-embroidered metallic zardozi along neckline and sleeve hems.', 'ভারী রাজকীয় মখমল কাপড়ে তৈরি এক্সক্লুসিভ কাফতান, গলায় ও হাতায় সূক্ষ্ম জারদৌসি কারুকাজ।', 'Imperial Velvet & Metallic Zardozi', 'Dhaka, Bangladesh', 'Bestseller', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=85'),
    ('prod-02', 'Handcrafted Silk-Cotton Festive Panjabi', 'হস্তনির্মিত সিল্ক-কটন উৎসবের পাঞ্জাবি', 'Panjabis', 'men', 'Subtle gold-thread threadwork along placket and collar on raw silk-cotton blend.', 'খাঁটি সিল্ক-কটন কাপড়ে তৈরি আভিজাত্যময় পাঞ্জাবি। কলার ও প্ল্যাকেটে সূক্ষ্ম সোনালী সুতোর কাজ।', 'Raw Silk-Cotton Blend', 'Dhaka, Bangladesh', 'New Arrival', 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=900&q=85'),
    ('prod-03', 'Midnight Navy Embroidered Velvet Saree', 'মিডনাইট নেভি জারদৌসি ভেলভেট শাড়ি', 'Sarees', 'women', 'Micro-velvet body with pure organza pallu trimmed with dabka lace.', 'গভীর নেভি ব্লু মাইক্রো-ভেলভেটের সাথে অর্গানজা আঁচল এবং ডাবকা লেস ফিনিশিং।', 'Micro-Velvet & Tissue Organza', 'Dhaka, Bangladesh', 'Limited Edition', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85'),
    ('prod-04', 'Emerald Sovereign Velvet Sherwani-Panjabi', 'এমারেল্ড সভরেন ভেলভেট শেরওয়ানি-পাঞ্জাবি', 'Panjabis', 'men', 'Deep emerald velvet semi-formal cut with hand-cast antiqued brass buttons.', 'রাজকীয় পান্না সবুজ মখমলের সেমি-ফরমাল কাটিং, অ্যান্টিক মেটাল বোতামের অলঙ্করণ।', 'Heavy Velvet & Antique Metal', 'Dhaka, Bangladesh', 'Artisanal', 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=900&q=85'),
    ('prod-05', 'Little Nawab Embroidered Panjabi & Velvet Koti Set', 'লিটল নবাব নকশী পাঞ্জাবি ও ভেলভেট কোটি সেট', 'Kids Wear', 'kids', 'Children festive ensemble: combed cotton panjabi paired with a plush velvet waistcoat.', 'শিশুদের উৎসবের সেট: আরামদায়ক কটন পাঞ্জাবির সাথে রাজকীয় ভেলভেট কটি।', 'Combed Cotton & Plush Velvet', 'Dhaka, Bangladesh', 'Kids Festive', 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=900&q=85'),
    ('prod-06', 'Cashmere & Velvet Reversible Winter Shawl', 'কাশ্মীরি ও ভেলভেট রিভার্সিবল উইন্টার শাল', 'Shawls', 'unisex', 'Double-sided winter luxury: ultra-soft cashmere flannel fused with velvet border.', 'উভয় পাশে ব্যবহারযোগ্য প্রিমিয়াম কাশ্মীরি শাল, ভেলভেট কারুকাজ ও সিল্ক পাড়।', 'Cashmere Flannel & Velvet', 'Dhaka, Bangladesh', 'Heritage', 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=900&q=85')
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_bn = EXCLUDED.name_bn,
    fabric = EXCLUDED.fabric,
    image_url = EXCLUDED.image_url;

-- 3. Insert Product Variants with Initial Inventory
INSERT INTO public.product_variants (id, product_id, sku, size, color, color_code, price_bdt, cost_price_bdt, stock, is_available)
VALUES
    ('v-01-s-burg', 'prod-01', 'VF-KAF-01-S', 'S', 'Imperial Burgundy', '#3E0713', 8500, 4800, 8, TRUE),
    ('v-01-m-burg', 'prod-01', 'VF-KAF-01-M', 'M', 'Imperial Burgundy', '#3E0713', 8500, 4800, 12, TRUE),
    ('v-01-l-burg', 'prod-01', 'VF-KAF-01-L', 'L', 'Imperial Burgundy', '#3E0713', 8500, 4800, 8, TRUE),
    ('v-01-xl-burg', 'prod-01', 'VF-KAF-01-XL', 'XL', 'Imperial Burgundy', '#3E0713', 8500, 4800, 6, TRUE),

    ('v-02-38-sand', 'prod-02', 'VF-PAN-02-38', 'Size 38 (S)', 'Desert Champagne', '#E6C87C', 4800, 2600, 12, TRUE),
    ('v-02-40-sand', 'prod-02', 'VF-PAN-02-40', 'Size 40 (M)', 'Desert Champagne', '#E6C87C', 4800, 2600, 15, TRUE),
    ('v-02-42-sand', 'prod-02', 'VF-PAN-02-42', 'Size 42 (L)', 'Desert Champagne', '#E6C87C', 4800, 2600, 14, TRUE),
    ('v-02-44-sand', 'prod-02', 'VF-PAN-02-44', 'Size 44 (XL)', 'Desert Champagne', '#E6C87C', 4800, 2600, 9, TRUE),

    ('v-03-free-navy', 'prod-03', 'VF-SAR-03-FREE', 'Free Size (5.5m)', 'Midnight Navy', '#0B132B', 12500, 7200, 7, TRUE),

    ('v-04-40-eme', 'prod-04', 'VF-SHR-04-40', 'Size 40 (M)', 'Emerald Velvet', '#0F382A', 7800, 4400, 10, TRUE),
    ('v-04-42-eme', 'prod-04', 'VF-SHR-04-42', 'Size 42 (L)', 'Emerald Velvet', '#0F382A', 7800, 4400, 11, TRUE),

    ('v-05-4y-mar', 'prod-05', 'VF-KID-05-4Y', 'Age 4-5 Yrs', 'Royal Burgundy', '#520B1C', 3600, 1900, 8, TRUE),
    ('v-05-6y-mar', 'prod-05', 'VF-KID-05-6Y', 'Age 6-7 Yrs', 'Royal Burgundy', '#520B1C', 3800, 2100, 10, TRUE),
    ('v-05-8y-mar', 'prod-05', 'VF-KID-05-8Y', 'Age 8-9 Yrs', 'Royal Burgundy', '#520B1C', 4200, 2300, 6, TRUE),

    ('v-06-one-burg', 'prod-06', 'VF-SHW-06-ONE', 'One Size (210x75cm)', 'Burgundy & Camel', '#3E0713', 6200, 3400, 16, TRUE)
ON CONFLICT (id) DO UPDATE SET
    price_bdt = EXCLUDED.price_bdt,
    stock = EXCLUDED.stock;

-- 4. Store Profile & Settings
INSERT INTO public.site_settings (key, value, description)
VALUES
    ('business_profile', jsonb_build_object(
        'shop_name_en', 'Velvet Fashion',
        'shop_name_bn', 'ভেলভেট ফ্যাশন',
        'trade_license_no', 'Pending Verification (DNCC)',
        'dbid_no', 'Pending Registration (DBID)',
        'tin_bin_no', 'Pending Registration',
        'support_phone', '+880 1700 000000',
        'support_whatsapp', '+880 1700 000000',
        'support_email', 'concierge@velvetfashion.com.bd',
        'bkash_merchant_number', '01700-000000 (Merchant)',
        'nagad_merchant_number', '01700-000000 (Merchant)'
    ), 'Official business credentials and support channels')
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value;

