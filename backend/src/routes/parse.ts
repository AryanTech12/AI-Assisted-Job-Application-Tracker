import express, { Response } from 'express';
import { protect, AuthRequest } from '../middlewares/authMiddleware';
import { parseJobDescription } from '../services/ai.service';

const router = express.Router();

router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { jdText } = req.body;
    
    if (!jdText) {
      return res.status(400).json({ message: 'Job Description text is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          message: 'OpenAI API key missing in server configuration. Please add it to your .env file.',
          requireKey: true,
        });
    }

    const parsedData = await parseJobDescription(jdText);
    
    res.status(200).json(parsedData);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: error.message });
    } else {
        res.status(500).json({ message: 'Server error parsing JD' });
    }
  }
});

export default router;
