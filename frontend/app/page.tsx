'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import ProductCardWithSizes from '@/components/ProductCardWithSizes';
import DualScrollBanner from '@/components/DualScrollBanner';
import OurStory from '@/components/OurStory';
import IngredientsEducation from '@/components/IngredientsEducation';
import FunFactsSlider from '@/components/FunFactsSlider';
import api from '@/lib/api';
import { ArrowRight, Leaf, Flame, Shield, Recycle, Star, ChevronLeft, ChevronRight, TreePine } from 'lucide-react';

const heroSlides = [
  {
    image: '/images/hero/makhana.jpg',
    badge: '🌿 100% Clean Ingredients',
    titleLine1: 'Snacking',
    titleLine2: 'Reimagined.',
    subtitle: 'Guilt-free, clean-labeled snacks that your body will thank you for. Roasted, not deep-fried.'
  },
  {
    image: '/images/hero/ragi-cookies.jpg',
    badge: '🍪 Healthy | Organic | Clean Eating',
    titleLine1: 'Ragi & Elaichi',
    titleLine2: 'Cookies',
    subtitle: 'Wholesome | Vegan | Gluten-Free. Made with 100% Organic Ragi & Cardamom.'
  },
  {
    image: '/images/hero/jowar-cookies.jpg',
    badge: '🍪 Healthy | Organic | Clean Eating',
    titleLine1: 'Jowar & Nuts',
    titleLine2: 'Cookies',
    subtitle: 'Wholesome | Vegan | Gluten-Free. Made with 100% Organic Jowar & Premium Nuts.'
  },
  {
    image: '/images/hero/beetroot-chips.jpg',
    badge: '🥔 Low Calorie | Fibre Rich',
    titleLine1: 'Beetroot',
    titleLine2: 'Chips',
    subtitle: 'Air Fried & Flavourful. Real Beetroot Taste with zero added preservatives.'
  },
  {
    image: '/images/hero/broccoli-chips.jpg',
    badge: '🥦 Low Calorie | Fibre Rich',
    titleLine1: 'Broccoli',
    titleLine2: 'Chips',
    subtitle: 'Air Fried & Crispy. Real Broccoli Taste with zero added preservatives.'
  }
];

const categories = [
  {
    name: 'Flavoured Makhanas',
    emoji: '🌰',
    desc: 'Air-popped fox nuts, guilt-free snacking',
    color: '#f0f4ed',
    icon: '🌿',
    variants: ['Himalayan Salt', 'Peri Peri', 'Pudina', 'Classic Cheese', 'Cream and Onion'],
    sizes: ['35gm', '75gm', '100gm']
  },
  {
    name: 'Air Fried Chips',
    emoji: '🥔',
    desc: '70% less oil, 100% more crunch',
    color: '#FEF9E7',
    icon: '⚡',
    variants: ['Vegetable Chips', 'Sweet Potato Chips', 'Beetroot Chips'],
    sizes: ['100gm']
  },
  {
    name: 'No Sugar No Palm Oil Millet Cookies',
    emoji: '🍪',
    desc: 'Nutritious millet cookies with zero sugar',
    color: '#F0FDF4',
    icon: '💪',
    variants: [],
    sizes: ['100gm']
  },
];

const testimonials = [
  { name: 'Priya Sharma', rating: 5, text: 'Finally a healthy snack that actually tastes good! The Himalayan Pink Salt Makhana is my office desk staple. Highly recommend!', city: 'Mumbai' },
  { name: 'Rohan Gupta', rating: 5, text: 'The roasted chips are incredible — I can\'t believe how crispy they are with so little oil. My kids love them too!', city: 'Delhi' },
  { name: 'Ananya Reddy', rating: 4, text: 'Great quality products and super fast delivery. The Protein Power Diet Mix is my go-to pre-workout snack.', city: 'Bangalore' },
  { name: 'Vikram Mehta', rating: 5, text: 'ShuddhEats has completely changed my snacking habits. Clean ingredients, amazing flavors. 10/10!', city: 'Pune' },
];

