// controllers/caseTransition.controller.js
import CaseTransition from '../models/CaseTransition.mjs';
import Case from '../models/Case.mjs';
import Unit from '../models/Unit.mjs';
import User from '../models/User.mjs';
import logger from '../config/logger.mjs';

// CREATE CaseTransition
export const createCaseTransition = async (req, res) => {
  try {
    const newTransition = new CaseTransition({
      case_id: req.body.case_id,
      transition_type: req.body.transition_type,
      sender_name: req.body.sender_name,
      sender_unit_id: req.body.sender_unit_id,
      receiver_name: req.body.receiver_name,
      receiver_unit_id: req.body.receiver_unit_id || null,
      manager_id: req.body.manager_id || null,
      transitioned_at: req.body.transitioned_at || new Date(),
      note: req.body.note || ''
    });

    await newTransition.save();

    if (manager_id && manager_id !== '') {
      // Có manager → cập nhật manager_id của hồ sơ
      await Case.findByIdAndUpdate(case_id, {
        manager_id
      });
    } else {
      // Không có manager → cập nhật ghi chú
      await Case.findByIdAndUpdate(case_id, {
        $set: {
          note: 'Đã chuyển sang đơn vị khác'
        }
      });
    }

    console.log('New transition created:', newTransition);
    req.flash('success_msg', 'Transition created successfully.');
    res.redirect('/casetransition');
  } catch (error) {
    logger.error('Error creating case transition:', error);
    req.flash('error_msg', 'An error occurred while creating the transition.');
    res.redirect('/casetransition');
  }
};

// GET all transitions (can filter by case_id)
// export const getCaseTransitions = async (req, res) => {
//   try {
//     const filter = {};
//     if (req.query.case_id) {
//       filter.case_id = req.query.case_id;
//     }

//     const transitions = await CaseTransition.find(filter)
//       .populate('case_id', 'case_code')
//       .populate('sender_unit_id', 'name')
//       .populate('receiver_unit_id', 'name')
//       .populate('manager_id', 'username');

//     res.render('casetransition', { transitions, user: req.user });
//   } catch (error) {
//     logger.error('Error fetching case transitions:', error);
//     req.flash('error_msg', 'Error loading transitions.');
//     res.redirect('/casetransition');
//   }
// };
export const getCaseTransitions = async (req, res) => {
  const cases = await Case.find();
  const users = await User.find();
  const units = await Unit.find();
  const transitions = await CaseTransition.find()
    .populate('case_id')
    .populate('sender_unit_id')
    .populate('receiver_unit_id')
    .populate('manager_id')
    .lean();

  res.render('casetransition', {
    title: 'Luân chuyển hồ sơ',
    cases,
    users,
    units,
    transitions,
  });
};

export const listCasetransition = async (req, res) => {
  try {
    const caseTransitions = await CaseTransition.find()
        .populate('case_id', 'case_code')
        .populate('sender_unit_id', 'name')
        .populate('receiver_unit_id', 'name')
        .populate('manager_id', 'username');// đặt tên số nhiều cho mảng
    res.render('user/casetransition', { 
      caseTransitions,  // truyền cho view với tên số nhiều dễ hiểu
      user: res.locals.user 
    });
  } catch (error) {
    console.error('Error fetching case transitions:', error);  // nên log lỗi để debug
    req.flash('error_msg', 'Error fetching case transitions');
    res.redirect('/user');
  }
};

// UPDATE CaseTransition
export const updateCaseTransition = async (req, res) => {
  try {
    const transition = await CaseTransition.findById(req.params.id);
    if (!transition) {
      req.flash('error_msg', 'Transition not found.');
      return res.redirect('/casetransition');
    }

    Object.assign(transition, {
      transition_type: req.body.transition_type,
      sender_name: req.body.sender_name,
      sender_unit_id: req.body.sender_unit_id,
      receiver_name: req.body.receiver_name,
      receiver_unit_id: req.body.receiver_unit_id || null,
      manager_id: req.body.manager_id || null,
      transitioned_at: req.body.transitioned_at || transition.transitioned_at,
      note: req.body.note || ''
    });

    await transition.save();
    const manager_id = req.body.manager_id;
    const case_id = transition.case_id;

    if (manager_id && manager_id !== '') {
      // Có manager → cập nhật manager_id của hồ sơ
      await Case.findByIdAndUpdate(case_id, {
        manager_id
      });
    } else {
      // Không có manager → cập nhật ghi chú
      await Case.findByIdAndUpdate(case_id, {
        $set: {
          note: 'Đã chuyển sang đơn vị khác'
        }
      });
    }

    req.flash('success_msg', 'Transition updated successfully.');
    res.redirect('/casetransition');
  } catch (error) {
    logger.error('Error updating case transition:', error);
    req.flash('error_msg', 'Error updating transition.');
    res.redirect('/casetransition');
  }
};

// DELETE CaseTransition
export const deleteCaseTransition = async (req, res) => {
  try {
    await CaseTransition.findByIdAndDelete(req.params.id);
    
    console.log('Transition deleted:', req.params.id);
    req.flash('success_msg', 'Transition deleted successfully.');
    res.redirect('/casetransition');
  } catch (error) {
    logger.error('Error deleting case transition:', error);
    req.flash('error_msg', 'Error deleting transition.');
    res.redirect('/casetransition');
  }
};
