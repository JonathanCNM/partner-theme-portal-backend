import Partner from '../models/Partner.js';
import { validateThemeJSON } from '../utils/themeValidator.js';
import ThemeVersion from '../models/ThemeVersion.js';

export const getAllPartners = async (req, res, next) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: partners,
    });
  } catch (error) {
    next(error);
  }
};

export const getPartnerById = async (req, res, next) => {
  try {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      res.status(404);
      throw new Error('Partner not found');
    }

    res.json({
      success: true,
      data: partner,
    });
  } catch (error) {
    next(error);
  }
};

export const createPartner = async (req, res, next) => {
  try {
    const { partnerId, name, logoType, logoValue, logoWhiteType, logoWhiteValue, themeJson, figmaLinks } = req.body;

    const existingPartner = await Partner.findOne({ partnerId });
    if (existingPartner) {
      res.status(400);
      throw new Error('Partner ID already exists');
    }

    const partnerData = {
      partnerId,
      name,
    };

    if (req.files?.logo) {
      partnerData.logo = {
        type: 'file',
        value: `/uploads/${req.files.logo[0].filename}`,
      };
    } else if (logoType === 'url' && logoValue) {
      partnerData.logo = {
        type: 'url',
        value: logoValue,
      };
    }

    if (req.files?.logoWhite) {
      partnerData.logoWhite = {
        type: 'file',
        value: `/uploads/${req.files.logoWhite[0].filename}`,
      };
    } else if (logoWhiteType === 'url' && logoWhiteValue) {
      partnerData.logoWhite = {
        type: 'url',
        value: logoWhiteValue,
      };
    }

    // Procesar figma links
    if (figmaLinks) {
      try {
        partnerData.figmaLinks = typeof figmaLinks === 'string' ? JSON.parse(figmaLinks) : figmaLinks;
      } catch (error) {
        res.status(400);
        throw new Error('Invalid figmaLinks format');
      }
    }

    // Procesar tema si se proporciona
    if (themeJson) {
      const validation = validateThemeJSON(themeJson);
      if (!validation.valid) {
        res.status(400);
        throw new Error(`Invalid theme JSON: ${validation.errors.join(', ')}`);
      }
      partnerData.theme = validation.data;
    }

    const partner = await Partner.create(partnerData);

    // Crear versión inicial si tiene tema
    if (partnerData.theme) {
      await ThemeVersion.create({
        partnerId: partner._id,
        versionNumber: 1,
        theme: partnerData.theme,
        changeDescription: 'Initial theme version',
        metadata: {
          changedFields: ['initial'],
          userAgent: req.headers['user-agent'],
        },
      });
    }

    res.status(201).json({
      success: true,
      data: partner,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePartner = async (req, res, next) => {
  try {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      res.status(404);
      throw new Error('Partner not found');
    }

    const { name, logoType, logoValue, logoWhiteType, logoWhiteValue, themeJson, figmaLinks } = req.body;

    if (name) partner.name = name;

    if (req.files?.logo) {
      partner.logo = {
        type: 'file',
        value: `/uploads/${req.files.logo[0].filename}`,
      };
    } else if (logoType === 'url' && logoValue) {
      partner.logo = {
        type: 'url',
        value: logoValue,
      };
    }

    if (req.files?.logoWhite) {
      partner.logoWhite = {
        type: 'file',
        value: `/uploads/${req.files.logoWhite[0].filename}`,
      };
    } else if (logoWhiteType === 'url' && logoWhiteValue) {
      partner.logoWhite = {
        type: 'url',
        value: logoWhiteValue,
      };
    }

    // Actualizar figma links
    if (figmaLinks !== undefined) {
      try {
        partner.figmaLinks = typeof figmaLinks === 'string' ? JSON.parse(figmaLinks) : figmaLinks;
      } catch (error) {
        res.status(400);
        throw new Error('Invalid figmaLinks format');
      }
    }

    // Actualizar tema si se proporciona
    if (themeJson) {
      const validation = validateThemeJSON(themeJson);
      if (!validation.valid) {
        res.status(400);
        throw new Error(`Invalid theme JSON: ${validation.errors.join(', ')}`);
      }
      
      // Detectar cambios en el tema
      const changedFields = [];
      if (partner.theme) {
        if (JSON.stringify(validation.data.font) !== JSON.stringify(partner.theme.font)) {
          changedFields.push('font');
        }
        if (JSON.stringify(validation.data.colors) !== JSON.stringify(partner.theme.colors)) {
          changedFields.push('colors');
        }
        if (JSON.stringify(validation.data.styles) !== JSON.stringify(partner.theme.styles)) {
          changedFields.push('styles');
        }
      }

      partner.theme = validation.data;

      // Crear nueva versión si hubo cambios
      if (changedFields.length > 0 || !partner.theme) {
        const versionNumber = await ThemeVersion.getNextVersionNumber(partner._id);
        await ThemeVersion.create({
          partnerId: partner._id,
          versionNumber,
          theme: validation.data,
          changeDescription: `Updated ${changedFields.join(', ')}`,
          metadata: {
            changedFields,
            userAgent: req.headers['user-agent'],
          },
        });
      }
    }

    await partner.save();

    res.json({
      success: true,
      data: partner,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePartner = async (req, res, next) => {
  try {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      res.status(404);
      throw new Error('Partner not found');
    }

    await Partner.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Partner deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicTheme = async (req, res, next) => {
  try {
    const { partnerId } = req.params;

    const partner = await Partner.findOne({ partnerId });

    if (!partner || !partner.theme) {
      res.status(404);
      throw new Error('Theme not found for this partner');
    }

    const themeJSON = {
      font: partner.theme.font,
      colors: partner.theme.colors,
    };

    if (partner.theme.version === 'actual' && partner.theme.styles) {
      themeJSON.styles = partner.theme.styles;
    }

    res.json({
      success: true,
      data: themeJSON,
      metadata: {
        partnerId: partner.partnerId,
        partnerName: partner.name,
        version: partner.theme.version,
        updatedAt: partner.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
