import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class NewRegistration {
  get key() {
    return 'newRegistration';
  }

  async handle({ data }) {
    const { reg } = data;
    await Mail.sendMail({
      to: `${reg.student.name} <${reg.student.email}>`,
      subject: 'Matrícula realizada na Gympoint',
      template: 'registration',
      context: {
        date: format(
          parseISO(reg.start_date),
          "'Dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt
          }
        ),
        value: reg.price,
        student: reg.student.name,
        plan: reg.plan.title,
        duration: reg.plan.duration
      }
    });
  }
}
export default new NewRegistration();
