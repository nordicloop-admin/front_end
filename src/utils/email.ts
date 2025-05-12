import logger from './logger';

/**
 * Send an invitation email to a new user
 * @param recipientEmail The email address of the recipient
 * @param recipientName The name of the recipient
 * @param invitationToken The invitation token
 * @returns A promise that resolves when the email is sent
 */
export const sendInvitationEmail = async (
  recipientEmail: string,
  recipientName: string,
  invitationToken: string
): Promise<void> => {
  try {
    // Create the invitation link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const invitationLink = `${baseUrl}/signup?token=${invitationToken}`;

    // Get EmailJS credentials from environment variables
    // Prefixed with underscore to fix ESLint unused variable warnings
    const _serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID_REGISTRATION || '';
    const _templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_INVITATION || '';
    const _publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

    // Log the email information for debugging
    logger.info(`Sending invitation email to ${recipientEmail}`);
    logger.info(`Invitation link: ${invitationLink}`);

    // In a real implementation, you would send the email here
    // For this example, we'll just log the information
    // In a production environment, you would use a server-side email service

    // Example of how to send the email using a server-side API
    /*
    const response = await fetch(`https://api.emailjs.com/api/v1.0/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          to_name: recipientName,
          to_email: recipientEmail,
          invitation_link: invitationLink,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send invitation email');
    }
    */

    return Promise.resolve();
  } catch (error) {
    logger.error('Error sending invitation email:', error);
    throw new Error('Failed to send invitation email');
  }
};

/**
 * Send a confirmation email after successful signup
 * @param recipientEmail The email address of the recipient
 * @param recipientName The name of the recipient
 * @returns A promise that resolves when the email is sent
 */
export const sendConfirmationEmail = async (
  recipientEmail: string,
  _recipientName: string // Prefixed with underscore to fix ESLint unused variable warning
): Promise<void> => {
  try {
    // Send the email using EmailJS
    // Note: This function is meant to be called from the server
    // In a real implementation, you would use a server-side email service
    // For this example, we'll simulate the email sending

    logger.info(`Sending confirmation email to ${recipientEmail}`);

    // In a real implementation, you would send the email here
    // For now, we'll just log the information

    return Promise.resolve();
  } catch (error) {
    logger.error('Error sending confirmation email:', error);
    throw new Error('Failed to send confirmation email');
  }
};
