const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      name,
      email,
      serviceType,
      academicLevel,
      pages,
      deadline,
      urgency,
      currency,
      instructions,
      estimatedPrice,
      files // Array of { filename, content (base64) }
    } = req.body;

    // Create email content
    const emailContent = `
New Quote Request from Gradex Writers Website

Contact Information:
- Name: ${name}
- Email: ${email}

Project Details:
- Service Type: ${serviceType}
- Academic Level: ${academicLevel || 'Not specified'}
- Pages/Words: ${pages}
- Deadline: ${deadline}
- Urgency: ${urgency}
- Preferred Currency: ${currency}
- Estimated Price: ${estimatedPrice || 'Not calculated'}

Additional Instructions:
${instructions || 'None provided'}

---
This email was sent from the Gradex Writers quote form.
    `;

    // Create transporter using Gmail SMTP
    // You'll need to set environment variables: EMAIL_USER and EMAIL_PASS
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password',
      },
    });

    // Prepare attachments from base64 files
    const attachments = [];
    if (files && Array.isArray(files) && files.length > 0) {
      files.forEach(file => {
        attachments.push({
          filename: file.filename,
          content: file.content,
          encoding: 'base64',
        });
      });
    }

    // Prepare email with attachments
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: 'tmmchess@gmail.com',
      subject: `New Quote Request from ${name} - ${serviceType}`,
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0A1F44;">New Quote Request from Gradex Writers Website</h2>
          
          <h3 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Contact Information</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          
          <h3 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; margin-top: 30px;">Project Details</h3>
          <p><strong>Service Type:</strong> ${serviceType}</p>
          <p><strong>Academic Level:</strong> ${academicLevel || 'Not specified'}</p>
          <p><strong>Pages/Words:</strong> ${pages}</p>
          <p><strong>Deadline:</strong> ${deadline}</p>
          <p><strong>Urgency:</strong> ${urgency}</p>
          <p><strong>Preferred Currency:</strong> ${currency}</p>
          <p><strong>Estimated Price:</strong> ${estimatedPrice || 'Not calculated'}</p>
          
          <h3 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; margin-top: 30px;">Additional Instructions</h3>
          <p style="white-space: pre-wrap;">${instructions || 'None provided'}</p>
          
          ${attachments.length > 0 ? `<p style="margin-top: 30px;"><strong>Attachments:</strong> ${attachments.length} file(s) attached</p>` : ''}
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;"><em>This email was sent from the Gradex Writers quote form.</em></p>
        </div>
      `,
      attachments: attachments,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ 
      success: true, 
      message: 'Quote request submitted successfully! We will contact you soon.' 
    });

  } catch (error) {
    console.error('Error submitting quote:', error);
    return res.status(500).json({ 
      error: 'Failed to submit quote request. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

