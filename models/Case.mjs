import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CaseSchema = new Schema({
  case_code: {               // Số hồ sơ
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  summary: {                 // Trích yếu hồ sơ
    type: String,
    required: true,
    trim: true
  },
  file_type_id: {           // Mã loại hồ sơ (ref đến file_types)
    type: Schema.Types.ObjectId,
    ref: 'FileType',
    required: true
  },
  created_at: {             // Ngày lập
    type: Date,
    default: Date.now,
    required: true
  },
  registered_at: {          // Ngày đăng ký
    type: Date,
    default: Date.now,
    required: true
  },
  ended_at: {               // Ngày kết thúc
    type: Date
  },
  archived_at: {            // Ngày nộp lưu
    type: Date
  },
  transferred_at: {         // Ngày chuyển
    type: Date
  },
  registrar_id: {           // Cán bộ đăng ký
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  manager_id: {             // Cán bộ quản lý
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {                 // Tình trạng
    type: String,
    enum: ['Đang chờ xử lý', 'Đã phê duyệt', 'Bị từ chối'], // mapping: dang_xuly -> processing
    required: true
  },
  note: {                   // Ghi chú
    type: String
  },
});

export default mongoose.model('Case', CaseSchema);

// import mongoose from 'mongoose';

// const declarationSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     index: true,
//   },
//   foreignResident: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'ForeignResident',
//     required: true,
//   },
//   accommodation: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Accommodation',
//     required: true,
//   },
//   check_in: {
//     type: Date,
//     required: true,
//   },
//   check_out: {
//     type: Date,
//     required: false,
//   },
//   reason: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   declarationDate: {
//     type: Date,
//     default: Date.now,
//   },
//   status: {
//     type: String,
//     enum: ['Pending', 'Approved', 'Rejected'],
//     default: 'Pending',
//   },
// }, {
//   timestamps: true,
// });

// // Tạo index để tăng tốc độ truy vấn cho các trường thường xuyên tìm kiếm
// declarationSchema.index({ user: 1, status: 1 });

// export default mongoose.model('Declaration', declarationSchema);
