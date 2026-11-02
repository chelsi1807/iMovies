import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { getDbStatus } from '../config/db.js';
import { dbStore } from '../data/dbStore.js';
import { generateToken } from '../middleware/auth.js';

const useMongo = () => getDbStatus().isMongoConnected;

// ─── POST /api/auth/register ─────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    let newUser;
    if (useMongo()) {
      const existing = await UserModel.findOne({ email: email.toLowerCase().trim() });
      if (existing) return res.status(400).json({ success: false, message: 'An account with this email already exists.' });

      newUser = await UserModel.create({
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'user',
        phone: phone || '',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`
      });
      newUser = newUser.toObject();
    } else {
      const existing = dbStore.findOne('users', { email: email.toLowerCase().trim() });
      if (existing) return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      newUser = dbStore.create('users', {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'user',
        phone: phone || '',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`
      });
    }

    const token = generateToken(newUser);
    const safeUser = { ...newUser };
    delete safeUser.password;

    res.status(201).json({ success: true, message: 'Account created successfully!', token, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/auth/login ────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    let user;
    if (useMongo()) {
      user = await UserModel.findOne({ email: email.toLowerCase().trim() }).lean();
    } else {
      user = dbStore.findOne('users', { email: email.toLowerCase().trim() });
    }

    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const token = generateToken(user);
    const safeUser = { ...user };
    delete safeUser.password;

    res.status(200).json({ success: true, message: 'Login successful!', token, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/auth/me ────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    let user;
    if (useMongo()) {
      user = await UserModel.findById(req.user._id).select('-password').lean();
    } else {
      user = dbStore.findById('users', req.user._id);
      if (user) { user = { ...user }; delete user.password; }
    }
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PUT /api/auth/profile ───────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const updates = {};
    if (name)   updates.name   = name;
    if (phone)  updates.phone  = phone;
    if (avatar) updates.avatar = avatar;

    let user;
    if (useMongo()) {
      user = await UserModel.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password').lean();
    } else {
      dbStore.findByIdAndUpdate('users', req.user._id, updates);
      user = dbStore.findById('users', req.user._id);
      if (user) { user = { ...user }; delete user.password; }
    }
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.status(200).json({ success: true, message: 'Profile updated successfully!', user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
