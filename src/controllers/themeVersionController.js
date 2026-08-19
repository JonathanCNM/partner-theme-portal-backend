import ThemeVersion from '../models/ThemeVersion.js';
import Partner from '../models/Partner.js';

// Obtener todas las versiones de tema de un partner
export const getThemeVersions = async (req, res, next) => {
  try {
    const { partnerId } = req.params;

    const partner = await Partner.findById(partnerId);
    if (!partner) {
      res.status(404);
      throw new Error('Partner not found');
    }

    const versions = await ThemeVersion.find({ partnerId })
      .sort({ versionNumber: -1 })
      .select('-__v');

    res.json({
      success: true,
      data: versions,
      count: versions.length,
    });
  } catch (error) {
    next(error);
  }
};

// Obtener una versión específica
export const getThemeVersion = async (req, res, next) => {
  try {
    const { partnerId, versionId } = req.params;

    const version = await ThemeVersion.findOne({
      _id: versionId,
      partnerId,
    });

    if (!version) {
      res.status(404);
      throw new Error('Theme version not found');
    }

    res.json({
      success: true,
      data: version,
    });
  } catch (error) {
    next(error);
  }
};

// Crear una nueva versión de tema
export const createThemeVersion = async (req, res, next) => {
  try {
    const { partnerId } = req.params;
    const { theme, changeDescription } = req.body;

    const partner = await Partner.findById(partnerId);
    if (!partner) {
      res.status(404);
      throw new Error('Partner not found');
    }

    if (!theme || !theme.font || !theme.colors) {
      res.status(400);
      throw new Error('Invalid theme data');
    }

    const versionNumber = await ThemeVersion.getNextVersionNumber(partnerId);

    const changedFields = [];
    if (partner.theme) {
      if (JSON.stringify(theme.font) !== JSON.stringify(partner.theme.font)) {
        changedFields.push('font');
      }
      if (JSON.stringify(theme.colors) !== JSON.stringify(partner.theme.colors)) {
        changedFields.push('colors');
      }
      if (JSON.stringify(theme.styles) !== JSON.stringify(partner.theme.styles)) {
        changedFields.push('styles');
      }
    }

    const version = await ThemeVersion.create({
      partnerId,
      versionNumber,
      theme,
      changeDescription: changeDescription || `Version ${versionNumber}`,
      metadata: {
        changedFields,
        userAgent: req.headers['user-agent'],
      },
    });

    res.status(201).json({
      success: true,
      data: version,
    });
  } catch (error) {
    next(error);
  }
};

// Comparar dos versiones
export const compareThemeVersions = async (req, res, next) => {
  try {
    const { partnerId, version1Id, version2Id } = req.params;

    const [version1, version2] = await Promise.all([
      ThemeVersion.findOne({ _id: version1Id, partnerId }),
      ThemeVersion.findOne({ _id: version2Id, partnerId }),
    ]);

    if (!version1 || !version2) {
      res.status(404);
      throw new Error('One or both versions not found');
    }

    const comparison = version2.compareWith(version1);

    res.json({
      success: true,
      data: {
        version1: {
          id: version1._id,
          versionNumber: version1.versionNumber,
          createdAt: version1.createdAt,
        },
        version2: {
          id: version2._id,
          versionNumber: version2.versionNumber,
          createdAt: version2.createdAt,
        },
        changes: comparison,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Marcar una versión como usada
export const markVersionAsUsed = async (req, res, next) => {
  try {
    const { partnerId, versionId } = req.params;

    const version = await ThemeVersion.findOneAndUpdate(
      { _id: versionId, partnerId },
      { lastUsedAt: new Date() },
      { new: true }
    );

    if (!version) {
      res.status(404);
      throw new Error('Theme version not found');
    }

    res.json({
      success: true,
      data: version,
    });
  } catch (error) {
    next(error);
  }
};

// Restaurar una versión anterior
export const restoreThemeVersion = async (req, res, next) => {
  try {
    const { partnerId, versionId } = req.params;

    const version = await ThemeVersion.findOne({ _id: versionId, partnerId });
    if (!version) {
      res.status(404);
      throw new Error('Theme version not found');
    }

    const partner = await Partner.findById(partnerId);
    if (!partner) {
      res.status(404);
      throw new Error('Partner not found');
    }

    // Crear una nueva versión con el tema anterior
    const newVersionNumber = await ThemeVersion.getNextVersionNumber(partnerId);
    
    await ThemeVersion.create({
      partnerId,
      versionNumber: newVersionNumber,
      theme: version.theme,
      changeDescription: `Restored from version ${version.versionNumber}`,
      metadata: {
        changedFields: ['restored'],
        userAgent: req.headers['user-agent'],
      },
    });

    // Actualizar el tema del partner
    partner.theme = version.theme;
    await partner.save();

    res.json({
      success: true,
      message: `Theme restored from version ${version.versionNumber}`,
      data: partner,
    });
  } catch (error) {
    next(error);
  }
};
