# API Documentation

## Base URL

```http://localhost:8000/api```


---

## Endpoints

### GET `/customers`
Fetch all customers.

**URL Parameters**:
None

**Response 200**
```json
[
  {
      "id": 1,
      "name": "Friesen Inc",
      "segment": "Startup",
      "score": 41,
      "category": "At Risk"
  },
  {
      "id": 2,
      "name": "Swaniawski - Kuhlman",
      "segment": "Startup",
      "score": 64.1,
      "category": "Middle"
  }
]
```

* **Response 404 - Not Found**
```json
{ "message": "No customers found" }
```

* **Response 500 - Internal Server Error**
```json
{ "error": "Error fetching customers: <actual error message>" }
```
Or

```json
{ "error": "An unknown error occurred"}
```
---
###  GET `/customers/:id/health`

Fetch a single customer by ID with health and event details.

**URL Parameters**

`id` (number, required) → Customer ID

* **Response 200**

```json
{
  "events": [
    {
      "id": 1,
      "customer_id": 1,
      "event_type": "login",
      "event_data": {
          "ip_address": "165.159.72.172",
          "login_method": "sso"
      },
      "created_at": "2025-08-28T03:53:36.833"
    },
    {
      "id": 2,
      "customer_id": 1,
      "event_type": "login",
      "event_data": {
          "ip_address": "193.248.118.9",
          "login_method": "sso"
      },
      "created_at": "2025-08-07T23:13:32.594"
    }
  ],
  "invoices": [
    {
      "id": 1,
      "customer_id": 1,
      "amount": 1443.29,
      "due_date": "2023-05-19",
      "paid_date": null,
      "status": "late"
    },
    {
      "id": 2,
      "customer_id": 1,
      "amount": 1367.49,
      "due_date": "2025-08-31",
      "paid_date": null,
      "status": "unpaid"
    }
  ],
  "tickets": [
    {
      "id": 1,
      "customer_id": 1,
      "status": "open",
      "priority": "high",
      "created_at": "2025-08-30T03:44:12.786",
      "resolved_at": null
    },
    {
      "id": 2,
      "customer_id": 1,
      "status": "open",
      "priority": "high",
      "created_at": "2025-08-20T08:26:40.315",
      "resolved_at": null
    }
  ],
  "customerName": "Friesen Inc",
  "customerSegment": "Startup",
  "id": 1,
  "score": 41.4,
  "scores": {
    "featureScore": 40,
    "loginScore": 45.45454545454545,
    "supportScore": 55,
    "paymentScore": 0,
    "apiScore": 70,
    "total": 41.4
  },
  "currentMonth": {
    "logins": 5,
    "features": 2,
    "apiCalls": 7
  },
  "lastMonth": {
    "logins": 11,
    "features": 5,
    "apiCalls": 10
  },
  "ticketsData": {
    "openTickets": 4,
    "mediumTickets": 3,
    "highTickets": 3,
    "closedTickets": 1,
    "pendingTickets": 2
  },
  "invoicePayment": {
    "onTime": 0,
    "late": 3,
    "unpaid": 0,
    "score": 0,
    "total": 3
  }
}
```


* **Response 404 - Not Found**
```json
{ "message": "Customer not found" }
```

* **Response 500 - Internal Server Error**
```json
{ "error": "Error fetching customers: <actual error message>"}
```
Or

```json
{ "error": "An unknown error occurred" }
```
---

###  POST `/customers/:id/events`

Adds a new event, support ticket, or invoice for a specific customer.

**URL Parameters**

`id` (number, required) → Customer ID to update

**Request Body (JSON)**

You can send any combination of events, tickets, and/or invoice data events:

```json
{
  {
    "event": { "eventType": "login", "event_data": { "ip": "127.0.0.1" } },
    "ticket": { "status": "open", "priority": "high" },
    "invoice": { "amount": 100, "dueDate": "2025-09-20", "status": "unpaid" }
    }
}
```

`event` (optional) – object containing event_type and event_data for event.

`ticket` (optional) – object containing status and priority for a support ticket.

`invoice` (optional) – object containing amount, dueDate, and status for a customer invoice.

* **Response 200**

```json
{
  "message": "Event recorded"
}

```

* **Response 400 - Bad Request**
```json
{ 
  "error": "No data provided. Include at least one of: event, ticket, or invoice."
}

```

* **Response 500 - Internal Server Error**
```json
{ "error": "Error saving customer events: <actual error message>"}
```
Or

```json
{ "error": "An unknown error occurred" }
```

---
### GET `/dashboard`
Fetch summarized health data for dashboard visualization.

**Response 200**
```json
{
  "summary": {
    "total_customers": 70,
    "Healthy": 9,
    "Middle": 25,
    "At Risk": 36
  },
  "topAtRisk": [
    {
      "id": 5,
      "name": "Kulas - McDermott",
      "score": 20.5,
      "segment": "Startup"
    },
    {
      "id": 3,
      "name": "Hammes - Sanford",
      "score": 28.4,
      "segment": "Startup"
    },
    {
      "id": 9,
      "name": "Hayes, Macejkovic and Hackett",
      "score": 29,
      "segment": "SMB"
    },
    {
      "id": 25,
      "name": "Durgan - Wolff",
      "score": 29.4,
      "segment": "Enterprise"
    },
    {
      "id": 16,
      "name": "Huel - Beatty",
      "score": 30.1,
      "segment": "SMB"
    }
  ]
} 
```

* **Response 404 - Not Found**
```json
{ "message": "No customers found" }
```

* **Response 500 - Internal Server Error**
```json
{ "error": "Error fetching dashboard data: <actual error message>" }
```
Or

```json
{ "error": "Failed to load dashboard data"}
```
