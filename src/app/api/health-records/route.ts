import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET /api/health-records - Get health records for a patient
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const type = searchParams.get('type');
    const limit = searchParams.get('limit');

    if (!patientId) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }

    const where: any = { patientId };
    if (type && type !== 'all') {
      where.type = type;
    }

    const healthRecords = await prisma.healthRecord.findMany({
      where,
      orderBy: { recordDate: 'desc' },
      take: limit ? parseInt(limit) : undefined,
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(healthRecords);
  } catch (error: any) {
    console.error('Error fetching health records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch health records', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/health-records - Create a new health record
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { patientId, type, title, description, value, unit, recordDate, provider } = body;

    // Validation
    if (!patientId || !type || !title || !recordDate || !provider) {
      return NextResponse.json(
        { error: 'Missing required fields: patientId, type, title, recordDate, provider' },
        { status: 400 }
      );
    }

    // Validate record type
    const validTypes = ['NOTE', 'VITAL_SIGNS', 'LAB_RESULT', 'PRESCRIPTION', 'DIAGNOSIS', 'PROCEDURE', 'DOCUMENT', 'IMAGE'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid record type' },
        { status: 400 }
      );
    }

    const healthRecord = await prisma.healthRecord.create({
      data: {
        patientId,
        type,
        title: title.trim(),
        description: description?.trim() || '',
        value: value?.trim() || null,
        unit: unit?.trim() || null,
        recordDate: new Date(recordDate),
        provider: provider.trim(),
        isPublic: false, // Default to private
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(healthRecord, { status: 201 });
  } catch (error: any) {
    console.error('Error creating health record:', error);
    return NextResponse.json(
      { error: 'Failed to create health record', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT /api/health-records - Update a health record
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { id, type, title, description, value, unit, recordDate, provider } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Record ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (type) updateData.type = type;
    if (title) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (value !== undefined) updateData.value = value?.trim() || null;
    if (unit !== undefined) updateData.unit = unit?.trim() || null;
    if (recordDate) updateData.recordDate = new Date(recordDate);
    if (provider) updateData.provider = provider.trim();

    const healthRecord = await prisma.healthRecord.update({
      where: { id },
      data: updateData,
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(healthRecord);
  } catch (error: any) {
    console.error('Error updating health record:', error);
    return NextResponse.json(
      { error: 'Failed to update health record', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/health-records - Delete a health record
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Record ID is required' },
        { status: 400 }
      );
    }

    await prisma.healthRecord.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Health record deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting health record:', error);
    return NextResponse.json(
      { error: 'Failed to delete health record', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
