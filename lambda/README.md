# AWS Lambda function for sending emails via Amazon SES

This Lambda function handles requests from the contact form and sends emails via Amazon SES.

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Create ZIP archive

**Windows PowerShell:**

```powershell
Compress-Archive -Path index.js,send-email.js,package.json,node_modules -DestinationPath function.zip
```

**Linux/Mac:**

```bash
zip -r function.zip index.js send-email.js package.json node_modules
```

**Or use the script:**

```bash
npm run package
```

**Note:** The `index.js` file is added for Lambda compatibility (default handler is `index.handler`). If you use `index.js`, the handler should be `index.handler`. If you use only `send-email.js`, the handler should be `send-email.handler`.

### 3. Upload to AWS Lambda

1. Go to [AWS Lambda Console](https://console.aws.amazon.com/lambda/)
2. Create a new function or select an existing one
3. Upload the `function.zip` file
4. **IMPORTANT:** Check the Handler:
    - Handler = `index.handler` (default - this is correct)
5. Configure environment variables (see below)

## Environment Variables Configuration

In Lambda Console → Configuration → Environment variables add:

```
FROM_EMAIL=your-verified-email@example.com
TO_EMAIL=recipient@example.com
AWS_REGION=us-east-1
```

## IAM Role Configuration

The Lambda function needs permissions to send emails via SES.

1. In Lambda Console → Configuration → Permissions
2. Click on the IAM role
3. Add the `AmazonSESFullAccess` policy or create a custom one:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": ["ses:SendEmail", "ses:SendRawEmail"],
            "Resource": "*"
        }
    ]
}
```

## Timeout Configuration

1. Configuration → General configuration → Edit
2. Timeout: `30 seconds`
3. Memory: `256 MB` (minimum)

## Testing

In Lambda Console → Test create a test event:

```json
{
    "httpMethod": "POST",
    "body": "{\"first_name\":\"Test\",\"last_name\":\"User\",\"email\":\"test@example.com\",\"phone\":\"+380501234567\",\"residence\":\"Kyiv\"}"
}
```

## API Gateway Integration

After configuring the Lambda function, set up API Gateway (see `SERVERLESS_SETUP.md`).

## Response Structure

The Lambda function returns an object in API Gateway format:

```javascript
{
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        success: true,
        message: "Message sent successfully",
        messageId: "xxx"
    })
}
```

## Detailed Instructions

See `../SERVERLESS_SETUP.md` for complete instructions on setting up Lambda + API Gateway.
