import mongoose from 'mongoose';

const fontConfigSchema = new mongoose.Schema({
  fontWeight: String,
  min: String,
  max: String,
  lineHeight: String,
}, { _id: false });

const themeSchema = new mongoose.Schema(
  {
    partnerId: {
      type: String,
      required: [true, 'Partner ID is required'],
      ref: 'Partner',
    },
    version: {
      type: String,
      enum: ['legacy', 'actual'],
      default: 'actual',
    },
    name: {
      type: String,
      trim: true,
    },
    font: {
      h1: fontConfigSchema,
      highlight: fontConfigSchema,
      h2: fontConfigSchema,
      bodycopy: fontConfigSchema,
      secondaryCta: fontConfigSchema,
      footerText: fontConfigSchema,
      mainButtonText: fontConfigSchema,
      step: fontConfigSchema,
      fontfamily: String,
      fontcdn: String,
    },
    colors: {
      primaryGradient: String,
      secondaryGradient: String,
      secondaryColor: String,
      whiteColor: String,
      inactived: String,
      errorColor: String,
      partnerHighlights: String,
      gradientDeg: String,
      primaryGradientPoint: String,
      secundaryGradientPoint: String,
      primaryMesh: String,
      gradient: String,
      lightness: String,
      useSystemTheme: Boolean,
      errorViewBackground: String,
      specialViewBackground: String,
      cardPanelBackground: String,
      cardBackground: String,
      cardBackgroundSecundary: String,
    },
    styles: {
      cardBorderRadius: String,
      buttonBorderRadius: String,
      inputBorderRadius: String,
      cardBorderColor: String,
      inputBorderColor: String,
      activeBorderBoton: String,
      tamañoBordeCard: String,
      tamañoBordeInput: String,
      buttonPadding: String,
      inputPadding: String,
      cardPadding: String,
      buttonSize: String,
      buttonShowIcon: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

themeSchema.index({ partnerId: 1 });

const Theme = mongoose.model('Theme', themeSchema);

export default Theme;
