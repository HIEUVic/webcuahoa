import { Product } from '../../types'
import StarRating from '../common/StarRating'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <a
      href={product.shopeeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl overflow-hidden shadow-sm transition-transform active:scale-95"
      style={{ background: '#fff', border: '1px solid #f3e8ff' }}
    >
      <div className="relative aspect-square bg-gray-50">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.hot && (
          <div
            className="absolute top-2 left-2 text-white text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'linear-gradient(135deg, #f87171, #fb923c)' }}
          >
            HOT
          </div>
        )}
        {product.discount && (
          <div
            className="absolute top-2 right-2 text-white text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgb(200, 170, 164)' }}
          >
            {product.discount}
          </div>
        )}
        {/* Shopee badge */}
        <div
          className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg"
          style={{ background: 'rgba(238, 77, 45, 0.92)', backdropFilter: 'blur(4px)' }}
        >
          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
          </svg>
          <span className="text-white text-xs font-bold">Shopee</span>
        </div>
      </div>
      <div className="p-2.5">
        <div className="text-gray-800 text-xs font-medium leading-tight line-clamp-2 mb-1.5">
          {product.name}
        </div>
        <StarRating rating={product.rating} />
        <div
          className="mt-2 w-full py-1.5 rounded-xl text-center text-xs font-semibold text-white"
          style={{
            backgroundImage:
              'linear-gradient(135deg, rgb(156, 112, 91), rgb(119, 79, 66), rgb(79, 53, 46))',
          }}
        >
          Mua ngay →
        </div>
      </div>
    </a>
  )
}