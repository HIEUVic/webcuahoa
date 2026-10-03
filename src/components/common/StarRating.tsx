interface StarRatingProps {
  rating: number
}

export default function StarRating({ rating }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          viewBox="0 0 12 12"
          className="w-3 h-3"
          fill={s <= Math.round(rating) ? '#f59e0b' : '#e5e7eb'}
        >
          <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.09L6 7.82l-2.78 1.73.53-3.09L1.5 4.27l3.11-.45z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-0.5">{rating}</span>
    </div>
  )
}