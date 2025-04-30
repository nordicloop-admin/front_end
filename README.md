This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Environment Variables

Before running the project, you need to set up the environment variables. Create a `.env.local` file in the root directory with the following variables:

```
# Airtable Credentials
NEXT_PUBLIC_AIRTABLE_BASE_ID=your_airtable_base_id
AIRTABLE_PAT=your_airtable_personal_access_token

# EmailJS Credentials - Newsletter
NEXT_PUBLIC_EMAILJS_SERVICE_ID_NEWSLETTER=your_emailjs_newsletter_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_NEWSLETTER=your_emailjs_newsletter_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# EmailJS Credentials - Contact Form
NEXT_PUBLIC_EMAILJS_SERVICE_ID_CONTACT=your_emailjs_contact_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONTACT=your_emailjs_contact_template_id
NEXT_PUBLIC_EMAILJS_CONTACT_PUBLIC_KEY=your_emailjs_contact_public_key

# EmailJS Credentials - Coming Soon Notification
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_NOTIFICATION=your_emailjs_notification_template_id

# Table Names
AIRTABLE_NEWSLETTER_TABLE=Newsletter
AIRTABLE_NOTIFICATION_TABLE=Notification List
```

Replace the placeholder values with your actual credentials.

### Running the Development Server

After setting up the environment variables, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Environment Variables on Vercel

When deploying to Vercel, make sure to add all the environment variables from your `.env.local` file to your Vercel project settings.
