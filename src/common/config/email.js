import nodemailer from "nodemailer"

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 465,
  secure: true, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail=async (to,subject,html)=>{
    await transporter.sendMail({
        from:`${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}`,        
        to,
        subject,
        html
    })
}

const sendVerificationEmail = async (email, token) => {
    const url = `${process.env.CLIENT_URL}/verify-email/${token}`;

    await sendMail(
        email,
        "Verify your email address",
        `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify your email</title>
        </head>

        <body style="
            margin: 0;
            padding: 0;
            background-color: #f4f6f8;
            font-family: Arial, Helvetica, sans-serif;
        ">

            <div style="
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            ">

                <!-- Header -->
                <div style="
                    background-color: #2563eb;
                    padding: 30px;
                    text-align: center;
                    color: #ffffff;
                ">
                    <h1 style="
                        margin: 0;
                        font-size: 28px;
                    ">
                        TAMSIL APP
                    </h1>

                    <p style="
                        margin: 8px 0 0;
                        font-size: 15px;
                    ">
                        Account Verification
                    </p>
                </div>

                <!-- Content -->
                <div style="padding: 40px 35px;">

                    <h2 style="
                        margin-top: 0;
                        color: #111827;
                        font-size: 24px;
                    ">
                        Welcome!
                    </h2>

                    <p style="
                        color: #4b5563;
                        font-size: 16px;
                        line-height: 1.6;
                    ">
                        Thank you for creating an account with us.
                    </p>

                    <p style="
                        color: #4b5563;
                        font-size: 16px;
                        line-height: 1.6;
                    ">
                        Please verify your email address by clicking the
                        button below.
                    </p>

                    <!-- Button -->
                    <div style="
                        text-align: center;
                        margin: 35px 0;
                    ">
                        <a href="${url}" style="
                            display: inline-block;
                            padding: 14px 28px;
                            background-color: #2563eb;
                            color: #ffffff;
                            text-decoration: none;
                            border-radius: 7px;
                            font-size: 16px;
                            font-weight: bold;
                        ">
                            Verify My Email
                        </a>
                    </div>

                    <p style="
                        color: #6b7280;
                        font-size: 14px;
                        line-height: 1.6;
                    ">
                        If you did not create this account, you can safely
                        ignore this email.
                    </p>

                    <hr style="
                        border: none;
                        border-top: 1px solid #e5e7eb;
                        margin: 30px 0;
                    ">

                    <p style="
                        color: #9ca3af;
                        font-size: 12px;
                        line-height: 1.5;
                    ">
                        If the button doesn't work, copy and paste the
                        following link into your browser:
                    </p>

                    <p style="
                        word-break: break-all;
                        color: #2563eb;
                        font-size: 12px;
                    ">
                        ${url}
                    </p>

                </div>

                <!-- Footer -->
                <div style="
                    background-color: #f9fafb;
                    padding: 20px;
                    text-align: center;
                ">
                    <p style="
                        margin: 0;
                        color: #9ca3af;
                        font-size: 12px;
                    ">
                        © 2026 TAMSIL APP. All rights reserved.
                    </p>
                </div>

            </div>

        </body>
        </html>
        `
    );
};
transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP ERROR:", error);
    } else {
        console.log("SMTP server is ready");
    }
});
export {sendMail,sendVerificationEmail}