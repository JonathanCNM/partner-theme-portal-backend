import express from 'express';
import {
  getAllThemes,
  getThemeById,
  getThemesByPartner,
  createTheme,
  updateTheme,
  deleteTheme,
  exportThemeAsJSON,
  importThemeFromJSON,
  getPublicThemeByPartner,
} from '../controllers/themeController.js';

const router = express.Router();

router.get('/', getAllThemes);
router.get('/:id', getThemeById);
router.get('/partner/:partnerId', getThemesByPartner);
router.get('/:id/export', exportThemeAsJSON);
router.post('/', createTheme);
router.post('/import', importThemeFromJSON);
router.put('/:id', updateTheme);
router.delete('/:id', deleteTheme);

export default router;
