import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const FileTypeSchema = new Schema({
  code: {                   // Mã loại
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {                   // Tên loại hồ sơ
    type: String,
    required: true,
    trim: true
  },
  description: {            // Mô tả
    type: String,
    default: ''
  }
},
{
  timestamps: true,
});

export default mongoose.model('FileType', FileTypeSchema);


// import mongoose from 'mongoose'

// const foreignResidentSchema = new mongoose.Schema({
//   passportNumber: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//   },
//   visaType: {
//     type: String,
//     required: true,
//   },
//   visaExpiryDate: {
//     type: Date,
//     required: true,
//   },
//   address: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   accommodation: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Accommodation',
//     required: true,
//   },
//   fullName: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   dateOfBirth: {
//     type: Date,
//     required: true,
//   },
//   nationality: {
//     type: String,
//     required: true,
//     trim: true,
//   },
// }, {
//   timestamps: true,
// })

// export default mongoose.model('ForeignResident', foreignResidentSchema)
