import express from 'express';
import {
  getThemeVersions,
  getThemeVersion,
  createThemeVersion,
  compareThemeVersions,
  markVersionAsUsed,
  restoreThemeVersion,
} from '../controllers/themeVersionController.js';

const router = express.Router();

// Rutas de versiones de tema
router.get('/:partnerId/versions', getThemeVersions);
router.get('/:partnerId/versions/:versionId', getThemeVersion);
router.post('/:partnerId/versions', createThemeVersion);
router.get('/:partnerId/versions/compare/:version1Id/:version2Id', compareThemeVersions);
router.put('/:partnerId/versions/:versionId/use', markVersionAsUsed);
router.post('/:partnerId/versions/:versionId/restore', restoreThemeVersion);

export default router;
