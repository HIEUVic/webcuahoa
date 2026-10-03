interface CategoryFilterProps {
  categories: string[]
  activeCategory: string
  onSelectCategory: (category: string) => void
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <section className="px-4 mt-4">
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none' }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className="shrink-0 px-4 py-2 rounded-2xl text-sm font-medium transition-all active:scale-95"
            style={
              activeCategory === cat
                ? {
                    background:
                      'linear-gradient(135deg, rgb(156, 112, 91), rgb(119, 79, 66), rgb(79, 53, 46))',
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(219,39,119,0.15)',
                  }
                : {
                    background: '#fff',
                    color: '#6b7280',
                    border: '1.5px solid #E6C8B7',
                  }
            }
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  )
}