# AWS Serverless File Upload Pipeline

This project implements a fully automated serverless file upload pipeline on AWS. It leverages Infrastructure as Code (CloudFormation) and continuous integration/continuous deployment (CI/CD) using AWS CodePipeline and CodeBuild. The system enables users to upload files via a web interface, routes them through an API Gateway to a Lambda function, stores them in S3, and manages event-driven processing using Amazon SQS and EventBridge. Monitoring and alerting are implemented with CloudWatch and SNS.

---

## Architecture Overview

- **Frontend**: Static S3 website for uploading images via a web form.
- **API Layer**: Amazon API Gateway with a `POST /upload` endpoint.
- **Backend**: AWS Lambda function processes the upload and stores the file in S3.
- **Queue**: Amazon SQS handles background processing; a Dead Letter Queue (DLQ) captures failed messages.
- **Monitoring**:
  - CloudWatch Alarm tracks Lambda errors and sends email alerts via SNS.
  - EventBridge schedules daily cleanup of expired uploads in S3.
- **CI/CD**: CodePipeline and CodeBuild orchestrate automatic deployment from GitHub.
- **Infrastructure**: All resources are provisioned using modular CloudFormation templates.

---

## Features

- Upload images securely via REST API.
- Store uploaded files in Amazon S3.
- Queue metadata in SQS for asynchronous processing.
- Automatically remove expired uploads (older than 7 days).
- Capture processing failures with DLQ and log them for review.
- Monitor Lambda errors and alert via email (SNS).
- Automate deployments using GitHub commits through CodePipeline.

---

## Deployment Workflow

1. Developer pushes changes to the GitHub repository.
2. CodePipeline detects changes and triggers a CodeBuild job.
3. CodeBuild:
   - Packages Lambda functions and templates.
   - Uploads artifacts to the designated S3 bucket.
   - Deploys the CloudFormation root stack with versioning.
4. Static website is uploaded to the frontend S3 bucket.
5. User uploads image → API Gateway → Lambda → S3 + SQS.
6. If processing fails, the message is routed to the DLQ.
7. DLQ Processor Lambda logs the failure for analysis.
8. CloudWatch monitors error metrics and sends notifications.
9. EventBridge triggers the cleanup Lambda every 24 hours.

---

## Setup Instructions

1. Deploy `bootstrap.yaml` manually to create initial buckets and IAM roles.
2. Commit and push code to GitHub.
3. CodePipeline automatically:
   - Builds and packages artifacts.
   - Deploys CloudFormation templates in the correct order.
   - Uploads the latest static site files to S3.

---

## Monitoring and Notifications

- **CloudWatch Alarm**: Triggers when the `Errors` metric for any Lambda function exceeds 1 within a 60-second period.
- **SNS Notification**: Sends an alert to email when triggered.
