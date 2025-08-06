import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET /api/users - Get all users or filter by role
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const email = searchParams.get('email');

    const where: any = {};
    if (role) where.role = role;
    if (email) where.email = email;

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        dateOfBirth: true,
        gender: true,
        role: true,
        avatar: true,
        isActive: true,
        specialization: true,
        licenseNumber: true,
        yearsExperience: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        phone: body.phone,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
        gender: body.gender,
        address: body.address,
        role: body.role || 'PATIENT',
        avatar: body.avatar,
        emergencyContact: body.emergencyContact,
        medicalHistory: body.medicalHistory,
        allergies: body.allergies,
        bloodType: body.bloodType,
        insuranceInfo: body.insuranceInfo,
        specialization: body.specialization,
        licenseNumber: body.licenseNumber,
        yearsExperience: body.yearsExperience,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}