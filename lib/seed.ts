import 'dotenv/config';
import { connectDB } from './mongodb';
import {
  SiteSettings,
  Product,
  FAQ,
  Testimonial,
  BlogPost,
  Service,
  User,
} from './models';
import bcrypt from 'bcryptjs';

async function seed() {
  await connectDB();

  console.log('Seeding database...');

  await User.deleteMany({});
  await SiteSettings.deleteMany({});
  await Product.deleteMany({});
  await FAQ.deleteMany({});
  await Testimonial.deleteMany({});
  await BlogPost.deleteMany({});
  await Service.deleteMany({});

  const seedEmail = process.env.ADMIN_EMAIL || 'admin@smon.com';
  const rawHash = process.env.ADMIN_PASSWORD_HASH;
  const passwordHash =
    rawHash && rawHash.startsWith('$2')
      ? rawHash
      : await bcrypt.hash('Admin123!', 12);

  await User.create({
    name: 'Smon Super Admin',
    email: seedEmail,
    passwordHash,
    role: 'super_admin',
    active: true,
  });
  console.log(`Seeded Super Admin user: ${seedEmail}`);


  await SiteSettings.create({
    businessName: 'Smon',
    tagline: {
      en: 'Powering Ethiopia with Solar Energy',
      am: 'ኢትዮጵያን በፀሐይ ኃይል ማብራት',
    },
    phone: ['+251 911 000 000', '+251 922 000 000'],
    whatsapp: '251911000000',
    email: 'info@smon.com',
    address: {
      en: 'Bole, Addis Ababa, Ethiopia',
      am: 'ቦሌ፣ አዲስ አበባ፣ ኢትዮጵያ',
    },
    workingHours: {
      en: 'Mon–Sat: 8:30 AM – 6:00 PM',
      am: 'ሰኞ–ቅዳሜ፡ 8:30 ጠዋት – 6:00 ማታ',
    },
    heroTitle: {
      en: 'Power Your Future With Solar Energy',
      am: 'የፀሐይ ኃይል ለወደፊቱ ዕድልዎ',
    },
    heroSubtitle: {
      en: 'Ethiopia\'s leading supplier of premium solar panels, inverters and batteries.',
      am: 'የኢትዮጵያ መሪ የፀሐይ ፓነል፣ ኢንቨርተር እና ባትሪ አቅራቢ።',
    },
    heroCTAText: {
      en: 'Get a Free Quote',
      am: 'ነጻ ዋጋ ይጠይቁ',
    },
    stats: [
      { label: { en: 'Projects Installed', am: 'የተገጠሙ ፕሮጀክቶች' }, value: '500+' },
      { label: { en: 'Total Capacity', am: 'ጠቅላላ አቅም' }, value: '2.4MW' },
      { label: { en: 'Warranty', am: 'ዋራንቲ' }, value: '10yr' },
      { label: { en: 'Customer Rating', am: 'ደንበኛ ደረጃ' }, value: '4.9★' },
    ],
    whyUsPoints: [
      {
        title: { en: 'Certified Engineers', am: 'የተረጋገጡ መሐንዲሶች' },
        desc: { en: 'Professional installation by certified solar engineers.', am: 'በተረጋገጡ መሐንዲሶች ባለሙያ ጭማሪ።' },
        icon: 'award',
      },
      {
        title: { en: 'Premium Products', am: 'ከፍተኛ ጥራት ያላቸው ምርቶች' },
        desc: { en: 'Only tier-1 solar panels and inverters from trusted brands.', am: 'ከታመኑ ብራንዶች የቲየር-1 ፓነሎች እና ኢንቨርተሮች።' },
        icon: 'sun',
      },
      {
        title: { en: '10-Year Warranty', am: '10 ዓመት ዋራንቲ' },
        desc: { en: 'Full warranty coverage on all installations.', am: 'በሁሉም ጭማሪዎች ሙሉ ዋራንቲ።' },
        icon: 'shield',
      },
    ],
    metaDescription: {
      en: 'Smon — premium solar equipment supplier in Addis Ababa, Ethiopia.',
      am: 'ስሞን — በአዲስ አበባ ፕሪሚየም የፀሐይ ኃይል መሳሪያ አቅራቢ።',
    },
  });

  await Product.insertMany([
    {
      name: { en: '550W Mono Solar Panel', am: '550W ሞኖ ፀሐይ ፓነል' },
      slug: '550w-mono-solar-panel',
      shortDescription: {
        en: 'High-efficiency monocrystalline panel for residential use.',
        am: 'ለቤት አጠቃቀም ከፍተኛ ቅንጅታ ሞኖክሪስታላይን ፓነል።',
      },
      description: {
        en: 'High quality JA Solar 550W Monocrystalline solar panel with superior efficiency.',
        am: 'ከፍተኛ ብቃት ያለው JA Solar 550W ሞኖክሪስታላይን የፀሐይ ፓነል።',
      },
      metaDescription: {
        en: 'JA Solar 550W Monocrystalline solar panel.',
        am: 'JA Solar 550W ሞኖክሪስታላይን የፀሐይ ፓነል።',
      },
      category: 'panels',
      brand: 'JA Solar',
      price: 18500,
      images: [],
      specs: [
        { key: 'Wattage', value: '550W' },
        { key: 'Efficiency', value: '21.3%' },
      ],
      inStock: true,
      featured: true,
    },
    {
      name: { en: '450W Poly Solar Panel', am: '450W ፖሊ ፀሐይ ፓነል' },
      slug: '450w-poly-solar-panel',
      shortDescription: {
        en: 'Cost-effective polycrystalline panel.',
        am: 'ተመጣጣኝ ዋጋ ያለው ፖሊክሪስታላይን ፓነል።',
      },
      description: {
        en: 'High efficiency Trina Solar 450W Polycrystalline panel for cost-effective installations.',
        am: 'አነስተኛ ወጪ ለሚጠይቁ ገጠማዎች ከፍተኛ ብቃት ያለው Trina Solar 450W ፖሊክሪስታላይን ፓነል።',
      },
      metaDescription: {
        en: 'Trina Solar 450W Polycrystalline panel.',
        am: 'Trina Solar 450W ፖሊክሪስታላይን ፓነል።',
      },
      category: 'panels',
      brand: 'Trina Solar',
      price: 14200,
      inStock: true,
      featured: true,
    },
    {
      name: { en: '5kW Hybrid Inverter', am: '5kW ሃይብሪድ ኢንቨርተር' },
      slug: '5kw-hybrid-inverter',
      shortDescription: {
        en: 'Hybrid inverter with battery backup support.',
        am: 'ባትሪ ባክአፕ ድጋፍ ያለው ሃይብሪድ ኢንቨርተር።',
      },
      description: {
        en: 'Growatt 5kW Hybrid Inverter supporting grid connection and battery backup options.',
        am: 'የግሪድ ግንኙነት እና የባትሪ ባክአፕ አማራጮችን የሚደግፍ Growatt 5kW ሃይብሪድ ኢንቨርተር።',
      },
      metaDescription: {
        en: 'Growatt 5kW Hybrid Inverter with backup.',
        am: 'Growatt 5kW ሃይብሪድ ኢንቨርተር ከባክአፕ ጋር።',
      },
      category: 'inverters',
      brand: 'Growatt',
      price: 85000,
      inStock: true,
      featured: true,
    },
    {
      name: { en: '3kW String Inverter', am: '3kW ስትሪንግ ኢንቨርተር' },
      slug: '3kw-string-inverter',
      shortDescription: {
        en: 'Reliable string inverter for small systems.',
        am: 'ለትናንሽ ስርዓቶች አስተማማኝ ስትሪንግ ኢንቨርተር።',
      },
      description: {
        en: 'Sungrow 3kW String Inverter optimized for small scale residential solar systems.',
        am: 'ለትናንሽ የቤት ውስጥ የፀሐይ ኃይል ስርዓቶች የተመቻቸ Sungrow 3kW ስትሪንግ ኢንቨርተር።',
      },
      metaDescription: {
        en: 'Sungrow 3kW String Inverter.',
        am: 'Sungrow 3kW ስትሪንግ ኢንቨርተር።',
      },
      category: 'inverters',
      brand: 'Sungrow',
      price: 52000,
      inStock: true,
      featured: false,
    },
    {
      name: { en: '5kWh Lithium Battery', am: '5kWh ሊቲየም ባትሪ' },
      slug: '5kwh-lithium-battery',
      shortDescription: {
        en: 'Wall-mounted lithium battery for home backup.',
        am: 'ለቤት ባክአፕ የግድግዳ ተሰይመ ሊቲየም ባትሪ።',
      },
      description: {
        en: 'Pylontech 5kWh wall-mounted lithium battery with deep discharge cycles for home energy storage.',
        am: 'ለቤት ውስጥ የኃይል ማከማቻነት የሚያገለግል ጥልቅ የዲስቻርጅ ዑደት ያለው Pylontech 5kWh ሊቲየም ባትሪ።',
      },
      metaDescription: {
        en: 'Pylontech 5kWh Lithium Battery.',
        am: 'Pylontech 5kWh ሊቲየም ባትሪ።',
      },
      category: 'batteries',
      brand: 'Pylontech',
      price: 120000,
      inStock: true,
      featured: true,
    },
    {
      name: { en: 'MC4 Connector Set', am: 'MC4 ኮነክተር ስብስብ' },
      slug: 'mc4-connector-set',
      shortDescription: {
        en: 'Weatherproof MC4 connector pair for panel wiring.',
        am: 'ለፓነል ሽቦ የአየር ሁኔታ መቋቋም MC4 ኮነክተር።',
      },
      description: {
        en: 'Weatherproof MC4 connector pair for secure and water-resistant solar panel wiring connections.',
        am: 'አስተማማኝ እና የውሃ መከላከያ ያለው የ MC4 ኮነክተር ጥንድ።',
      },
      metaDescription: {
        en: 'MC4 Connector Set.',
        am: 'MC4 ኮነክተር ስብስብ።',
      },
      category: 'accessories',
      brand: 'Generic',
      price: 350,
      inStock: true,
      featured: false,
    },
  ]);


  await FAQ.insertMany([
    {
      question: {
        en: 'How much does a solar system cost in Ethiopia?',
        am: 'በኢትዮጵያ የፀሐይ ኃይል ስርዓት ምን ያህል ያስከፍላል?',
      },
      answer: {
        en: 'A typical home system (3–5kW) costs between 150,000–350,000 ETB depending on components and installation.',
        am: 'ባህላዊ የቤት ስርዓት (3–5kW) በአካላት እና በጭማሪ ላይ በመመስረት ከ150,000–350,000 ብር ይኖረዋል።',
      },
      category: 'cost',
      order: 1,
      published: true,
    },
    {
      question: {
        en: 'How long does installation take?',
        am: 'ጭማሪው ምን ያህል ጊዜ ይወስዳል?',
      },
      answer: {
        en: 'Most residential installations are completed within 1–3 days.',
        am: 'አብዛኛው የቤት ጭማሪ በ1–3 ቀናት ውስጥ ይጠናቀቃል።',
      },
      category: 'installation',
      order: 2,
      published: true,
    },
    {
      question: {
        en: 'What warranty do you offer?',
        am: 'ምን ዓይነት ዋራንቲ ይሰጣሉ?',
      },
      answer: {
        en: 'We offer up to 10 years on installation and manufacturer warranties on all equipment.',
        am: 'በጭማሪ ላይ እስከ 10 ዓመት እና በሁሉም መሳሪያዎች ላይ የአምራች ዋራንቲ እናቀርባለን።',
      },
      category: 'warranty',
      order: 3,
      published: true,
    },
    {
      question: {
        en: 'Do solar panels work during power outages?',
        am: 'የኤሌክትሪክ መቋረጥ ጊዜ ፀሐይ ፓነሎች ይሰራሉ?',
      },
      answer: {
        en: 'Only with a battery backup system. Grid-tied systems shut down during outages for safety.',
        am: 'ባትሪ ባክአፕ ስርዓት ካለ ብቻ። ለደህንነት ግሪድ-ተያያዥ ስርዓቶች በመቋረጥ ጊዜ ይዘጋሉ።',
      },
      category: 'technical',
      order: 4,
      published: true,
    },
    {
      question: {
        en: 'How do I get a quote?',
        am: 'ዋጋ እንዴት እጠይቃለሁ?',
      },
      answer: {
        en: 'Fill out our quote form, use the solar calculator, or contact us on WhatsApp.',
        am: 'የዋጋ መጠየቂያ ቅጹን ይሙሉ፣ ሶላር ካልኩሌተር ይጠቀሙ ወይም በዋትስአፕ ያግኙን።',
      },
      category: 'general',
      order: 5,
      published: true,
    },
  ]);

  await Testimonial.insertMany([
    {
      author: { en: 'Abebe Kebede', am: 'አበበ ከበደ' },
      location: 'Bole, Addis Ababa',
      text: {
        en: 'Smon installed our 5kW system in just two days. Our electricity bill dropped by 80%.',
        am: 'ስሞን 5kW ስርዓታችንን በሁለት ቀን ጭነታል። የኤሌክትሪክ ቢልናችን በ80% ቀነሰ።',
      },
      rating: 5,
      featured: true,
      order: 1,
    },
    {
      author: { en: 'Tigist Haile', am: 'ትግስት ኃይሌ' },
      location: 'Kazanchis, Addis Ababa',
      text: {
        en: 'Professional team, quality products, and excellent after-sales support.',
        am: 'ባለሙያ ቡድን፣ ጥራት ያለው ምርት እና ጥሩ የሽያጭ ቀጥተኛ ድጋፍ።',
      },
      rating: 5,
      featured: true,
      order: 2,
    },
    {
      author: { en: 'Dawit Mengistu', am: 'ዳዊት መንግስቱ' },
      location: 'Megenagna, Addis Ababa',
      text: {
        en: 'Best solar supplier in Addis. Fair pricing and honest advice.',
        am: 'በአዲስ አበባ ምርጥ ሶላር አቅራቢ። ፍትሃዊ ዋጋ እና ታማኝ ምክር።',
      },
      rating: 5,
      featured: true,
      order: 3,
    },
  ]);

  await BlogPost.insertMany([
    {
      title: {
        en: 'Solar Energy in Ethiopia: 2025 Outlook',
        am: 'በኢትዮጵያ የፀሐይ ኃይል፡ 2025 እይታ',
      },
      slug: 'solar-energy-ethiopia-2025',
      excerpt: {
        en: 'Why now is the best time to invest in solar for your home or business.',
        am: 'ለቤትዎ ወይም ለንግድዎ አሁን በፀሐይ ኃይል ለመዋዕል ምርጥ ጊዜ ለምንድን ነው።',
      },
      content: {
        en: '<p>Solar adoption in Ethiopia is accelerating as grid electricity costs rise.</p>',
        am: '<p>የግሪድ ኤሌክትሪክ ዋጋ ሲጨምር በኢትዮጵያ የፀሐይ ኃይል አጠቃቀም እየተፋጠነ ነው።</p>',
      },
      category: 'news',
      author: 'Smon Team',
      published: true,
      publishedAt: new Date(),
      seoTitle: {
        en: 'Solar Energy in Ethiopia: 2025 Outlook',
        am: 'በኢትዮጵያ የፀሐይ ኃይል፡ 2025 እይታ',
      },
      seoDescription: {
        en: 'Why now is the best time to invest in solar for your home or business in Ethiopia.',
        am: 'በኢትዮጵያ ውስጥ ለቤትዎ ወይም ለንግድዎ በፀሐይ ኃይል ለመዋዕል ለምን ምርጥ ጊዜ እንደሆነ ይወቁ።',
      },
    },
    {
      title: {
        en: 'How to Choose the Right Solar Panel',
        am: 'ትክክለኛውን የፀሐይ ፓነል እንዴት እንደምትመርጡ',
      },
      slug: 'choose-right-solar-panel',
      excerpt: {
        en: "Mono vs poly, wattage, efficiency — a buyer's guide.",
        am: 'ሞኖ ከፖሊ፣ ዋት፣ ቅንጅታ — የገዢ መመሪያ።',
      },
      content: {
        en: '<p>Choosing the right panel depends on your budget, roof space, and energy needs.</p>',
        am: '<p>ትክክለኛውን ፓነል መምረጥ በበጀትዎ፣ በጣሪያ ቦታ እና በኢነርጂ ፍላጎትዎ ላይ ይመሰረታል።</p>',
      },
      category: 'guides',
      author: 'Smon Team',
      published: true,
      publishedAt: new Date(),
      seoTitle: {
        en: 'How to Choose the Right Solar Panel - Buyer Guide',
        am: 'ትክክለኛውን የፀሐይ ፓነል እንዴት እንደሚመርጥ - የገዢ መመሪያ',
      },
      seoDescription: {
        en: "Mono vs poly, wattage, efficiency - learn how to choose the right solar panels in Ethiopia.",
        am: "ሞኖ ከፖሊ፣ ዋት፣ ቅንጅታ - በኢትዮጵያ ውስጥ ትክክለኛውን የፀሐይ ፓነል እንዴት እንደሚመርጡ ይወቁ።",
      },
    },
    {
      title: {
        en: 'Understanding Net Metering in Ethiopia',
        am: 'በኢትዮጵያ ኔት ሜትሪንግ መረዳት',
      },
      slug: 'net-metering-ethiopia',
      excerpt: {
        en: 'What net metering means and how it affects your solar ROI.',
        am: 'ኔት ሜትሪንግ ምን ማለት እንደሆነ እና በሶላር ROIዎ ላይ እንዴት ይጽፈዋል።',
      },
      content: {
        en: '<p>Net metering allows you to sell excess solar energy back to the grid.</p>',
        am: '<p>ኔት ሜትሪንግ ከፍተኛ የፀሐይ ኃይል ወደ ግሪድ ለመሸጥ ያስችላል።</p>',
      },
      category: 'guides',
      author: 'Smon Team',
      published: true,
      publishedAt: new Date(),
      seoTitle: {
        en: 'Understanding Net Metering in Ethiopia',
        am: 'በኢትዮጵያ ኔት ሜትሪንግ መረዳት',
      },
      seoDescription: {
        en: 'Learn what net metering means and how it affects your solar system ROI in Ethiopia.',
        am: 'ኔት ሜትሪንግ ምን እንደሆነ እና በኢትዮጵያ የሶላር ሲስተም ROI ላይ እንዴት እንደሚነካ ይወቁ።',
      },
    },
  ]);


  await Service.insertMany([
    {
      title: { en: 'Residential Solar', am: 'የቤት ሶላር' },
      description: {
        en: 'Complete solar solutions for homes and apartments.',
        am: 'ለቤቶች እና አፓርትመንቶች ሙሉ ሶላር መፍትሄዎች።',
      },
      icon: 'home',
      features: [
        { en: 'Site assessment', am: 'የቦታ ግምገማ' },
        { en: 'Custom system design', am: 'ብጁ ስርዓት ንድፍ' },
        { en: 'Professional installation', am: 'ባለሙያ ጭማሪ' },
      ],
      order: 1,
    },
    {
      title: { en: 'Commercial Solar', am: 'የንግድ ሶላር' },
      description: {
        en: 'Large-scale solar for businesses, factories, and offices.',
        am: 'ለንግዶች፣ ፋብሪካዎች እና ቢሮዎች ትልቅ ሶላር።',
      },
      icon: 'building',
      features: [
        { en: 'Energy audit', am: 'የኢነርጂ ኦዲት' },
        { en: 'ROI analysis', am: 'ROI ትንተና' },
        { en: 'Maintenance plans', am: 'የጥገና እቅዶች' },
      ],
      order: 2,
    },
    {
      title: { en: 'Maintenance & Support', am: 'ጥገና እና ድጋፍ' },
      description: {
        en: 'Ongoing maintenance to keep your system at peak performance.',
        am: 'ስርዓትዎን በከፍተኛ አፈጻጸም ለማቆየት ቀጣይነት ያለው ጥገና።',
      },
      icon: 'wrench',
      features: [
        { en: 'Annual inspections', am: 'ዓመታዊ ፍተሻዎች' },
        { en: 'Performance monitoring', am: 'የአፈጻጸም ክትትል' },
        { en: '24/7 support hotline', am: '24/7 ድጋፍ ሆትላይን' },
      ],
      order: 3,
    },
  ]);

  console.log('Seed completed successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
