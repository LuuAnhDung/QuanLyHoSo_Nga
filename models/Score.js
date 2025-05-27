// models/Score.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
  case_id: {
    type: Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  evaluator_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  evaluated_at: {
    type: Date,
    default: Date.now
  },
  context: {
    type: String,
    enum: ['Bàn giao', 'Kết thúc', 'Hàng năm'],
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  grade: {
    type: String,
     enum: ['Tốt', 'Khá', 'Trung bình', 'Kém'],
  }
});

scoreSchema.pre('save', function (next) {
  if (this.score != null) {
    if (this.score >= 80) this.grade = 'Tốt';
    else if (this.score >= 65) this.grade = 'Khá';
    else if (this.score >= 50) this.grade = 'Trung bình';
    else this.grade = 'Kém';
  }
  next();
});

export default mongoose.model('Score', scoreSchema);
