import { APP_NAME } from "../constants/app";

const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL as string;

const COMMON_STYLES = `
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #faf5ff 0%, #fdf2f8 50%, #fff7ed 100%); padding: 20px; }
        .container { margin: 0 auto; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(20px); border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.3); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #9333ea 0%, #7917d6 50%, #9809d5 100%); padding: 40px 30px; text-align: center; }
        .logo { width: 60px; height: 60px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; margin: 0 auto 20px; color: white; font-weight: bold; font-size: 24px; text-align: center; line-height: 60px; }
        .header h1 { color: white; font-size: 32px; font-weight: 700; margin-bottom: 20px; }
        .header p { color: rgba(255, 255, 255, 0.9); font-size: 16px; }
        .content { padding: 40px 30px; }
        .welcome-text { color: #1f2937; font-size: 18px; line-height: 1.6; margin-bottom: 30px; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #7917d6 50%, #9809d5 100%); color: white !important; text-decoration: none; padding: 16px 32px; border-radius: 16px; font-weight: 600; box-shadow: 0 8px 20px rgba(147, 51, 234, 0.3); }
        .footer { padding: 30px; text-align: center; background: #f9fafb; border-top: 1px solid #e5e7eb; }
        .footer p { color: #6b7280; font-size: 14px; }
    </style>
`;

export const SIGNUP_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
${COMMON_STYLES}
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">F</div>
            <h1>Welcome to ${APP_NAME}!</h1>
            <p>Thank you for joining ${APP_NAME}! You're now part of a community of 1K+ creators showcasing their work beautifully.</p>
        </div>
        <div class="content">
            <p style="text-align: center; margin-bottom: 30px;">
                <a href=${NEXT_PUBLIC_APP_URL}/dashboard class="cta-button">Create your first post</a>
            </p>
        </div>
        <div class="footer">
            <p>© 2025 ${APP_NAME}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

export const FORGOT_PASSWORD_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
${COMMON_STYLES}
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">F</div>
            <h1>Reset Your Password</h1>
            <p>Secure your account with a new password</p>
        </div>
        <div class="content">
            <p>We received a request to reset your password for your ${APP_NAME} account. Click the button below to securely reset your password.</p>
            <p style="text-align: center; margin-bottom: 30px;">
                <a href=${NEXT_PUBLIC_APP_URL}/reset-password?t={{token}} class="cta-button">Reset Your Password</a>
            </p>
            <p style="text-align: center; color: #6b7280; font-size: 14px;">
                This link will expire in 15 minutes for security reasons.
            </p>
            <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px;">
                If you didn't request this password reset, please ignore this email. Your account remains secure.
            </p>
        </div>
        <div class="footer">
            <p>© 2025 ${APP_NAME}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

export const PASSWORD_RESET_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
${COMMON_STYLES}
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">F</div>
            <h1>Password Reset Confirmed</h1>
            <p>Your ${APP_NAME} account password has been updated</p>
        </div>
        <div class="content">
            <p  >We're happy to let you know that your ${APP_NAME} account password has been successfully reset.</p>
            <p style="text-align: center; margin-bottom: 30px;">
                <a href=${NEXT_PUBLIC_APP_URL}/login class="cta-button">Go to Your Dashboard</a>
            </p>
            <p style="text-align: center; color: #6b7280; font-size: 14px;">
                If you didn't request this password reset, please contact our support team immediately.
            </p>
        </div>
        <div class="footer">
            <p>© 2025 ${APP_NAME}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
