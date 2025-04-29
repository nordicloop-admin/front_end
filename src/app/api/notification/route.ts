import { NextResponse } from 'next/server';
import logger from '@/utils/logger';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    // Airtable API credentials from environment variables
    const AIRTABLE_PAT = process.env.AIRTABLE_PAT || '';
    const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID || '';
    const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_NOTIFICATION_TABLE || 'Notification List';

    // Send data to Airtable using the correct structure and field names
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: [{
          fields: {
            'Email Address': email,
            'Notification Status': 'Pending'
          }
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      logger.error('Airtable error:', error);
      throw new Error(error.error?.message || 'Failed to subscribe');
    }

    // Return success response
    return NextResponse.json({ success: true, message: 'You will be notified when we launch!' });
  } catch (error) {
    logger.error('Notification subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to register for notification' },
      { status: 500 }
    );
  }
}
