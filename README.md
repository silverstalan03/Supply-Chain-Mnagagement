# Supply Chain Management System

## API Endpoints

### Create Order
POST /orders
```json
{
  "customer_id": "CUST123",
  "items": [
    {
      "product_id": "PROD1",
      "quantity": 2,
      "price": 10.00
    }
  ]
}
```

### Get Order
GET /orders/{orderId}

## Local Development
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run local API:
   ```bash
   sam local start-api
   ```

3. Run tests:
   ```bash
   pytest tests/
   ```

## Deployment
```bash
sam build
sam deploy
```