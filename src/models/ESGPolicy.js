import mongoose from 'mongoose';

const esgPolicySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Policy title is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Policy description is required'],
      trim: true,
    },
    effectiveDate: {
      type: Date,
      required: [true, 'Effective date is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['Draft', 'Active', 'Archived'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Draft',
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

// Index for effective date queries
esgPolicySchema.index({ effectiveDate: -1, status: 1 });

const ESGPolicy = mongoose.model('ESGPolicy', esgPolicySchema);

export default ESGPolicy;
