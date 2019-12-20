import * as Yup from 'yup';
import { addMonths, parseISO, startOfHour } from 'date-fns';
import Registration from '../models/Registration';
import Student from '../models/Student';
import Plans from '../models/Plans';
import Queue from '../../lib/Queue';
import NewRegister from '../jobs/NewRegistration';

class RegistrationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const checkStudent = await Student.findOne({
      where: { id: req.body.student_id }
    });
    if (!checkStudent) {
      return res.status(400).json({ error: 'User doesnt exists' });
    }

    const checkPlan = await Plans.findOne({
      where: { id: req.body.plan_id }
    });
    if (!checkPlan) {
      return res.status(400).json({ error: 'Plan doesnt exists' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const userPlan = await Plans.findOne({
      where: { id: plan_id },
      attributes: ['price', 'duration', 'title']
    });
    const day = startOfHour(parseISO(req.body.start_date));
    const datef = addMonths(day, userPlan.duration);
    const finalPrice = userPlan.price * userPlan.duration;
    const register = await Registration.create({
      start_date,
      end_date: datef,
      student_id,
      plan_id,
      price: finalPrice
    });

    const reg = await Registration.findByPk(register.id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email']
        },
        {
          model: Plans,
          as: 'plan',
          attributes: ['title', 'duration']
        }
      ]
    });
    await Queue.add(NewRegister.key, {
      reg
    });

    return res.json(register);
  }

  async index(req, res) {
    const registers = await Registration.findAll({
      where: { canceled_at: null }
    });
    return res.json({ registers });
  }

  async delete(req, res) {
    const checkRegister = await Registration.findByPk(req.params.id);
    if (!checkRegister) {
      return res.status(400).json({ error: 'Id register doest exists' });
    }
    checkRegister.canceled_at = new Date();
    await checkRegister.save();

    return res.json({ checkRegister });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }
    const register = await Registration.findByPk(req.params.id);
    if (!register) {
      return res.status(400).json({ error: 'This register doesn t exists' });
    }
    if (register.canceled_at !== null) {
      return res.status(400).json({ error: 'this register was cancelled' });
    }
    await register.update(req.body);
    return res.json(register);
  }
}
export default new RegistrationController();
