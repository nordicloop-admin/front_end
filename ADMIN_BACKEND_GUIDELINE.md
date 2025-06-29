# Backend API Guideline for Admin Dashboard

This document outlines the implemented backend endpoints, request/response structures, and data models for the admin dashboard of the Nordic Loop Marketplace. All endpoints have been implemented and are production-ready.

---

## 1. Companies Management

### Endpoints

- `GET /api/company/admin/companies/`
  - **Query Params:** `search`, `status` (`all`, `pending`, `approved`, `rejected`)
  - **Response:**
    ```json
    {
      "count": 1,
      "next": null,
      "previous": null,
      "results": [
        {
          "id": "1",
          "companyName": "Eco Solutions AB",
          "vatNumber": "SE123456789001",
          "country": "Sweden",
          "sector": "recycling",
          "companyEmail": "info@ecosolutions.se",
          "companyPhone": "+46 8 123 45 67",
          "contacts": [
            {
              "name": "Erik Johansson",
              "email": "erik@ecosolutions.se",
              "position": "Sustainability Manager"
            }
          ],
          "status": "approved",
          "createdAt": "2023-05-15"
        }
      ],
      "page_size": 10,
      "total_pages": 1,
      "current_page": 1
    }
    ```

- `POST /api/company/admin/companies/`
  - **Request:**
    ```json
    {
      "companyName": "string",
      "vatNumber": "string",
      "country": "string",
      "sector": "string",
      "companyEmail": "string",
      "companyPhone": "string",
      "contacts": [
        {
          "name": "string",
          "email": "string",
          "position": "string"
        }
      ]
    }
    ```
  - **Response:** Created company object

- `PATCH /api/company/admin/companies/{id}/status/`
  - **Request:** `{ "status": "approved" | "pending" | "rejected" }`
  - **Response:** Updated company object

- `GET /api/company/admin/companies/{id}/`
  - **Response:** Company object (see above)

- `PUT /api/company/admin/companies/{id}/`
  - **Request:** Same as POST
  - **Response:** Updated company object

- `DELETE /api/company/admin/companies/{id}/`
  - **Response:** Success/failure

---

## 2. Users Management

### Endpoints

- `GET /api/users/admin/users/`
  - **Query Params:** `search`
  - **Response:**
    ```json
    {
      "count": 1,
      "next": null,
      "previous": null,
      "results": [
        {
          "id": "1",
          "email": "erik@ecosolutions.se",
          "firstName": "Erik",
          "lastName": "Johansson",
          "position": "Sustainability Manager",
          "companyId": "1",
          "companyName": "Eco Solutions AB",
          "createdAt": "2023-05-15"
        }
      ],
      "page_size": 10,
      "total_pages": 1,
      "current_page": 1
    }
    ```

- `POST /api/users/admin/users/`
  - **Request:**
    ```json
    {
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "position": "string",
      "companyId": "string"
    }
    ```
  - **Response:** Created user object

- `GET /api/users/admin/users/{id}/`
  - **Response:** User object

- `PUT /api/users/admin/users/{id}/`
  - **Request:** Same as POST
  - **Response:** Updated user object

- `PATCH /api/users/admin/users/{id}/status/`
  - **Request:** `{ "active": true | false }`
  - **Response:** Updated user object

- `DELETE /api/users/admin/users/{id}/`
  - **Response:** Success/failure

---

## 3. Bids Management

### Endpoints

- `GET /api/bids/admin/bids/`
  - **Query Params:** `search`, `status` (`all`, `active`, `pending`, `outbid`, `rejected`)
  - **Response:**
    ```json
    {
      "count": 1,
      "next": null,
      "previous": null,
      "results": [
        {
          "id": "1",
          "itemId": "1",
          "itemName": "PPA Thermocomp UFW49RSC (Black)",
          "bidAmount": 5250.000,
          "previousBid": 5150.000,
          "bidderName": "Erik Johansson",
          "bidderCompany": "Eco Solutions AB",
          "bidderEmail": "erik@ecosolutions.se",
          "status": "active",
          "isHighest": true,
          "createdAt": "2023-05-15T14:30:00Z",
          "expiresAt": "2023-05-18T14:30:00Z",
          "needsReview": false
        }
      ],
      "page_size": 10,
      "total_pages": 1,
      "current_page": 1
    }
    ```

