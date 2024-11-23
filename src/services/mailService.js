const formData = require('form-data');
const Mailgun = require('mailgun.js');

class MailService {
    constructor(apiKey, domain) {
        const mailgun = new Mailgun(formData);
        this.client = mailgun.client({ username: 'api', key: apiKey });
        this.domain = domain;
    }

    async sendEmail({ to, subject, text, html }) {
        try {
            const response = await this.client.messages.create(this.domain, {
                from: "Yawn's World <noreply@yawnsworld.com>",
                to,
                subject,
                text,
                html,
            });
            console.log('Email sent:', response);
            return response;
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email.');
        }
    }

    generateTransactionReceiptEmail({ transactionId, date, amount, token, toAddress, totalPaid, currency, totalFee, blockchainLink }) {
        return `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <a href="${process.env.CLIENT_URL}"><img src="https://buy.yawnsworld.com/assets/yw-D4zpNmPu.png" width="50" /></a>
                <h2>Transaction Receipt</h2>
                <p>Thank you for your transaction! Here are the details:</p>
                <ul>
                    <li><strong>Transaction ID:</strong> <a href="${blockchainLink}">${transactionId}</a></li>
                    <li><strong>Date:</strong> ${date}</li>
                    <li><strong>Amount Bought:</strong> ${amount} ${token}</li>
                    <li><strong>Total Paid:</strong> ${totalPaid} ${currency}</li>
                    <li><strong>Fee Paid:</strong> ${totalFee} ${currency}</li>
                    <li><strong>To Address:</strong> <a href="https://etherscan.io/address/${toAddress}">${toAddress}</a></li>
                </ul>
                <p><a href="${blockchainLink}" style="color: #007bff;">View on Explorer</a></p>
                <p>If you have any questions, feel free to contact us at support@yawnsworld.com.</p>
                <p>Best regards,<br>Yawn's World Team</p>
            </div>
        `;
    }
}

module.exports = MailService;
