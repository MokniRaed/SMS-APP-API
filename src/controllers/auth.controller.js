import jwt from 'jsonwebtoken';
import { Role, User } from '../models/user.model.js';




export const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Username or email already exists'
      });
    }

    // Check if the role exists
    const roleExists = await Role.findById(role);
    if (!roleExists) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = new User({
      username,
      email,
      password,
      role
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating user',
      error: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('role', 'name description');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set the token in the cookies (httpOnly, secure, sameSite)
    res.cookie('token', token, {
      httpOnly: true, // So it can't be accessed via JavaScript
      secure: process.env.NODE_ENV === 'production', // Set to true in production (uses https)
      sameSite: 'lax', // or 'strict' if you need strict cookie policy
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    // Send user data along with the token (but without sending the token directly in the response body)
    return res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role.name
      }
    });
  } catch (error) {
    console.log("err", error);

    res.status(500).json({
      message: 'Error during login',
      error: error.message
    });
  }
};