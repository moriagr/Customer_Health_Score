# 📖 API Documentation

## Base URL

```http://localhost:8000/api```


---

## Endpoints

### GET `/customers`
Fetch all customers.

**Response 200**
```json
[
  {
    "id": "123",
    "name": "Acme Corp",
    "industry": "Finance",
    "createdAt": "2025-01-12T10:00:00Z"
  },
  {
    "id": "c124",
    "name": "TechNova",
    "industry": "SaaS",
    "createdAt": "2025-02-20T08:30:00Z"
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

###  GET `/customers/:id/health`

Fetch a single customer by ID with health.

**URL Parameters**

`id` (number, required) → Customer ID

* **Response 200**

```json
{
  "id": "123",
  "name": "Acme Corp",
  "industry": "Finance",
  "createdAt": "2025-01-12T10:00:00Z"
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

###  POST `/customers/:id/events`

Adds a new event, support ticket, or invoice for a specific customer.

**URL Parameters**

`id` (number, required) → Customer ID to update

**Request Body (JSON)**

You can send any combination of event, ticket, or invoice data:

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


* **Response 400 - No Data**
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


### GET `/dashboard`
Fetch summarized health data for dashboard visualization.

**Response 200**
```json
{
  "totalCustomers": 50,
  "averageHealthScore": 81.2,
  "healthDistribution": {
    "healthy": 30,
    "neutral": 15,
    "atRisk":  [{
    "id": "123",
    "name": "Acme Corp",
    "industry": "Finance",
    "createdAt": "2025-01-12T10:00:00Z"
  },
  {
    "id": "c124",
    "name": "TechNova",
    "industry": "SaaS",
    "createdAt": "2025-02-20T08:30:00Z"
  }]
  }
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