const whyUs = [
  { icon: Leaf, title: 'Clean Ingredients', desc: 'No artificial colors, flavors, or preservatives. What you read is what you eat.' },
  { icon: Flame, title: 'Roasted, Not Deep-Fried', desc: 'Up to 70% less oil using our state-of-the-art roasting technology.' },
  { icon: Shield, title: 'Nutritionist Approved', desc: 'Every recipe is approved by certified nutritionists for maximum health benefits.' },
  { icon: Recycle, title: 'Sustainable Packaging', desc: 'Fully recyclable packaging that reduces our carbon footprint.' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [feat, best] = await Promise.all([
          api.get('/products?featured=true'),
          api.get('/products?bestseller=true'),
        ]);
        setFeatured(feat.data.slice(0, 3));
        setBestsellers(best.data.slice(0, 4));
      } catch (err: any) {
        console.warn('API unavailable, using homepage fallback data:', err?.message || err);
        // Fallback mock data if backend not running
        const mock = [
          { _id: '1', name: 'Himalayan Pink Salt Makhana', slug: 'himalayan-pink-salt-makhana-35g', price: 99, originalPrice: 129, category: 'Flavoured Makhanas', thumbnail: '/images/products/himalayan-salt-makhana.svg', ratings: 4.8, numReviews: 124, isBestSeller: true, stock: 150, shortDescription: 'Roasted fox nuts with Himalayan pink salt.', availableSizes: ['35gm', '75gm', '100gm'], weight: 35 },
          { _id: '2', name: 'Vegetable Chips (100g)', slug: 'vegetable-chips-100g', price: 149, originalPrice: 199, category: 'Roasted Chips', thumbnail: '/images/products/vegetable-chips.svg', ratings: 4.9, numReviews: 201, isBestSeller: true, stock: 200, shortDescription: 'Roasted with 70% less oil.', availableSizes: ['100gm'], weight: 100 },
          { _id: '3', name: 'No Sugar No Palm Oil Millet Cookies', slug: 'millet-cookies-100g', price: 179, originalPrice: 199, category: 'No Sugar No Palm Oil Millet Cookies', thumbnail: '/images/products/millet-cookies.svg', ratings: 4.8, numReviews: 112, isBestSeller: true, stock: 80, shortDescription: 'Nutritious millet cookies with zero sugar.', availableSizes: ['100gm'], weight: 100 },
        ];
        setFeatured(mock);
        setBestsellers(mock);
      } finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(() => setTestimonialIndex(i => (i + 1) % testimonials.length), 4000);
    const slideTimer = setInterval(() => setCurrentSlide(s => (s + 1) % heroSlides.length), 5000);
    return () => {
      clearInterval(timer);
      clearInterval(slideTimer);
    };
  }, [mounted]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubSuccess(true); setEmail(''); }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-1000 bg-cover bg-center bg-no-repeat -mt-[55px] sm:-mt-[65px]" style={{ backgroundImage: `url(${heroSlides[currentSlide].image})`, backgroundAttachment: 'fixed', backgroundSize: 'cover' }}>
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/30"></div>

        <div className="page-container relative z-10 py-6 sm:py-10 md:py-16 lg:py-20 flex flex-col justify-between h-full min-h-[80vh]">
          <div className="max-w-3xl mt-auto mb-auto" key={currentSlide}>
            <div className="badge mb-3 sm:mb-4 md:mb-6 animate-fadeInUp text-xs sm:text-sm px-3 sm:px-4 py-2" style={{ background: 'rgba(246,201,28,0.2)', color: 'rgb(223, 196, 172)', backdropFilter: 'blur(4px)' }}>
              {heroSlides[currentSlide].badge}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-3 sm:mb-4 md:mb-6 leading-tight animate-fadeInUp" style={{ animationDelay: '0.1s', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              {heroSlides[currentSlide].titleLine1}
              <span className="block" style={{ color: 'rgb(223, 196, 172)' }}>{heroSlides[currentSlide].titleLine2}</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 mb-4 sm:mb-6 md:mb-8 lg:mb-10 leading-relaxed animate-fadeInUp font-light" style={{ animationDelay: '0.2s', maxWidth: '550px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              {heroSlides[currentSlide].subtitle}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 md:gap-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <Link href="/shop" className="btn-accent text-xs sm:text-sm md:text-base lg:text-lg px-5 sm:px-6 md:px-8 lg:px-10 py-2.5 sm:py-3 md:py-4 justify-center sm:justify-start font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                Shop Now <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
              </Link>
            </div>
          </div>

          <div className="absolute bottom-16 sm:bottom-20 left-0 right-0 flex justify-center gap-2 z-20">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/80'}`}
                aria-label={`Go to slide ${i + 1}`}
                suppressHydrationWarning
              />
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/40 rounded-full flex justify-center pt-1.5 sm:pt-2" style={{ backdropFilter: 'blur(4px)' }}>
            <div className="w-1 h-2 sm:h-2.5 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white animate-fadeInUp">
        <div className="page-container">
          <div className="text-center mb-10">
            <div className="badge badge-primary mb-3 animate-scaleIn">Our Collections</div>
            <h2 className="section-title animate-fadeInUp delay-100">Snack by Category</h2>
            <p className="section-subtitle mt-3 max-w-2xl mx-auto animate-fadeInUp delay-200 text-sm">Discover our carefully curated collections, each designed with a unique philosophy to keep you healthy and satisfied.</p>
          </div>
          <div className="flex justify-center">
            <div className="flex flex-wrap justify-center gap-6 max-w-5xl w-full">
            {categories.map((cat, i) => (
              <Link 
                href={`/shop?category=${encodeURIComponent(cat.name)}`} 
                key={cat.name}
                className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] max-w-sm flex-shrink-0"
              >
                <div className="card overflow-hidden group flex flex-col h-full hover:shadow-lg transition-all duration-300">
                  {/* Card Header with Icon */}
                  <div className="relative h-32 overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: cat.color }}>
                    <div className="text-5xl group-hover:scale-125 transition-transform duration-300 drop-shadow-sm">{cat.emoji}</div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-black transition-opacity duration-300"></div>
                  </div>

                  {/* Card Content */}
                  <div className="p-3 flex flex-col flex-grow">
                    {/* Title and Description */}
                    <h3 className="text-sm font-bold mb-1 line-clamp-1" style={{ color: '#475d2a' }}>{cat.name}</h3>
                    <p className="text-xs mb-3 leading-relaxed line-clamp-1 flex-grow" style={{ color: '#6b6969' }}>{cat.desc}</p>

                    {/* Pack Sizes Section */}
                    <div className="mb-3">
                      <p className="text-xs font-bold uppercase mb-1.5" style={{ color: '#475d2a', letterSpacing: '0.05em' }}>Sizes</p>
                      <div className="flex flex-wrap gap-1">
                        {cat.sizes.map(size => (
                          <span key={size} className="text-xs font-bold px-2 py-0.5 rounded-full border" style={{ borderColor: '#475d2a', color: '#475d2a', background: 'transparent' }}>
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button - Sticks to Bottom */}
                    <button className="w-full btn-primary py-1.5 text-xs font-semibold flex items-center justify-center gap-1 mt-auto">
                      Explore <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* Category Carousel */}
      <section className="py-10 bg-white overflow-hidden">
        <div className="text-center mb-8 animate-fadeInUp page-container">
          <h2 className="section-title text-2xl animate-fadeInUp delay-100">Quick Browse</h2>
          <p className="section-subtitle mt-2 max-w-lg mx-auto text-sm animate-fadeInUp delay-200">Explore our popular categories</p>
        </div>
        {/* Infinite marquee — 8 copies ensures content always > viewport width */}
        <div className="w-full overflow-hidden flex justify-center">
          <div className="scroll-animate flex gap-12 w-max" style={{ '--duration': '18s' } as any}>
            {Array.from({ length: 8 }).flatMap((_, setIdx) =>
              [
                { label: 'Flavoured Makhanas', emoji: '🌰', href: '/shop?category=Flavoured Makhanas' },
                { label: 'Air Fried Chips', emoji: '🥔', href: '/shop?category=Air Fried Chips' },
                { label: 'Millet Cookies', emoji: '🍪', href: '/shop?category=No Sugar No Palm Oil Millet Cookies' },
              ].map((cat, i) => (
                <Link
                  key={`${setIdx}-${i}`}
                  href={cat.href}
                  className="flex flex-col items-center gap-2 flex-shrink-0 group"
                >
                  <div
                    className="h-14 w-14 rounded-full flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-115 group-hover:shadow-md"
                    style={{ background: '#f0f4ed' }}
                  >
                    {cat.emoji}
                  </div>
                  <span className="text-xs font-semibold text-[#475d2a] whitespace-nowrap">
                    {cat.label}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-12 bg-white animate-fadeInUp">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div className="animate-slideInLeft">
              <div className="badge badge-primary mb-2">Curated For You</div>
              <h2 className="section-title text-2xl">Featured Products</h2>
            </div>
            <Link href="/shop" className="btn-outline hidden md:flex text-sm">View All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-80" />)}
            </div>
          ) : (
            <div className="w-full overflow-hidden flex justify-center">
              <div className="scroll-animate flex gap-4 w-max" style={{ '--duration': '20s' } as any}>
                {[...featured, ...featured].map((p, i) => (
                  <div key={`featured-${i}`} className="flex-shrink-0 w-[280px] sm:w-[320px]">
                    <ProductCardWithSizes product={p} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Did You Know? Ingredients Education */}
      <IngredientsEducation />

      {/* Fun Facts Slider */}
      <FunFactsSlider />

      {/* Why Us - Bento Grid */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2C421A 0%, #1E2D12 100%)' }}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4BA9E] rounded-full mix-blend-overlay filter blur-[120px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-[120px] opacity-10 pointer-events-none"></div>
        <div className="page-container relative z-10">
          <div className="text-center mb-16 animate-fadeInUp">
            <div className="badge mb-4 animate-slideInTop backdrop-blur-md border border-white/20" style={{ background: 'rgba(212,186,158,0.15)', color: '#D4BA9E' }}>Our Promise</div>
            <h2 className="section-title text-white animate-fadeInUp delay-100 tracking-tight">Why Choose ShuddhEats?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
            {whyUs.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="p-8 md:p-10 rounded-3xl group animate-fadeInUp backdrop-blur-xl border border-white/10 flex flex-col justify-center transition-all duration-500 hover:transform hover:-translate-y-2 bg-white/5 hover:bg-white/10" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl bg-white/10 border border-white/10">
                  <Icon className="w-8 h-8 text-[#D4BA9E]" />
                </div>
                <h3 className="font-bold text-white mb-3 text-xl">{title}</h3>
                <p className="leading-relaxed text-white/70 text-base">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual Scroll Banner */}
      <DualScrollBanner />

      {/* Best Sellers */}
      <section className="py-12 animate-fadeInUp" style={{ background: '#fafaf7' }}>
        <div className="page-container">
          <div className="text-center mb-8">
            <div className="badge badge-accent mb-2 animate-scaleIn">Customer Favorites</div>
            <h2 className="section-title text-2xl animate-fadeInUp delay-100">Best Sellers</h2>
            <p className="section-subtitle mt-2 max-w-xl mx-auto text-sm animate-fadeInUp delay-200">Tried, tested, and loved by thousands of happy snackers across India.</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-72" />)}
            </div>
          ) : (
            <div className="w-full overflow-hidden flex justify-center">
              <div className="scroll-animate flex gap-4 w-max" style={{ '--duration': '15s' } as any}>
                {[...bestsellers, ...bestsellers].map((p, i) => (
                  <div key={`bestseller-${i}`} className="flex-shrink-0 w-[220px] sm:w-[260px]">
                    <ProductCardWithSizes product={p} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Bundles */}
      <section className="py-12 bg-white animate-fadeInUp">
        <div className="page-container">
          <div className="text-center mb-8">
            <div className="badge badge-primary mb-2 animate-scaleIn">Special Offers</div>
            <h2 className="section-title text-2xl animate-fadeInUp delay-100">Bundles That Match Your Goals</h2>
            <p className="section-subtitle mt-2 max-w-xl mx-auto text-sm animate-fadeInUp delay-200">Save more with our curated bundles designed for your lifestyle</p>
          </div>
          <div className="w-full overflow-hidden flex justify-center">
            <div className="scroll-animate flex gap-4 w-max" style={{ '--duration': '22s' } as any}>
              {[
                { name: 'Best Seller Bundle', image: '/images/products/himalayan-salt-makhana.svg', save: '7%', price: 829, original: 890, rating: 4.8, reviews: 67 },
                { name: 'Fitness Bundle', image: '/images/products/sweet-potato-chips.svg', save: '12%', price: 1299, original: 1499, rating: 4.9, reviews: 156 },
                { name: 'Healthy Snack Box', image: '/images/products/millet-cookies.svg', save: '10%', price: 1039, original: 1150, rating: 4.7, reviews: 98 },
                { name: 'Ultimate Mix Bundle', image: '/images/products/pudina-makhana.svg', save: '15%', price: 1379, original: 1620, rating: 4.6, reviews: 88 },
                { name: 'Best Seller Bundle', image: '/images/products/himalayan-salt-makhana.svg', save: '7%', price: 829, original: 890, rating: 4.8, reviews: 67 },
                { name: 'Fitness Bundle', image: '/images/products/sweet-potato-chips.svg', save: '12%', price: 1299, original: 1499, rating: 4.9, reviews: 156 },
              ].map((bundle, i) => (
                <div key={`bundle-${i}`} className="flex-shrink-0 w-[240px] sm:w-[280px] card p-4 group relative">
                  {/* Save Badge */}
                  <div className="absolute top-3 left-3 z-10 rounded-full text-white text-xs font-bold px-3 py-1" style={{ background: '#c94a54' }}>
                    Save {bundle.save}
                  </div>

                  {/* Bundle Image */}
                  <div className="relative w-full h-40 mb-3 rounded-lg overflow-hidden bg-[#f0f4ed] flex items-center justify-center">
                    <Image
                      src={bundle.image}
                      alt={bundle.name}
                      width={160}
                      height={160}
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#475d2a] text-[#475d2a]" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">({bundle.reviews})</span>
                  </div>

                  {/* Bundle Name */}
                  <h3 className="font-semibold text-sm mb-2 text-[#475d2a] line-clamp-2">{bundle.name}</h3>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs line-through text-gray-400">₹{bundle.original}</span>
                    <span className="text-lg font-bold text-red-500">₹{bundle.price}</span>
                  </div>

                  {/* Add to Cart Button */}
                  <button className="w-full btn-primary text-xs py-2 justify-center" suppressHydrationWarning>
                    Add to cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <OurStory />

      {/* Testimonials */}
      <section className="py-12" style={{ background: '#f0f4ed' }}>
        <div className="page-container">
          <div className="text-center mb-10">
            <div className="badge badge-primary mb-2">Reviews</div>
            <h2 className="section-title text-2xl">What Our Snackers Say</h2>
          </div>
          <div className="max-w-2xl mx-auto relative">
            {mounted && (
              <div className="card p-8 text-center animate-fadeIn" key={testimonialIndex}>
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(testimonials[testimonialIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[rgb(223, 196, 172)] text-[rgb(223, 196, 172)]" />
                  ))}
                </div>
                <p className="text-lg italic text-gray-700 mb-6 leading-relaxed">"{testimonials[testimonialIndex].text}"</p>
                <p className="font-bold" style={{ color: '#475d2a' }}>{testimonials[testimonialIndex].name}</p>
                <p className="text-sm text-gray-400">{testimonials[testimonialIndex].city}</p>
              </div>
            )}
            {mounted && (
              <div className="flex justify-center gap-3 mt-6">
                <button onClick={() => setTestimonialIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: '#475d2a', color: 'white' }}>
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setTestimonialIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${i === testimonialIndex ? 'w-6 bg-[#475d2a]' : 'bg-gray-300'}`} />
                ))}
                <button onClick={() => setTestimonialIndex((i) => (i + 1) % testimonials.length)}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: '#475d2a', color: 'white' }}>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 animate-fadeInUp" style={{ background: 'rgb(223, 196, 172)' }}>
        <div className="page-container">
          <div className="max-w-xl mx-auto text-center">
            <div className="text-4xl mb-3 animate-bounce-slow">💌</div>
            <h2 className="text-2xl font-extrabold mb-2 animate-fadeInUp delay-100" style={{ color: '#1a1a1a' }}>Get 10% Off Your First Order!</h2>
            <p className="text-sm mb-6 animate-fadeInUp delay-200" style={{ color: 'rgba(0,0,0,0.6)' }}>Join our snacker newsletter for exclusive discounts, new launches, and healthy snacking tips.</p>
            {subSuccess ? (
              <div className="bg-[#475d2a] text-white py-4 px-8 rounded-2xl font-bold text-lg animate-scaleIn">
                🎉 You're in! Check your email for your discount code.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto animate-fadeInUp delay-300">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="your@email.com"
                  className="input-field flex-1" style={{ borderColor: 'rgba(0,0,0,0.1)' }} suppressHydrationWarning />
                <button type="submit" className="btn-primary whitespace-nowrap" suppressHydrationWarning>Subscribe</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
