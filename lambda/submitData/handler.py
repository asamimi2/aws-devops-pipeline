import json
import boto3
import os
import base64

s3 = boto3.client('s3')
sqs = boto3.client('sqs')

QUEUE_URL = os.environ.get('QUEUE_URL')
BUCKET_NAME = os.environ.get('BUCKET_NAME')

def lambda_handler(event, context):
    try:
        print("Received event:", event)
        
        body = event.get('body')
        if event.get('isBase64Encoded'):
            body = base64.b64decode(body)
        
        file_key = "uploads/uploaded_file"
        
        # Upload file to S3
        s3.put_object(Bucket=BUCKET_NAME, Key=file_key, Body=body)
        
        # Send message to SQS
        sqs.send_message(QueueUrl=QUEUE_URL, MessageBody=json.dumps({"fileKey": file_key}))

        # Return successful CORS-enabled response
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
            "body": json.dumps({"message": "Upload successful"})
        }

    except Exception as e:
        print("Error:", str(e))
        
        # Return error CORS-enabled response
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
            "body": json.dumps({"error": str(e)})
        }
