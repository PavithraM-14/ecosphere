import mongoose from 'mongoose';

const workflowHistorySchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      required: [true, 'Entity type is required'],
      trim: true,
      index: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Entity ID is required'],
      index: true,
    },
    previousStatus: {
      type: String,
      required: [true, 'Previous status is required'],
      trim: true,
    },
    newStatus: {
      type: String,
      required: [true, 'New status is required'],
      trim: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Changed by user is required'],
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

// Compound index for efficient queries
workflowHistorySchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

const WorkflowHistory = mongoose.model('WorkflowHistory', workflowHistorySchema);

export default WorkflowHistory;
