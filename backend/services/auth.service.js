import jwt from 'jsonwebtoken';
import userRepository from '../repositories/user.repository.js';
import logger from '../config/logger.js';

class AuthService {
  async register(name, email, password, role) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email is already registered');
    }

    const user = await userRepository.create({
      name,
      email,
      password,
      role,
    });

    logger.info(`User registered: ${email} (${role})`);
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user || user.status !== 'Active') {
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // Check if MFA is enabled
    if (user.isMfaEnabled) {
      return {
        requireMfa: true,
        userId: user._id,
        email: user.email,
      };
    }

    const token = this.generateToken(user);
    logger.info(`User logged in: ${email}`);
    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async verifyMfa(userId, code) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Simulate OTP validation: standard simulated code "123456" or check MFA secret
    if (code !== '123456' && code !== user.mfaSecret) {
      throw new Error('Invalid MFA code');
    }

    const token = this.generateToken(user);
    logger.info(`User authenticated via MFA: ${user.email}`);
    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async enableMfa(userId) {
    const mockSecret = Math.floor(100000 + Math.random() * 900000).toString(); // simple mock MFA OTP
    await userRepository.update(userId, {
      isMfaEnabled: true,
      mfaSecret: mockSecret,
    });
    return { secret: mockSecret };
  }

  generateToken(user) {
    return jwt.sign(
      { id: user._id, role: user.role, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'enterprise_hms_jwt_secret_key_2026_secure',
      { expiresIn: '24h' }
    );
  }
}

export default new AuthService();
