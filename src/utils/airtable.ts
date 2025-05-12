import { CompanyRegistration, User, ReviewStatus } from '@/types/auth';
import logger from './logger';

// Define Airtable table names from environment variables
const COMPANIES_TABLE = process.env.AIRTABLE_COMPANIES_TABLE || 'Companies';
const USERS_TABLE = process.env.AIRTABLE_USERS_TABLE || 'Users';

/**
 * Register a new company in Airtable
 * @param companyData The company registration data
 * @returns The ID of the created company record
 */
export const registerCompany = async (companyData: CompanyRegistration): Promise<string> => {
  try {
    const AIRTABLE_PAT = process.env.AIRTABLE_PAT || '';
    const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID || '';

    // Format today's date as YYYY-MM-DD
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    // Prepare the data for Airtable
    const fields: Record<string, string> = {
      'Company Name': companyData.companyName,
      'VAT Number': companyData.vatNumber,
      'Email': companyData.email || '',
      'Website': companyData.website || '',
      'Country': companyData.country,
      'Sector': companyData.sector,
      'Contact First Name': companyData.contactFirstName,
      'Contact Last Name': companyData.contactLastName,
      'Contact Email': companyData.contactEmail,
      'Contact Position': companyData.contactPosition,
      'Review Status': 'pending',
      'Created At': formattedDate
    };

    // Add second contact person data if provided
    if (companyData.contact2FirstName && companyData.contact2LastName) {
      fields['Contact2 First Name'] = companyData.contact2FirstName;
      fields['Contact2 Last Name'] = companyData.contact2LastName;
      fields['Contact2 Email'] = companyData.contact2Email || '';
      fields['Contact2 Position'] = companyData.contact2Position || '';
    }

    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${COMPANIES_TABLE}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: [{
          fields
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      logger.error('Airtable error:', error);
      throw new Error(error.error?.message || 'Failed to register company');
    }

    const data = await response.json();
    return data.records[0].id;
  } catch (error) {
    logger.error('Company registration error:', error);
    throw new Error('Failed to register company');
  }
};

/**
 * Create a new user in Airtable
 * @param userData The user data
 * @returns The ID of the created user record
 */
export const createUser = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  position: string;
  companyId: string;
}): Promise<string> => {
  try {
    const AIRTABLE_PAT = process.env.AIRTABLE_PAT || '';
    const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID || '';

    // Format today's date as YYYY-MM-DD
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    // Prepare the data for Airtable
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${USERS_TABLE}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: [{
          fields: {
            'Email': userData.email,
            'Password': userData.password, // Note: In a real app, this should be hashed
            'First Name': userData.firstName,
            'Last Name': userData.lastName,
            'Position': userData.position,
            'Company ID': userData.companyId,
            'Created At': formattedDate
          }
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      logger.error('Airtable error:', error);
      throw new Error(error.error?.message || 'Failed to create user');
    }

    const data = await response.json();
    return data.records[0].id;
  } catch (error) {
    logger.error('User creation error:', error);
    throw new Error('Failed to create user');
  }
};

/**
 * Get company information by ID
 * @param companyId The company ID
 * @returns The company information
 */
export const getCompanyById = async (companyId: string): Promise<any> => {
  try {
    const AIRTABLE_PAT = process.env.AIRTABLE_PAT || '';
    const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID || '';

    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${COMPANIES_TABLE}/${companyId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      logger.error('Airtable error:', error);
      throw new Error(error.error?.message || 'Failed to get company');
    }

    const data = await response.json();
    return {
      id: data.id,
      name: data.fields['Company Name'],
      vatNumber: data.fields['VAT Number'],
      email: data.fields['Email'],
      website: data.fields['Website'],
      country: data.fields['Country'],
      sector: data.fields['Sector'],
      reviewStatus: data.fields['Review Status'] as ReviewStatus,
      createdAt: data.fields['Created At']
    };
  } catch (error) {
    logger.error('Get company error:', error);
    throw new Error('Failed to get company');
  }
};

/**
 * Get user by email
 * @param email The user's email
 * @returns The user information or null if not found
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const AIRTABLE_PAT = process.env.AIRTABLE_PAT || '';
    const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID || '';

    // Use Airtable formula to filter by email
    const formula = encodeURIComponent(`{Email} = "${email}"`);

    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${USERS_TABLE}?filterByFormula=${formula}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_PAT}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      logger.error('Airtable error:', error);
      throw new Error(error.error?.message || 'Failed to get user');
    }

    const data = await response.json();

    if (data.records.length === 0) {
      return null;
    }

    const record = data.records[0];
    return {
      id: record.id,
      email: record.fields['Email'],
      firstName: record.fields['First Name'],
      lastName: record.fields['Last Name'],
      position: record.fields['Position'],
      companyId: record.fields['Company ID'],
      createdAt: record.fields['Created At']
    };
  } catch (error) {
    logger.error('Get user error:', error);
    throw new Error('Failed to get user');
  }
};
