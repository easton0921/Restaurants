const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: Config.get("SMTP").Host,
    port: Config.get("SMTP").Port,
    secure: true, // use SSL
    auth: {
        user: Config.get("SMTP").User,
        pass: Config.get("SMTP").Password
    },
    tls: {
        rejectUnauthorized: true
    }
});

module.exports.send = async (
    { to, subject, message }
) => {
    try {
        const info = await transporter.sendMail({
            from: `"${Config.get("SMTP").From}" <${Config.get("SMTP").FromEmail}>`,
            to: [].concat(to),
            subject: `${subject}`,
            text: `${message}`,
            html: `${message}`
        });

        console.log("EmailService", "Message sent: %s", info.messageId);

    } catch (error) {
        console.error("EmailService", error);
    }
};