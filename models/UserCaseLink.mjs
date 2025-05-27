import mongoose from 'mongoose';

const userCaseLinkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('UserCaseLink', userCaseLinkSchema);