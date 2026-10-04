import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Area, getCroppedImg } from '../../utils/cropImage'

interface ImageCropModalProps {
  imageSrc: string
  onCropComplete: (croppedFile: File, previewUrl: string) => void
  onCancel: () => void
}

export default function ImageCropModal({
  imageSrc,
  onCropComplete,
  onCancel,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [processing, setProcessing] = useState(false)

  const onCropChange = (newCrop: { x: number; y: number }) => {
    setCrop(newCrop)
  }

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom)
  }

  const handleCropComplete = useCallback(
    (_croppedArea: Area, currentCroppedAreaPixels: Area) => {
      setCroppedAreaPixels(currentCroppedAreaPixels)
    },
    []
  )

  const handleDone = async () => {
    if (!croppedAreaPixels) return
    setProcessing(true)
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels)
      if (croppedFile) {
        const previewUrl = URL.createObjectURL(croppedFile)
        onCropComplete(croppedFile, previewUrl)
      }
    } catch (err) {
      console.error('Lỗi khi cắt ảnh:', err)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-60 bg-black/80 flex flex-col items-center justify-between p-4">
      {/* Thanh tiêu đề */}
      <div className="w-full max-w-sm flex items-center justify-between text-white py-2">
        <h3 className="text-sm font-semibold">Kéo & chỉnh vùng hiển thị ảnh</h3>
        <button
          onClick={onCancel}
          className="text-stone-300 hover:text-white text-sm px-2 py-1"
        >
          Hủy
        </button>
      </div>

      {/* Vùng Crop trực quan */}
      <div className="relative w-full max-w-sm aspect-square bg-stone-900 rounded-2xl overflow-hidden my-auto border border-stone-700">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1} // Tỉ lệ vuông 1:1 chuẩn thẻ sản phẩm
          onCropChange={onCropChange}
          onCropComplete={handleCropComplete}
          onZoomChange={onZoomChange}
        />
      </div>

      {/* Thanh điều khiển Zoom và nút xác nhận */}
      <div className="w-full max-w-sm space-y-4 pb-4">
        <div className="flex items-center gap-3 px-2">
          <span className="text-white text-xs">🔍-</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <span className="text-white text-xs">🔍+</span>
        </div>

        <button
          type="button"
          disabled={processing}
          onClick={handleDone}
          className="w-full py-2.5 rounded-xl text-white text-xs font-semibold shadow-lg active:scale-95 transition-all"
          style={{
            backgroundImage:
              'linear-gradient(135deg, rgb(156, 112, 91), rgb(119, 79, 66), rgb(79, 53, 46))',
          }}
        >
          {processing ? 'Đang xử lý...' : '✓ Chọn vùng ảnh này'}
        </button>
      </div>
    </div>
  )
}