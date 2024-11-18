import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  author: mongoose.Types.ObjectId;
  target: mongoose.Types.ObjectId;
  text: string;
  created_at: Date;
}

const reviewSchema: Schema = new Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  target: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true, maxlength: 5000 },
  created_at: { type: Date, default: Date.now },
});

const Review = mongoose.model<IReview>('Review', reviewSchema);
export default Review;
