import openai from '@/lib/openai';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method } = req;
    switch (method) {
      case 'GET':
        try {
          const response = await openai.listFineTunes();
          res.status(200).json(response.data.data.reverse());
        } catch (error) {
          res.status(500).json({ message: 'ERROR_GET_MODEL' });
        }
        break;
      case 'DELETE':
        try {
          const modelId = req.query.id;
          if (modelId === null || typeof modelId !== 'string' || Array.isArray(modelId)) {
            return res.status(400).json({ error: 'No Model id exist' });
          }
          const response = await openai.deleteModel(modelId);
          res.status(200).json(response.data);
        } catch (error) {
          res.status(500).json({ message: 'ERROR_DEL_MODEL' });
        }
        break;
      case 'POST':
        try {
          const { fileId }: NextApiRequest['body'] = req.body;
          const response = await openai.createFineTune({
            training_file: fileId,
            model: 'davinci',
          });
          if (!response.data.id) {
            return res.status(400).json({ error: 'Failed Model fine tuning' });
          }
          res.status(200).json(response.data);
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: 'ERROR_POST_MODEL' });
        }
        break;
      case 'PUT':
        try {
          const modelId = req.query.id;
          if (modelId === null || typeof modelId !== 'string' || Array.isArray(modelId)) {
            return res.status(400).json({ error: 'No Model id exist' });
          }
          const response = await openai.cancelFineTune(modelId);
          res.status(200).json(response.data);
        } catch (error: any) {
          console.log(error.response.data);
          res.status(500).json({ message: 'ERROR_PUT_MODEL' });
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
