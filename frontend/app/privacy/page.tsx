export const metadata = {
    title: 'Privacy Policy | ShuddhEats',
    description: 'Privacy Policy for ShuddhEats',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="pt-24 pb-16 page-container max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-[#475d2a]">Privacy Policy</h1>
            <div className="prose prose-green max-w-none text-gray-700">
                <p className="mb-4"><i>Last updated: March 2026</i></p>
                <p className="mb-4">This is a demo Privacy Policy page. We will update this with our official legal text before launching the application.</p>
                <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
                <p className="mb-4">We collect information you provide directly to us when you create an account, place an order, or subscribe to our newsletter.</p>
                <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Information</h2>
                <p className="mb-4">We use the information we collect to provide, maintain, and improve our services, to process transactions, and to send you related information.</p>
                <h2 className="text-2xl font-bold mt-8 mb-4">3. Contact Us</h2>
                <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at hello@shuddheats.com.</p>
            </div>
        </div>
    );
}
