import Logo from "./Logo";
import { Link } from "wouter";
import { 
  FacebookIcon, 
  TwitterIcon, 
  InstagramIcon, 
  LinkedinIcon, 
  Globe, 
  DollarSign 
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neutral-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-6">
              <Logo white size="md" />
            </div>
            <p className="text-gray-400 mb-4">Discover authentic African hospitality with trusted local hosts.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold font-montserrat mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about"><div className="text-gray-400 hover:text-primary transition cursor-pointer">About Us</div></Link></li>
              <li><Link href="/careers"><div className="text-gray-400 hover:text-primary transition cursor-pointer">Careers</div></Link></li>
              <li><Link href="/press"><div className="text-gray-400 hover:text-primary transition cursor-pointer">Press</div></Link></li>
              <li><Link href="/blog"><div className="text-gray-400 hover:text-primary transition cursor-pointer">Blog</div></Link></li>
              <li><Link href="/contact"><div className="text-gray-400 hover:text-primary transition cursor-pointer">Contact</div></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold font-montserrat mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/help"><div className="text-gray-400 hover:text-primary transition cursor-pointer">Help Center</div></Link></li>
              <li><Link href="/safety"><div className="text-gray-400 hover:text-primary transition cursor-pointer">Safety Information</div></Link></li>
              <li><Link href="/cancellation"><div className="text-gray-400 hover:text-primary transition cursor-pointer">Cancellation Options</div></Link></li>
              <li><Link href="/trust"><div className="text-gray-400 hover:text-primary transition cursor-pointer">Trust & Safety</div></Link></li>
              <li><Link href="/report"><div className="text-gray-400 hover:text-primary transition cursor-pointer">Report a Concern</div></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold font-montserrat mb-4">Hosting</h3>
            <ul className="space-y-2">
              <li><Link href="/become-host"><div className="text-gray-400 hover:text-primary transition cursor-pointer">Try Hosting</div></Link></li>
              <li><Link href="/host-resources"><div className="text-gray-400 hover:text-primary transition cursor-pointer">Host Resources</div></Link></li>
              <li><Link href="/community"><div className="text-gray-400 hover:text-primary transition cursor-pointer">Community Forum</div></Link></li>
              <li><Link href="/host-protection"><div className="text-gray-400 hover:text-primary transition cursor-pointer">Host Protection</div></Link></li>
              <li><Link href="/responsible-hosting"><div className="text-gray-400 hover:text-primary transition cursor-pointer">Responsible Hosting</div></Link></li>
            </ul>
          </div>
        </div>
        
        <hr className="border-gray-700 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 StayAfrika. All rights reserved.
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/privacy"><div className="text-gray-400 hover:text-primary transition cursor-pointer">Privacy</div></Link>
            <Link href="/terms"><div className="text-gray-400 hover:text-primary transition cursor-pointer">Terms</div></Link>
            <Link href="/sitemap"><div className="text-gray-400 hover:text-primary transition cursor-pointer">Sitemap</div></Link>
            <div className="flex items-center">
              <Globe className="text-gray-400 mr-2 h-4 w-4" />
              <select className="bg-transparent text-gray-400 border-none focus:ring-0">
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="yo">Yoruba</option>
                <option value="sw">Swahili</option>
              </select>
            </div>
            <div className="flex items-center">
              <DollarSign className="text-gray-400 mr-2 h-4 w-4" />
              <select className="bg-transparent text-gray-400 border-none focus:ring-0">
                <option value="ngn">NGN</option>
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="gbp">GBP</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
