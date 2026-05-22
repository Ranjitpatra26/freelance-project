export const metadata = {
    title: 'Refund Policy | ShuddhEats',
    description: 'Refund Policy for ShuddhEats',
};

export default function RefundPolicyPage() {
    return (
        <div className="pt-24 pb-16 page-container max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-[#475d2a]">Refund Policy</h1>
            <div className="prose prose-green max-w-none text-gray-700">
                <p className="mb-4"><i>Last updated: March 2026</i></p>
                <p className="mb-4">This is a demo Refund Policy page. We will update this with our official legal tracking text before launching the application.</p>
                <h2 className="text-2xl font-bold mt-8 mb-4">Returns</h2>
                <p className="mb-4">Our policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately we can’t offer you a refund or exchange.</p>
                <p className="mb-4">To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.</p>
                <h2 className="text-2xl font-bold mt-8 mb-4">Refunds</h2>
                <p className="mb-4">Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.</p>
            </div>
        </div>
    );
}
