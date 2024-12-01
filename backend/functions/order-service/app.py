# functions/order-service/app.py

import json
import boto3
import os
from decimal import Decimal
from datetime import datetime
import uuid
import traceback
from typing import Dict, Any
from order_management.processor import (
    OrderProcessor, 
    OrderError, 
    OrderNotFoundError, 
    DocumentNotFoundError,
    BaseEncoder,
    DecimalEncoder
)

def create_cors_headers():
    return {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,HEAD,PATCH',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
    }

def create_response(status_code: int, body: Dict[str, Any]) -> Dict[str, Any]:
    try:
        return {
            'statusCode': status_code,
            'headers': create_cors_headers(),
            'body': json.dumps(DecimalEncoder.encode(body))
        }
    except Exception as e:
        print(f"Error creating response: {str(e)}")
        return {
            'statusCode': 500,
            'headers': create_cors_headers(),
            'body': json.dumps({
                'error': 'Error creating response',
                'details': str(e)
            })
        }

def format_order_data(body: Dict[str, Any], order_id: str) -> Dict[str, Any]:
    """Format order data with proper types and structure"""
    try:
        timestamp = datetime.utcnow().isoformat()
        
        items = []
        total_amount = Decimal('0')
        
        for item in body['items']:
            quantity = Decimal(str(item['quantity']))
            price = Decimal(str(item['price']))
            item_total = quantity * price
            
            items.append({
                'product_id': item['product_id'],
                'name': item['name'],
                'quantity': quantity,
                'price': price,
                'total': item_total
            })
            total_amount += item_total
        
        return {
            'order_id': order_id,
            'customer_id': body['customer_id'],
            'customer_name': body['customer_name'],
            'items': items,
            'total_amount': total_amount,
            'status': 'PENDING',
            'created_at': timestamp,
            'updated_at': timestamp
        }
    except Exception as e:
        print(f"Error formatting order data: {str(e)}")
        print(f"Input body: {json.dumps(body)}")
        raise ValueError(f"Invalid order data format: {str(e)}")

