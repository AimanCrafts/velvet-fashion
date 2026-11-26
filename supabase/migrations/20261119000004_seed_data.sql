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

INSERT INTO public.products (id, name_en, name_bn, category, audience, description_en, description_bn, fabric, origin, badge, image_url)
VALUES
    ('prod-01', 'Imperial Burgundy Velvet Party Kaftan', 'ইম্পেরিয়াল বার্গান্ডি ভেলভেট পার্টি কাফতান', 'Kaftans', 'women', 'Full-length silk-blend burgundy velvet kaftan accented with hand-worked antique gold zardozi along the neckline and sleeve cuffs.', 'প্রিমিয়াম সিল্ক-ভেলভেটে তৈরি পূর্ণ দৈর্ঘ্যের বার্গান্ডি কাফতান, নেকলাইন ও হাতায় সোনালী জারদৌসি কারুকাজসহ।', 'Imperial Velvet & Metallic Zardozi', 'Dhaka, Bangladesh', 'Bestseller', './products/kaftan-burgundy-velvet.jpg'),
    ('prod-02', 'Handcrafted Champagne Silk-Cotton Festive Panjabi', 'হস্তনির্মিত শ্যাম্পেন সিল্ক-কটন উৎসবের পাঞ্জাবি', 'Panjabis', 'men', 'Structured band-collar panjabi woven in luminous champagne raw silk-cotton with subtle gold tonal threadwork along the placket.', 'খাঁটি শ্যাম্পেন সিল্ক-কটন কাপড়ে তৈরি পাঞ্জাবি, কলার ও প্ল্যাকেটে সূক্ষ্ম সোনালী সুতোর কাজ।', 'Raw Silk-Cotton Blend', 'Dhaka, Bangladesh', 'New Arrival', './products/panjabi-champagne-silk.jpg'),
    ('prod-03', 'Royal Plum & Gold Brocade Silk Saree', 'রয়্যাল প্লাম ও সোনালী ব্রোকেড সিল্ক শাড়ি', 'Sarees', 'women', 'Deep plum woven silk saree bordered in antique gold zari brocade and crimson piping, paired with a tailored black velvet blouse.', 'অ্যান্টিক সোনালী জরির পাড় ও লাল পাইপিংয়ে সজ্জিত গাঢ় প্লাম সিল্ক শাড়ি, কালো ভেলভেট ব্লাউজসহ।', 'Mulberry Silk with Zari Brocade Border', 'Dhaka, Bangladesh', 'Limited Edition', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85'),
    ('prod-04', 'Emerald Sovereign Velvet Sherwani-Panjabi', 'এমারেল্ড সভরেন ভেলভেট শেরওয়ানি-পাঞ্জাবি', 'Panjabis', 'men', 'Structured mid-thigh emerald velvet sherwani coat tailored with a mandarin collar and hand-cast antiqued brass buttons.', 'রাজকীয় পান্না সবুজ মখমলের সেমি-ফরমাল শেরওয়ানি-কাট পাঞ্জাবি, অ্যান্টিক পিতলের বোতামের অলঙ্করণসহ।', 'Heavy Velvet & Antique Brass Hardware', 'Dhaka, Bangladesh', 'Artisanal', './products/sherwani-emerald-velvet.jpg'),
    ('prod-05', 'Little Nawab Embroidered Panjabi & Velvet Koti Set', 'লিটল নবাব এমব্রয়ডার্ড পাঞ্জাবি ও ভেলভেট কোটি সেট', 'Kids Wear', 'kids', 'Cream cotton-silk panjabi paired with a royal burgundy velvet waistcoat embroidered in gold thread along the collar and placket.', 'ক্রিম কটন-সিল্ক পাঞ্জাবি এবং গলায় ও পকেটে সোনালী নকশার রাজকীয় বার্গান্ডি ভেলভেট কোটির উৎসবের সেট।', 'Burgundy Velvet Koti & Cotton-Silk Panjabi', 'Dhaka, Bangladesh', 'Kids Festive', './products/kids-nawab-koti.jpg'),
    ('prod-06', 'Heritage Checked Cashmere Winter Scarf & Wrap', 'হেরিটেজ চেকড কাশ্মীরি শীতের স্কার্ফ ও শাল', 'Shawls', 'unisex', 'Soft brushed cashmere-blend winter wrap woven in classic camel, espresso, and pine checks for effortless seasonal layering.', 'ক্যামেল, এস্প্রেসো ও পাইন রঙের ক্লাসিক চেক বুননে তৈরি উষ্ণ ও কোমল কাশ্মীরি শীতের শাল।', 'Brushed Cashmere & Merino Wool', 'Dhaka, Bangladesh', 'Heritage', 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=900&q=85')
ON CONFLICT (id) DO UPDATE SET
    name_en = EXCLUDED.name_en,
    name_bn = EXCLUDED.name_bn,
    description_en = EXCLUDED.description_en,
    description_bn = EXCLUDED.description_bn,
    fabric = EXCLUDED.fabric,
    image_url = EXCLUDED.image_url;

INSERT INTO public.product_variants (id, product_id, sku, size, color, color_code, price_bdt, cost_price_bdt, stock, is_available)
VALUES
    ('v-01-s-burg', 'prod-01', 'VF-KAF-01-S', 'S', 'Imperial Burgundy', '#3E0713', 8500, 4800, 8, TRUE),
    ('v-01-m-burg', 'prod-01', 'VF-KAF-01-M', 'M', 'Imperial Burgundy', '#3E0713', 8500, 4800, 12, TRUE),
    ('v-01-l-burg', 'prod-01', 'VF-KAF-01-L', 'L', 'Imperial Burgundy', '#3E0713', 8500, 4800, 8, TRUE),
    ('v-01-xl-burg', 'prod-01', 'VF-KAF-01-XL', 'XL', 'Imperial Burgundy', '#3E0713', 8500, 4800, 6, TRUE),

    ('v-02-38-sand', 'prod-02', 'VF-PAN-02-38', 'Size 38 (S)', 'Champagne Gold', '#E6C87C', 4800, 2600, 12, TRUE),
    ('v-02-40-sand', 'prod-02', 'VF-PAN-02-40', 'Size 40 (M)', 'Champagne Gold', '#E6C87C', 4800, 2600, 15, TRUE),
    ('v-02-42-sand', 'prod-02', 'VF-PAN-02-42', 'Size 42 (L)', 'Champagne Gold', '#E6C87C', 4800, 2600, 14, TRUE),
    ('v-02-44-sand', 'prod-02', 'VF-PAN-02-44', 'Size 44 (XL)', 'Champagne Gold', '#E6C87C', 4800, 2600, 9, TRUE),

    ('v-03-free-navy', 'prod-03', 'VF-SAR-03-FREE', 'Free Size (5.5m)', 'Royal Plum & Gold', '#4A1942', 12500, 7200, 7, TRUE),

    ('v-04-40-eme', 'prod-04', 'VF-SHR-04-40', 'Size 40 (M)', 'Emerald Velvet', '#0F382A', 7800, 4400, 10, TRUE),
    ('v-04-42-eme', 'prod-04', 'VF-SHR-04-42', 'Size 42 (L)', 'Emerald Velvet', '#0F382A', 7800, 4400, 11, TRUE),

    ('v-05-4y-mar', 'prod-05', 'VF-KID-05-4Y', 'Age 4-5 Yrs', 'Royal Burgundy', '#520B1C', 3600, 1900, 8, TRUE),
    ('v-05-6y-mar', 'prod-05', 'VF-KID-05-6Y', 'Age 6-7 Yrs', 'Royal Burgundy', '#520B1C', 3800, 2100, 10, TRUE),
    ('v-05-8y-mar', 'prod-05', 'VF-KID-05-8Y', 'Age 8-9 Yrs', 'Royal Burgundy', '#520B1C', 4200, 2300, 6, TRUE),

    ('v-06-one-burg', 'prod-06', 'VF-SHW-06-ONE', 'One Size (210x75cm)', 'Camel & Espresso Check', '#6B4C35', 6200, 3400, 16, TRUE)
ON CONFLICT (id) DO UPDATE SET
    color = EXCLUDED.color,
    color_code = EXCLUDED.color_code,
    price_bdt = EXCLUDED.price_bdt,
    stock = EXCLUDED.stock;

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
