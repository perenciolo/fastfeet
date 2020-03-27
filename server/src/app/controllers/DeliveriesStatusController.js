import { Op } from 'sequelize';
import { startOfDay, endOfDay, getHours, parseISO, format } from 'date-fns';
import * as Yup from 'yup';

import Package from '../models/Package';
import Deliverman from '../models/Deliverman';

class DeliveriesStatusController {
  async store(req, res) {
    try {
      const { id, packId } = req.params;
      const deliveryman = await Deliverman.findByPk(id);

      if (!deliveryman) {
        return res.status(404).json({ error: 'Deliveryman not found' });
      }

      const startedToday = await Package.findAll({
        where: {
          deliveryman_id: id,
          [Op.and]: [
            {
              start_date: {
                [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
              },
            },
            { end_date: { [Op.eq]: null } },
            { canceled_at: { [Op.eq]: null } },
          ],
        },
      });

      if (startedToday.length > 5) {
        return res
          .status(401)
          .json({ error: 'You reach your diary limit of 5 deliveries' });
      }

      const schema = Yup.object().shape({
        start_date: Yup.date().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation error' });
      }

      const { start_date } = req.body;
      const startHour = getHours(parseISO(start_date));
      const isWorkingHours = startHour >= 8 && startHour <= 18;

      if (!isWorkingHours) {
        return res
          .status(400)
          .json({ error: 'Starting hour must be between 8:00 and 18:00' });
      }

      const updatedPack = await (await Package.findByPk(packId)).update({
        start_date,
      });

      return res.json(updatedPack);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true });
    }
  }

  async end(req, res) {
    try {
      const { id, packId } = req.params;
      const deliveryman = await Deliverman.findByPk(id);

      if (!deliveryman) {
        return res.status(404).json({ error: 'Deliveryman not found' });
      }

      const schema = Yup.object().shape({
        end_date: Yup.date().required(),
        signature_id: Yup.number(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation error' });
      }

      const { end_date, signature_id } = req.body;
      let updateData = { end_date };

      if (signature_id) {
        updateData = { ...updateData, signature_id };
      }

      const updatedPack = await (await Package.findByPk(packId)).update(
        updateData
      );

      return res.json(updatedPack);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: true });
    }
  }
}

export default new DeliveriesStatusController();
