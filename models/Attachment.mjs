import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const AttachmentSchema = new Schema({
  case_id: {                        // Mã hồ sơ liên quan
    type: Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  original_name: {                 // Tên file gốc
    type: String,
    required: true,
    trim: true
  },
  file_path: {                     // Đường dẫn lưu trữ vật lý (trên server)
    type: String,
    required: true,
    trim: true
  },
  mime_type: {                     // Loại file (image/jpeg, application/pdf, ...)
    type: String,
    required: true,
    trim: true
  },
},
{
  timestamps: true,
});

export default mongoose.model('Attachment', AttachmentSchema);


// import mongoose from 'mongoose'

// const residenceSchema = new mongoose.Schema({
//   foreignResident: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'ForeignResident',
//     required: true,
//   },
//   declaration: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Declaration',
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
//   },
//   reason: {
//     type: String,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ['Pending', 'Approved', 'Rejected'],
//     default: 'Pending',
//   },
// }, {
//   timestamps: true,
// })

// export default mongoose.model('Residence', residenceSchema)
