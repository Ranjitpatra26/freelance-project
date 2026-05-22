'use client';
import { useState } from 'react';

export default function OurStory() {
    const [activeTab, setActiveTab] = useState('farm');

    const content = {
        farm: {
            title: 'Farm Fresh',
            description: 'We partner with Indian farmers who grow clean, seasonal ingredients using mindful methods. No shortcuts, no nasties, just traceable produce picked at peak, so each bite begins natural, honest, and homegrown.'
        },
        chef: {
            title: 'Chef Crafted',
            description: 'Our expert chefs carefully craft every recipe using traditional techniques and premium ingredients. Each snack is made with precision, passion, and purpose to deliver exceptional taste and quality.'
        },
        family: {
            title: 'Family First',
            description: 'We believe in creating snacks that bring families together. Every product is made with care, keeping health and happiness in mind, so you can share wholesome moments with your loved ones.'
        }
    };

    const current = content[activeTab as keyof typeof content];

    return (
        <section className="py-6 bg-white">
            <div className="page-container">
                {/* Heading */}
                <div className="text-center mb-4">
                    <h2 className="text-2xl md:text-3xl font-bold">
                        Grown, Crafted, <span className="text-red-500 italic">Shared.</span>
                    </h2>
                </div>

                {/* Toggle Buttons - Below Heading */}
                <div className="flex justify-center mb-6">
                    <div className="flex gap-0 border-2 border-gray-300 rounded-full p-1 bg-white w-fit">
                    <button
                        onClick={() => setActiveTab('farm')}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                            activeTab === 'farm'
                                ? 'bg-[#475d2a] text-white'
                                : 'bg-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Farm Fresh
                    </button>
                    <button
                        onClick={() => setActiveTab('chef')}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                            activeTab === 'chef'
                                ? 'bg-[#475d2a] text-white'
                                : 'bg-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Chef Crafted
                    </button>
                    <button
                        onClick={() => setActiveTab('family')}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                            activeTab === 'family'
                                ? 'bg-[#475d2a] text-white'
                                : 'bg-transparent text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Family First
                    </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                    {/* Left - Text Content */}
                    <div className="order-2 lg:order-1">
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                            {current.description}
                        </p>
                    </div>

                    {/* Right - Illustration Placeholder */}
                    <div className="order-1 lg:order-2">
                        <div className="bg-gradient-to-b from-yellow-100 to-green-100 rounded-lg p-4 flex items-center justify-center min-h-48">
                            <div className="text-center">
                                <div className="text-4xl mb-2">🌾</div>
                                <div className="text-4xl mb-2">👨‍🍳</div>
                                <div className="text-4xl">🥗</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
