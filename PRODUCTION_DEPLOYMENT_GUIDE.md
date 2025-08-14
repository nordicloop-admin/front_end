# Production Deployment Guide

## Environment Variables for Production

The following environment variables must be configured in your production deployment (e.g., Vercel):

### Required Environment Variables

```bash
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

# EmailJS Credentials - Company Registration
NEXT_PUBLIC_EMAILJS_SERVICE_ID_REGISTRATION=your_emailjs_registration_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_INVITATION=your_emailjs_invitation_template_id

# Table Names
AIRTABLE_NEWSLETTER_TABLE=Newsletters
AIRTABLE_NOTIFICATION_TABLE=Notification Lists
AIRTABLE_COMPANIES_TABLE=Companies
AIRTABLE_USERS_TABLE=Users

# Application Settings
NEXT_PUBLIC_BASE_URL=https://your-production-domain.com

# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-api-url.com/api
```

## Common Issues and Solutions

### 1. Client-Side Exception Errors

**Problem**: "Application error: a client-side exception has occurred"

**Solutions**:
- ✅ Added Error Boundary component to catch and handle runtime errors
- ✅ Added better error handling in AuthContext
- ✅ Fixed hydration mismatch issues in RootLayoutClient
- ✅ Added timeout and network error handling to API calls
- ✅ Added environment variable validation

### 2. Environment Variable Issues

**Problem**: Undefined environment variables causing runtime errors

**Solutions**:
- Ensure all `NEXT_PUBLIC_*` variables are set in production
- Add fallback values for optional environment variables
- Validate critical environment variables at runtime

### 3. API Connection Issues

**Problem**: Network errors when connecting to backend API

**Solutions**:
- Set correct `NEXT_PUBLIC_API_URL` for production
- Ensure CORS is properly configured on the backend
- Add proper error handling for network timeouts

### 4. Hydration Mismatches

**Problem**: Server-side rendered content doesn't match client-side

**Solutions**:
- Use `useEffect` to ensure client-side only rendering where needed
- Add loading states to prevent hydration mismatches
- Avoid using browser-only APIs during SSR

## Deployment Checklist

### Before Deployment:
- [ ] All environment variables are configured
- [ ] API endpoints are accessible from production domain
- [ ] EmailJS credentials are valid and working
- [ ] Airtable credentials have proper permissions
- [ ] Build completes successfully (`npm run build`)
- [ ] No TypeScript errors or warnings

### After Deployment:
- [ ] Application loads without client-side exceptions
- [ ] Authentication flow works correctly
- [ ] API calls are successful
- [ ] Email functionality works (contact forms, newsletters)
- [ ] All pages render correctly
- [ ] Error boundaries display properly when errors occur

## Monitoring and Debugging

### Error Tracking:
- Check browser console for client-side errors
- Monitor network requests in browser dev tools
- Use Vercel's function logs for API route debugging

### Performance:
- Monitor Core Web Vitals
- Check for large bundle sizes
- Optimize images and assets

## Support

If you encounter issues after following this guide:
1. Check the browser console for specific error messages
2. Verify all environment variables are correctly set
3. Test API endpoints independently
4. Review the Error Boundary component for caught exceptions
