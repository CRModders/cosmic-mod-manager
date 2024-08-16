import * as nodemailer from "nodemailer";

// TODO: Replace this demo email transporter with the actual ones
const emailTransporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
        user: process.env.DEMO_EMAIL as string,
        pass: process.env.DEMO_EMAIL_PASSWORD as string,
    },
});

type sendEmailOptions = {
    receiver: string;
    subject: string;
    template: string;
    text?: string;
};

export const sendEmail = async ({ receiver, subject, text, template }: sendEmailOptions) => {
    return await emailTransporter.sendMail({
        from: process.env.SUPPORT_EMAIL,
        to: receiver,
        subject: subject,
        text: text || "",
        html: template,
    });
};
