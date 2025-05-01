import { NextResponse } from 'next/server';
import { verifyInvitationToken, hashPassword } from '@/utils/auth';
import { createUser, getUserByEmail } from '@/utils/airtable';
import { sendConfirmationEmail } from '@/utils/email';
import logger from '@/utils/logger';

export async function POST(request: Request) {
  try {
    const { token, password, confirmPassword } = await request.json();
    
    // Validate required fields
    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match' },
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
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Get the company information from the token
    // In a real implementation, you would store the company ID in the token
    // For this example, we'll use a placeholder
    const companyId = 'placeholder_company_id';
    
    // Create the user
    await createUser({
      email,
      password: hashedPassword,
      firstName: 'Placeholder', // In a real implementation, you would get this from the token
      lastName: 'User',         // In a real implementation, you would get this from the token
      position: 'Placeholder',  // In a real implementation, you would get this from the token
      companyId
    });
    
    // Send a confirmation email
    await sendConfirmationEmail(email, 'Placeholder User');
    
    return NextResponse.json({
      success: true,
      message: 'User created successfully'
    });
  } catch (error) {
    logger.error('User signup error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create user' },
      { status: 500 }
    );
  }
}
