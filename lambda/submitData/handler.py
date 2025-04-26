import json
import boto3
import os
import base64
from io import BytesIO

# Initialize SQS and S3 clients
sqs = boto3.client('sqs')
s3 = boto3.client('s3')

QUEUE_URL = os.environ.get('QUEUE_URL')
BUCKET_NAME = os.environ.get('BUCKET_NAME')
API_ENDPOINT = os.environ.get('API_ENDPOINT')  # API Gateway endpoint

def lambda_handler(event, context):
    try:
        # Parse the event body (assuming base64-encoded image data)
        body = json.loads(event['body']) if 'body' in event else event
        
        file_name = body.get('file_name')
        file_data_base64 = body.get('file_data')
        
        if not file_name or not file_data_base64:
            raise ValueError("File name or file data missing in the request.")

        # Decode the base64-encoded file
        file_data = base64.b64decode(file_data_base64)
        file_stream = BytesIO(file_data)

        # Upload the file to S3
        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=f"uploads/{file_name}",
            Body=file_stream,
            ContentType="application/octet-stream"
        )

        # Send message to SQS
        message = json.dumps({
            'file_name': file_name,
            's3_bucket': BUCKET_NAME,
            's3_key': f"uploads/{file_name}",
            'message': 'File uploaded successfully'
        })
        sqs.send_message(QueueUrl=QUEUE_URL, MessageBody=message)

        # Return the API endpoint
        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "File uploaded successfully!",
                "api_endpoint": API_ENDPOINT  # Send the API endpoint back
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
