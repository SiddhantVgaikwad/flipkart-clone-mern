const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter object using SMTP
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST, // SMTP server address (e.g., smtp.gmail.com)
        port: process.env.SMTP_PORT, // SMTP port (e.g., 465 for SSL or 587 for TLS)
        secure: true, // Use SSL/TLS
        auth: {
            user: process.env.SMTP_MAIL, // Your email address
            pass: process.env.SMTP_PASSWORD, // Your email password or app-specific password
        },
    });

    // Define email options
    const mailOptions = {
        from: process.env.SMTP_MAIL, // Sender address
        to: options.email, // Recipient address
        subject: options.subject, // Email subject
        html: options.message, // HTML body
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;