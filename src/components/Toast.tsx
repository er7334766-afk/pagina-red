import { useEffect } from 'react'
import { CheckCircle } from './icons'

interface Props {
  message: string
  onClose: () => void
}

export default function Toast({ message, onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-800 text-white px-5 py-3 rounded-lg shadow-xl text-sm font-medium animate-slide-up">
      <CheckCircle size={16} className="text-emerald-400 shrink-0" />
      {message}
    </div>
  )
}
