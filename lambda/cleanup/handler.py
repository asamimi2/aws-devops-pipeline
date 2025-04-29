import boto3
import datetime
import os

# Initialize the S3 client
s3 = boto3.client('s3')

MAX_AGE_DAYS = 0
UPLOADS_PREFIX = 'uploads/'  # Only clean files inside uploads/

def lambda_handler(event, context):
    print("Received event:", event)

    # First try event bucket, fallback to environment BUCKET_NAME
    BUCKET_NAME = event.get('bucket') or os.environ.get('BUCKET_NAME')

    if not BUCKET_NAME:
        raise ValueError("No BUCKET_NAME provided via event or environment.")

    deleted = []
    threshold = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=MAX_AGE_DAYS)

    paginator = s3.get_paginator('list_objects_v2')
    page_iterator = paginator.paginate(Bucket=BUCKET_NAME, Prefix=UPLOADS_PREFIX)

    for page in page_iterator:
        objects = page.get('Contents', [])
        for obj in objects:
            if obj['LastModified'] < threshold:
                s3.delete_object(Bucket=BUCKET_NAME, Key=obj['Key'])
                deleted.append(obj['Key'])

    return {
        "statusCode": 200,
        "body": f"Deleted {len(deleted)} objects from {BUCKET_NAME}: {deleted}"
    }