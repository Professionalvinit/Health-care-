import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET /api/vital-signs - Get vital signs for a patient
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const days = searchParams.get('days');
    const limit = searchParams.get('limit');

    if (!patientId) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }

    const where: any = { patientId };
    
    if (days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(days));
      where.recordDate = {
        gte: daysAgo,
      };
    }

    const vitalSigns = await prisma.vitalSigns.findMany({
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

    return NextResponse.json(vitalSigns);
  } catch (error: any) {
    console.error('Error fetching vital signs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vital signs', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/vital-signs - Create new vital signs record
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { 
      patientId, 
      systolic, 
      diastolic, 
      heartRate, 
      temperature, 
      weight, 
      height, 
      recordDate 
    } = body;

    // Validation
    if (!patientId || !recordDate) {
      return NextResponse.json(
        { error: 'Patient ID and record date are required' },
        { status: 400 }
      );
    }

    // Validate vital signs ranges
    const errors: string[] = [];
    if (systolic && (systolic < 60 || systolic > 250)) {
      errors.push('Systolic blood pressure must be between 60-250 mmHg');
    }
    if (diastolic && (diastolic < 30 || diastolic > 150)) {
      errors.push('Diastolic blood pressure must be between 30-150 mmHg');
    }
    if (heartRate && (heartRate < 30 || heartRate > 220)) {
      errors.push('Heart rate must be between 30-220 bpm');
    }
    if (temperature && (temperature < 90 || temperature > 110)) {
      errors.push('Temperature must be between 90-110°F');
    }
    if (weight && (weight < 10 || weight > 1000)) {
      errors.push('Weight must be between 10-1000 lbs');
    }
    if (height && (height < 12 || height > 96)) {
      errors.push('Height must be between 12-96 inches');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors.join(', ') },
        { status: 400 }
      );
    }

    // Calculate BMI if weight and height are provided
    let bmi = null;
    if (weight && height) {
      bmi = (weight / (height * height)) * 703; // BMI formula for lbs and inches
      bmi = Math.round(bmi * 10) / 10; // Round to 1 decimal place
    }

    const vitalSigns = await prisma.vitalSigns.create({
      data: {
        patientId,
        systolic: systolic || null,
        diastolic: diastolic || null,
        heartRate: heartRate || null,
        temperature: temperature || null,
        weight: weight || null,
        height: height || null,
        bmi,
        recordDate: new Date(recordDate),
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

    return NextResponse.json(vitalSigns, { status: 201 });
  } catch (error: any) {
    console.error('Error creating vital signs:', error);
    return NextResponse.json(
      { error: 'Failed to create vital signs record', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT /api/vital-signs - Update vital signs record
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { 
      id, 
      systolic, 
      diastolic, 
      heartRate, 
      temperature, 
      weight, 
      height, 
      recordDate 
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Vital signs ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (systolic !== undefined) updateData.systolic = systolic;
    if (diastolic !== undefined) updateData.diastolic = diastolic;
    if (heartRate !== undefined) updateData.heartRate = heartRate;
    if (temperature !== undefined) updateData.temperature = temperature;
    if (weight !== undefined) updateData.weight = weight;
    if (height !== undefined) updateData.height = height;
    if (recordDate) updateData.recordDate = new Date(recordDate);

    // Recalculate BMI if weight or height changed
    if (weight !== undefined || height !== undefined) {
      const current = await prisma.vitalSigns.findUnique({ where: { id } });
      if (current) {
        const newWeight = weight !== undefined ? weight : current.weight;
        const newHeight = height !== undefined ? height : current.height;
        if (newWeight && newHeight) {
          updateData.bmi = Math.round(((newWeight / (newHeight * newHeight)) * 703) * 10) / 10;
        }
      }
    }

    const vitalSigns = await prisma.vitalSigns.update({
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

    return NextResponse.json(vitalSigns);
  } catch (error: any) {
    console.error('Error updating vital signs:', error);
    return NextResponse.json(
      { error: 'Failed to update vital signs', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
