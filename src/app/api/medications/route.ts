import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET /api/medications - Get medications for a patient
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const isActive = searchParams.get('isActive');

    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (isActive !== null) where.isActive = isActive === 'true';

    const medications = await prisma.medication.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 10, // Recent 10 logs
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(medications);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch medications', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/medications - Add a new medication
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    const medication = await prisma.medication.create({
      data: {
        patientId: body.patientId,
        name: body.name,
        dosage: body.dosage,
        frequency: body.frequency,
        instructions: body.instructions,
        prescriber: body.prescriber,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        reminderTime: body.reminderTime,
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

    return NextResponse.json(medication, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create medication', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT /api/medications - Update medication
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }

    const medication = await prisma.medication.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
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

    return NextResponse.json(medication);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update medication', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}