import authService from '../services/auth.service.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      res.status(400);
      throw new Error('All fields (name, email, password, role) are required');
    }
    const user = await authService.register(name, email, password, role);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password are required');
    }
    const result = await authService.login(email, password);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error.message === 'Invalid email or password') {
      res.status(401);
    }
    next(error);
  }
};

export const verifyMfa = async (req, res, next) => {
  try {
    const { userId, code } = req.body;
    if (!userId || !code) {
      res.status(400);
      throw new Error('User ID and OTP code are required');
    }
    const result = await authService.verifyMfa(userId, code);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (error.message === 'Invalid MFA code' || error.message === 'User not found') {
      res.status(401);
    }
    next(error);
  }
};

export const enableMfa = async (req, res, next) => {
  try {
    const result = await authService.enableMfa(req.user.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
