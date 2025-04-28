import React from 'react';
import { Helmet } from 'react-helmet';
import { ZigzagPattern } from '../components/africanPatterns';

const Personas = () => {
  return (
    <div className="relative">
      <Helmet>
        <title>User Personas | StayAfrika</title>
      </Helmet>
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <ZigzagPattern className="absolute top-0 right-0 w-full h-full opacity-5" />
      </div>
      
      <div className="container mx-auto px-4 py-12 max-w-5xl relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-primary">StayAfrika User Personas</h1>
        
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-primary">Local Hosts</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Persona 1: Adeola */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-primary">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary/60 flex items-center justify-center text-white text-2xl font-bold">AJ</div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold">Adeola Johnson</h3>
                  <p className="text-gray-600">The Property Investor</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="px-3 py-1 bg-gray-100 rounded-full">42 years old</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">Lagos, Nigeria</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">Bank Executive</span>
                </div>
                
                <div>
                  <h4 className="font-semibold text-primary mb-1">Background</h4>
                  <p className="text-gray-700">Adeola purchased two apartments as investment properties five years ago. She previously used a local property manager who rented them as long-term leases, but she's frustrated with low returns and maintenance issues.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-primary mb-1">Goals</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Generate more income from existing properties</li>
                    <li>Minimize personal involvement in day-to-day management</li>
                    <li>Protect properties from damage</li>
                    <li>Build a retirement investment portfolio</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-primary mb-1">Pain Points</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Doesn't have time to manage bookings</li>
                    <li>Worried about property security</li>
                    <li>Uncertain about pricing strategy</li>
                    <li>Has experienced payment delays</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-primary mb-1">Channels</h4>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-3 py-1 bg-primary/10 rounded-full">Facebook Groups</span>
                    <span className="px-3 py-1 bg-primary/10 rounded-full">WhatsApp</span>
                    <span className="px-3 py-1 bg-primary/10 rounded-full">Email</span>
                    <span className="px-3 py-1 bg-primary/10 rounded-full">Instagram</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Persona 2: Emmanuel */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-primary">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary/60 flex items-center justify-center text-white text-2xl font-bold">EO</div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold">Emmanuel Oladele</h3>
                  <p className="text-gray-600">The Accidental Host</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="px-3 py-1 bg-gray-100 rounded-full">34 years old</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">Abuja (property in Lagos)</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">Tech Entrepreneur</span>
                </div>
                
                <div>
                  <h4 className="font-semibold text-primary mb-1">Background</h4>
                  <p className="text-gray-700">Emmanuel relocated to Abuja for business two years ago but kept his Lagos apartment. He's been leaving it empty except when he visits Lagos for business trips. He's heard from friends about the short-term rental market.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-primary mb-1">Goals</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Turn his unused property into income</li>
                    <li>Keep apartment available for occasional visits</li>
                    <li>Minimal hands-on management</li>
                    <li>Learn about the short-term rental business</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-primary mb-1">Pain Points</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Lives in a different city from his property</li>
                    <li>No experience with hospitality services</li>
                    <li>Concerned about remote management</li>
                    <li>Doesn't know how to price his property</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-primary mb-1">Channels</h4>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-3 py-1 bg-primary/10 rounded-full">Twitter/X</span>
                    <span className="px-3 py-1 bg-primary/10 rounded-full">WhatsApp</span>
                    <span className="px-3 py-1 bg-primary/10 rounded-full">Webinars</span>
                    <span className="px-3 py-1 bg-primary/10 rounded-full">LinkedIn</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-primary">Travelers & Tourists</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Persona 1: Sarah */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-accent">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-accent to-accent/60 flex items-center justify-center text-white text-2xl font-bold">SW</div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold">Sarah Williams</h3>
                  <p className="text-gray-600">The Diaspora Returnee</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="px-3 py-1 bg-gray-100 rounded-full">37 years old</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">London, UK</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">Healthcare Admin</span>
                </div>
                
                <div>
                  <h4 className="font-semibold text-accent mb-1">Background</h4>
                  <p className="text-gray-700">Born in the UK to Nigerian parents and maintains strong connections to her heritage. Visits family in Lagos regularly and wants more independence during her visits.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-accent mb-1">Goals</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Find comfortable, secure accommodations</li>
                    <li>Experience authentic Nigerian culture</li>
                    <li>Potentially invest in Nigerian property</li>
                    <li>Connect with local experiences</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-accent mb-1">Pain Points</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Concerns about safety and security</li>
                    <li>Finding Western-standard accommodations</li>
                    <li>Unsure which areas are convenient</li>
                    <li>Past bad experiences with local lodging</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-accent mb-1">Channels</h4>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-3 py-1 bg-accent/10 rounded-full">Instagram</span>
                    <span className="px-3 py-1 bg-accent/10 rounded-full">Facebook Groups</span>
                    <span className="px-3 py-1 bg-accent/10 rounded-full">Travel Influencers</span>
                    <span className="px-3 py-1 bg-accent/10 rounded-full">TripAdvisor</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Persona 2: Michael */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-accent">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-accent to-accent/60 flex items-center justify-center text-white text-2xl font-bold">MC</div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold">Michael Chen</h3>
                  <p className="text-gray-600">The Business Traveler</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="px-3 py-1 bg-gray-100 rounded-full">45 years old</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">Shanghai, China</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">Business Owner</span>
                </div>
                
                <div>
                  <h4 className="font-semibold text-accent mb-1">Background</h4>
                  <p className="text-gray-700">Runs a growing business expanding into West African markets. Making first trips to Lagos to establish business connections and potentially open a local office.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-accent mb-1">Goals</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Find reliable, business-friendly accommodations</li>
                    <li>Stay in convenient areas for meetings</li>
                    <li>Experience some local culture in downtime</li>
                    <li>Understand Nigerian business environment</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-accent mb-1">Pain Points</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Language barriers and cultural differences</li>
                    <li>Uncertainty about safe locations</li>
                    <li>Needs reliable internet and workspace</li>
                    <li>Concerned about transportation</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-accent mb-1">Channels</h4>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-3 py-1 bg-accent/10 rounded-full">LinkedIn</span>
                    <span className="px-3 py-1 bg-accent/10 rounded-full">Booking platforms</span>
                    <span className="px-3 py-1 bg-accent/10 rounded-full">Business networks</span>
                    <span className="px-3 py-1 bg-accent/10 rounded-full">WeChat</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Persona 3: Amara and David */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-accent">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-accent to-accent/60 flex items-center justify-center text-white text-2xl font-bold">A&D</div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold">Amara & David Osei</h3>
                  <p className="text-gray-600">The Leisure Travelers</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="px-3 py-1 bg-gray-100 rounded-full">28 & 31 years old</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">Accra, Ghana</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">Young Professionals</span>
                </div>
                
                <div>
                  <h4 className="font-semibold text-accent mb-1">Background</h4>
                  <p className="text-gray-700">Young Ghanaian couple who love exploring African cities for weekend getaways. Tech-savvy, Instagram-active travelers interested in urban experiences, food, and culture.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-accent mb-1">Goals</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Experience Lagos nightlife and culture</li>
                    <li>Stay in stylish, Instagram-worthy accommodations</li>
                    <li>Find unique local experiences</li>
                    <li>Meet like-minded young professionals</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-accent mb-1">Pain Points</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Finding aesthetically pleasing accommodations</li>
                    <li>Concerns about overpriced tourist traps</li>
                    <li>Need trusted local recommendations</li>
                    <li>Limited knowledge navigating Lagos</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-accent mb-1">Channels</h4>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-3 py-1 bg-accent/10 rounded-full">Instagram</span>
                    <span className="px-3 py-1 bg-accent/10 rounded-full">TikTok</span>
                    <span className="px-3 py-1 bg-accent/10 rounded-full">Travel blogs</span>
                    <span className="px-3 py-1 bg-accent/10 rounded-full">Booking apps</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="bg-gray-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4 text-primary">Marketing Approach</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3 text-primary">For Local Hosts</h3>
              <ul className="list-disc list-outside ml-5 space-y-2 text-gray-700">
                <li>Partner with property owners via Facebook Groups, WhatsApp communities</li>
                <li>Create a "Become a Host" onboarding page with a clear value offer (earn more, we manage everything)</li>
                <li>Free onboarding Zoom session: "How to Make Passive Income with StayAfrika"</li>
                <li>Simple sign-up flow: List property → KYC Verification → Photoshoot (optional) → Go Live</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-3 text-primary">For Travelers & Tourists</h3>
              <ul className="list-disc list-outside ml-5 space-y-2 text-gray-700">
                <li>Launch social media campaigns showcasing beautiful stays + experiences in Lagos</li>
                <li>SEO: Blogs like "Top 10 Places to Stay in Lagos" featuring StayAfrika listings</li>
                <li>Partnership with Nigerian travel influencers</li>
                <li>Easy "Book Now" flow on website: no login required until final payment</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Personas;