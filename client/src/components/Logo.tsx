import { Link } from "wouter";

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  white?: boolean;
}

const Logo = ({ size = 'md', white = false }: LogoProps) => {
  const sizes = {
    sm: "w-6 h-6 text-2xl",
    md: "w-8 h-8 text-2xl",
    lg: "w-10 h-10 text-3xl"
  };

  return (
    <Link href="/">
      <div className="flex items-center space-x-2 cursor-pointer">
        <svg 
          className={`${sizes[size]} ${white ? "text-primary" : "text-primary"}`} 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <span className={`font-bold font-montserrat ${white ? "text-white" : "text-secondary"}`}>
          Stay<span className="text-primary">Afrika</span>
        </span>
      </div>
    </Link>
  );
};

export default Logo;
