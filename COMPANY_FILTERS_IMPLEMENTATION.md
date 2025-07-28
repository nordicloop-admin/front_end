# Company Search and Filter Implementation

## Overview
The admin companies page now includes comprehensive search and filter functionality with the following features:

## Features Implemented

### 🔍 Search Functionality
- **Enhanced search bar** with improved placeholder text
- **Multi-field search** across:
  - Company name
  - VAT number
  - Company email
  - Country
  - Associated user names (first name, last name, email)

### 🎛️ Filter Options
1. **Status Filter** (existing, enhanced)
   - All, Pending, Approved, Rejected

2. **Sector Filter** (new)
   - All Sectors
   - Manufacturing & Production
   - Construction & Demolition
   - Wholesale & Retail
   - Packaging & Printing
   - Recycling & Waste Management
   - Energy & Utilities
   - Other

3. **Country Filter** (new)
   - All Countries
   - Dynamic list based on existing companies
   - Currently includes: Sweden, US, Test Country

### 🎨 UI Improvements
- **Responsive layout** with improved mobile support
- **Loading states** for filter dropdowns
- **Better spacing** and organization of filters
- **URL state management** - filters persist on page refresh
- **Debounced search** to reduce API calls

## Technical Implementation

### Frontend Changes
1. **Service Layer** (`services/company.ts`):
   - Added `sector` and `country` parameters to `AdminCompanyParams`
   - Created `getCompanyFilterOptions()` function
   - Added `FilterOption` and `CompanyFilterOptions` interfaces

2. **Component** (`app/admin/companies/page.tsx`):
   - Added state management for new filters
   - Implemented filter option loading
   - Enhanced URL parameter handling
   - Added loading states and error handling

### Backend Changes
1. **Repository** (`company_repository.py`):
   - Enhanced search to include user names via related model
   - Added sector and country filtering
   - Optimized queries with `prefetch_related`

2. **Service** (`company_service.py`):
   - Added new filter parameters

3. **View** (`company_view.py`):
   - Added filter validation
   - Created `CompanyFiltersView` for filter options

4. **URLs** (`company/urls.py`):
   - Added `/api/company/filters/` endpoint

## Usage Examples

### API Endpoints
```bash
# Get filter options
GET /api/company/filters/

# Search with filters
GET /api/company/admin/companies/?search=Test&sector=manufacturing%20%20%26%20Production&country=Sweden&status=approved
```

### Frontend Usage
The filters work automatically when users:
1. Type in the search box (debounced)
2. Select from dropdown filters
3. Navigate with pagination
4. Refresh the page (state persists via URL)

## Performance Considerations
- **Debounced search** (300ms delay) reduces API calls
- **Optimized database queries** with prefetch_related
- **Pagination** maintains performance with large datasets
- **Loading states** provide user feedback

## Testing
✅ Search by company name: Works  
✅ Search by user name: Works  
✅ Filter by sector: Works  
✅ Filter by country: Works  
✅ Combined filters: Works  
✅ URL state persistence: Works  
✅ Pagination with filters: Works  
✅ Loading states: Works  

## Future Enhancements
- Add date range filtering
- Add export functionality with current filters
- Add saved filter presets
- Add advanced search modal
