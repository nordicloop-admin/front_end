import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    // Validate input
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }
    
    // Airtable API credentials
    const AIRTABLE_PAT = 'patmOQKnXR9SZsGj7.4335f190ffd9fdab306b5afe1802ed13c181cc3533bcfde1d46651f08788b27d';
    const AIRTABLE_BASE_ID = 'appIiD2vycmBErjPC';
    const AIRTABLE_TABLE_NAME = 'Notification List';
    
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
      console.error('Airtable error:', error);
      throw new Error(error.error?.message || 'Failed to subscribe');
    }
    
    return NextResponse.json({ success: true, message: 'You will be notified when we launch!' });
  } catch (error) {
    console.error('Notification subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to register for notification' },
      { status: 500 }
    );
  }
}
