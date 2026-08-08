import BaseRepository from './base.repository.js';
import User from '../models/User.js';

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    return User.findOne({ email: cleanEmail, isDeleted: false }).select('+password +mfaSecret');
  }

  async findByIdWithSecrets(id) {
    if (!id) return null;
    return User.findById(id).select('+password +mfaSecret');
  }
}

export default new UserRepository();

