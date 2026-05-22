'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Star, ArrowLeft, Shield, Leaf, Package, Minus, Plus } from 'lucide-react';
import Link from 'next/link';

const mockProducts: any = {
    'himalayan-pink-salt-makhana': { _id: '1', name: 'Himalayan Pink Salt Makhana', slug: 'himalayan-pink-salt-makhana', price: 199, originalPrice: 249, category: 'Makhana', thumbnail: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800', images: ['https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800'], ratings: 4.8, numReviews: 124, isBestSeller: true, stock: 150, weight: '100g', description: 'Light, airy fox nuts air-popped and seasoned with pure Himalayan pink salt. High in protein, low in fat, and completely guilt-free. Perfect for evening snacking.', ingredients: ['Fox Nuts (Makhana)', 'Himalayan Pink Salt', 'Cold Pressed Coconut Oil'], nutritionFacts: { calories: 347, protein: 9.7, carbs: 76.9, fat: 0.1, fiber: 0.5 } },
    'classic-salted-air-fried-chips': { _id: '4', name: 'Classic Salted Air Fried Chips', slug: 'classic-salted-air-fried-chips', price: 89, originalPrice: 120, category: 'Air Fried Chips', thumbnail: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800', images: ['https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800'], ratings: 4.9, numReviews: 201, isBestSeller: true, stock: 200, weight: '80g', description: 'Thin-sliced, air-fried potato chips with just the right amount of salt. 70% less oil than regular chips. Crispy, crunchy, and completely guilt-free.', ingredients: ['Potato', 'Salt', 'Sunflower Oil (minimal)'], nutritionFacts: { calories: 130, protein: 2.1, carbs: 27.8, fat: 2.0, fiber: 2.2 } },
    'protein-power-diet-mix': { _id: '7', name: 'Protein Power Diet Mix', slug: 'protein-power-diet-mix', price: 249, originalPrice: 299, category: 'Diet Mix', thumbnail: 'https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?w=800', images: ['https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?w=800'], ratings: 4.8, numReviews: 112, isBestSeller: true, stock: 80, weight: '200g', description: 'A protein-packed roasted mixture of chana, moong dal, sunflower seeds, and pumpkin seeds. Perfect pre or post workout snack. No added preservatives.', ingredients: ['Roasted Chana', 'Moong Dal', 'Sunflower Seeds', 'Pumpkin Seeds', 'Black Pepper', 'Salt'], nutritionFacts: { calories: 380, protein: 24.5, carbs: 45.2, fat: 11.3, fiber: 8.9 } },
};

export default function ProductDetailPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const { addToCart } = useCart();
    const { user, loading: authLoading } = useAuth();
    const [selectedWeight, setSelectedWeight] = useState<number>(100);
    const [selectedPackaging, setSelectedPackaging] = useState<'jar' | 'pouch'>('jar');

    useEffect(() => {
        if (product) {
            const parsedWeight = parseInt(product.weight) || 100;
            setSelectedWeight(parsedWeight);
            setSelectedPackaging(parsedWeight >= 100 ? 'jar' : 'pouch');
        }
    }, [product]);

    const getDynamicPrice = () => {
        if (!product) return { price: 0, originalPrice: 0 };
        const isMakhana = product.category === 'Makhana' || product.category === 'Flavoured Makhanas' || product.name.toLowerCase().includes('makhana');
        
        if (isMakhana) {
            if (selectedWeight <= 35) {
                return { price: 99, originalPrice: 129 };
            } else if (selectedWeight === 75) {
                return { price: 199, originalPrice: 249 };
            } else {
                return { price: 249, originalPrice: 299 };
            }
        } else {
            if (selectedWeight <= 35) {
                return { price: 49, originalPrice: 69 };
            } else if (selectedWeight === 75) {
                return { price: 89, originalPrice: 119 };
            } else {
                return { price: product.price, originalPrice: product.originalPrice || (product.price + 40) };
            }
        }
    };

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push(`/auth/login?redirect=/shop/${slug}`);
        }
    }, [user, authLoading, router, slug]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await api.get(`/products/${slug}`);
                setProduct(data);
                const rv = await api.get(`/reviews/product/${data._id}`);
                setReviews(rv.data);
            } catch {
                setProduct(mockProducts[slug as string] || null);
            } finally { setLoading(false); }
        };
        fetch();
    }, [slug]);

    const btnRef = useRef<HTMLButtonElement>(null);
    const [added, setAdded] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const spawnRipple = useCallback((e: React.MouseEvent) => {
        const btn = btnRef.current;
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.4;
        const span = document.createElement('span');
        span.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.28);width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;transform:scale(0);animation:cartRipple 0.6s linear forwards;pointer-events:none;z-index:3`;
        btn.appendChild(span);
        span.addEventListener('animationend', () => span.remove());
    }, []);

    const handleAddToCart = async (e: React.MouseEvent) => {
        if (!product || added || isAdding) return;
        spawnRipple(e);
        setIsAdding(true);
        try {
            const { price } = getDynamicPrice();
            await addToCart(product._id, product.name, product.thumbnail, price, qty, {
                weight: selectedWeight,
                packaging: selectedPackaging
            });
            setAdded(true);
            setTimeout(() => setAdded(false), 2400);
        } finally {
            setIsAdding(false);
        }
    };

    // Show loading while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#475d2a] border-t-transparent rounded-full" style={{ animation: 'spin 0.8s linear infinite' }} />
            </div>
        );
    }

    // Don't render if not authenticated (will redirect)
    if (!user) {
        return null;
    }

    if (!product) return (
        <div className="min-h-screen pt-24 flex items-center justify-center flex-col gap-4">
            <div className="text-5xl">😔</div>
            <h2 className="text-xl font-bold">Product not found</h2>
            <Link href="/shop" className="btn-primary">Back to Shop</Link>
        </div>
    );

    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;

    return (
        <>
        <div className="min-h-screen pt-24 pb-16 bg-white">
            <div className="page-container">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-sm mb-8 hover:text-[#475d2a] transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Shop
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    {/* Image */}
                    <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: '1/1', background: '#f0f4ed' }}>
                        <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                        {product.isBestSeller && (
                            <div className="absolute top-4 left-4 badge" style={{ background: 'rgb(223, 196, 172)', color: '#1a1a1a' }}>⭐ Best Seller</div>
                        )}
                        {discount && (
                            <div className="absolute top-4 right-4 badge" style={{ background: '#475d2a', color: 'white' }}>{discount}% OFF</div>
                        )}
                    </div>

                    {/* Info */}
                    <div>
                        <span className="badge badge-primary mb-3">{product.category}</span>
                        <h1 className="text-3xl font-extrabold mb-2" style={{ color: '#475d2a' }}>{product.name}</h1>
                        <div className="flex items-center gap-2 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.ratings) ? 'fill-[rgb(223, 196, 172)] text-[rgb(223, 196, 172)]' : 'text-gray-300'}`} />
                            ))}
                            <span className="text-sm text-gray-500">({product.numReviews} reviews)</span>
                        </div>
                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-4xl font-extrabold" style={{ color: '#475d2a' }}>₹{getDynamicPrice().price}</span>
                            {getDynamicPrice().originalPrice && <span className="text-xl text-gray-400 line-through">₹{getDynamicPrice().originalPrice}</span>}
                            {getDynamicPrice().originalPrice && getDynamicPrice().originalPrice > getDynamicPrice().price && (
                                <span className="text-sm font-bold text-green-600">Save ₹{getDynamicPrice().originalPrice - getDynamicPrice().price}</span>
                            )}
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

                        {/* Weight Selection */}
                        <div className="mb-6">
                            <span className="font-semibold text-sm block mb-3 text-gray-700">Select Weight:</span>
                            <div className="flex flex-wrap gap-2.5">
                                {[30, 75, 100].map((w) => {
                                    const displayWeight = w === 30 && (product.category?.includes('Makhana') || product.name?.toLowerCase().includes('makhana')) ? 35 : w;
                                    const isSelected = selectedWeight === displayWeight;
                                    return (
                                        <button
                                            key={w}
                                            onClick={() => {
                                                setSelectedWeight(displayWeight);
                                                setSelectedPackaging(displayWeight >= 100 ? 'jar' : 'pouch');
                                            }}
                                            className={`py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 border-2 flex items-center gap-1.5 ${
                                                isSelected
                                                    ? 'border-[#475d2a] text-white'
                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                            style={isSelected ? { background: '#475d2a', borderColor: '#475d2a' } : {}}
                                        >
                                            {displayWeight}g
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="font-semibold text-sm">Quantity:</span>
                            <div className="flex items-center border-2 border-[#f0f4ed] rounded-xl overflow-hidden">
                                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 hover:bg-[#f0f4ed] transition-colors"><Minus className="w-4 h-4" /></button>
                                <span className="px-4 font-bold text-lg min-w-[2.5rem] text-center">{qty}</span>
                                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-4 py-3 hover:bg-[#f0f4ed] transition-colors"><Plus className="w-4 h-4" /></button>
                            </div>
                            <span className="text-sm text-gray-400">{product.stock} in stock</span>
                        </div>

                        {/* ── Premium animated Add to Cart button ── */}
                        <button
                            ref={btnRef}
                            onClick={handleAddToCart}
                            disabled={!product || product.stock === 0}
                            aria-label="Add to cart"
                            style={{
                                position: 'relative',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                width: '100%',
                                border: '2px solid #2d4a1e',
                                borderRadius: '9999px',
                                background: added ? '#2d4a1e' : '#ffffff',
                                color: added ? '#ffffff' : '#2d4a1e',
                                padding: '16px 32px',
                                fontSize: '15px',
                                fontWeight: 700,
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                                cursor: (!product || product.stock === 0) ? 'not-allowed' : 'pointer',
                                opacity: (!product || product.stock === 0) ? 0.45 : 1,
                                transition: 'color 0.44s cubic-bezier(0.4,0,0.2,1), box-shadow 0.44s cubic-bezier(0.4,0,0.2,1), transform 0.18s cubic-bezier(0.4,0,0.2,1)',
                                boxShadow: added ? '0 8px 28px rgba(45,74,30,0.30)' : 'none',
                                marginBottom: '16px',
                            }}
                            onMouseEnter={e => {
                                if (!added) {
                                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 28px rgba(45,74,30,0.22)';
                                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                                }
                            }}
                            onMouseLeave={e => {
                                if (!added) {
                                    (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                                }
                            }}
                        >
                            {/* Slide fill */}
                            <span style={{
                                position: 'absolute', inset: 0,
                                background: '#2d4a1e',
                                borderRadius: '9999px',
                                transform: added ? 'translateX(0)' : 'translateX(-105%)',
                                transition: 'transform 0.48s cubic-bezier(0.4,0,0.2,1)',
                                zIndex: 0,
                            }} />
                            {/* Cart icon */}
                            {!added && (
                                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, position: 'relative', zIndex: 1, stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0 }}>
                                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                    <line x1="3" y1="6" x2="21" y2="6"/>
                                    <path d="M16 10a4 4 0 0 1-8 0"/>
                                </svg>
                            )}
                            {/* Check icon */}
                            {added && (
                                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, position: 'relative', zIndex: 1, stroke: '#fff', fill: 'none', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0 }}>
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                            )}
                            <span style={{ position: 'relative', zIndex: 1 }}>
                                {added
                                    ? `Added to Cart ✓`
                                    : isAdding
                                    ? 'Adding…'
                                    : `Add to Cart — ₹${getDynamicPrice().price * qty}`}
                            </span>
                        </button>
                        <style>{`@keyframes cartRipple { to { transform: scale(4); opacity: 0; } }`}</style>
                        <Link href="/cart" className="btn-outline w-full justify-center py-4 block text-center">View Cart</Link>

                        {/* Trust badges */}
                        <div className="grid grid-cols-3 gap-3 mt-6">
                            {[
                                { Icon: Leaf, label: 'Clean Ingredients' },
                                { Icon: Shield, label: 'Quality Assured' },
                                { Icon: Package, label: 'Eco Packaging' },
                            ].map(({ Icon, label }) => (
                                <div key={label} className="flex flex-col items-center gap-1 p-3 rounded-xl text-center" style={{ background: '#f0f4ed' }}>
                                    <Icon className="w-5 h-5" style={{ color: '#475d2a' }} />
                                    <span className="text-xs font-medium" style={{ color: '#475d2a' }}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div>
                    <div className="flex gap-2 mb-8 border-b border-gray-100">
                        {['description', 'nutrition', 'ingredients', 'reviews'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={`px-5 py-3 text-sm font-semibold capitalize transition-all border-b-2 -mb-px ${activeTab === tab ? 'border-[#475d2a] text-[#475d2a]' : 'border-transparent text-gray-400'}`}>
                                {tab === 'reviews' ? `Reviews (${reviews.length})` : tab}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'description' && (
                        <p className="text-gray-600 leading-relaxed max-w-2xl">{product.description}</p>
                    )}
                    {activeTab === 'nutrition' && product.nutritionFacts && (
                        <div className="max-w-sm">
                            <h3 className="font-bold text-lg mb-4" style={{ color: '#475d2a' }}>Nutrition Facts (per 100g)</h3>
                            <div className="divide-y border border-gray-100 rounded-xl overflow-hidden">
                                {Object.entries(product.nutritionFacts).map(([k, v]) => (
                                    <div key={k} className="flex justify-between px-4 py-3 odd:bg-[#f9fbf7]">
                                        <span className="font-medium capitalize">{k}</span>
                                        <span className="text-gray-600">{v as string}{k === 'calories' ? ' kcal' : 'g'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'ingredients' && product.ingredients && (
                        <div className="flex flex-wrap gap-3">
                            {product.ingredients.map((ing: string) => (
                                <span key={ing} className="badge badge-primary px-4 py-2">{ing}</span>
                            ))}
                        </div>
                    )}
                    {activeTab === 'reviews' && (
                        <div>
                            {reviews.length === 0 ? (
                                <p className="text-gray-400">No reviews yet. Be the first to review!</p>
                            ) : (
                                <div className="space-y-4 mb-8">
                                    {reviews.map((r: any) => (
                                        <div key={r._id} className="card p-5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ background: '#475d2a' }}>
                                                    {r.name?.[0] || 'U'}
                                                </div>
                                                <span className="font-semibold">{r.name}</span>
                                                <div className="flex ml-auto">
                                                    {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-[rgb(223, 196, 172)] text-[rgb(223, 196, 172)]" />)}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm">{r.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {user && (
                                <div className="card p-6 mt-4">
                                    <h4 className="font-bold mb-4" style={{ color: '#475d2a' }}>Write a Review</h4>
                                    <div className="flex gap-2 mb-4">
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <button key={n} onClick={() => setReviewForm(f => ({ ...f, rating: n }))}>
                                                <Star className={`w-6 h-6 ${n <= reviewForm.rating ? 'fill-[rgb(223, 196, 172)] text-[rgb(223, 196, 172)]' : 'text-gray-300'}`} />
                                            </button>
                                        ))}
                                    </div>
                                    <textarea value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                                        placeholder="Share your experience..." rows={3} className="input-field mb-3 resize-none" />
                                    <button onClick={async () => {
                                        try {
                                            await api.post('/reviews', { productId: product._id, rating: reviewForm.rating, comment: reviewForm.comment });
                                            const rv = await api.get(`/reviews/product/${product._id}`);
                                            setReviews(rv.data);
                                            setReviewForm({ rating: 5, comment: '' });
                                        } catch (err: any) { alert(err.response?.data?.message || 'Error submitting review'); }
                                    }} className="btn-primary">Submit Review</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}
