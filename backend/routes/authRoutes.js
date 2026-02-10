import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// In-memory OTP store: { username: { otp, password, expiresAt } }
const otpStore = new Map();

// Send OTP email via Brevo REST API (no SDK needed)
const sendOtpEmail = async (username, otp) => {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'api-key': process.env.BREVO_API_KEY,
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            sender: {
                name: 'Naman Jewellers',
                email: process.env.BREVO_SENDER_EMAIL,
            },
            to: [{
                email: process.env.ADMIN_NOTIFICATION_EMAIL,
                name: 'Admin',
            }],
            subject: 'Registration OTP - Naman Jewellers',
            htmlContent: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #1a1a2e; color: #ffffff; border-radius: 12px;">
                    <h2 style="color: #d4a843; text-align: center; margin-bottom: 20px;">Naman Jewellers</h2>
                    <p style="font-size: 16px; color: #cccccc;">A new user is trying to register:</p>
                    <div style="background: #16213e; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #d4a843;">
                        <p style="margin: 0; font-size: 14px; color: #999;">Username</p>
                        <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; color: #ffffff;">${username}</p>
                    </div>
                    <div style="text-align: center; margin: 25px 0;">
                        <p style="font-size: 14px; color: #999; margin-bottom: 10px;">Verification OTP</p>
                        <div style="background: #d4a843; color: #1a1a2e; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 15px 30px; border-radius: 8px; display: inline-block;">${otp}</div>
                    </div>
                    <p style="font-size: 13px; color: #666; text-align: center;">This OTP expires in 5 minutes.</p>
                </div>
            `,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send email');
    }

    return await response.json();
};

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });

        // For demo/initial setup: if no user exists and credentials are admin/admin, create it
        if (!user && username === 'admin' && password === 'admin') {
            user = new User({ username, password });
            await user.save();
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({ username: user.username, role: user.role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Step 1: Register - Generate OTP and send email
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        if (password.length < 4) {
            return res.status(400).json({ message: 'Password must be at least 4 characters' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP with 5-minute expiry
        otpStore.set(username, {
            otp,
            password,
            expiresAt: Date.now() + 5 * 60 * 1000
        });

        // Send OTP email via Brevo
        await sendOtpEmail(username, otp);

        res.json({ message: 'OTP sent to admin email for verification' });
    } catch (error) {
        console.error('Registration OTP error:', error);
        res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }
});

// Step 2: Verify OTP and create account
router.post('/verify-otp', async (req, res) => {
    const { username, otp } = req.body;
    try {
        const stored = otpStore.get(username);

        if (!stored) {
            return res.status(400).json({ message: 'No OTP found. Please register again.' });
        }

        if (Date.now() > stored.expiresAt) {
            otpStore.delete(username);
            return res.status(400).json({ message: 'OTP has expired. Please register again.' });
        }

        if (stored.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }

        // OTP verified - create the user
        const user = new User({ username, password: stored.password });
        await user.save();

        // Clean up OTP
        otpStore.delete(username);

        res.status(201).json({ username: user.username, role: user.role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
