import express, { Response } from 'express';
import { protect, AuthRequest } from '../middlewares/authMiddleware';
import Application from '../models/Application';

const router = express.Router();

router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const applications = await Application.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching applications' });
  }
});

router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
     const newApplication = await Application.create({
        ...req.body,
        user: req.user._id
     });
     res.status(201).json(newApplication);
  } catch (error) {
     res.status(500).json({ message: 'Server error creating application' });
  }
});

router.put('/:id', protect, async (req: AuthRequest, res: Response) => {
   try {
      const application = await Application.findById(req.params.id);
      
      if (!application) {
          return res.status(404).json({ message: 'Application not found' });
      }

      if (application.user.toString() !== req.user._id.toString()) {
          return res.status(401).json({ message: 'Not authorized' });
      }

      const updatedApplication = await Application.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
      );
      
      res.status(200).json(updatedApplication);
   } catch (error) {
      res.status(500).json({ message: 'Server error updating application' });
   }
});

router.delete('/:id', protect, async (req: AuthRequest, res: Response) => {
   try {
      const application = await Application.findById(req.params.id);
      
      if (!application) {
          return res.status(404).json({ message: 'Application not found' });
      }

      if (application.user.toString() !== req.user._id.toString()) {
          return res.status(401).json({ message: 'Not authorized' });
      }

      await application.deleteOne();
      
      res.status(200).json({ id: req.params.id });
   } catch (error) {
      res.status(500).json({ message: 'Server error deleting application' });
   }
});

export default router;
