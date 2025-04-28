import { Star, StarHalf } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah O.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    rating: 5,
    text: "The apartment in Lekki was exactly as pictured. Amazing views, clean space, and the host was so helpful with local recommendations. Will definitely use StayAfrika for my next trip!"
  },
  {
    id: 2,
    name: "James K.",
    image: "https://images.unsplash.com/photo-1522556189639-b150ed9c4330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    rating: 4.5,
    text: "As a business traveler to Lagos, I needed a reliable place with good internet. My StayAfrika booking exceeded expectations with a workspace and all amenities I needed. Seamless experience."
  },
  {
    id: 3,
    name: "Adeola T.",
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    isHost: true,
    text: "Hosting on StayAfrika has been rewarding. The platform makes it easy to list my property and manage bookings. I've met amazing guests and the support team is always responsive when I need help."
  }
];

const Testimonials = () => {
  // Helper function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-accent text-accent" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-accent text-accent" />);
    }
    
    return stars;
  };
  
  return (
    <section className="py-16 bg-neutral-light">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold font-montserrat text-neutral-dark text-center mb-12">What Our Community Says</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold font-montserrat">{testimonial.name}</h4>
                  {testimonial.isHost ? (
                    <p className="text-sm text-gray-500">Host since 2023</p>
                  ) : (
                    <div className="flex text-accent">
                      {renderStars(testimonial.rating)}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-gray-600 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
