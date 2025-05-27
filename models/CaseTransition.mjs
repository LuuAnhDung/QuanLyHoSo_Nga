import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CaseTransitionSchema = new Schema({
  case_id: {                        // Mã hồ sơ
    type: Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  transition_type: {               // Loại diễn biến
    type: String,
    enum: ['Chuyển loại', 'Bàn giao', 'Cập nhật'], // chuyen_loai, ban_giao, cap_nhat
    required: true
  },
  sender_name: {                   // Tên cán bộ chuyển
    type: String,
    required: true,
    trim: true
  },
  sender_unit_id: {               // Mã đơn vị cán bộ chuyển
    type: Schema.Types.ObjectId,
    ref: 'Unit',
    required: true
  },
  receiver_name: {                // Tên cán bộ nhận
    type: String,
    required: true,
    trim: true
  },
  receiver_unit_id: {            // Mã đơn vị cán bộ nhận (có thể null)
    type: Schema.Types.ObjectId,
    ref: 'Unit',
    default: null
  },
  manager_id: {                   // Mã cán bộ quản lý
    type: Schema.Types.ObjectId,
    ref: 'User',

    // required: true
  },
  transitioned_at: {              // Ngày diễn biến
    type: Date,
    default: Date.now,
    required: true
  },
  note: {                         // Ghi chú
    type: String,
    default: ''
  }
}, 
{
  timestamps: true,
});

export default mongoose.model('CaseTransition', CaseTransitionSchema);

