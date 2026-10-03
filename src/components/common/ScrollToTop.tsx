export default function ScrollToTop() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={handleScrollToTop}
      className="fixed bottom-6 right-4 w-11 h-11 rounded-full shadow-lg flex items-center justify-center text-white transition-transform active:scale-90 z-50"
      style={{
        backgroundImage:
          'linear-gradient(135deg, rgb(156, 112, 91), rgb(119, 79, 66), rgb(79, 53, 46))',
      }}
      aria-label="Lên đầu trang"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="w-5 h-5"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  )
}