import mongoose from 'mongoose';

const carbonTransactionSchema = new mongoose.Schema(
  {
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
      index: true,
    },
    source: {
      type: String,
      required: [true, 'Emission source is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    emissionFactor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmissionFactor',
      required: [true, 'Emission factor is required'],
    },
    calculatedEmission: {
      type: Number,
      required: [true, 'Calculated emission is required'],
      min: [0, 'Calculated emission cannot be negative'],
    },
    transactionDate: {
      type: Date,
      required: [true, 'Transaction date is required'],
      default: Date.now,
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Verified', 'Rejected'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Pending',
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

// Compound indexes for efficient queries
carbonTransactionSchema.index({ department: 1, transactionDate: -1 });
carbonTransactionSchema.index({ status: 1, transactionDate: -1 });

const CarbonTransaction = mongoose.model('CarbonTransaction', carbonTransactionSchema);

export default CarbonTransaction;
