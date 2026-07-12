import mongoose from 'mongoose';

const environmentalGoalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
    },
    targetValue: {
      type: Number,
      required: [true, 'Target value is required'],
      min: [0, 'Target value cannot be negative'],
    },
    currentValue: {
      type: Number,
      default: 0,
      min: [0, 'Current value cannot be negative'],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['Active', 'Completed', 'Cancelled', 'Overdue'],
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

// Index for deadline-based queries
environmentalGoalSchema.index({ deadline: 1, status: 1 });

// Virtual field for progress percentage
environmentalGoalSchema.virtual('progress').get(function () {
  if (this.targetValue === 0) return 0;
  return Math.min(100, Math.round((this.currentValue / this.targetValue) * 100));
});

// Ensure virtuals are included in JSON
environmentalGoalSchema.set('toJSON', { virtuals: true });
environmentalGoalSchema.set('toObject', { virtuals: true });

const EnvironmentalGoal = mongoose.model('EnvironmentalGoal', environmentalGoalSchema);

export default EnvironmentalGoal;
