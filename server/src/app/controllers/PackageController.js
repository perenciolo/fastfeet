import Package from '../models/Package';
import * as Yup from 'yup';

export class PackageController {
  async index(_, res) {
    try {
      const packages = await Package.findAll();

      return res.json(packages);
    } catch (error) {
      console.log(error);
      return res.status(500).send();
    }
  }

  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        recipient_id: Yup.number()
          .required()
          .min(1),
        deliveryman_id: Yup.number()
          .required()
          .min(1),
        signature_id: Yup.number().min(1),
        product: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
        const error = await schema.validate(req.body);
        return res.status(400).json({ error });
      }

      const { recipient_id, deliveryman_id, signature_id, product } = req.body;
      const pack = await Package.create({
        recipient_id,
        deliveryman_id,
        signature_id,
        product,
      });

      return res.json(pack);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const schema = Yup.object().shape({
        recipient_id: Yup.number()
          .required()
          .min(1),
        deliveryman_id: Yup.number()
          .required()
          .min(1),
        signature_id: Yup.number().min(1),
        product: Yup.string().required(),
        canceled_at: Yup.date(),
        start_date: Yup.date(),
        end_date: Yup.date(),
      });

      if (!(await schema.isValid(req.body))) {
        const error = await schema.validate(req.body);
        return res.status(400).json({ error });
      }

      const pack = await Package.findByPk(id);

      if (!pack) {
        return res.status(404).json({ error: 'Package not found' });
      }

      const newPack = await pack.update(req.body);
      return res.json(newPack);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const pack = await Package.findByPk(id);

      if (!pack) {
        return res.status(404).json({ error: 'Package not found' });
      }

      await pack.destroy();
      return res.status(204).json();
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
}

export default new PackageController();
