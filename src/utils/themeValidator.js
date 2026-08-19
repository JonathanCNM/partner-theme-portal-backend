export const validateThemeJSON = (jsonString) => {
  const errors = [];

  try {
    const parsed = JSON.parse(jsonString);

    // Validar estructura principal
    if (!parsed.font || typeof parsed.font !== 'object') {
      errors.push('Missing or invalid "font" section');
    }

    if (!parsed.colors || typeof parsed.colors !== 'object') {
      errors.push('Missing or invalid "colors" section');
    }

    // Validar font properties
    const requiredFontProps = ['h1', 'highlight', 'h2', 'bodycopy', 'secondaryCta', 'footerText', 'mainButtonText', 'step', 'fontfamily', 'fontcdn'];
    
    if (parsed.font) {
      const fontKeys = Object.keys(parsed.font);
      const missingFontProps = requiredFontProps.filter(prop => !fontKeys.includes(prop));
      
      if (missingFontProps.length > 0) {
        errors.push(`Missing font properties: ${missingFontProps.join(', ')}`);
      }
    }

    // Validar colors properties
    const requiredColorProps = ['primaryGradient', 'secondaryGradient', 'secondaryColor', 'whiteColor', 'inactived', 'errorColor', 'partnerHighlights', 'gradientDeg', 'primaryGradientPoint', 'secundaryGradientPoint', 'gradient', 'lightness', 'useSystemTheme'];
    
    if (parsed.colors) {
      const colorKeys = Object.keys(parsed.colors);
      const missingColorProps = requiredColorProps.filter(prop => !colorKeys.includes(prop));
      
      if (missingColorProps.length > 0) {
        errors.push(`Missing color properties: ${missingColorProps.join(', ')}`);
      }
    }

    // Detectar versión
    const hasStyles = parsed.styles && Object.keys(parsed.styles).length > 0;
    const version = hasStyles ? 'actual' : 'legacy';

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    return {
      valid: true,
      errors: [],
      data: {
        version,
        font: parsed.font,
        colors: parsed.colors,
        styles: parsed.styles,
      },
    };

  } catch (error) {
    return {
      valid: false,
      errors: [`Invalid JSON: ${error.message}`],
    };
  }
};
