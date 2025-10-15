import { useState, useCallback } from 'react';

export interface UploadedDocument {
  id: string;
  documentType: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: Date;
}

export interface UseDocumentUploadResult {
  documents: UploadedDocument[];
  uploading: boolean;
  uploadProgress: number;
  error: string | null;
  uploadDocument: (file: File, documentType: string, investorId: string) => Promise<void>;
  deleteDocument: (documentId: string) => Promise<void>;
  fetchDocuments: (investorId: string) => Promise<void>;
}

export default function useDocumentUpload(): UseDocumentUploadResult {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadDocument = useCallback(async (file: File, documentType: string, investorId: string) => {
    try {
      setUploading(true);
      setUploadProgress(0);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);
      formData.append('investorId', investorId);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao fazer upload do documento');
      }

      const uploadedDoc = await response.json();
      setDocuments(prev => [...prev, uploadedDoc]);
      setUploadProgress(100);

    } catch (err: any) {
      console.error('Error uploading document:', err);
      setError(err.message || 'Erro ao fazer upload do documento');
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const deleteDocument = useCallback(async (documentId: string) => {
    try {
      setError(null);

      const response = await fetch(`/api/documents/upload?documentId=${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao deletar documento');
      }

      setDocuments(prev => prev.filter(doc => doc.id !== documentId));

    } catch (err: any) {
      console.error('Error deleting document:', err);
      setError(err.message || 'Erro ao deletar documento');
      throw err;
    }
  }, []);

  const fetchDocuments = useCallback(async (investorId: string) => {
    try {
      setError(null);

      const response = await fetch(`/api/documents/upload?investorId=${investorId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar documentos');
      }

      const docs = await response.json();
      setDocuments(docs);

    } catch (err: any) {
      console.error('Error fetching documents:', err);
      setError(err.message || 'Erro ao buscar documentos');
    }
  }, []);

  return {
    documents,
    uploading,
    uploadProgress,
    error,
    uploadDocument,
    deleteDocument,
    fetchDocuments,
  };
}
