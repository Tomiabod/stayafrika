import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface AfricanPatternProps extends HTMLAttributes<HTMLDivElement> {
  opacity?: number;
  color?: string;
}

export const AfricanPattern = ({ 
  className, 
  opacity = 0.05, 
  color = 'E57C23', 
  ...props 
}: AfricanPatternProps) => {
  const patternStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627,25.373a5,5,0,0,0-7.071,0L42.627,30.3l-5-5L42.556,20.3a5,5,0,0,0-7.071-7.071L30.556,18.157l-5-5L30.485,8.224a5,5,0,0,0-7.071-7.071L18.485,6.084a15,15,0,0,0,0,21.213L30.556,39.368a15,15,0,0,0,21.213,0l2.858-2.929A5,5,0,0,0,54.627,25.373Z' fill='%23${color}' fill-opacity='${opacity}'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat'
  };

  return (
    <div className={cn(className)} style={patternStyle} {...props} />
  );
};

export const KentePattern = ({ 
  className, 
  opacity = 0.05, 
  color = 'F8B400', 
  ...props 
}: AfricanPatternProps) => {
  const patternStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h10v10H0V0zm10 10h10v10H10V10z' fill='%23${color}' fill-opacity='${opacity}'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat'
  };

  return (
    <div className={cn(className)} style={patternStyle} {...props} />
  );
};

export const ZigzagPattern = ({ 
  className, 
  opacity = 0.05, 
  color = '025464', 
  ...props 
}: AfricanPatternProps) => {
  const patternStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='12' viewBox='0 0 40 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6.172L6.172 0h5.656L0 11.828V6.172zm40 5.656L28.172 0h5.656L40 6.172v5.656zM6.172 12l12-12h3.656l12 12h-5.656L20 3.828 11.828 12H6.172zm12 0L20 10.172 21.828 12h-3.656z' fill='%23${color}' fill-opacity='${opacity}'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat'
  };

  return (
    <div className={cn(className)} style={patternStyle} {...props} />
  );
};
