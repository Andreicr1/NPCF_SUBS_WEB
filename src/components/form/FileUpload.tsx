import React from 'react'

type FileItem = { file: File; status: 'pendente' | 'enviado' | 'erro' }

type Props = {
  onFiles?: (files: File[]) => void
  accept?: string
}

export default function FileUpload({ onFiles, accept }: Props) {
  const [items, setItems] = React.useState<FileItem[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFiles = React.useCallback((files: File[]) => {
    if (!files?.length) return
    setItems((prev) => [...prev, ...files.map((f) => ({ file: f, status: 'pendente' as const }))])
    onFiles?.(files)
  }, [onFiles])

  const onDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files || [])
    handleFiles(files)
  }, [handleFiles])

  

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="border-2 border-dashed border-muted-200 rounded-2xl p-6 text-center bg-white"
      >
        <p className="text-sm text-ink-700">Arraste e solte arquivos aqui</p>
        <p className="text-xs text-ink-500">ou</p>
        <button
          type="button"
          className="btn btn-secondary mt-2 px-4 py-1.5 focus-ring"
          onClick={() => inputRef.current?.click()}
        >
          Selecionar arquivos
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          title="Selecionar arquivos"
          aria-label="Selecionar arquivos"
          onChange={(e) => handleFiles(Array.from(e.target.files || []))}
        />
      </div>
      {items.length > 0 && (
        <ul className="mt-4 space-y-2">
          {items.map((it, idx) => (
            <li key={idx} className="flex items-center justify-between rounded-lg bg-white border border-muted-200 px-3 py-2">
              <div>
                <div className="text-sm text-ink-900">{it.file.name}</div>
                <div className="text-xs text-ink-500">{(it.file.size / 1024).toFixed(1)} KB</div>
              </div>
              <span className="text-xs text-ink-500">{it.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

