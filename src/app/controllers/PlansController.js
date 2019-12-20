import * as Yup from 'yup';
import Plans from '../models/Plans';

class PlansController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }
    const PlansExists = await Plans.findOne({
      where: { title: req.body.title }
    });
    if (PlansExists) {
      return res.status(400).json({ error: 'Plan already exists' });
    }

    const newPlan = await Plans.create(req.body);
    return res.json(newPlan);
  }

  async index(req, res) {
    const plans = await Plans.findAll({
      where: { canceled_at: null },
      attributes: ['id', 'title', 'duration', 'price']
    });

    return res.json({ plans });
  }

  async delete(req, res) {
    const checkPlan = await Plans.findByPk(req.params.id);
    if (!checkPlan) {
      return res.status(400).json({ error: 'Id plan doest exists' });
    }
    checkPlan.canceled_at = new Date();
    await checkPlan.save();

    return res.json({ checkPlan });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const plan = await Plans.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'This plan doesnt exists' });
    }
    const { title, duration, price } = await plan.update(req.body);
    return res.json({
      title,
      duration,
      price
    });
  }
}
export default new PlansController();
