import { addDays, endOfDay, startOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const checkStudent = await Student.findByPk(req.params.id);
    if (!checkStudent) {
      return res.status(400).json({ error: 'Student doesnt has register' });
    }

    const dateIni = addDays(new Date(), -7);
    const quant = await Checkin.count({
      where: {
        created_at: {
          [Op.between]: [startOfDay(dateIni), endOfDay(new Date())]
        }
      }
    });

    if (quant >= 7) {
      return res
        .status(400)
        .json({ error: 'This student was visit 7 times last week' });
    }
    const checkin = await Checkin.create({
      student_id: req.params.id
    });

    return res.json(checkin);
  }

  async index(req, res) {
    const student_id = req.params.id;
    const checkStudent = await Student.findByPk(student_id);
    if (!checkStudent) {
      return res.status(400).json({ error: 'User doesnt exists' });
    }
    const checkins = await Checkin.findAll({
      where: { student_id }
    });
    return res.json(checkins);
  }
}
export default new CheckinController();
