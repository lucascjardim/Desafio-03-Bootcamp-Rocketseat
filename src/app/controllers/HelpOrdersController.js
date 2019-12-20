import * as Yup from 'yup';
import Student from '../models/Student';
import HelpOrders from '../models/HelpOrders';
import Queue from '../../lib/Queue';
import Answer from '../jobs/Answer';

class HelpOrdersController {
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required()
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }
    const checkStudent = await Student.findByPk(req.params.id);
    if (!checkStudent) {
      return res.status(400).json({ error: 'Student doesnt exists' });
    }
    const student_id = req.params.id;
    const { question } = req.body;
    const help = await HelpOrders.create({
      student_id,
      question
    });
    return res.json({ help });
  }

  async index(req, res) {
    const checkStudent = await Student.findByPk(req.params.id);
    if (!checkStudent) {
      return res.status(400).json({ error: 'Student doesn t exists' });
    }

    const help_orders = await HelpOrders.findAll({
      where: { student_id: req.params.id, answer_at: null }
    });

    return res.json({ help_orders });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required()
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }
    const question = await HelpOrders.findByPk(req.params.id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email']
        }
      ]
    });

    if (!question) {
      return res.status(400).json({ error: 'This question doesnt exists' });
    }
    const { answer } = req.body;
    question.answer = answer;
    question.answer_at = new Date();
    question.save();
    await Queue.add(Answer.key, {
      question
    });
    return res.json(question);
  }
}
export default new HelpOrdersController();
