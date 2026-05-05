import express, { Request, Response } from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// POST /api/auth/signup
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
    console.log(`[LOCAL SERVER] POST /api/auth/signup hit with email:`, req.body?.email);
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            res.status(400).json({ message: 'Please enter all fields' });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ message: 'Password must be at least 6 characters' });
            return;
        }

        // Check for existing user
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            res.status(400).json({ message: 'An account with this email already exists' });
            return;
        }

        // Create new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        // Create JWT
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                allergies: savedUser.allergies
            }
        });
    } catch (error: any) {
        console.error('LOCAL SERVER Signup error:', error.message, error.stack);
        res.status(500).json({ message: `LOCAL Server error during signup: ${error.message}` });
    }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            res.status(400).json({ message: 'Please enter all fields' });
            return;
        }

        // Check for user
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password as string);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }

        // Create JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                allergies: user.allergies
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// GET /api/auth/me (Optional, to get user data from token)
router.get('/me', async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.header('x-auth-token');
        if (!token) {
            res.status(401).json({ message: 'No token, authorization denied' });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ user });
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
});

// PUT /api/auth/me/allergies
router.put('/me/allergies', async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.header('x-auth-token');
        if (!token) {
            res.status(401).json({ message: 'No token, authorization denied' });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        const { allergies } = req.body;
        
        if (!Array.isArray(allergies)) {
            res.status(400).json({ message: 'Allergies must be an array' });
            return;
        }

        const user = await User.findByIdAndUpdate(
            decoded.id,
            { allergies },
            { new: true }
        ).select('-password');

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating allergies' });
    }
});

export default router;
