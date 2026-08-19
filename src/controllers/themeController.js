import Theme from '../models/Theme.js';
import Partner from '../models/Partner.js';

export const getAllThemes = async (req, res, next) => {
  try {
    const { partnerId } = req.query;
    
    const filter = {};
    if (partnerId) {
      filter.partnerId = partnerId;
    }

    const themes = await Theme.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: themes,
    });
  } catch (error) {
    next(error);
  }
};

export const getThemeById = async (req, res, next) => {
  try {
    const theme = await Theme.findById(req.params.id);

    if (!theme) {
      res.status(404);
      throw new Error('Theme not found');
    }

    res.json({
      success: true,
      data: theme,
    });
  } catch (error) {
    next(error);
  }
};

export const getThemesByPartner = async (req, res, next) => {
  try {
    const { partnerId } = req.params;

    const partner = await Partner.findOne({ partnerId });
    if (!partner) {
      res.status(404);
      throw new Error('Partner not found');
    }

    const themes = await Theme.find({ partnerId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: themes,
    });
  } catch (error) {
    next(error);
  }
};

export const createTheme = async (req, res, next) => {
  try {
    const { partnerId, font, colors } = req.body;

    const partner = await Partner.findOne({ partnerId });
    if (!partner) {
      res.status(404);
      throw new Error('Partner not found');
    }

    const theme = await Theme.create({
      partnerId,
      font,
      colors,
    });

    res.status(201).json({
      success: true,
      data: theme,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTheme = async (req, res, next) => {
  try {
    const theme = await Theme.findById(req.params.id);

    if (!theme) {
      res.status(404);
      throw new Error('Theme not found');
    }

    const { font, colors } = req.body;

    if (font) theme.font = font;
    if (colors) theme.colors = colors;

    await theme.save();

    res.json({
      success: true,
      data: theme,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTheme = async (req, res, next) => {
  try {
    const theme = await Theme.findById(req.params.id);

    if (!theme) {
      res.status(404);
      throw new Error('Theme not found');
    }

    await Theme.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Theme deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const exportThemeAsJSON = async (req, res, next) => {
  try {
    const theme = await Theme.findById(req.params.id);

    if (!theme) {
      res.status(404);
      throw new Error('Theme not found');
    }

    const themeJSON = {
      font: theme.font,
      colors: theme.colors,
    };

    if (theme.version === 'actual' && theme.styles) {
      themeJSON.styles = theme.styles;
    }

    res.json({
      success: true,
      data: themeJSON,
    });
  } catch (error) {
    next(error);
  }
};

export const importThemeFromJSON = async (req, res, next) => {
  try {
    const { partnerId, themeData, name, version } = req.body;

    const partner = await Partner.findOne({ partnerId });
    if (!partner) {
      res.status(404);
      throw new Error('Partner not found');
    }

    const hasStyles = themeData.styles && Object.keys(themeData.styles).length > 0;
    const detectedVersion = version || (hasStyles ? 'actual' : 'legacy');

    const theme = await Theme.create({
      partnerId,
      name,
      version: detectedVersion,
      font: themeData.font,
      colors: themeData.colors,
      styles: themeData.styles,
    });

    res.status(201).json({
      success: true,
      data: theme,
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicThemeByPartner = async (req, res, next) => {
  try {
    const { partnerId } = req.params;

    const themes = await Theme.find({ partnerId }).sort({ createdAt: -1 });

    if (themes.length === 0) {
      res.status(404);
      throw new Error('No themes found for this partner');
    }

    const latestTheme = themes[0];

    const themeJSON = {
      font: latestTheme.font,
      colors: latestTheme.colors,
    };

    if (latestTheme.version === 'actual' && latestTheme.styles) {
      themeJSON.styles = latestTheme.styles;
    }

    res.json({
      success: true,
      data: themeJSON,
      metadata: {
        partnerId: latestTheme.partnerId,
        version: latestTheme.version,
        name: latestTheme.name,
        updatedAt: latestTheme.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
