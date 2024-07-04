import * as nodemailer from "nodemailer";

// TODO: Replace this demo email transporter with the actual ones

const emailTransporter = nodemailer.createTransport({
    service: "gmail",
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
    const res = await emailTransporter.sendMail({
        from: process.env.SUPPORT_EMAIL,
        to: receiver,
        subject: subject,
        text: text || "",
        html: template,
    });
};

// const verificationEmailTransporter = nodemailer.createTransport({
// 	host: "smtp.zoho.com",
// 	port: 465,
// 	secure: true,
// 	auth: {
// 		user: process.env.SUPPORT_EMAIL,
// 		pass: process.env.SUPPORT_EMAIL_APP_PASSWORD,
// 	},
// });

// type sendVerificationEmailOptions = {
// 	receiver: string;
// 	subject: string;
// 	text?: string;
// 	template: string;
// };

// export const sendVerificationEmail = async ({
// 	receiver,
// 	subject,
// 	text,
// 	template,
// }: sendVerificationEmailOptions) => {
// 	await verificationEmailTransporter.sendMail({
// 		from: process.env.SUPPORT_EMAIL,
// 		to: receiver,
// 		subject: subject,
// 		text: text,
// 		html: template,
// 	});
// };
