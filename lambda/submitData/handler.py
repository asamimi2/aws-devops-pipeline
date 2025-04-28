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
        else:
            body = body.encode('utf-8')

        # Now decode JSON from the body
        data = json.loads(body)

        # Get filename and file_data from the body
        file_name = data['file_name']
        file_data = base64.b64decode(data['file_data'])

        # Define where to upload (dynamic filename)
        file_key = f"uploads/{file_name}"

        # Upload the decoded file to S3
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
            "body": json.dumps({"message": "Upload successful"})
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
