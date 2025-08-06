import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { perplexityChat } from '@/perplexity-api';

const prisma = new PrismaClient();

// GET /api/symptoms - Get symptom reports
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const isReviewed = searchParams.get('isReviewed');

    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (isReviewed !== null) where.isReviewed = isReviewed === 'true';

    const symptomReports = await prisma.symptomReport.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(symptomReports);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch symptom reports', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/symptoms - Create symptom report with AI analysis
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { patientId, symptoms, severity, description } = body;

    // Create symptom query for AI analysis
    const symptomsArray = typeof symptoms === 'string' ? JSON.parse(symptoms) : symptoms;
    const symptomQuery = `I am experiencing the following symptoms: ${symptomsArray.join(', ')}. 
      Severity level: ${severity}/10. 
      Additional details: ${description || 'None provided'}. 
      Please provide medical guidance, potential causes, and recommendations for when to seek professional care. 
      Include important disclaimers about consulting healthcare professionals.`;

    let aiResponse = '';
    let aiSources: string[] = [];

    try {
      // Get AI analysis using Perplexity
      const response = await perplexityChat(symptomQuery);

      aiResponse = response.response || '';
      aiSources = response.sources || [];
    } catch (aiError) {
      console.error('AI analysis failed:', aiError);
      aiResponse = 'AI analysis is currently unavailable. Please consult with a healthcare professional for proper medical evaluation.';
    }

    // Determine priority based on severity and symptoms
    let priority = 'NORMAL';
    if (severity >= 8) {
      priority = 'HIGH';
    } else if (severity >= 6) {
      priority = 'NORMAL';
    } else {
      priority = 'LOW';
    }

    // Check for urgent symptoms
    const urgentKeywords = ['chest pain', 'difficulty breathing', 'severe headache', 'bleeding', 'unconscious'];
    const hasUrgentSymptoms = symptomsArray.some((symptom: string) => 
      urgentKeywords.some(keyword => 
        symptom.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    if (hasUrgentSymptoms) {
      priority = 'URGENT';
    }

    const symptomReport = await prisma.symptomReport.create({
      data: {
        patientId,
        symptoms: JSON.stringify(symptomsArray),
        severity,
        description,
        aiResponse,
        aiSources: JSON.stringify(aiSources),
        priority,
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

    return NextResponse.json(symptomReport, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create symptom report', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT /api/symptoms - Update symptom report (for provider review)
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { id, isReviewed, reviewedBy, reviewNotes } = body;

    const symptomReport = await prisma.symptomReport.update({
      where: { id },
      data: {
        isReviewed,
        reviewedBy,
        reviewNotes,
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

    return NextResponse.json(symptomReport);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update symptom report', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
