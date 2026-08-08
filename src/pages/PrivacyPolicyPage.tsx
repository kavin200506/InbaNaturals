import LeafDivider from '../components/LeafDivider';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-ivory/30">
      <div className="bg-ivory-dark py-14 text-center border-b border-ivory-dark">
        <h1 className="font-serif text-5xl text-charcoal mb-3">Privacy Policy</h1>
        <LeafDivider />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl p-8 border border-ivory-dark shadow-sm space-y-4">
          <p className="text-charcoal-light text-sm leading-relaxed">
            We collect only the information you choose to share with us — your name,
            phone number, email address, and any message content — when you use our
            contact form or reach out to us via WhatsApp. This information is used
            solely to respond to your inquiry, process your order, and provide customer
            support. We do not sell, rent, or share your personal information with third
            parties for marketing purposes. Order and delivery details may be shared
            with our courier partners solely for the purpose of fulfilling your order.
            We do not store payment information — all payments are handled directly
            between you and us via the payment method agreed upon at the time of order
            confirmation. You may request that we delete your contact information from
            our records at any time by emailing us. This website does not currently use
            tracking cookies or third-party advertising trackers beyond standard
            analytics to understand site traffic. If our practices change, we will
            update this policy accordingly.
          </p>
        </div>
      </div>
    </div>
  );
}
