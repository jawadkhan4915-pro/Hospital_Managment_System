import staffRepository from '../repositories/staff.repository.js';
import logger from '../config/logger.js';

class StaffService {
  async registerStaff(staffData) {
    const count = await staffRepository.count();
    const prefix = staffData.specialization ? 'DOC' : 'STF';
    const staffId = `${prefix}-${1000 + count + 1}`;

    const staff = await staffRepository.create({
      ...staffData,
      staffId,
    });

    logger.info(`Staff record created: ${staffId} (${staffData.department})`);
    return staff;
  }

  async getStaffProfile(staffId) {
    const staff = await staffRepository.findById(staffId, { populate: 'userId' });
    if (!staff) {
      throw new Error('Staff member not found');
    }
    return staff;
  }

  async getStaffByUserId(userId) {
    return staffRepository.findByUserId(userId);
  }

  async getAllDoctors() {
    // Find staff entries linked to doctors (they have specialization fields or role is doctor)
    return staffRepository.find({ specialization: { $exists: true, $ne: '' } }, { populate: 'userId' });
  }

  async updateSchedule(staffId, scheduleArray) {
    const staff = await staffRepository.findById(staffId);
    if (!staff) {
      throw new Error('Staff member not found');
    }

    staff.schedule = scheduleArray;
    await staff.save();

    logger.info(`Schedule updated for staff: ${staff.staffId}`);
    return staff;
  }
}

export default new StaffService();
