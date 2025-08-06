import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET /api/messages - Get messages for a user
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const conversationWith = searchParams.get('conversationWith');
    const isRead = searchParams.get('isRead');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let where: any = {
      OR: [
        { senderId: userId },
        { receiverId: userId },
      ],
    };

    if (conversationWith) {
      where = {
        OR: [
          { senderId: userId, receiverId: conversationWith },
          { senderId: conversationWith, receiverId: userId },
        ],
      };
    }

    if (isRead !== null && !conversationWith) {
      where.receiverId = userId;
      where.isRead = isRead === 'true';
    }

    const messages = await prisma.message.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            specialization: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            specialization: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch messages', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/messages - Send a new message
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    const message = await prisma.message.create({
      data: {
        senderId: body.senderId,
        receiverId: body.receiverId,
        subject: body.subject,
        content: body.content,
        type: body.type || 'GENERAL',
        priority: body.priority || 'NORMAL',
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to send message', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT /api/messages - Mark messages as read
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { messageIds, isRead = true } = body;

    if (!messageIds || !Array.isArray(messageIds)) {
      return NextResponse.json(
        { error: 'Message IDs array is required' },
        { status: 400 }
      );
    }

    const messages = await prisma.message.updateMany({
      where: {
        id: {
          in: messageIds,
        },
      },
      data: {
        isRead,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ 
      updated: messages.count,
      messageIds,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update messages', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET /api/messages/conversations - Get conversation list for a user
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get latest message for each conversation
    const conversations = await prisma.$queryRaw`
      WITH latest_messages AS (
        SELECT DISTINCT ON (
          CASE 
            WHEN "senderId" = ${userId} THEN "receiverId"
            ELSE "senderId"
          END
        )
        *,
        CASE 
          WHEN "senderId" = ${userId} THEN "receiverId"
          ELSE "senderId"
        END as other_user_id
        FROM "messages"
        WHERE "senderId" = ${userId} OR "receiverId" = ${userId}
        ORDER BY other_user_id, "createdAt" DESC
      )
      SELECT * FROM latest_messages
      ORDER BY "createdAt" DESC
    ` as any[];

    // Get user details for each conversation
    const conversationsWithUsers = await Promise.all(
      conversations.map(async (msg: any) => {
        const otherUserId = msg.other_user_id;
        const otherUser = await prisma.user.findUnique({
          where: { id: otherUserId },
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            specialization: true,
          },
        });

        // Count unread messages in this conversation
        const unreadCount = await prisma.message.count({
          where: {
            senderId: otherUserId,
            receiverId: userId,
            isRead: false,
          },
        });

        return {
          ...msg,
          otherUser,
          unreadCount,
        };
      })
    );

    return NextResponse.json(conversationsWithUsers);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch conversations', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}