import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema(
  {
    partnerId: {
      type: String,
      required: [true, 'Partner ID is required'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    logo: {
      type: {
        type: String,
        enum: ['url', 'file'],
      },
      value: String,
    },
    logoWhite: {
      type: {
        type: String,
        enum: ['url', 'file'],
      },
      value: String,
    },
    figmaLinks: [
      {
        productName: {
          type: String,
          required: true,
          trim: true,
        },
        url: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
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
  },
  {
    timestamps: true,
  }
);

partnerSchema.index({ partnerId: 1 });
partnerSchema.index({ name: 1 });

const Partner = mongoose.model('Partner', partnerSchema);

export default Partner;
