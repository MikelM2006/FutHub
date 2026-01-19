import { Circle } from 'lucide-react';

// interface LogoProps se elimina

export function Logo({ size = 'md', variant = 'dark' }) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-[30px]',
    lg: 'text-[40px]',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textColor = variant === 'light' ? 'text-white' : 'text-[#111827]';

  return (
    <div className="flex items-center gap-2">
      {/* Ícono de balón de fútbol estilizado */}
      <div className="relative">
        <Circle 
          className={`${iconSizes[size]} text-[#16a34a] fill-[#16a34a]`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Patrón de balón */}
          <svg className={iconSizes[size]} viewBox="0 0 24 24" fill="none">
            <path d="M12 4L14 8L12 12L8 12L6 8L12 4Z" fill="white" />
            <path d="M14 8L18 9L16 13L12 12L14 8Z" fill="white" opacity="0.8" />
            <path d="M6 8L8 12L6 16L2 15L6 8Z" fill="white" opacity="0.8" />
            {/* ... (más paths si los tenías) ... */}
          </svg>
        </div>
      </div>
      <span className={`${sizeClasses[size]} ${textColor} font-bold`}>
        Futhub
      </span>
    </div>
  );
}