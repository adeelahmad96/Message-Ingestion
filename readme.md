# WhatsApp Webhook Backend

This project sets up a backend application to handle WhatsApp webhook payloads, authenticate them, and store them in an SQS queue. The application uses AWS Lambda, API Gateway, and SQS, and is deployed using AWS CloudFormation.

## Architecture

The architecture consists of:
1. **API Gateway**: To handle incoming HTTP requests.
2. **Lambda Functions**: 
   - One function to verify the WhatsApp token.
   - Another function to authenticate the payload and send it to SQS.
3. **SQS Queue**: To store authenticated messages.

## Prerequisites

1. **AWS CLI**: Ensure you have the AWS CLI installed and configured with the necessary permissions.
2. **AWS S3 Bucket**: You'll need an S3 bucket to store the Lambda function code.
3. **Meta App**: Set up a Business Type App in the Meta App Dashboard with the Webhooks Product.

## Deployment Steps

### 1. Package Lambda Code

Package the Lambda code:

```bash
zip index.zip index.js
