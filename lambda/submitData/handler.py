import json
import boto3
import os

# SubmitData Lambda function to send messages to SQS queue
sqs = boto3.client('sqs')
s3 = boto3.client('s3')  # To interact with S3
QUEUE_URL = os.environ.get('QUEUE_URL')
BUCKET_NAME = os.environ.get('BUCKET_NAME')  # Get the S3 bucket name from environment variables

def lambda_handler(event, context):
    try:
        body = json.loads(event['body']) if 'body' in event else event
        message = json.dumps(body)

        # Example of using BUCKET_NAME (e.g., upload a message to the S3 bucket)
        if BUCKET_NAME:
            s3.put_object(Bucket=BUCKET_NAME, Key="message.json", Body=message)  # Uploading the message to S3

        # Send message to SQS
        response = sqs.send_message(
            QueueUrl=QUEUE_URL,
            MessageBody=message
        )

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Message sent!", "MessageId": response['MessageId']})
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }