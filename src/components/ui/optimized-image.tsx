import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export const OptimizedImage = ({
  src,
  alt,
  className,
  loading = 'lazy',
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Convert image path to WebP
  const webpSrc = src.replace(/\.(png|jpe?g)$/, '.webp');

  useEffect(() => {
    const img = new Image();
    img.src = webpSrc;
    img.onload = () => setIsLoaded(true);
  }, [webpSrc]);

  return (
    <picture>
      <source type="image/webp" srcSet={webpSrc} />
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={cn(
          'transition-opacity duration-300',
          !isLoaded && 'opacity-70',
          isLoaded && 'opacity-100',
          className
        )}
        {...props}
      />
    </picture>
  );
}; 