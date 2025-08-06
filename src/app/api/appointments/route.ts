import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET /api/appointments - Get appointments with filtering
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const providerId = searchParams.get('providerId');
    const status = searchParams.get('status');
    const upcoming = searchParams.get('upcoming');

    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (providerId) where.providerId = providerId;
    if (status) where.status = status;
    
    if (upcoming === 'true') {
      where.startTime = {
        gte: new Date(),
      };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
            specialization: true,
            avatar: true,
          },
        },
      },
      orderBy: { startTime: 'asc' },
    });

    return NextResponse.json(appointments);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch appointments', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/appointments - Create a new appointment
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    const appointment = await prisma.appointment.create({
      data: {
        patientId: body.patientId,
        providerId: body.providerId,
        title: body.title,
        description: body.description,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        type: body.type || 'IN_PERSON',
        status: 'SCHEDULED',
        location: body.location,
        notes: body.notes,
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            specialization: true,
          },
        },
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create appointment', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT /api/appointments - Update appointment status
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        status,
        notes,
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
        provider: {
          select: {
            id: true,
            name: true,
            specialization: true,
          },
        },
      },
    });

    return NextResponse.json(appointment);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update appointment', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}