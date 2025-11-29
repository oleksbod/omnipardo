const { SESClient, SendEmailCommand, SendRawEmailCommand } = require("@aws-sdk/client-ses");

// Initialize SES client
const sesClient = new SESClient({
    region: process.env.AWS_REGION || "us-east-1",
});

// Function to format email in HTML
function formatEmailHTML(formData) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 5px; padding: 10px; background-color: white; border-left: 3px solid #4CAF50; }
        .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Contact Form Submission</h1>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">First Name:</div>
                <div class="value">${formData.first_name || "Not specified"}</div>
            </div>
            <div class="field">
                <div class="label">Last Name:</div>
                <div class="value">${formData.last_name || "Not specified"}</div>
            </div>
            <div class="field">
                <div class="label">Residence:</div>
                <div class="value">${formData.residence || "Not specified"}</div>
            </div>
            <div class="field">
                <div class="label">Email:</div>
                <div class="value">${formData.email || "Not specified"}</div>
            </div>
            <div class="field">
                <div class="label">Phone:</div>
                <div class="value">${formData.phone || "Not specified"}</div>
            </div>
            <div class="field">
                <div class="label">Model of Interest:</div>
                <div class="value">${formData.models || "Not specified"}</div>
            </div>
            <div class="field">
                <div class="label">Navigation Area:</div>
                <div class="value">${formData.port || "Not specified"}</div>
            </div>
            <div class="field">
                <div class="label">Boat Registration:</div>
                <div class="value">${formData.boat_registration || "Not specified"}</div>
            </div>
            <div class="field">
                <div class="label">Message:</div>
                <div class="value">${formData.message || "Not specified"}</div>
            </div>
            <div class="field">
                <div class="label">Consents:</div>
                <div class="value">
                    <strong>Marketing:</strong> ${formData.marketing_consent ? "Yes ✓" : "No ✗"}<br>
                    <strong>Profiling:</strong> ${formData.profiling_consent ? "Yes ✓" : "No ✗"}
                </div>
            </div>
        </div>
        <div class="footer">
            <p>Submission Date: ${new Date().toLocaleString("en-US")}</p>
        </div>
    </div>
</body>
</html>
    `.trim();
}

// Function to format email in text
function formatEmailText(formData) {
    return `
New Contact Form Submission:

First Name: ${formData.first_name || "Not specified"}
Last Name: ${formData.last_name || "Not specified"}
Residence: ${formData.residence || "Not specified"}
Email: ${formData.email || "Not specified"}
Phone: ${formData.phone || "Not specified"}
Model of Interest: ${formData.models || "Not specified"}
Navigation Area: ${formData.port || "Not specified"}
Boat Registration: ${formData.boat_registration || "Not specified"}
Message: ${formData.message || "Not specified"}

Consents:
- Marketing: ${formData.marketing_consent ? "Yes" : "No"}
- Profiling: ${formData.profiling_consent ? "Yes" : "No"}

---
Submission Date: ${new Date().toLocaleString("en-US")}
    `.trim();
}

// Function to format PDF email in HTML (short description only)
function formatPdfEmailHTML(formData) {
    const model = formData.models || "your yacht";
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #262322; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .message { padding: 15px; background-color: white; border-left: 3px solid #262322; text-align: left; }
        .message p { text-align: left; margin: 10px 0; }
        .message p:first-child { font-weight: bold; }
        .message p:last-child { font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Your Pardo Yacht Configuration</h1>
        </div>
        <div class="content">
            <div class="message">
                <p>Dear ${formData.first_name || "Customer"},</p>
                <p>Thank you for configuring your Pardo ${model}.</p>
                <p>Please find attached your complete yacht configuration PDF with all selected options and camera views.</p>
                <p>If you have any questions or would like to discuss your configuration, please don't hesitate to contact us.</p>
                <p>Best regards,<br>Pardo Yachts Team</p>
            </div>
        </div>        
    </div>
</body>
</html>
    `.trim();
}

