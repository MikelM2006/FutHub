import { Star } from 'lucide-react';
import { useState } from 'react';

// interface StarRatingProps se elimina

export function StarRating({ value, onChange, max = 5 }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[...Array(max)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            className="transition-colors"
          >
            <Star
              className={`w-6 h-6 ${
                starValue <= (hover || value)
                  ? 'fill-[#16a34a] text-[#16a34a]'
                  : 'fill-none text-[#d1d5db]'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}