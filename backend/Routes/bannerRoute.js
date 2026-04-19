// routes/bannerRoutes.js
import express from 'express';
import { createBanner, getAllBanners, deleteBanner } from '../controllers/bannerController.js';

const router = express.Router();

// Route for creating a banner
router.post('/create', createBanner);

// Route for getting all banners
router.get('/all', getAllBanners);

// Route for deleting a banner
router.delete('/delete/:id', deleteBanner);

export default router;