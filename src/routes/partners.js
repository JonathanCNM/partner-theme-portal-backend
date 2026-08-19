import express from 'express';
import upload from '../middlewares/upload.js';
import {
  getAllPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
} from '../controllers/partnerController.js';

const router = express.Router();

router.get('/', getAllPartners);
router.get('/:id', getPartnerById);
router.post(
  '/',
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'logoWhite', maxCount: 1 },
  ]),
  createPartner
);
router.put(
  '/:id',
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'logoWhite', maxCount: 1 },
  ]),
  updatePartner
);
router.delete('/:id', deletePartner);

export default router;
