import mongoose from 'mongoose';

const themeVersionSchema = new mongoose.Schema(
  {
    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner',
      required: true,
      index: true,
    },
    versionNumber: {
      type: Number,
      required: true,
    },
    theme: {
      version: {
        type: String,
        enum: ['legacy', 'actual'],
        default: 'actual',
      },
      font: mongoose.Schema.Types.Mixed,
      colors: mongoose.Schema.Types.Mixed,
      styles: mongoose.Schema.Types.Mixed,
    },
    changeDescription: {
      type: String,
      default: 'Theme updated',
    },
    lastUsedAt: {
      type: Date,
      default: null,
    },
    metadata: {
      changedFields: [String],
      userAgent: String,
    },
  },
  {
    timestamps: true,
  }
);

// Índice compuesto para partnerId y versionNumber
themeVersionSchema.index({ partnerId: 1, versionNumber: -1 });

// Método estático para obtener el siguiente número de versión
themeVersionSchema.statics.getNextVersionNumber = async function (partnerId) {
  const lastVersion = await this.findOne({ partnerId })
    .sort({ versionNumber: -1 })
    .select('versionNumber');
  
  return lastVersion ? lastVersion.versionNumber + 1 : 1;
};

// Método para comparar con otra versión
themeVersionSchema.methods.compareWith = function (otherVersion) {
  const changes = {
    font: {},
    colors: {},
    styles: {},
  };

  // Comparar fonts
  if (JSON.stringify(this.theme.font) !== JSON.stringify(otherVersion.theme.font)) {
    changes.font = {
      old: otherVersion.theme.font,
      new: this.theme.font,
    };
  }

  // Comparar colors
  if (JSON.stringify(this.theme.colors) !== JSON.stringify(otherVersion.theme.colors)) {
    changes.colors = {
      old: otherVersion.theme.colors,
      new: this.theme.colors,
    };
  }

  // Comparar styles
  if (JSON.stringify(this.theme.styles) !== JSON.stringify(otherVersion.theme.styles)) {
    changes.styles = {
      old: otherVersion.theme.styles,
      new: this.theme.styles,
    };
  }

  return changes;
};

const ThemeVersion = mongoose.model('ThemeVersion', themeVersionSchema);

export default ThemeVersion;
