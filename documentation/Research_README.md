# Customer Health Score Research

A **customer health score** is a key metric that indicates the likelihood that a customer will renew their subscription or service.  
It helps predict **churn risk** vs. **retention strength**, guiding customer success and product strategies.  

---

## What Is a Customer Health Score?
Companies measure health in multiple ways:
- **Numeric points system** (0–100 or weighted scores)  
- **Ranking system** (A, B, C, D)  
- **Color coding** (Green = good, Yellow = medium, Red = at risk)  

---
## Key Metrics

### 1️. Login Frequency
- **What it means**: How often users log into the platform.  
- **Why it matters**:  
  - High frequency = active usage, lower churn risk  
  - Low frequency = disengagement, higher churn risk  
- **How to measure**:  
  - Count logins in last 30 days  
  - Compare against previous month  
  - Normalize to 0–100 score  

---

### 2️. Feature Adoption Rate
- **What it means**: % of key features used by the customer.  
- **Why it matters**:  
  - More features used → deeper adoption → harder to churn  
  - Few features used → shallow adoption → riskier  
- **How to measure**:  
  - Count features used in last 30 days  
  - Compare against previous month  
  - Normalize to 0–100 score  

---

### 3. Support Ticket Volume
- **What it means**: Number of support requests over time.  
- **Why it matters**:  
  - High volume = frustration, friction, possible churn  
  - Low volume = smooth usage (but sometimes disengagement)  

- **How to measure**:  
  - Count tickets for each category:
    - open tickets with low priority
    - open tickets with medium priority
    - open tickets with high priority
    - pending tickets
  -  Calculation: 
  ```javascript 
  100 - 20 * (lowTickets * 1 + mediumTickets * 2 + highTickets * 5 + pendingTickets * 1) / (lowTickets + mediumTickets + highTickets + pendingTickets) 
   ```

---

### 4. API Usage Trends
- **What it means**: Consistency of API calls (for integrations).  
- **Why it matters**:  
  - Strong API usage → deeply integrated, sticky customer  
  - Declining API usage → disengagement risk  
- **How to measure**:  
  - Count API calls in last 30 days   
  - Compare against previous month
  - Normalize to 0–100 score  

---

### 5. Payment Timeliness
- **What it means**: On-time vs. late invoice payments.  
- **Why it matters**: Direct financial risk and customer reliability.  
- **How to measure**:  
  - % of invoices paid on time  
  - Track late invoices over time  

---

## Weighted Scoring Approach

| Metric              | Weight | Rationale |
|---------------------|--------|-----------|
| **Feature Adoption** | 30% | Best indicator of product value |
| **Login Frequency**  | 25% | Core engagement metric |
| **Support Tickets**  | 20% | Inverse health signal |
| **Payment Timeliness** | 15% | Important but external factors affect it |
| **API Usage**        | 10% | Strong for integrations, but not universal |

---

## Scoring Formula

```javascript
// Core formula
score = (metric / expected) * 100
✅ Simple and transparent
✅ Scales naturally
✅ Easy to explain to stakeholders
✅ Allows over-performance (>100 scores possible)
```

## Why This Approach?
- Balanced, transparent, and easy to implement.

- Gives clear signals for customer success teams.

- Provides fairness across customer segments.

- Optimized for business impact while staying actionable.

