import mongoose from 'mongoose';

const emissionFactorSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: [true, 'Emission source is required'],
      trim: true,
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      trim: true,
    },
    factor: {
      type: Number,
      required: [true, 'Emission factor is required'],
      min: [0, 'Factor cannot be negative'],
    },
    status: {
      type: String,
      enum: {
        values: ['Active', 'Inactive'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Active',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index for efficient source lookups
emissionFactorSchema.index({ source: 1, status: 1 });

const EmissionFactor = mongoose.model('EmissionFactor', emissionFactorSchema);

export default EmissionFactor;
