import json

#dqlProcessor Lambda function to process messages from the Dead Letter Queue (DLQ)
def lambda_handler(event, context):
    for record in event.get("Records", []):
        message_body = record.get("body")
        print("Failed Message Received from DLQ:", message_body)
    return {
        "statusCode": 200,
        "body": json.dumps({"message": "DLQ processed"})
    }