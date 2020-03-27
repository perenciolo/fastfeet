import Deliverman from '../models/Deliverman';
import File from '../models/File';
import * as Yup from 'yup';

class DelivermanController {
  async index(_, res) {
    try {
      const delivermen = await Deliverman.findAll();
      return res.json(delivermen);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number().min(1),
    });

    try {
      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'validation fails' });
      }

      if (await Deliverman.findOne({ where: { email: req.body.email } })) {
        return res.status(400).json({ error: 'Deliverman already exists' });
      }

      const saved = await Deliverman.create(req.body);

      const deliverman = await Deliverman.findByPk(saved.id, {
        include: [
          { model: File, as: 'avatar', attributes: ['id', 'path', 'url'] },
        ],
      });

      return res.json(deliverman);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number().min(1),
    });

    try {
      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'validation fails' });
      }

      const { email } = req.body;

      const deliverman = await Deliverman.findByPk(id);

      if (!deliverman) {
        return res.status(404).json({ error: 'Deliverman not found' });
      }

      const delivermanEmail = await Deliverman.findOne({
        where: { email },
      });

      if (
        email &&
        delivermanEmail &&
        deliverman &&
        delivermanEmail.email !== deliverman.email
      ) {
        return res.status(400).json({ error: 'Email is already been used' });
      }

      if (
        delivermanEmail &&
        deliverman &&
        delivermanEmail.email === deliverman.email
      ) {
        return res
          .status(400)
          .json({ error: 'Email is must be different to the current one' });
      }

      let updated = await deliverman.update(req.body);

      if (req.body.avatar_id) {
        updated = await Deliverman.findByPk(id, {
          include: [
            { model: File, as: 'avatar', attributes: ['id', 'path', 'url'] },
          ],
        });
      }

      return res.json(updated);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    try {
      const deliverman = await Deliverman.findByPk(id);
      await deliverman.destroy();
      return res.status(204).send();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true });
    }
  }
}

export default new DelivermanController();
