import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
    },
    type: {
      type: String,
      required: [true, 'Category type is required'],
      enum: {
        values: ['CSR Activity', 'Challenge'],
        message: '{VALUE} is not a valid category type',
      },
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

// Compound index for type-based queries
categorySchema.index({ type: 1, status: 1 });

const Category = mongoose.model('Category', categorySchema);

export default Category;
