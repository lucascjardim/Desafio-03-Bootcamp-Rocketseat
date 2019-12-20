import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class Answer {
  get key() {
    return 'Answer';
  }

  async handle({ data }) {
    const { question } = data;
    console.log(question);
    await Mail.sendMail({
      to: `${question.student.name} <${question.student.email}>`,
      subject: 'Sua pergunta foi respondida.',
      template: 'answer',
      context: {
        student: question.student.name,
        date: format(
          parseISO(question.answer_at),
          "'Dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt
          }
        ),
        question: question.question,
        answer: question.answer
      }
    });
  }
}
export default new Answer();
