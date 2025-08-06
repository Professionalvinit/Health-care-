import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET /api/medication-logs - Get medication adherence logs
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const medicationId = searchParams.get('medicationId');
    const patientId = searchParams.get('patientId');
    const days = searchParams.get('days');

    let where: any = {};
    
    if (medicationId) {
      where.medicationId = medicationId;
    }
    
    if (patientId) {
      where.medication = {
        patientId: patientId,
      };
    }

    if (days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(days));
      where.takenAt = {
        gte: daysAgo,
      };
    }

    const medicationLogs = await prisma.medicationLog.findMany({
      where,
      include: {
        medication: {
          select: {
            id: true,
            name: true,
            dosage: true,
            frequency: true,
            patient: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { takenAt: 'desc' },
    });

    return NextResponse.json(medicationLogs);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch medication logs', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/medication-logs - Log medication adherence
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    const medicationLog = await prisma.medicationLog.create({
      data: {
        medicationId: body.medicationId,
        takenAt: body.takenAt ? new Date(body.takenAt) : new Date(),
        status: body.status || 'TAKEN',
        notes: body.notes,
      },
      include: {
        medication: {
          select: {
            id: true,
            name: true,
            dosage: true,
            patient: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(medicationLog, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create medication log', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET /api/medication-logs/adherence - Get adherence statistics
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const days = parseInt(searchParams.get('days') || '30');

    if (!patientId) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all logs for the patient in the specified period
    const logs = await prisma.medicationLog.findMany({
      where: {
        medication: {
          patientId: patientId,
        },
        takenAt: {
          gte: startDate,
        },
      },
      include: {
        medication: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Calculate adherence statistics
    const totalLogs = logs.length;
    const takenLogs = logs.filter((log: any) => log.status === 'TAKEN').length;
    const missedLogs = logs.filter((log: any) => log.status === 'MISSED').length;
    const delayedLogs = logs.filter((log: any) => log.status === 'DELAYED').length;

    const adherenceRate = totalLogs > 0 ? (takenLogs / totalLogs) * 100 : 0;

    // Group by medication
    const medicationStats = logs.reduce((acc: any, log: any) => {
      const medId = log.medication.id;
      const medName = log.medication.name;
      
      if (!acc[medId]) {
        acc[medId] = {
          medicationId: medId,
          medicationName: medName,
          total: 0,
          taken: 0,
          missed: 0,
          delayed: 0,
          adherenceRate: 0,
        };
      }
      
      acc[medId].total++;
      if (log.status === 'TAKEN') acc[medId].taken++;
      if (log.status === 'MISSED') acc[medId].missed++;
      if (log.status === 'DELAYED') acc[medId].delayed++;
      
      acc[medId].adherenceRate = (acc[medId].taken / acc[medId].total) * 100;
      
      return acc;
    }, {});

    const stats = {
      overall: {
        totalLogs,
        takenLogs,
        missedLogs,
        delayedLogs,
        adherenceRate,
      },
      byMedication: Object.values(medicationStats),
      period: {
        days,
        startDate,
        endDate: new Date(),
      },
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to calculate adherence statistics', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}