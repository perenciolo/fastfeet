import Recipient from '../models/Recipient';
import * as Yup from 'yup';

class RecipientController {
  async index(_, res) {
    const recipients = await Recipient.findAll();
    return res.json(recipients);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      cep: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      cep: Yup.string(),
      street: Yup.string(),
      number: Yup.string(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const { id } = req.params;
    const recipient = await Recipient.findOne({ where: { id } });

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const newRecipient = await recipient.update(req.body);

    return res.json(newRecipient);
  }

  async delete(req, res) {
    const { id } = req.params;
    const recipient = await Recipient.findOne({ where: { id } });

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    await recipient.destroy();

    return res.status(204).send();
  }
}

export default new RecipientController();
