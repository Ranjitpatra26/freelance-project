import Link from 'next/link';
import Image from 'next/image';
import { Leaf, Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer style={{ background: '#475d2a' }} className="text-white">
            <div className="page-container pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="h-24 w-24 rounded-full overflow-hidden flex items-center justify-center mb-6" style={{ background: 'rgba(255,255,255,0.95)' }}>
                            <Image
                                src="/images/logo-se-circle.png"
                                alt="ShuddhEats Logo"
                                width={96}
                                height={96}
                                className="h-full w-full object-contain"
                            />
                        </div>
                        <p className="text-sm leading-relaxed opacity-80 mb-6">
                            Clean ingredients, roasted goodness, and sustainable packaging. Snacking the way nature intended.
                        </p>
                        <div className="flex gap-3">
                            <a href="https://www.instagram.com/_shuddheats_?utm_source=qr&igsh=MTZ2OXAzMDBreHBoMA==" target="_blank" rel="noopener noreferrer"
                                className="w-9 h-9 rounded-xl flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                                style={{ background: 'rgba(255,255,255,0.1)' }}>
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-xl flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                                style={{ background: 'rgba(255,255,255,0.1)' }}>
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-xl flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                                style={{ background: 'rgba(255,255,255,0.1)' }}>
                                <Facebook className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-wider mb-5 opacity-60">Quick Links</h4>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: 'Shop', href: '/shop' },
                                { label: 'About Us', href: '/about' },
                                { label: 'Contact', href: '/contact' },
                                { label: 'Track Order', href: '/track' },
                            ].map(l => (
                                <Link key={l.href} href={l.href} className="text-sm opacity-75 hover:opacity-100 hover:text-[rgb(223,196,172)] transition-colors">{l.label}</Link>
                            ))}
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-wider mb-5 opacity-60">Categories</h4>
                        <div className="flex flex-col gap-3">
                            {['Flavoured Makhanas', 'Air Fried Chips', 'No Sugar No Palm Oil Millet Cookies'].map(c => (
                                <Link key={c} href={`/shop?category=${encodeURIComponent(c)}`}
                                    className="text-sm opacity-75 hover:opacity-100 hover:text-[rgb(223,196,172)] transition-colors">{c}</Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-wider mb-5 opacity-60">Get in Touch</h4>
                        <div className="flex flex-col gap-4">
                            {[
                                { Icon: Mail, text: 'hello@shuddheats.com' },
                                { Icon: Phone, text: '+91 98765 43210' },
                                { Icon: MapPin, text: 'Mumbai, Maharashtra' },
                            ].map(({ Icon, text }) => (
                                <div key={text} className="flex items-center gap-3 text-sm opacity-75">
                                    <Icon className="w-4 h-4 shrink-0" />
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs opacity-50">
                    <p>© 2026 shuddheats.co.in - All rights reserved. Made with 💚 in India.</p>
                    <div className="flex gap-4">
                        <Link href="/privacy" className="hover:opacity-100 transition-opacity">Privacy Policy</Link>
                        <Link href="/terms" className="hover:opacity-100 transition-opacity">Terms of Service</Link>
                        <Link href="/refund" className="hover:opacity-100 transition-opacity">Refund Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
