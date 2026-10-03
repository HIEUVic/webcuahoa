import { Product } from '../../types'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
  activeCategory: string
  onResetFilter: () => void
}

export default function ProductGrid({
  products,
  activeCategory,
  onResetFilter,
}: ProductGridProps) {
  return (
    <section className="px-4 mt-4 pb-8">
      <div className="flex items-center justify-between mb-3">
        <h2
          className="font-bold text-gray-800"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 17 }}
        >
          {activeCategory === 'Tất cả' ? 'Sản phẩm nổi bật' : activeCategory}
        </h2>
        <span className="text-xs" style={{ color: 'rgb(187, 150, 125)' }}>
          {products.length} sản phẩm
        </span>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🔍</div>
          <div className="text-gray-500 text-sm">Không tìm thấy sản phẩm</div>
          <button
            onClick={onResetFilter}
            className="mt-3 text-sm font-medium px-4 py-2 rounded-xl transition-transform active:scale-95"
            style={{
              background: 'linear-gradient(135deg,#993300,#663300)',
              color: '#fff',
            }}
          >
            Xem tất cả
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  )
}