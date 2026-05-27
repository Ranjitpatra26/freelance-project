const express = require('express');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

const router = express.Router();

// Generate backup codes
const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 10; i++) {
        codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
};

// @POST /api/twofa/setup
// Generate TOTP secret and QR code for admin to scan
router.post('/setup', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        // Generate secret
        const secret = speakeasy.generateSecret({
            name: `SuddhEats Admin (${user.email})`,
            issuer: 'SuddhEats',
            length: 32
        });

        // Generate QR code
        const qrCode = await QRCode.toDataURL(secret.otpauth_url);

        // Generate backup codes
        const backupCodes = generateBackupCodes();

        // Store in session (don't save to DB yet)
        res.json({
            success: true,
            qrCode,
            manual_entry_key: secret.base32,
            backupCodes,
            secret: secret.base32
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @POST /api/twofa/verify-setup
// Verify TOTP token and enable 2FA
router.post('/verify-setup', protect, adminOnly, async (req, res) => {
    try {
        const { totpCode, secret } = req.body;

        if (!totpCode || !secret) {
            return res.status(400).json({ message: 'TOTP code and secret required' });
        }

        // Verify the TOTP code
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: totpCode,
            window: 6
        });

        if (!verified) {
            return res.status(401).json({ message: 'Invalid authenticator code' });
        }

        // Save to database
        const user = await User.findById(req.user._id);
        const backupCodes = generateBackupCodes();

        user.twoFactorEnabled = true;
        user.twoFactorSecret = secret;
        user.backupCodes = backupCodes;
        await user.save();

        res.json({
            success: true,
            message: '2FA enabled successfully',
            backupCodes
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @POST /api/twofa/disable
// Disable 2FA for admin
router.post('/disable', protect, adminOnly, async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'Password required' });
        }

        const user = await User.findById(req.user._id);

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Disable 2FA
        user.twoFactorEnabled = false;
        user.twoFactorSecret = null;
        user.backupCodes = [];
        await user.save();

        res.json({
            success: true,
            message: '2FA disabled successfully'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
