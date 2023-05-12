import openai from '@/lib/openai';
import { uploadAsync } from '@/lib/upload';
import axios from 'axios';
import FormData from 'form-data';
import { NextApiRequestWithFile, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequestWithFile, res: NextApiResponse) => {
  try {
    const { method } = req;
    switch (method) {
      case 'GET':
        try {
          const response = await openai.listFiles();
          res.status(200).json(response.data.data.reverse());
        } catch (error) {
          res.status(500).json({ message: 'ERROR_GET_FILE' });
        }
        break;
      case 'DELETE':
        try {
          const fileId = req.query.id;
          if (fileId === null || typeof fileId !== 'string' || Array.isArray(fileId)) {
            return res.status(400).json({ error: 'No file id exist' });
          }
          const response = await openai.deleteFile(fileId);
          if (!response.data.id) {
            return res.status(500).json({ error: 'Failed to delete file' });
          }
          res.status(200).json(response.data);
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: 'ERROR_DEL_FILE' });
        }
        break;
      case 'POST':
        try {
          const file: any = await uploadAsync(req, res);
          if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
          }
          const fileBuffer = file.buffer;
          const form = new FormData();
          form.append('file', fileBuffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
          });
          form.append('purpose', 'fine-tune');
          const response = await axios.post('https://api.openai.com/v1/files', form, {
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_KEY}`,
              ...form.getHeaders(),
            },
          });
          res.status(200).json(response.data);
        } catch (error) {
          res.status(500).json({ message: 'ERROR_POST_FILE' });
        }
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ message: `Method ${method} Not Allowed` });
        break;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error' });
  }
};
