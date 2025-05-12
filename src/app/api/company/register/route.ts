import { NextResponse } from 'next/server';
import { registerCompany } from '@/utils/airtable';
import { generateInvitationToken } from '@/utils/auth';
import { sendInvitationEmail } from '@/utils/email';
import logger from '@/utils/logger';
import { CompanyRegistration } from '@/types/auth';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      'companyName',
      'vatNumber',
      'country',
      'sector',
      'contactFirstName',
      'contactLastName',
      'contactEmail',
      'contactPosition'
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Prepare company registration data
    const companyData: CompanyRegistration = {
      companyName: data.companyName,
      vatNumber: data.vatNumber,
      email: data.email,
      website: data.website,
      country: data.country,
      sector: data.sector,
      contactFirstName: data.contactFirstName,
      contactLastName: data.contactLastName,
      contactEmail: data.contactEmail,
      contactPosition: data.contactPosition,
      reviewStatus: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Add second contact person data if provided
    if (data.contact2FirstName && data.contact2LastName) {
      companyData.contact2FirstName = data.contact2FirstName;
      companyData.contact2LastName = data.contact2LastName;
      companyData.contact2Email = data.contact2Email;
      companyData.contact2Position = data.contact2Position;
    }

    // Register the company in Airtable
    const companyId = await registerCompany(companyData);

    // Generate an invitation token for the contact person
    const invitationToken = generateInvitationToken(data.contactEmail);

    // Send an invitation email to the contact person
    await sendInvitationEmail(
      data.contactEmail,
      `${data.contactFirstName} ${data.contactLastName}`,
      invitationToken
    );

    return NextResponse.json({
      success: true,
      message: 'Company registered successfully. An invitation email has been sent to the contact person.',
      companyId
    });
  } catch (error) {
    logger.error('Company registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to register company' },
      { status: 500 }
    );
  }
}