- `GET /api/bids/admin/bids/{id}/`
  - **Response:** Bid object

- `PATCH /api/bids/admin/bids/{id}/status/`
  - **Request:** `{ "status": "active" | "rejected" }`
  - **Response:** Updated bid object

---

## 4. Marketplace Listings Management

### Endpoints

- `GET /api/ads/admin/marketplace/`
  - **Query Params:** `search`, `status` (`all`, `active`, `pending`, `inactive`)
  - **Response:**
    ```json
    {
      "count": 1,
      "next": null,
      "previous": null,
      "results": [
        {
          "id": "1",
          "name": "PPA Thermocomp UFW49RSC (Black)",
          "category": "Plastics",
          "basePrice": 5013.008,
          "highestBid": 5250.000,
          "status": "active",
          "volume": "500 kg",
          "seller": "Eco Solutions AB",
          "countryOfOrigin": "Sweden",
          "createdAt": "2023-05-15",
          "image": "/path/to/image.jpg"
        }
      ],
      "page_size": 10,
      "total_pages": 1,
      "current_page": 1
    }
    ```

- `POST /api/ads/admin/marketplace/`
  - **Request:**
    ```json
    {
      "name": "string",
      "category": "string",
      "basePrice": "decimal",
      "volume": "string",
      "seller": "string",
      "countryOfOrigin": "string",
      "image": "string"
    }
    ```
  - **Response:** Created listing object

- `GET /api/ads/admin/marketplace/{id}/`
  - **Response:** Listing object

- `PUT /api/ads/admin/marketplace/{id}/`
  - **Request:** Same as POST
  - **Response:** Updated listing object

- `PATCH /api/ads/admin/marketplace/{id}/status/`
  - **Request:** `{ "status": "active" | "pending" | "inactive" }`
  - **Response:** Updated listing object

- `DELETE /api/ads/admin/marketplace/{id}/`
  - **Response:** Success/failure

---

## 5. Subscriptions Management

### Endpoints

- `GET /api/ads/admin/subscriptions/`
  - **Query Params:** `search`, `plan`, `status`
  - **Response:**
    ```json
    {
      "count": 1,
      "next": null,
      "previous": null,
      "results": [
        {
          "id": "1",
          "companyId": "1",
          "companyName": "Eco Solutions AB",
          "plan": "premium",
          "status": "active",
          "startDate": "2023-01-15",
          "endDate": "2024-01-15",
          "autoRenew": true,
          "paymentMethod": "credit_card",
          "lastPayment": "2023-01-15",
          "amount": "799 SEK",
          "contactName": "Erik Johansson",
          "contactEmail": "erik@ecosolutions.se"
        }
      ],
      "page_size": 10,
      "total_pages": 1,
      "current_page": 1
    }
    ```

- `GET /api/ads/admin/subscriptions/{id}/`
  - **Response:** Subscription object

- `PUT /api/ads/admin/subscriptions/{id}/`
  - **Request:** Same structure as response object
  - **Response:** Updated subscription object

- `PATCH /api/ads/admin/subscriptions/{id}/status/`
  - **Request:** `{ "status": "active" | "expired" | "payment_failed" }`
  - **Response:** Updated subscription object

---

## 6. Addresses Management

### Endpoints

- `GET /api/ads/admin/addresses/`
  - **Query Params:** `search`, `type`, `verified`
  - **Response:**
    ```json
    {
      "count": 1,
      "next": null,
      "previous": null,
      "results": [
        {
          "id": "1",
          "companyId": "1",
          "companyName": "Eco Solutions AB",
          "type": "business",
          "addressLine1": "Storgatan 45",
          "addressLine2": "",
          "city": "Stockholm",
          "postalCode": "11455",
          "country": "Sweden",
          "isVerified": true,
          "isPrimary": true,
          "contactName": "Erik Johansson",
          "contactPhone": "+46 70 123 4567",
          "createdAt": "2023-05-15"
        }
      ],
      "page_size": 10,
      "total_pages": 1,
      "current_page": 1
    }
    ```

- `GET /api/ads/admin/addresses/{id}/`
  - **Response:** Address object

- `PUT /api/ads/admin/addresses/{id}/`
  - **Request:** Same structure as response object
  - **Response:** Updated address object

