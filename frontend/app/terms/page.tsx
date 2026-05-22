export const metadata = {
    title: 'Terms of Service | ShuddhEats',
    description: 'Terms of Service for ShuddhEats',
};

export default function TermsOfServicePage() {
    return (
        <div className="pt-24 pb-16 page-container max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-[#475d2a]">Terms of Service</h1>
            <div className="prose prose-green max-w-none text-gray-700">
                <p className="mb-4"><i>Last updated: March 2026</i></p>
                <p className="mb-4">This is a demo Terms of Service page. We will update this with our official legal tracking text before launching the application.</p>
                <h2 className="text-2xl font-bold mt-8 mb-4">1. Agreement to Terms</h2>
                <p className="mb-4">By accessing or using our website, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.</p>
                <h2 className="text-2xl font-bold mt-8 mb-4">2. Purchases</h2>
                <p className="mb-4">If you wish to purchase any product or service made available through the Service, you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.</p>
            </div>
        </div>
    );
}
