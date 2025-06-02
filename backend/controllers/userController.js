
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';


const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('Please provide username and password');
  }

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);
    throw new Error('Username already exists');
  }

  const user = await User.create({
    username,
    password,
  });

  if (user) {
    const userResponse = {
      _id: user._id,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      token: generateToken(user._id),
    };
    res.status(201).json(userResponse);
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});


const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('Please provide username and password');
  }

  const user = await User.findOne({ username }).select('+password');

  if (user && (await user.matchPassword(password))) {
    const userResponse = {
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    };
    res.json(userResponse);
  } else {
    res.status(401);
    throw new Error('Invalid username or password');
  }
});


const getUserProfile = asyncHandler(async (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      username: req.user.username,
      createdAt: req.user.createdAt,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { registerUser, loginUser, getUserProfile };