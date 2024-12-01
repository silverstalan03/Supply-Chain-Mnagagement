# setup_aws.py
import boto3
import json

def create_resources():
    # Initialize clients
    dynamodb = boto3.client('dynamodb')
    s3 = boto3.client('s3')
    sns = boto3.client('sns')
    sqs = boto3.client('sqs')
    
    # Create DynamoDB table
    try:
        dynamodb.create_table(
            TableName='orders',
            KeySchema=[{'AttributeName': 'order_id', 'KeyType': 'HASH'}],
            AttributeDefinitions=[{'AttributeName': 'order_id', 'AttributeType': 'S'}],
            BillingMode='PAY_PER_REQUEST'
        )
        print("Created DynamoDB table: orders")
    except dynamodb.exceptions.ResourceInUseException:
        print("DynamoDB table already exists")

    # Create S3 bucket
    account_id = boto3.client('sts').get_caller_identity()['Account']
    bucket_name = f"supply-chain-docs-{account_id}"
    
    try:
        s3.create_bucket(Bucket=bucket_name)
        print(f"Created S3 bucket: {bucket_name}")
        
        cors_config = {
            'CORSRules': [{
                'AllowedHeaders': ['*'],
                'AllowedMethods': ['GET', 'PUT', 'POST'],
                'AllowedOrigins': ['*'],
                'MaxAgeSeconds': 3000
            }]
        }
        s3.put_bucket_cors(Bucket=bucket_name, CORSConfiguration=cors_config)
    except Exception as e:
        print(f"Error with S3: {e}")

    # Create SNS topic
    try:
        topic = sns.create_topic(Name='order-notifications')
        topic_arn = topic['TopicArn']
        print(f"Created SNS topic: {topic_arn}")
    except Exception as e:
        print(f"Error with SNS: {e}")
        return

    # Create SQS queue
    try:
        queue = sqs.create_queue(QueueName='order-processing-queue')
        queue_url = queue['QueueUrl']
        print(f"Created SQS queue: {queue_url}")
        
        # Subscribe SQS to SNS
        queue_arn = f"arn:aws:sqs:{boto3.Session().region_name}:{account_id}:order-processing-queue"
        
        sns.subscribe(
            TopicArn=topic_arn,
            Protocol='sqs',
            Endpoint=queue_arn
        )
        
    except Exception as e:
        print(f"Error with SQS: {e}")

if __name__ == '__main__':
    create_resources()