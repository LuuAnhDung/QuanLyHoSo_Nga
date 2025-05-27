// controllers/case.controller.js
import Case from '../models/Case.mjs';
import FileType from '../models/FileType.mjs';
import User from '../models/User.mjs';
import Attachment from '../models/Attachment.mjs';
import logger from '../config/logger.mjs';
import fs from 'fs';
import path from 'path';

// CREATE a new case
export const createCase = async (req, res) => {
  try {
    const newCase = new Case({
      case_code: req.body.case_code,
      summary: req.body.summary,
      file_type_id: req.body.file_type_id,
      registrar_id: req.user?._id || '6648cc5b3c421c42e43d53bb',
      manager_id: req.body?.manager_id || '6648cc5b3c421c42e43d53bb',
      status: req.body.status || 'Đang chờ xử lý',
      note: req.body.note,
      created_at: req.body.created_at || new Date(),
      registered_at: req.body.registered_at || new Date(),
      ended_at: req.body.ended_at,
      archived_at: req.body.archived_at,
      transferred_at: req.body.transferred_at
    });

    await newCase.save();

    // Handle file attachments
    if (req.files && req.files.length > 0) {
      const attachments = req.files.map(file => new Attachment({
        case_id: newCase._id,
        original_name: file.originalname,
        file_path: path.join('uploads', file.filename),
        mime_type: file.mimetype
      }));
      await Attachment.insertMany(attachments);
    }

    // res.redirect('/case');
    res.redirect('/case?success=1');
  } catch (error) {
    logger.error('Error creating case:', error);
    req.flash('error_msg', 'An error occurred while creating the case.');
    res.redirect('/case');
  }
};