// Function to format PDF email in text (short description only)
function formatPdfEmailText(formData) {
    const model = formData.models || "your yacht";
    return `
Your Pardo Yacht Configuration

Dear ${formData.first_name || "Customer"},

Thank you for configuring your Pardo ${model}.

Please find attached your complete yacht configuration PDF with all selected options and camera views.

If you have any questions or would like to discuss your configuration, please don't hesitate to contact us.

Best regards,
Pardo Yachts Team

    `.trim();
}

// Lambda handler
exports.handler = async (event) => {
    // Get origin from request headers (for CORS)
    const requestOrigin = event.headers?.origin || event.headers?.Origin;

    // Allowed origins list - includes development and production domains
    const allowedOrigins = [
        "https://oleksbod.github.io",
        "https://configurator.pardoyachts.com",
        // Development origins
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ];

    // Check if it's a localhost/127.0.0.1 origin for development (any port)
    const isDevOrigin = requestOrigin && (requestOrigin.includes("localhost") || requestOrigin.includes("127.0.0.1"));

    // Determine CORS origin
    let corsOrigin = "*"; // Default fallback
    if (requestOrigin) {
        // Check if exact match in allowed origins
        if (allowedOrigins.includes(requestOrigin)) {
            corsOrigin = requestOrigin;
        } else if (isDevOrigin) {
            // Allow any localhost/127.0.0.1 for development
            corsOrigin = requestOrigin;
        }
    }

    // CORS headers - complete for development and production
    const headers = {
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Headers": "Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
        "Access-Control-Max-Age": "86400", // 24 hours - cache preflight for 24 hours
        "Content-Type": "application/json",
    };

    // Handle preflight requests (OPTIONS)
    // Check both httpMethod and requestContext for OPTIONS
    const httpMethod = event.httpMethod || event.requestContext?.http?.method || event.requestContext?.httpMethod;
    if (httpMethod === "OPTIONS" || httpMethod === "options") {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: "OK" }),
        };
    }

    try {
        // Parse body
        let formData;
        if (typeof event.body === "string") {
            formData = JSON.parse(event.body);
        } else {
            formData = event.body;
        }

        // Validate data
        if (!formData.email || !formData.first_name || !formData.last_name) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: "Missing required fields",
                }),
            };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: "Invalid email format",
                }),
            };
        }

        // Get environment variables
        const fromEmail = process.env.FROM_EMAIL || "noreply@cantieredelpardo.com";
        const toEmail = process.env.TO_EMAIL;
        const debugPdfEmail = process.env.DEBUG_PDF_EMAIL === "true" || process.env.DEBUG_PDF_EMAIL === "1";

        // Internal recipients for all emails
        const internalRecipients = [
            "info@pardoyachts.com",
            "marketing@cantieredelpardo.com",
            "configurator@cantieredelpardo.com",
        ];

        if (!toEmail) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: "Server error: email addresses not configured",
                }),
            };
        }

        // Determine if this is a configuration request
        const isConfigurationRequest = formData.configuration && formData.first_name === "Configuration";

        // Check if PDF attachment is present
        const hasPdfAttachment = formData.pdf_attachment && formData.pdf_filename;

        let response;

        if (hasPdfAttachment) {
            // Use SendRawEmailCommand for emails with attachments
            // Always use "Your Pardo Yacht Configuration" subject for PDF emails
            const subject = "Your Pardo Yacht Configuration";
            // Use short PDF email format instead of full form
            const htmlBody = formatPdfEmailHTML(formData);
            const textBody = formatPdfEmailText(formData);

            // Build recipients based on DEBUG_PDF_EMAIL setting
            let toAddresses, bccAddresses, ccAddresses;

            if (debugPdfEmail) {
                // DEBUG MODE: Send PDF only to user email and TO_EMAIL
                toAddresses = [formData.email, toEmail].filter(Boolean);
                bccAddresses = [];
                ccAddresses = [];
                console.log("DEBUG_PDF_EMAIL enabled: Sending PDF only to user and TO_EMAIL");
            } else {
                // PRODUCTION MODE: Send PDF to user + copies to internal recipients
                if (isConfigurationRequest) {
                    // Configuration request: send to user, BCC to internal
                    toAddresses = [formData.email];
                    bccAddresses = internalRecipients;
                    ccAddresses = [];
                } else {
                    // Contact form with PDF: send to main recipient, CC to internal
                    toAddresses = [toEmail];
                    bccAddresses = [];
                    ccAddresses = internalRecipients;
                }
            }

            // Create MIME message with attachment
            const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            let rawMessage = `From: ${fromEmail}\r\n`;
            rawMessage += `To: ${toAddresses.join(", ")}\r\n`;
            if (ccAddresses.length > 0) {
                rawMessage += `Cc: ${ccAddresses.join(", ")}\r\n`;
            }
            if (bccAddresses.length > 0) {
                rawMessage += `Bcc: ${bccAddresses.join(", ")}\r\n`;
            }
            rawMessage += `Subject: ${subject}\r\n`;
            rawMessage += `MIME-Version: 1.0\r\n`;
            rawMessage += `Content-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n`;

            // HTML part
            rawMessage += `--${boundary}\r\n`;
            rawMessage += `Content-Type: multipart/alternative; boundary="${boundary}_alt"\r\n\r\n`;

            // Text part
            rawMessage += `--${boundary}_alt\r\n`;
            rawMessage += `Content-Type: text/plain; charset=UTF-8\r\n`;
            rawMessage += `Content-Transfer-Encoding: 7bit\r\n\r\n`;
            rawMessage += `${textBody}\r\n\r\n`;

            // HTML part
            rawMessage += `--${boundary}_alt\r\n`;
            rawMessage += `Content-Type: text/html; charset=UTF-8\r\n`;
            rawMessage += `Content-Transfer-Encoding: 7bit\r\n\r\n`;
            rawMessage += `${htmlBody}\r\n\r\n`;
            rawMessage += `--${boundary}_alt--\r\n\r\n`;

            // PDF attachment
            rawMessage += `--${boundary}\r\n`;
            rawMessage += `Content-Type: application/pdf; name="${formData.pdf_filename}"\r\n`;
            rawMessage += `Content-Disposition: attachment; filename="${formData.pdf_filename}"\r\n`;
            rawMessage += `Content-Transfer-Encoding: base64\r\n\r\n`;
            rawMessage += `${formData.pdf_attachment}\r\n\r\n`;
            rawMessage += `--${boundary}--\r\n`;

            const rawEmailParams = {
                RawMessage: {
                    Data: Buffer.from(rawMessage),
                },
            };

            const rawCommand = new SendRawEmailCommand(rawEmailParams);
            response = await sesClient.send(rawCommand);
        } else {
            // Use SendEmailCommand for emails without attachments
            // For configuration requests: send to user's email, BCC to internal recipients
            // For contact forms: send to main recipient and CC to internal recipients
            let destination;
            if (isConfigurationRequest) {
                // Configuration: send to user, BCC to internal
                destination = {
                    ToAddresses: [formData.email],
                    BccAddresses: internalRecipients,
                };
            } else {
                // Contact form: send to main recipient and CC to internal
                destination = {
                    ToAddresses: [toEmail],
                    CcAddresses: internalRecipients,
                };
            }

            // Parameters for sending email
            const params = {
                Source: fromEmail,
                Destination: destination,
                Message: {
                    Subject: {
                        Data: isConfigurationRequest ? "Your Pardo Yacht Configuration" : "New Contact Form Submission",
                        Charset: "UTF-8",
                    },
                    Body: {
                        Html: {
                            Data: formatEmailHTML(formData),
                            Charset: "UTF-8",
                        },
                        Text: {
                            Data: formatEmailText(formData),
                            Charset: "UTF-8",
                        },
                    },
                },
            };

            // Send email via SES
            const command = new SendEmailCommand(params);
            response = await sesClient.send(command);
        }

        console.log("Email sent successfully:", response.MessageId);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: "Message sent successfully",
                messageId: response.MessageId,
            }),
        };
    } catch (error) {
        console.error("Error sending email:", error);

        // More detailed error handling
        let errorMessage = "Error sending message";
        if (error.name === "MessageRejected") {
            errorMessage = "Email cannot be sent. Check SES settings.";
        } else if (error.name === "InvalidParameterValue") {
            errorMessage = "Invalid email sending parameters.";
        }

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: errorMessage,
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            }),
        };
    }
};
