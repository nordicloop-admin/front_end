import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/utils/airtable';
import { verifyPassword } from '@/utils/auth';
import logger from '@/utils/logger';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Get the user by email
    const user = await getUserByEmail(email);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Verify the password
    // In a real implementation, you would get the hashed password from the user record
    // For this example, we'll use a placeholder
    const isPasswordValid = await verifyPassword(password, `hashed_${password}`);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // In a real implementation, you would create a session or JWT token here
    // For this example, we'll just return the user information
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        position: user.position,
        companyId: user.companyId
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to log in' },
      { status: 500 }
    );
  }
}
