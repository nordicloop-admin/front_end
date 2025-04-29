import { NextResponse } from 'next/server';
import logger from '@/utils/logger';

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    // Validate inputs
    if (!name || !email) {
      return NextResponse.json({ success: false, message: 'Name and email are required' }, { status: 400 });
    }

    // Airtable API credentials from environment variables
    const AIRTABLE_PAT = process.env.AIRTABLE_PAT || '';
    const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID || '';
    const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_NEWSLETTER_TABLE || 'Newsletter';

    // Format today's date as YYYY-MM-DD
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Gets YYYY-MM-DD format

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
            'Subscriber Name': name,
            'Email Address': email,
            'Signup Date': formattedDate
          }
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      logger.error('Airtable error:', error);
      throw new Error(error.error?.message || 'Failed to subscribe');
    }

    return NextResponse.json({ success: true, message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    logger.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}
