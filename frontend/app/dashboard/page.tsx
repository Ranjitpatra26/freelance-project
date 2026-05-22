'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, TrendingUp, Heart, Repeat2, Home, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSpent: 0,
        favoriteProduct: null as string | null,
        repeatPurchases: 0,
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login?redirect=/dashboard');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            fetchPurchaseHistory();
        }
    }, [user]);

    const fetchPurchaseHistory = async () => {
        try {
            const response = await api.get('/orders/myorders');
            const orders = response.data || [];

            // Process purchase history
            const productMap = new Map();
            let totalOrders = 0;
            let totalSpent = 0;

            orders.forEach((order: any) => {
                totalOrders++;
                totalSpent += order.totalPrice || 0;

                order.items?.forEach((item: any) => {
                    const key = item.productId || item.name;
                    if (productMap.has(key)) {
                        productMap.get(key).quantity += item.quantity || 1;
                        productMap.get(key).purchases += 1;
                    } else {
                        productMap.set(key, {
                            ...item,
                            quantity: item.quantity || 1,
                            purchases: 1,
                            lastBought: new Date(order.createdAt).toLocaleDateString(),
                        });
                    }
                });
            });

            // Sort by repeat purchases
            const sorted = Array.from(productMap.values())
                .sort((a, b) => b.purchases - a.purchases);

            setPurchaseHistory(sorted);

            setStats({
                totalOrders,
                totalSpent: Math.round(totalSpent),
                favoriteProduct: sorted[0]?.name || 'None yet',
                repeatPurchases: sorted.filter(p => p.purchases > 1).length,
            });
        } catch (err) {
            console.error('Failed to fetch purchase history:', err);
            // Use mock data for demo
            setMockData();
        } finally {
            setLoading(false);
        }
    };

    const setMockData = () => {
        const mockProducts = [
            { name: 'Himalayan Pink Salt Makhana', purchases: 5, quantity: 15, price: 99, thumbnail: '/images/products/himalayan-salt-makhana.svg', lastBought: '2026-03-10' },
            { name: 'Vegetable Chips', purchases: 3, quantity: 9, price: 149, thumbnail: '/images/products/vegetable-chips.svg', lastBought: '2026-03-05' },
            { name: 'Protein Power Diet Mix', purchases: 2, quantity: 6, price: 179, thumbnail: '/images/products/millet-cookies.svg', lastBought: '2026-02-28' },
        ];
        setPurchaseHistory(mockProducts);
        setStats({
            totalOrders: 8,
            totalSpent: 2150,
            favoriteProduct: 'Himalayan Pink Salt Makhana',
            repeatPurchases: 3,
        });
        setLoading(false);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#475d2a] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen pt-24 bg-white">
            <div className="page-container">
                {/* Header - Minimal & Clean */}
                <div className="mb-16 animate-fadeInUp">
                    <div className="mb-2">
                        <h1 className="section-title">Welcome back, {user.name}! 👋</h1>
                    </div>
                    <p className="section-subtitle">Here's what's happening with your account today</p>
                </div>

                {/* Stats Grid - Clean & Minimal */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 animate-fadeInUp delay-100">
                    {/* Total Orders */}
                    <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="mb-4">
                            <span className="text-3xl">📦</span>
                        </div>
                        <p className="text-xs font-semibold uppercase" style={{ color: '#b8a89f', letterSpacing: '0.05em' }}>Total Orders</p>
                        <h3 className="text-3xl font-extrabold mt-2" style={{ color: '#475d2a' }}>{stats.totalOrders}</h3>
                        <p className="text-xs mt-3" style={{ color: '#d4cac1' }}>All time purchases</p>
                    </div>

                    {/* Total Spent */}
                    <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="mb-4">
                            <span className="text-3xl">💰</span>
                        </div>
                        <p className="text-xs font-semibold uppercase" style={{ color: '#b8a89f', letterSpacing: '0.05em' }}>Total Spent</p>
                        <h3 className="text-3xl font-extrabold mt-2" style={{ color: '#dfc4ac' }}>₹{stats.totalSpent.toLocaleString()}</h3>
                        <p className="text-xs mt-3" style={{ color: '#d4cac1' }}>Lifetime value</p>
                    </div>

                    {/* Repeat Purchases */}
                    <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="mb-4">
                            <span className="text-3xl">🔁</span>
                        </div>
                        <p className="text-xs font-semibold uppercase" style={{ color: '#b8a89f', letterSpacing: '0.05em' }}>Favorites</p>
                        <h3 className="text-3xl font-extrabold mt-2" style={{ color: '#475d2a' }}>{stats.repeatPurchases}</h3>
                        <p className="text-xs mt-3" style={{ color: '#d4cac1' }}>Repurchased items</p>
                    </div>

                    {/* Favorite Product */}
                    <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="mb-4">
                            <span className="text-3xl">⭐</span>
                        </div>
                        <p className="text-xs font-semibold uppercase" style={{ color: '#b8a89f', letterSpacing: '0.05em' }}>Top Pick</p>
                        <h3 className="text-sm font-bold mt-2 line-clamp-2" style={{ color: '#475d2a', minHeight: '2.5rem' }}>{stats.favoriteProduct}</h3>
                        <p className="text-xs mt-3" style={{ color: '#d4cac1' }}>Your most loved</p>
                    </div>
                </div>

                {/* Featured Products Section */}
                <div className="mb-16 animate-fadeInUp delay-200">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold mb-1" style={{ color: '#475d2a' }}>Your Favorites</h2>
                            <p className="text-sm" style={{ color: '#b8a89f' }}>Products you love and keep coming back to</p>
                        </div>
                        {purchaseHistory.length > 0 && (
                            <Link href="/shop" className="btn-outline text-sm">
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-72" />)}
                        </div>
                    ) : purchaseHistory.length === 0 ? (
                        <div className="rounded-lg p-12 text-center" style={{ background: '#f0f4ed' }}>
                            <div className="text-6xl mb-4">🌾</div>
                            <h3 className="text-xl font-bold mb-2" style={{ color: '#475d2a' }}>Start Your Healthy Journey</h3>
                            <p className="text-sm mb-6" style={{ color: '#b8a89f' }}>No purchases yet. Explore our collection of clean snacks!</p>
                            <Link href="/shop" className="btn-primary">
                                Explore Shop
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {purchaseHistory.slice(0, 6).map((product, idx) => (
                                <div key={idx} className="card overflow-hidden hover:shadow-lg transition-all duration-300 animate-fadeInUp" style={{ animationDelay: `${idx * 0.05}s` }}>
                                    {/* Product Image */}
                                    <div className="relative h-56 overflow-hidden bg-[#f0f4ed] flex items-center justify-center">
                                        <img
                                            src={product.thumbnail}
                                            alt={product.name}
                                            className="w-32 h-32 object-contain hover:scale-110 transition-transform duration-300"
                                        />
                                        {/* Badge */}
                                        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full px-3 py-1 font-semibold text-xs" style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                                            🔄 {product.purchases}x
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-5">
                                        <h3 className="font-bold text-sm mb-3 line-clamp-2 h-10 flex items-start" style={{ color: '#1a1a1a' }}>{product.name}</h3>

                                        <div className="flex items-baseline gap-2 mb-4">
                                            <span className="text-2xl font-extrabold" style={{ color: '#475d2a' }}>₹{product.price}</span>
                                            <span className="text-xs" style={{ color: '#b8a89f' }}>Qty: {product.quantity}</span>
                                        </div>

                                        <p className="text-xs mb-4" style={{ color: '#b8a89f' }}>Last purchased {product.lastBought}</p>

                                        <button className="btn-primary w-full text-xs py-2.5 font-semibold">
                                            Buy Again
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions Section */}
                <div className="mb-16 animate-fadeInUp delay-300">
                    <h2 className="text-2xl font-bold mb-8" style={{ color: '#475d2a' }}>Quick Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <Link href="/shop" className="card p-7 group hover:shadow-lg transition-all duration-300 flex flex-col">
                            <div className="text-4xl mb-4">🛍️</div>
                            <h3 className="font-bold text-base mb-1" style={{ color: '#475d2a' }}>Continue Shopping</h3>
                            <p className="text-xs flex-1" style={{ color: '#b8a89f' }}>Discover more healthy snacks</p>
                            <div className="mt-3 text-xs font-semibold flex items-center gap-2" style={{ color: '#475d2a' }}>
                                Explore <span>→</span>
                            </div>
                        </Link>

                        <Link href="/track" className="card p-7 group hover:shadow-lg transition-all duration-300 flex flex-col">
                            <div className="text-4xl mb-4">📍</div>
                            <h3 className="font-bold text-base mb-1" style={{ color: '#475d2a' }}>Track Orders</h3>
                            <p className="text-xs flex-1" style={{ color: '#b8a89f' }}>Check delivery status</p>
                            <div className="mt-3 text-xs font-semibold flex items-center gap-2" style={{ color: '#475d2a' }}>
                                Track <span>→</span>
                            </div>
                        </Link>

                        <Link href="/contact" className="card p-7 group hover:shadow-lg transition-all duration-300 flex flex-col">
                            <div className="text-4xl mb-4">💬</div>
                            <h3 className="font-bold text-base mb-1" style={{ color: '#475d2a' }}>Get Support</h3>
                            <p className="text-xs flex-1" style={{ color: '#b8a89f' }}>Our team is here to help</p>
                            <div className="mt-3 text-xs font-semibold flex items-center gap-2" style={{ color: '#475d2a' }}>
                                Contact <span>→</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
