import boto3
import datetime
import os

s3 = boto3.client('s3')
BUCKET_NAME = os.environ.get('BUCKET_NAME')
MAX_AGE_DAYS = 7

def lambda_handler(event, context):
    deleted = []
    threshold = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=MAX_AGE_DAYS)
    objects = s3.list_objects_v2(Bucket=BUCKET_NAME).get('Contents', [])

    for obj in objects:
        if obj['LastModified'] < threshold:
            s3.delete_object(Bucket=BUCKET_NAME, Key=obj['Key'])
            deleted.append(obj['Key'])

    return {
        "statusCode": 200,
        "body": f"Deleted {len(deleted)} objects: {deleted}"
    }