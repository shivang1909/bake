import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';

const homepageSectionSchema = new Schema(
  {
    sectionName: {
      type: String,
      required: true,
      trim: true
    },
    visible: {
      type: Boolean,
      default: true
    },
    productIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'product'
      }
    ]
  },
  {
    timestamps: true
  }
);

const HomepageSection = model('HomepageSection', homepageSectionSchema);

export default HomepageSection;
