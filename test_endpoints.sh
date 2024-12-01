#!/bin/bash

# Get API endpoint
API_URL=$(aws cloudformation describe-stacks \
    --stack-name supply-chain-management \
    --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
    --output text)

echo "Testing API at: $API_URL"

# Test 1: Create Order
echo -e "\n1. Testing Create Order"
CREATE_RESPONSE=$(curl -s -X POST "$API_URL/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "TEST_CUSTOMER",
    "items": [
      {"product_id": "TEST_PROD", "quantity": 1, "price": 99.99}
    ]
  }')

echo "Create Response: $CREATE_RESPONSE"

# Test 2: Get Orders
echo -e "\n2. Testing Get Orders"
GET_RESPONSE=$(curl -s "$API_URL/orders")
echo "Get Response: $GET_RESPONSE"

# Test 3: Check DynamoDB
echo -e "\n3. Checking DynamoDB"
aws dynamodb scan --table-name orders

# Test 4: Check S3
echo -e "\n4. Checking S3"
BUCKET_NAME=$(aws cloudformation describe-stacks \
    --stack-name supply-chain-management \
    --query 'Stacks[0].Outputs[?OutputKey==`DocumentsBucket`].OutputValue' \
    --output text)
aws s3 ls s3://$BUCKET_NAME/orders/ --recursive

# Test 5: Check SNS
echo -e "\n5. Checking SNS"
TOPIC_ARN=$(aws cloudformation describe-stacks \
    --stack-name supply-chain-management \
    --query 'Stacks[0].Outputs[?OutputKey==`TopicArn`].OutputValue' \
    --output text)
aws sns list-subscriptions-by-topic --topic-arn $TOPIC_ARN

# Test 6: Check SQS
echo -e "\n6. Checking SQS"
QUEUE_URL=$(aws sqs get-queue-url --queue-name order-processing-queue --query 'QueueUrl' --output text)
aws sqs get-queue-attributes --queue-url $QUEUE_URL --attribute-names All
