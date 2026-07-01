import BaseRepository from './base.repository.js';
import Staff from '../models/Staff.js';

class StaffRepository extends BaseRepository {
  constructor() {
    super(Staff);
  }

  async findByStaffId(staffId) {
    return this.findOne({ staffId });
  }

  async findByUserId(userId) {
    return this.findOne({ userId });
  }
}

export default new StaffRepository();
