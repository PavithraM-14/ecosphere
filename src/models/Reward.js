import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Reward name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Reward description is required'],
      trim: true,
    },
    pointsRequired: {
      type: Number,
      required: [true, 'Points required is required'],
      min: [0, 'Points required cannot be negative'],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    status: {
      type: String,
      enum: {
        values: ['Available', 'Out of Stock', 'Discontinued'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Available',
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

// Index for points-based queries
rewardSchema.index({ pointsRequired: 1, status: 1 });

const Reward = mongoose.model('Reward', rewardSchema);

export default Reward;
