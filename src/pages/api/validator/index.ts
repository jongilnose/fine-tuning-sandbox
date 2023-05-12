import { uploadAsync } from '@/lib/upload';
import axios from 'axios';
import FormData from 'form-data';
import { NextApiRequestWithFile, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

function refineData(data: string) {
  const separator = '\n\n###\n\n';
  const stopSequence = ' ###';

  const dataDict = JSON.parse(data);

  const newDataDict = {
    prompt: dataDict.prompt + ' ->' + separator,
    completion: ' ' + dataDict.completion + stopSequence,
  };

  return JSON.stringify(newDataDict, null, 2);
}

function removeDuplicates(dataList: any[]) {
  const uniqueDataList: any[] = [];
  const uniqueDataSet = new Set();

  dataList.forEach(data => {
    const sortedData = JSON.stringify(JSON.parse(data), Object.keys(JSON.parse(data)).sort(), 2);

    if (!uniqueDataSet.has(sortedData)) {
      uniqueDataSet.add(sortedData);
      uniqueDataList.push(data);
    }
  });

  return uniqueDataList;
}

export default async (req: NextApiRequestWithFile, res: NextApiResponse) => {
  try {
    const { method } = req;
    switch (method) {
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