// GET all cases (admin/manager/full list)
export const getCases = async (req, res) => {
  try {
    let cases;
    let attachments;
    if (req.user.role === 'admin' || req.user.role === 'manager' || req.user.role === 'user') {
      cases = await Case.find()
        .populate('file_type_id')
        .populate('registrar_id', 'username')
        .populate('manager_id', 'username');
      attachments = await Attachment.find({ case_id: { $in: cases.map(c => c._id) } }).populate('case_id');
    } else {
      cases = await Case.find({ registrar_id: req.user._id })
        .populate('file_type_id')
        .populate('registrar_id', 'username')
        .populate('manager_id', 'username');
    }

    // res.render('case', { cases, user: req.user });
    // res.json(cases);
    res.json({ cases, attachments });
  } catch (error) {
    // logger.error('Error fetching cases:', error);
    // req.flash('error_msg', 'An error occurred while fetching cases.');
    // res.redirect('/');
    console.error('Error fetching cases:', error);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
};

// export const getCasesPage = async (req, res) => {
//   try {
//     // Có thể truyền user để template dùng
//     res.render('caseview', { user: req.user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Lỗi server khi hiển thị trang caseview');
//   }
// };
export const getCasesPage = async (req, res) => {
  try {
    const fileTypes = await FileType.find();
    const users = await User.find();

    res.render('caseview', {
      user: req.user,
      fileTypes,
      users,
      currentUserId: req.user?._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Lỗi server khi hiển thị trang caseview');
  }
};


// UPDATE a case by ID
export const updateCase = async (req, res) => {
  try {
    const caseToUpdate = await Case.findById(req.params.id);
    if (!caseToUpdate) {
      req.flash('error_msg', 'Case not found.');
      return res.redirect('/case');
    }

    Object.assign(caseToUpdate, {
      case_code: req.body.case_code,
      summary: req.body.summary,
      file_type_id: req.body.file_type_id,
      manager_id: req.body.manager_id,
      status: req.body.status,
      note: req.body.note,
      ended_at: req.body.ended_at,
      archived_at: req.body.archived_at,
      transferred_at: req.body.transferred_at
    });

    await caseToUpdate.save();

    // Handle new attachments if provided
    if (req.files && req.files.length > 0) {
      const attachments = req.files.map(file => new Attachment({
        case_id: caseToUpdate._id,
        original_name: file.originalname,
        file_path: path.join('uploads', file.filename),
        mime_type: file.mimetype
      }));
      await Attachment.insertMany(attachments);
    }

    req.flash('success_msg', 'Case updated successfully.');
    res.redirect('/case');
  } catch (error) {
    logger.error('Error updating case:', error);
    req.flash('error_msg', 'An error occurred while updating the case.');
    res.redirect('/case');
  }
};

// DELETE a case by ID
export const deleteCase = async (req, res) => {
  try {
    const deletedCase = await Case.findByIdAndDelete(req.params.id);

    // Remove associated attachments
    const attachments = await Attachment.find({ case_id: req.params.id });
    for (const file of attachments) {
      fs.unlink(path.resolve(file.file_path), err => {
        if (err) logger.error('Failed to delete file:', file.path);
      });
    }
    await Attachment.deleteMany({ case_id: req.params.id });

    req.flash('success_msg', 'Case deleted successfully.');
    res.redirect('/case');
  } catch (error) {
    logger.error('Error deleting case:', error);
    req.flash('error_msg', 'An error occurred while deleting the case.');
    res.redirect('/case');
  }
};

// import Declaration from '../models/Declaration.mjs';
// import Accommodation from '../models/Accommodation.mjs';
// import ForeignResident from '../models/ForeignResident.mjs';
// import mongoose from 'mongoose';
// import logger from '../config/logger.mjs';
// import Residence from '../models/Residence.mjs';

// export const createDeclaration = async (req, res) => {
//   try {
//     // Fetch the accommodation associated with the logged-in user
//     const accommodation = await Accommodation.findOne({ representative: req.user._id });

//     if (!accommodation) {
//       req.flash('error_msg', 'No accommodation found for your account.');
//       return res.redirect('/declaration/new');
//     }

//     // Create a new ForeignResident entry
//     const foreignResident = new ForeignResident({
//       fullName: req.body.fullName,
//       passportNumber: req.body.passportNumber,
//       visaType: req.body.visaType,
//       visaExpiryDate: req.body.visaExpiryDate,
//       address: req.body.address,
//       dateOfBirth: req.body.dateOfBirth,
//       nationality: req.body.nationality,
//       accommodation: accommodation._id, // Use the accommodation's ObjectId
//     });

//     await foreignResident.save();

//     // Create a new Declaration entry
//     const newDeclaration = new Declaration({
//       user: req.user._id,
//       accommodation: accommodation._id, // Use the accommodation's ObjectId
//       check_in: req.body.check_in,
//       check_out: req.body.check_out,
//       reason: req.body.reason,
//       status: 'Pending',
//     });

//     await newDeclaration.save();

//     req.flash('success_msg', 'Declaration submitted successfully.');
//     res.redirect('/declaration');
//   } catch (error) {
//     logger.error('Error creating declaration:', error);
//     req.flash('error_msg', 'An error occurred while submitting the declaration.');
//     res.redirect('/declaration/new');
//   }
// };

// // Function to render the declaration form with accommodations
// export const renderDeclarationForm = async (req, res) => {
//   try {
//     // Fetch the accommodation associated with the logged-in user
//     const accommodation = await Accommodation.findOne({ managing_unit: req.user._id });

//     if (!accommodation) {
//       req.flash('error_msg', 'No accommodation found for your account.');
//       return res.redirect('/declarations');
//     }

//     console.log('Accommodation:', accommodation); // Debugging line to verify data
//     res.render('declaration', { accommodations: [accommodation], user: req.user });
//   } catch (error) {
//     console.error('Error fetching accommodation:', error);
//     req.flash('error_msg', 'Error fetching accommodation');
//     res.redirect('/declarations');
//   }
// };

// export const getDeclarations = async (req, res) => {
//   try {
//     let residences;

//     if (req.user.role === 'admin' || req.user.role === 'manager') {
//       // Fetch all residences for admins and managers
//       residences = await Residence.find()
//         .populate({
//           path: 'declaration',
//           populate: { path: 'user', select: 'username' }
//         })
//         .populate('foreignResident')
//         .populate('accommodation');
//     } else {
//       // Fetch only the residences associated with the logged-in user
//       residences = await Residence.find()
//         .populate({
//           path: 'declaration',
//           match: { user: req.user._id },
//           populate: { path: 'user', select: 'username' }
//         })
//         .populate('foreignResident')
//         .populate('accommodation');
//     }

//     // Filter out residences without a matching declaration for regular users
//     if (req.user.role !== 'admin' && req.user.role !== 'manager') {
//       residences = residences.filter(residence => residence.declaration);
//     }

//     console.log('Fetched residences:', residences); // Debugging line

//     // Render the view with the fetched residences
//     res.render('declaration', { residences, user: req.user });
//   } catch (error) {
//     logger.error('Error fetching declarations:', error);
//     req.flash('error_msg', 'Error fetching declarations');
//     res.redirect('/declaration'); // Redirect to the declaration page on error
//   }
// }; 