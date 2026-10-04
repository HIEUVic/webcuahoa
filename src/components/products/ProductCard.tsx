import { Product } from '../../types'
import { recordProductClick } from '../../services/api'
import StarRating from '../common/StarRating'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const handleClickProduct = () => {
    // Tự động ghi nhận click ngầm lên Supabase mà khách không cần đăng nhập
    recordProductClick(product.id)
  }

  // Nhãn badge thương hiệu theo nền tảng
  const renderPlatformBadge = () => {
    switch (product.platform) {
      case 'lazada':
        return (
          <div
            className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{ background: 'rgba(15, 20, 110, 0.92)', backdropFilter: 'blur(4px)' }}
          >
            <span className="text-white text-[10px] font-bold">Lazada</span>
          </div>
        )
      case 'tiktok':
        return (
          <div
            className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{ background: 'rgba(0, 0, 0, 0.88)', backdropFilter: 'blur(4px)' }}
          >
            <span className="text-white text-[10px] font-bold">TikTok</span>
          </div>
        )
      case 'taobao':
        return (
          <div
            className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{ background: 'rgba(255, 80, 0, 0.92)', backdropFilter: 'blur(4px)' }}
          >
            <span className="text-white text-[10px] font-bold">Taobao</span>
          </div>
        )
      case 'shopee':
      default:
        return (
          <div
            className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{ background: 'rgba(238, 77, 45, 0.92)', backdropFilter: 'blur(4px)' }}
          >
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
            </svg>
            <span className="text-white text-xs font-bold">Shopee</span>
          </div>
        )
    }
  }

  return (
    <a
      href={product.affiliate_url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClickProduct}
      className="block rounded-2xl overflow-hidden shadow-sm transition-transform active:scale-95"
      style={{ background: '#fff', border: '1px solid #f3e8ff' }}
    >
      <div className="relative aspect-square bg-gray-50">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.is_hot && (
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
        {renderPlatformBadge()}
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