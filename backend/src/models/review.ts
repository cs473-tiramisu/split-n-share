import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  author: mongoose.Types.ObjectId;
  target: mongoose.Types.ObjectId;
  rating: number;
  text: string;
  created_at: Date;
  likes: mongoose.Types.ObjectId[];
}

const reviewSchema: Schema = new Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  target: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true},
  text: { type: String, required: true, maxlength: 5000 },
  created_at: { type: Date, default: Date.now },
  likes: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] }, // Array of user IDs
});


const Review = mongoose.model<IReview>('Review', reviewSchema);
export default Review;
