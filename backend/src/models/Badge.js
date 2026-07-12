import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Badge name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Badge description is required'],
      trim: true,
    },
    unlockRule: {
      type: String,
      required: [true, 'Unlock rule is required'],
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
      default: 'default-badge.png',
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

const Badge = mongoose.model('Badge', badgeSchema);

export default Badge;