- `PATCH /api/ads/admin/addresses/{id}/verify/`
  - **Request:** `{ "isVerified": true | false }`
  - **Response:** Updated address object

---

## Implementation Details

### Authentication & Authorization
- All endpoints require admin authentication using `IsAdminUser` permission
- Use JWT tokens for authentication: `Authorization: Bearer <token>`
- Admin users must have `is_staff=True` and `is_superuser=True`

### Pagination
- All list endpoints use `StandardResultsSetPagination`
- Default page size: 10 items per page
- Query parameters: `page`, `page_size` (max 100)
- Response includes: `count`, `next`, `previous`, `results`, `page_size`, `total_pages`, `current_page`

### Search & Filtering
- **Companies:** Search by `official_name`, `vat_number`, `email`, `primary_email`, `primary_first_name`, `primary_last_name`
- **Users:** Search by `email`, `first_name`, `last_name`, `role`
- **Bids:** Search by `ad__title`, `user__email`, `user__first_name`, `user__last_name`, `user__company__official_name`
- **Marketplace:** Search by `title`, `category__name`, `user__company__official_name`, `location__country`
- **Subscriptions:** Search by `company__official_name`, `contact_name`, `contact_email`
- **Addresses:** Search by `company__official_name`, `contact_name`, `contact_phone`, `city`, `country`

### Error Handling
- **200:** Success
- **201:** Created
- **400:** Bad Request (validation errors)
- **401:** Unauthorized (no authentication)
- **403:** Forbidden (not admin)
- **404:** Not Found
- **500:** Internal Server Error

### Data Models Implemented

#### Company Model
```python
- official_name: CharField
- vat_number: CharField (unique)
- email: EmailField (unique)
- country: CharField
- sector: CharField (choices)
- phone: CharField
- primary_first_name/last_name/email/position
- secondary_first_name/last_name/email/position
- status: CharField (pending/approved/rejected)
```

#### User Model
```python
- email: EmailField
- first_name/last_name: CharField
- company: ForeignKey to Company
- role: CharField
- is_active: BooleanField
```

#### Ad Model (Marketplace)
```python
- title: CharField
- category: ForeignKey
- starting_bid_price: DecimalField
- available_quantity: DecimalField
- unit_of_measurement: CharField
- status: CharField (active/pending/inactive)
- location: ForeignKey to Location
```

#### Bid Model
```python
- user: ForeignKey to User
- ad: ForeignKey to Ad
- bid_price_per_unit: DecimalField
- volume_requested: DecimalField
- status: CharField
- created_at: DateTimeField
```

#### Subscription Model
```python
- company: ForeignKey to Company
- plan: CharField (basic/premium/enterprise)
- status: CharField (active/expired/payment_failed)
- start_date/end_date: DateField
- payment_method: CharField
- amount: CharField
```

#### Address Model
```python
- company: ForeignKey to Company
- type: CharField (business/shipping/billing)
- address_line1/address_line2: CharField
- city/postal_code/country: CharField
- is_verified/is_primary: BooleanField
- contact_name/contact_phone: CharField
```

---

## Usage Examples

### Authentication
```javascript
// Login first to get JWT token
const response = await fetch('/api/users/login/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@test.com', password: 'admin123' })
});
const { access } = await response.json();

// Use token in subsequent requests
const headers = {
  'Authorization': `Bearer ${access}`,
  'Content-Type': 'application/json'
};
```

### List Companies with Search
```javascript
const response = await fetch('/api/company/admin/companies/?search=eco&status=approved', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();
```

### Update Company Status
```javascript
const response = await fetch('/api/company/admin/companies/1/status/', {
  method: 'PATCH',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ status: 'approved' })
});
```

### Paginated Results
```javascript
const response = await fetch('/api/users/admin/users/?page=2&page_size=20', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { results, count, total_pages, current_page } = await response.json();
```

---

## Status

✅ **All endpoints implemented and tested**  
✅ **Response formats match specification exactly**  
✅ **Admin authentication and authorization working**  
✅ **Search, filtering, and pagination implemented**  
✅ **CRUD operations functional**  
✅ **Status update endpoints working**  
✅ **Production ready**

---

This guideline reflects the actual implementation. All endpoints are functional and ready for frontend integration. 