def validate_order_data(body: Dict[str, Any]) -> None:
    """Validate order data"""
    try:
        print(f"Validating order data: {json.dumps(body)}")
        
        required_fields = ['customer_id', 'customer_name', 'items']
        for field in required_fields:
            if field not in body:
                raise ValueError(f"Missing required field: {field}")

        if not isinstance(body['items'], list):
            raise ValueError("Items must be an array")

        if not body['items']:
            raise ValueError("Order must contain at least one item")

        for item in body['items']:
            required_item_fields = ['product_id', 'name', 'quantity', 'price']
            for field in required_item_fields:
                if field not in item:
                    raise ValueError(f"Missing required item field: {field}")

            try:
                quantity = float(item['quantity'])
                if quantity <= 0:
                    raise ValueError("Quantity must be positive")
            except (ValueError, TypeError):
                raise ValueError(f"Invalid quantity: {item.get('quantity')}")

            try:
                price = float(item['price'])
                if price <= 0:
                    raise ValueError("Price must be positive")
            except (ValueError, TypeError):
                raise ValueError(f"Invalid price: {item.get('price')}")

    except ValueError as e:
        raise
    except Exception as e:
        print(f"Validation error: {str(e)}\nTraceback: {traceback.format_exc()}")
        raise ValueError(f"Invalid order data: {str(e)}")

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Main Lambda handler"""
    print('Event:', json.dumps(event))
    print('Environment variables:', {
        'ORDERS_TABLE': os.environ.get('ORDERS_TABLE'),
        'DOCUMENTS_BUCKET': os.environ.get('DOCUMENTS_BUCKET'),
        'ORDER_TOPIC_ARN': os.environ.get('ORDER_TOPIC_ARN')
    })

    try:
        # Initialize processor
        processor = OrderProcessor(
            table_name=os.environ.get('ORDERS_TABLE', 'scm-stack-orders'),
            bucket_name=os.environ.get('DOCUMENTS_BUCKET', 'scm-stack-docs-975050073542'),
            topic_arn=os.environ.get('ORDER_TOPIC_ARN', 'scm-stack-orders')
        )

        # Handle CORS preflight
        if event.get('httpMethod') == 'OPTIONS':
            return create_response(200, {})

        path = event.get('path', '')
        method = event['httpMethod']
        
        print(f"Processing {method} request to {path}")
        
        # GET /orders - List all orders
        if method == 'GET' and path == '/orders':
            print("Getting all orders")
            orders = processor.list_orders()
            print(f"Found {len(orders)} orders")
            return create_response(200, orders)
        
        # POST /orders - Create new order
        elif method == 'POST' and path == '/orders':
            print("Creating new order")
            try:
                body = json.loads(event['body'])
                print("Request body:", json.dumps(body))
                
                validate_order_data(body)
                order_id = f"ORD-{uuid.uuid4().hex[:8]}"
                print("Generated order ID:", order_id)
                
                order_data = format_order_data(body, order_id)
                print("Formatted order data:", json.dumps(DecimalEncoder.encode(order_data)))
                
                processed_order = processor.create_order(order_data)
                print("Order created successfully:", json.dumps(DecimalEncoder.encode(processed_order)))
                
                return create_response(201, processed_order)
                
            except ValueError as e:
                print(f"Validation error: {str(e)}")
                return create_response(400, {'error': str(e)})
            except Exception as e:
                print(f"Error creating order: {str(e)}\n{traceback.format_exc()}")
                return create_response(500, {
                    'error': 'Failed to create order',
                    'details': str(e)
                })
        
        # GET /orders/{orderId} - Get specific order
        elif method == 'GET' and path.startswith('/orders/') and not path.endswith('/document'):
            order_id = event['pathParameters']['orderId']
            print(f"Getting order: {order_id}")
            
            try:
                order = processor.get_order(order_id)
                if not order:
                    return create_response(404, {'error': 'Order not found'})
                return create_response(200, order)
            except Exception as e:
                print(f"Error getting order: {str(e)}\n{traceback.format_exc()}")
                return create_response(500, {'error': 'Failed to get order'})
        
        # PATCH /orders/{orderId}/status - Update order status
        elif method == 'PATCH' and '/status' in path:
            order_id = event['pathParameters']['orderId']
            body = json.loads(event['body'])
            status = body.get('status')
            print(f"Updating order status: {order_id} to {status}")
            
            if not status:
                return create_response(400, {'error': 'Status field is required'})
            
            valid_statuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED']
            if status not in valid_statuses:
                return create_response(400, {
                    'error': f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
                })
            
            try:
                updated_order = processor.update_status(order_id, status)
                return create_response(200, updated_order)
            except OrderNotFoundError:
                return create_response(404, {'error': 'Order not found'})
            except Exception as e:
                print(f"Error updating order status: {str(e)}\n{traceback.format_exc()}")
                return create_response(500, {'error': 'Failed to update order status'})
        
        # DELETE /orders/{orderId} - Delete order
        elif method == 'DELETE':
            order_id = event['pathParameters']['orderId']
            print(f"Deleting order: {order_id}")
            
            try:
                processor.delete_order(order_id)
                return create_response(200, {'message': 'Order deleted successfully'})
            except OrderNotFoundError:
                return create_response(404, {'error': 'Order not found'})
            except Exception as e:
                print(f"Error deleting order: {str(e)}\n{traceback.format_exc()}")
                return create_response(500, {'error': 'Failed to delete order'})
        
        # Invalid endpoint
        else:
            return create_response(404, {'error': 'Invalid endpoint'})
            
    except Exception as e:
        print(f"Unhandled error: {str(e)}\n{traceback.format_exc()}")
        return create_response(500, {
            'error': 'Internal server error',
            'message': str(e)
        })