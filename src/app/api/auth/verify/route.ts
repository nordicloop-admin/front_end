import { NextResponse } from 'next/server';
import { verifyInvitationToken } from '@/utils/auth';
import { getUserByEmail } from '@/utils/airtable';
import logger from '@/utils/logger';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token is required' },
        { status: 400 }
      );
    }
    
    // Verify the invitation token
    const email = verifyInvitationToken(token);
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 400 }
      );
    }
    
    // Check if the user already exists
    const existingUser = await getUserByEmail(email);
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      email
    });
  } catch (error) {
    logger.error('Token verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify token' },
      { status: 500 }
    );
  }
}
