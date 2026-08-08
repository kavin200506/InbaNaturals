import LeafDivider from '../components/LeafDivider';
import StarRating from '../components/StarRating';

type Testimonial = {
  name: string;
  location: string;
  rating: number;
  product: string;
  quote: string;
};

const testimonials: Testimonial[] = [];

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="bg-ivory-dark py-14 text-center border-b border-ivory-dark">
        <span className="text-sage text-xs font-medium uppercase tracking-widest">Real Stories</span>
        <h1 className="font-serif text-5xl text-charcoal mt-2 mb-3">Customer Love</h1>
        <LeafDivider />
        <p className="text-charcoal-light mt-4 max-w-md mx-auto text-sm leading-relaxed">
          Don't just take our word for it — hear from our community of natural beauty believers.
        </p>
      </div>

      {/* Overall rating banner */}
      {testimonials.length > 0 && (
        <div className="bg-sage py-10">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <StarRating rating={5} />
              <span className="font-serif text-4xl text-white font-bold">5.0</span>
            </div>
            <p className="text-white/80 text-sm">Early feedback from our first customers</p>
          </div>
        </div>
      )}

      {/* Testimonial cards grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {testimonials.length === 0 && (
          <div className="text-center py-10">
            <p className="text-charcoal text-base font-medium bg-ivory-dark inline-block px-6 py-3 rounded-2xl border border-ivory-dark">
              Early feedback from our first customers coming soon! 🌿
            </p>
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-7 border border-ivory-dark flex flex-col"
            >
              {/* Top */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center font-serif font-bold text-sage text-base">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal text-sm">{t.name}</p>
                    <p className="text-charcoal-light text-xs">{t.location}</p>
                  </div>
                </div>
                <StarRating rating={t.rating} />
              </div>

              {/* Quote */}
              <p className="text-charcoal-light text-sm leading-relaxed flex-1 italic">
                "{t.quote}"
              </p>

              {/* Product tag */}
              <div className="mt-4 pt-4 border-t border-ivory-dark">
                <span className="inline-block bg-sage/10 text-sage text-xs font-medium px-3 py-1 rounded-full">
                  ✓ Verified: {t.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 text-center px-4">
        <div className="max-w-lg mx-auto bg-ivory-dark rounded-3xl p-10 border border-ivory-dark">
          <h2 className="font-serif text-3xl text-charcoal mb-3">Love InbaNaturals?</h2>
          <p className="text-charcoal-light text-sm mb-6 leading-relaxed">
            Share your experience and help others discover the power of natural beauty.
          </p>
          <button className="bg-sage hover:bg-sage-dark text-white font-medium px-8 py-3.5 rounded-2xl transition-colors duration-200">
            Write a Review
          </button>
        </div>
      </section>
    </div>
  );
}
