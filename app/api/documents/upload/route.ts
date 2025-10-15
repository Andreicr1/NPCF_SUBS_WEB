import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';
import { put, del } from '@vercel/blob';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// POST /api/documents/upload - Fazer upload de documento para Vercel Blob
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const documentType = (formData.get('documentType') as string | null) ?? undefined;
    const investorId = (formData.get('investorId') as string | null) ?? undefined;

    if (!file || !documentType || !investorId) {
      return NextResponse.json(
        { error: 'Arquivo, tipo de documento e investorId são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se investidor existe
    const investor = await prisma.investor.findUnique({ where: { id: investorId } });
    if (!investor) {
      return NextResponse.json(
        { error: 'Investidor não encontrado' },
        { status: 404 }
      );
    }

    // Enviar para Vercel Blob (sem usar filesystem efêmero)
    const timestamp = Date.now();
    const originalName = (file.name || 'document').replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${documentType}_${timestamp}_${originalName}`;

    const { url } = await put(`investors/${investorId}/${fileName}` as `${string}`, file, {
      access: 'public',
      contentType: file.type,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Salvar no banco
    const document = await prisma.document.create({
      data: {
        investorId,
        documentType,
        fileName,
        filePath: url, // URL do Blob
        fileSize: file.size,
        mimeType: file.type,
        status: 'pending',
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: investorId,
        action: 'upload',
        entity: 'document',
        entityId: document.id,
        changes: JSON.stringify({ documentType, fileName, fileSize: file.size }),
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    });

    return NextResponse.json(document);
  } catch (error: any) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao fazer upload do documento' },
      { status: 500 }
    );
  }
}

// GET /api/documents/upload?investorId=xxx - Listar documentos de um investidor
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const investorId = searchParams.get('investorId');

    if (!investorId) {
      return NextResponse.json(
        { error: 'investorId é obrigatório' },
        { status: 400 }
      );
    }

    const documents = await prisma.document.findMany({
      where: { investorId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(documents);
  } catch (error: any) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar documentos' },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/upload?documentId=xxx - Deletar documento
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json(
        { error: 'documentId é obrigatório' },
        { status: 400 }
      );
    }

    const document = await prisma.document.findUnique({ where: { id: documentId } });
    if (!document) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      );
    }

    // Remove do Blob (ignora erro se já não existir)
    try {
      await del(document.filePath as `${string}`, { token: process.env.BLOB_READ_WRITE_TOKEN });
    } catch (err) {
      console.error('Error deleting blob:', err);
    }

    await prisma.document.delete({ where: { id: documentId } });

    await prisma.auditLog.create({
      data: {
        userId: document.investorId,
        action: 'delete',
        entity: 'document',
        entityId: documentId,
        changes: JSON.stringify({ documentType: document.documentType, fileName: document.fileName }),
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao deletar documento' },
      { status: 500 }
    );
  }
}

