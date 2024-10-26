import env from "@/utils/env";
import * as nodemailer from "nodemailer";

// TODO: Replace this demo email transporter with the actual ones
const emailTransporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
        user: env.DEMO_EMAIL,
        pass: env.DEMO_EMAIL_PASSWORD,
    },
});

type sendEmailOptions = {
    receiver: string;
    subject: string;
    template: string;
    text?: string;
};

export async function sendEmail({ receiver, subject, text, template }: sendEmailOptions) {
    return await emailTransporter.sendMail({
        from: "noreply@crmm.tech",
        to: receiver,
        subject: subject,
        text: text || "",
        html: template,
    });
}
