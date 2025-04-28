import { useState } from "react";
import { Link, useLocation } from "wouter";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Menu, User } from "lucide-react";

const Header = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Logo />
        
        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/listings">
            <div className={`nav-item font-medium hover:text-primary transition cursor-pointer ${location === '/listings' ? 'text-primary' : 'text-neutral-dark'}`}>
              Explore
            </div>
          </Link>
          <Link href={user?.role === 'host' ? "/host/dashboard" : "/become-host"}>
            <div className={`nav-item font-medium hover:text-primary transition cursor-pointer ${location === '/host/dashboard' || location === '/become-host' ? 'text-primary' : 'text-neutral-dark'}`}>
              Host
            </div>
          </Link>
          <Link href="/about">
            <div className={`nav-item font-medium hover:text-primary transition cursor-pointer ${location === '/about' ? 'text-primary' : 'text-neutral-dark'}`}>
              About
            </div>
          </Link>
          <Link href="/personas">
            <div className={`nav-item font-medium hover:text-primary transition cursor-pointer ${location === '/personas' ? 'text-primary' : 'text-neutral-dark'}`}>
              Personas
            </div>
          </Link>
          <Link href="/contact">
            <div className={`nav-item font-medium hover:text-primary transition cursor-pointer ${location === '/contact' ? 'text-primary' : 'text-neutral-dark'}`}>
              Contact
            </div>
          </Link>
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link href="/become-host">
                <div className="hidden md:inline-block px-4 py-2 text-primary hover:text-white hover:bg-primary rounded-full transition duration-300 border border-primary cursor-pointer">
                  Become a host
                </div>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full p-2 border border-gray-200 hover:shadow-md transition">
                    <Menu className="w-4 h-4 mr-2" />
                    <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/register">Sign up</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/login">Log in</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/become-host">Host your property</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/help">Help Center</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full p-2 border border-gray-200 hover:shadow-md transition">
                  <Menu className="w-4 h-4 mr-2" />
                  <Avatar className="w-8 h-8">
                    {user.profilePicture ? (
                      <AvatarImage src={user.profilePicture} alt={user.firstName} />
                    ) : (
                      <AvatarFallback>{getInitials(user.firstName)}</AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {user.role === 'guest' && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                )}
                {user.role === 'host' && (
                  <DropdownMenuItem asChild>
                    <Link href="/host/dashboard">Host Dashboard</Link>
                  </DropdownMenuItem>
                )}
                {user.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user.role !== 'host' && (
                  <DropdownMenuItem asChild>
                    <Link href="/become-host">Become a Host</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/help">Help Center</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          className="md:hidden flex" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6 text-neutral-dark" />
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/listings">
              <div className="block px-3 py-2 rounded-md text-base font-medium text-neutral-dark hover:bg-gray-100 cursor-pointer">
                Explore
              </div>
            </Link>
            <Link href={user?.role === 'host' ? "/host/dashboard" : "/become-host"}>
              <div className="block px-3 py-2 rounded-md text-base font-medium text-neutral-dark hover:bg-gray-100 cursor-pointer">
                Host
              </div>
            </Link>
            <Link href="/about">
              <div className="block px-3 py-2 rounded-md text-base font-medium text-neutral-dark hover:bg-gray-100 cursor-pointer">
                About
              </div>
            </Link>
            <Link href="/personas">
              <div className="block px-3 py-2 rounded-md text-base font-medium text-neutral-dark hover:bg-gray-100 cursor-pointer">
                Personas
              </div>
            </Link>
            <Link href="/contact">
              <div className="block px-3 py-2 rounded-md text-base font-medium text-neutral-dark hover:bg-gray-100 cursor-pointer">
                Contact
              </div>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
