import File from '../models/File';
import * as Yup from 'yup';

class FileController {
  async store(req, res) {
    const schema = Yup.object().shape({
      file: Yup.object().shape({
        originalname: Yup.string().required(),
        filename: Yup.string().required(),
      }),
    });

    if (!(await schema.isValid(req))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const { originalname: name, filename: path } = req.file;
    console.log({ name, path });
    const file = await File.create({ name, path });

    return res.json(file);
  }
}

export default new FileController();
