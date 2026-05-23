'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import api from '@/lib/api';
import { Search, SlidersHorizontal, X, Grid3x3, List } from 'lucide-react';

const CATEGORIES = ['All', 'Flavoured Makhanas', 'Air Fried Chips', 'No Sugar No Palm Oil Millet Cookies'];
const SORTS = [
    { label: 'Newest', value: '' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Top Rated', value: 'rating' },
];

function ShopContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState(searchParams.get('category') || 'All');
    const [sort, setSort] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

    const mockProducts = [
        { _id: '1', name: 'Himalayan Salt Makhana (30g)', slug: 'himalayan-salt-makhana-100g', price: 249, originalPrice: 299, category: 'Flavoured Makhanas', thumbnail: '/images/products/himalayan-salt-makhana.svg', ratings: 4.8, numReviews: 124, isBestSeller: true, stock: 150, shortDescription: 'Roasted fox nuts with Himalayan pink salt.', weight: 30 },
        { _id: '2', name: 'Peri Peri Makhana (100g)', slug: 'peri-peri-makhana-100g', price: 249, originalPrice: 299, category: 'Flavoured Makhanas', thumbnail: '/images/products/peri-peri-makhana.svg', ratings: 4.6, numReviews: 89, isBestSeller: false, stock: 120, shortDescription: 'Spicy peri peri flavoured fox nuts.' },
        { _id: '3', name: 'Classic Cheese Makhana (100g)', slug: 'classic-cheese-makhana-100g', price: 249, originalPrice: 299, category: 'Flavoured Makhanas', thumbnail: '/images/products/classic-cheese-makhana.svg', ratings: 4.7, numReviews: 92, isBestSeller: true, stock: 110, shortDescription: 'Creamy cheese flavored fox nuts.' },
        { _id: '4', name: 'Vegetable Chips (100g)', slug: 'vegetable-chips-100g', price: 119, originalPrice: 159, category: 'Air Fried Chips', thumbnail: '/images/products/vegetable-chips.svg', ratings: 4.7, numReviews: 145, isBestSeller: true, stock: 150, shortDescription: 'Air-fried vegetable chips with 70% less oil.' },
        { _id: '5', name: 'Sweet Potato Chips (100g)', slug: 'sweet-potato-chips-100g', price: 119, originalPrice: 159, category: 'Air Fried Chips', thumbnail: '/images/products/sweet-potato-chips.svg', ratings: 4.8, numReviews: 167, isBestSeller: true, stock: 140, shortDescription: 'Naturally sweet and nutritious air-fried chips.' },
        { _id: '6', name: 'Beetroot Chips (100g)', slug: 'beetroot-chips-100g', price: 119, originalPrice: 159, category: 'Air Fried Chips', thumbnail: '/images/products/beetroot-chips.svg', ratings: 4.6, numReviews: 98, isBestSeller: false, stock: 130, shortDescription: 'Antioxidant-rich air-fried beetroot chips.' },
        { _id: '7', name: 'Millet Cookies (100g)', slug: 'millet-cookies-100g', price: 149, originalPrice: 199, category: 'No Sugar No Palm Oil Millet Cookies', thumbnail: '/images/products/millet-cookies.svg', ratings: 4.9, numReviews: 134, isBestSeller: true, stock: 120, shortDescription: 'Nutritious millet cookies, zero sugar, no palm oil.' },
        { _id: '8', name: 'Pudina Makhana (100g)', slug: 'pudina-makhana-100g', price: 249, originalPrice: 299, category: 'Flavoured Makhanas', thumbnail: '/images/products/pudina-makhana.svg', ratings: 4.5, numReviews: 65, isBestSeller: false, stock: 100, shortDescription: 'Refreshing mint flavored fox nuts.' },
        { _id: '9', name: 'Cream and Onion Makhana (100g)', slug: 'cream-and-onion-makhana-100g', price: 249, originalPrice: 299, category: 'Flavoured Makhanas', thumbnail: '/images/products/cream-onion-makhana.svg', ratings: 4.6, numReviews: 75, isBestSeller: false, stock: 95, shortDescription: 'Rich cream and onion flavored fox nuts.' },
    ];

    // Fetch products based on filters
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params: any = {};
                if (category && category !== 'All') {
                    params.category = category;
                }
                if (search) {
                    params.search = search;
                }
                if (sort) {
                    params.sort = sort;
                }
                const { data } = await api.get('/products', { params });
                setProducts(data);
            } catch (err) {
                console.warn('API error fetching products, using fallbacks:', err);
                let filtered = [...mockProducts];
                if (category && category !== 'All') {
                    filtered = filtered.filter(p => p.category?.toLowerCase() === category.toLowerCase());
                }
                if (search) {
                    const query = search.toLowerCase().trim();
                    filtered = filtered.filter(p => 
                        p.name?.toLowerCase().includes(query) || 
                        (p.shortDescription && p.shortDescription.toLowerCase().includes(query)) ||
                        p.category?.toLowerCase().includes(query)
                    );
                }
                if (sort === 'price_asc') {
                    filtered.sort((a, b) => a.price - b.price);
                } else if (sort === 'price_desc') {
                    filtered.sort((a, b) => b.price - a.price);
                } else if (sort === 'rating') {
                    filtered.sort((a, b) => b.ratings - a.ratings);
                }
                setProducts(filtered);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category, search, sort]);

    const catUrl = searchParams.get('category');
    useEffect(() => {
        if (catUrl) setCategory(catUrl);
    }, [catUrl]);



    return (
        <div className="min-h-screen pt-24 pb-16" style={{ background: '#fafaf7' }}>
            <div className="page-container">
                {/* Header */}
                <div className="text-center mb-10 animate-fadeInUp">
                    <div className="badge badge-primary mb-3">Our Products</div>
                    <h1 className="section-title animate-fadeInUp delay-100">Shop ShuddhEats</h1>
                    <p className="section-subtitle mt-2 max-w-lg mx-auto animate-fadeInUp delay-200">Discover our range of clean, air-fried, and nutritious snacks</p>
                </div>

                {/* Search + Filter Bar */}
                <div className="mb-6 sm:mb-8 animate-slideInTop">
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
                                    className="input-field pl-9 sm:pl-12 w-full text-sm sm:text-base" />
                                {search && <button onClick={() => setSearch('')} className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-gray-400" /></button>}
                            </div>
                            <select value={sort} onChange={e => setSort(e.target.value)} className="input-field w-full sm:w-48 text-sm sm:text-base">
                                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                        </div>
                        {/* View Toggle */}
                        <div className="flex gap-2 p-1 rounded-lg self-start sm:self-auto" style={{ background: '#f0f4ed' }}>
                            <button
                                onClick={() => setViewType('grid')}
                                className={`p-2 rounded transition-all text-xs sm:text-sm`}
                                title="Grid View"
                            >
                                <Grid3x3 className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: viewType === 'grid' ? '#475d2a' : '#999' }} />
                            </button>
                            <button
                                onClick={() => setViewType('list')}
                                className={`p-2 rounded transition-all text-xs sm:text-sm`}
                                title="List View"
                            >
                                <List className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: viewType === 'list' ? '#475d2a' : '#999' }} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                    {CATEGORIES.map((c, i) => (
                        <button key={c} onClick={() => setCategory(c)}
                            className={`px-3 sm:px-5 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all animate-fadeInUp`}
                            style={category === c ? { background: '#475d2a', color: 'white', boxShadow: '0 8px 16px rgba(46,82,52,0.3)', animationDelay: `${i * 0.05}s` } : { background: 'white', color: '#5a6a4a', animationDelay: `${i * 0.05}s` }}>
                            {c}
                        </button>
                    ))}
                </div>

                {/* Products Grid/List */}
                {loading ? (
                    <div className={viewType === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6" : "space-y-3 sm:space-y-4"}>
                        {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-80 sm:h-96" />)}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12 sm:py-20 animate-fadeInUp">
                        <div className="text-5xl sm:text-6xl mb-4 animate-bounce-slow">🍃</div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-600">No products found</h3>
                        <p className="text-sm sm:text-base text-gray-400 mt-2">Try adjusting your filters</p>
                    </div>
                ) : viewType === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 animate-fadeInUp">
                        {products.map((p) => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-4 animate-fadeInUp">
                        {products.map((p) => (
                            <div key={p._id} className="card p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 hover:shadow-lg transition-shadow">
                                <div className="w-full sm:w-24 h-32 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-[#f0f4ed] flex items-center justify-center">
                                    <img src={p.thumbnail} alt={p.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-2 sm:gap-4 mb-2 sm:mb-3">
                                        <div>
                                            <h3 className="font-bold text-sm sm:text-base hover:text-[#475d2a] transition-colors line-clamp-2">{p.name}</h3>
                                            <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-1">{p.shortDescription}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-base sm:text-lg font-extrabold block" style={{ color: '#475d2a' }}>₹{p.price}</span>
                                            {p.originalPrice && (
                                                <span className="text-xs text-gray-400 line-through">₹{p.originalPrice}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-auto">
                                        <div className="flex gap-2 items-center">
                                            <span className="badge badge-primary text-xs">{p.category}</span>
                                            {p.isBestSeller && <span className="badge text-xs" style={{ background: 'rgb(223, 196, 172)', color: 'rgb(84, 82, 82)' }}>⭐ Best Seller</span>}
                                        </div>
                                        <button
                                            onClick={() => router.push(`/shop/${p.slug}`)}
                                            className="btn-primary text-xs py-2 px-3 sm:px-4 w-full sm:w-auto"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin">Loading...</div></div>}>
            <ShopContent />
        </Suspense>
    );
}
