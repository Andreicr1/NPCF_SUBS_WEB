"use client";
import React from 'react'
import useDocumentUpload from '@/hooks/useDocumentUpload'
import TertiaryButton from '@/src/components/buttons/TertiaryButton'

type DocType = 'passport' | 'proofOfAddress' | 'bankStatement'

export default function DocumentsUploader() {
  const { documents, uploading, error, uploadDocument, deleteDocument, fetchDocuments } = useDocumentUpload()
  const [investorId, setInvestorId] = React.useState<string | null>(null)
  const [dragOverType, setDragOverType] = React.useState<DocType | null>(null)

  React.useEffect(() => {
    const id = localStorage.getItem('investorId')
    setInvestorId(id)
    if (id) fetchDocuments(id)
  }, [fetchDocuments])

  const uploadMany = async (files: FileList | File[], docType: DocType) => {
    const list = Array.from(files || [])
    if (list.length === 0) return
    if (!investorId) {
      alert('Protocolo ainda não gerado. Envie seus dados na etapa Revisão para habilitar o upload.')
      return
    }
    for (const f of list) {
      await uploadDocument(f, docType, investorId)
    }
  }

  const onSelect = async (e: React.ChangeEvent<HTMLInputElement>, docType: DocType) => {
    const files = e.target.files
    if (!files?.length) return
    await uploadMany(files, docType)
  }

  const onDrop = async (e: React.DragEvent<HTMLDivElement>, docType: DocType) => {
    e.preventDefault()
    setDragOverType(null)
    if (!e.dataTransfer?.files?.length) return
    await uploadMany(e.dataTransfer.files, docType)
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>, docType: DocType) => {
    e.preventDefault()
    setDragOverType(docType)
  }

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOverType(null)
  }

  return (
    <div className="space-y-6">
      {!investorId && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800 text-sm">
          Envie seus dados na etapa Revisão para gerar o protocolo e habilitar o upload de documentos.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`rounded-lg border ${dragOverType==='passport' ? 'border-brand-600 bg-brand-400/5' : 'border-muted-200 bg-white'} p-4`}
          onDrop={(e)=>onDrop(e,'passport')}
          onDragOver={(e)=>onDragOver(e,'passport')}
          onDragLeave={onDragLeave}
        >
          <label htmlFor="passport-upload" className="text-sm font-medium text-ink-900">Passaporte / Documento de Identidade</label>
          <p className="text-xs text-ink-500">PDF, JPG ou PNG</p>
          <input id="passport-upload" type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="mt-2" onChange={(e) => onSelect(e, 'passport')} disabled={!investorId || uploading} />
          <p className="text-[11px] text-ink-500 mt-1">Arraste e solte aqui para enviar múltiplos arquivos.</p>
        </div>
        <div
          className={`rounded-lg border ${dragOverType==='proofOfAddress' ? 'border-brand-600 bg-brand-400/5' : 'border-muted-200 bg-white'} p-4`}
          onDrop={(e)=>onDrop(e,'proofOfAddress')}
          onDragOver={(e)=>onDragOver(e,'proofOfAddress')}
          onDragLeave={onDragLeave}
        >
          <label htmlFor="proofOfAddress-upload" className="text-sm font-medium text-ink-900">Comprovante de Endereço</label>
          <p className="text-xs text-ink-500">Emitido nos últimos 3 meses</p>
          <input id="proofOfAddress-upload" type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="mt-2" onChange={(e) => onSelect(e, 'proofOfAddress')} disabled={!investorId || uploading} />
          <p className="text-[11px] text-ink-500 mt-1">Arraste e solte aqui para enviar múltiplos arquivos.</p>
        </div>
        <div
          className={`rounded-lg border ${dragOverType==='bankStatement' ? 'border-brand-600 bg-brand-400/5' : 'border-muted-200 bg-white'} p-4`}
          onDrop={(e)=>onDrop(e,'bankStatement')}
          onDragOver={(e)=>onDragOver(e,'bankStatement')}
          onDragLeave={onDragLeave}
        >
          <label htmlFor="bankStatement-upload" className="text-sm font-medium text-ink-900">Extrato Bancário (opcional)</label>
          <p className="text-xs text-ink-500">Com origem dos recursos</p>
          <input id="bankStatement-upload" type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="mt-2" onChange={(e) => onSelect(e, 'bankStatement')} disabled={!investorId || uploading} />
          <p className="text-[11px] text-ink-500 mt-1">Arraste e solte aqui para enviar múltiplos arquivos.</p>
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-ink-900 mb-2">Arquivos enviados</div>
        {documents.length === 0 ? (
          <div className="text-sm text-ink-500">Nenhum arquivo enviado ainda.</div>
        ) : (
          <ul className="space-y-2">
            {documents.map((d) => (
              <li key={d.id} className="flex items-center justify-between rounded-lg border border-muted-200 bg-white px-3 py-2 text-sm">
                <div className="flex-1 pr-4">
                  <div className="text-ink-900">{d.fileName}</div>
                  <div className="text-ink-500 text-xs">{d.documentType} • {(d.fileSize/1024).toFixed(1)} KB • {d.status}</div>
                </div>
                <TertiaryButton type="button" onClick={() => deleteDocument(d.id)}>Remover</TertiaryButton>
              </li>
            ))}
          </ul>
        )}
      </div>

      {uploading && <div className="text-sm text-ink-500">Enviando arquivo(s)...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  )
}
