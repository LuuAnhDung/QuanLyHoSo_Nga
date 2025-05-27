import express from 'express';
import {
  createCase,
  getCases,
  updateCase,
  deleteCase,
  getCasesPage
} from '../controllers/caseController.mjs';
import FileType from '../models/FileType.mjs';
import User from '../models/User.mjs'; 
import multer from 'multer';
import path from 'path';
import { ensureAuthenticated } from '../middleware/auth.mjs';

// Multer config for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

const router = express.Router();

// GET all cases
router.get('/all', ensureAuthenticated, getCases);

router.get('/view', ensureAuthenticated, getCasesPage);

// CREATE a case (POST)
router.post('/add', upload.array('attachments'),ensureAuthenticated, createCase);
router.get('/',ensureAuthenticated, async (req, res) => {
  try {
    const fileTypes = await FileType.find().lean();
    const users = await User.find().lean();

    res.render('case', { fileTypes, users }); // hoặc 'case_form' tùy view bạn dùng
  } catch (err) {
    console.error('Error loading form:', err);
    res.status(500).send('Lỗi khi tải biểu mẫu.');
  }
});
// UPDATE a case (POST or PUT method — often POST from form)
router.post('/update/:id', upload.array('attachments'),ensureAuthenticated, updateCase);

// DELETE a case
router.post('/delete/:id',ensureAuthenticated, deleteCase);

export default router;

// import express from 'express';
// import { ensureAuthenticated } from '../middleware/auth.mjs';
// import Declaration from '../models/Declaration.mjs';
// import Unit from '../models/Unit.mjs';
// import ForeignResident from '../models/ForeignResident.mjs';
// import User from '../models/User.mjs';
// import mongoose from 'mongoose';
// import logger from '../logger.js';
// import Accommodation from '../models/Accommodation.mjs';
// import { createDeclaration, getDeclarations } from '../controllers/declarationController.mjs';

// const router = express.Router();

// // API to add a new declaration
// router.post('/api/add', ensureAuthenticated, async (req, res) => {
//   const { full_name, nationality, check_in, check_out, reason } = req.body;

//   try {
//     // Fetch the accommodation associated with the logged-in user
//     const accommodation = await Accommodation.findOne({ representative: req.user._id });

//     if (!accommodation) {
//       logger.error('No accommodation found for the user.');
//       return res.status(400).json({ error: 'No accommodation found for your account.' });
//     }

//     const newDeclaration = new Declaration({
//       user: req.user._id,
//       full_name,
//       nationality,
//       accommodation: accommodation._id, // Use the accommodation's ObjectId
//       check_in,
//       check_out,
//       reason,
//       declarationDate: new Date(),
//       status: 'Pending',
//     });

//     await newDeclaration.save();
//     logger.info(`Declaration added successfully for user ${req.user._id}`);
//     res.status(201).json({ message: 'Declaration added successfully', declaration: newDeclaration });
//   } catch (error) {
//     logger.error('Error adding declaration:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // API to get declarations for the authenticated user
// router.get('/api', ensureAuthenticated, getDeclarations);

// // Route to display the declaration page
// router.get('/', ensureAuthenticated, getDeclarations);

// // Route to handle new declaration form submission
// router.post('/', ensureAuthenticated, createDeclaration);

// // Add this route to fetch districts and wards
// router.get('/api/units', ensureAuthenticated, async (req, res) => {
//   try {
//     logger.info('Fetching units from database...'); // Log when fetching starts
//     const units = await Unit.findOne({ Code: '01' }); // Assuming '01' is the code for Hà Nội
//     logger.info('Fetched units:', units); // Log the fetched units
//     if (units && units.District) {
//       res.json(units.District);
//     } else {
//       logger.error('District property is not available');
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   } catch (error) {
//     logger.error('Error fetching units:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Update route for profile information
// router.post('/update', ensureAuthenticated, async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { passportNumber, visaType, visaExpiryDate, address } = req.body;

//     // Update the ForeignResident information in the database
//     const updatedResident = await ForeignResident.findOneAndUpdate(
//       { user: userId },
//       { passportNumber, visaType, visaExpiryDate, address },
//       { new: true, upsert: true } // Create if not exists
//     );

//     if (updatedResident) {
//       logger.info('Update successful:', updatedResident);
//       res.json({ success: true, user: updatedResident });
//     } else {
//       logger.info('No matching user found for update');
//       res.json({ success: false, message: 'Không tìm thấy thông tin người dùng.' });
//     }
//   } catch (err) {
//     logger.error('Error updating user details:', err);
//     res.json({ success: false, message: 'Có lỗi xảy ra khi cập nhật thông tin' });
//   }
// });

// export default router;
