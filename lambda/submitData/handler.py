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

        # Parse JSON if necessary
        body_json = json.loads(body)

        # Get the file name and file data
        file_name = body_json['file_name']
        file_data = base64.b64decode(body_json['file_data'])

        file_key = f"uploads/{file_name}"

        # Upload the file to S3
        s3.put_object(Bucket=BUCKET_NAME, Key=file_key, Body=file_data)

        # Send a message to SQS
        sqs.send_message(QueueUrl=QUEUE_URL, MessageBody=json.dumps({"fileKey": file_key}))

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
            "body": json.dumps({"message": "Upload successful", "fileKey": file_key})
        }

    except Exception as e:
        print("Error:", str(e))
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
            "body": json.dumps({"error": str(e)})
        }
