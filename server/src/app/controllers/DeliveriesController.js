import Package from '../models/Package';
import { Op } from 'sequelize';

export class DeliveriesController {
  async index(req, res) {
    try {
      const { id } = req.params;
      const packs = await Package.findAll({
        where: {
          deliveryman_id: id,
          [Op.and]: [
            { canceled_at: { [Op.eq]: null } },
            { end_date: { [Op.eq]: null } },
          ],
        },
      });
      return res.json(packs);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true });
    }
  }

  async delivered(req, res) {
    try {
      const { id } = req.params;
      const packs = await Package.findAll({
        where: {
          deliveryman_id: id,
          [Op.and]: [
            { canceled_at: { [Op.eq]: null } },
            { end_date: { [Op.ne]: null } },
          ],
        },
      });
      return res.json(packs);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true });
    }
  }
}

export default new DeliveriesController();
