import json
import boto3
import os

sqs = boto3.client('sqs')
QUEUE_URL = os.environ.get('QUEUE_URL')

def lambda_handler(event, context):
    try:
        body = json.loads(event['body']) if 'body' in event else event
        message = json.dumps(body)

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