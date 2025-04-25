import json
import boto3
import os
import base64
from io import BytesIO

# Initialize SQS and S3 clients
sqs = boto3.client('sqs')
s3 = boto3.client('s3')

QUEUE_URL = os.environ.get('QUEUE_URL')
BUCKET_NAME = os.environ.get('BUCKET_NAME')  # Get the S3 bucket name from environment variables
API_ENDPOINT = os.environ.get('API_ENDPOINT')  # Get the API endpoint from environment variables

def lambda_handler(event, context):
    try:
        # Parse the event body (assuming base64-encoded image data)
        body = json.loads(event['body']) if 'body' in event else event
        
        # Extract metadata and file data
        file_name = body.get('file_name')  # Expected to be sent from the frontend
        file_data_base64 = body.get('file_data')  # Base64-encoded file data from frontend
        
        if not file_name or not file_data_base64:
            raise ValueError("File name or file data missing in the request.")

        # Decode the base64-encoded file
        file_data = base64.b64decode(file_data_base64)
        file_stream = BytesIO(file_data)  # Create a stream for the file data

        # Upload the file to S3
        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=f"uploads/{file_name}",  # Path in S3 (uploads/filename)
            Body=file_stream,
            ContentType="application/octet-stream"
        )

        # Send a message to SQS (you can include metadata like the file name, or URL)
        message = json.dumps({
            'file_name': file_name,
            's3_bucket': BUCKET_NAME,
            's3_key': f"uploads/{file_name}",
            'message': 'File uploaded successfully'
        })

        response = sqs.send_message(
            QueueUrl=QUEUE_URL,
            MessageBody=message
        )

        # If you need to trigger an API or return an endpoint as part of the response:
        # Example: call an external API or notify frontend with the API endpoint.
        if API_ENDPOINT:
            api_response = {
                "status": "File uploaded",
                "api_endpoint": API_ENDPOINT  # Return the API endpoint in the response
            }
        else:
            api_response = {
                "status": "File uploaded",
                "message": "API endpoint not configured"
            }

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "File uploaded successfully!",
                "MessageId": response['MessageId'],
                "api_details": api_response  # Include the API response details
            })
        }

    except Exception as e:
        # Handle errors
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
