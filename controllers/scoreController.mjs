// controllers/score.controller.js
import Score from '../models/Score.js';
import Case from '../models/Case.mjs';
import User from '../models/User.mjs';
import logger from '../config/logger.mjs';

// CREATE Score
export const createScore = async (req, res) => {
  try {
    const newScore = new Score({
      case_id: req.body.case_id,
      evaluator_id: req.body.evaluator_id,
      evaluated_at: req.body.evaluated_at || new Date(),
      context: req.body.context,
      score: req.body.score
    });

    await newScore.save();

    console.log('Score created:', newScore);
    req.flash('success_msg', 'Chấm điểm thành công.');
    res.redirect('/score');
  } catch (error) {
    logger.error('Error creating score:', error);
    req.flash('error_msg', 'Lỗi khi chấm điểm.');
    res.redirect('/score');
  }
};

export const listScore = async (req, res) => {
  try {
    const cases = await Case.find();
    const users = await User.find();
    const scores = await Score.find()
      .populate('case_id')
      .populate('evaluator_id')
      .lean();
    res.render('user/score', {
      title: 'Chấm điểm hồ sơ',
      scores,
      cases,
      users
    });
  } catch (error) {
    logger.error('Error loading scores:', error);
    req.flash('error_msg', 'Lỗi khi tải danh sách chấm điểm.');
    res.redirect('/');
  }
};


// GET all Scores
export const getScores = async (req, res) => {
  try {
    const cases = await Case.find();
    const users = await User.find();
    const scores = await Score.find()
      .populate('case_id')
      .populate('evaluator_id')
      .lean();

    res.render('score', {
      title: 'Chấm điểm hồ sơ',
      scores,
      cases,
      users
    });
  } catch (error) {
    logger.error('Error loading scores:', error);
    req.flash('error_msg', 'Lỗi khi tải danh sách chấm điểm.');
    res.redirect('/');
  }
};

// UPDATE Score
export const updateScore = async (req, res) => {
  try {
    const score = await Score.findById(req.params.id);
    if (!score) {
      req.flash('error_msg', 'Không tìm thấy chấm điểm.');
      return res.redirect('/score');
    }

    Object.assign(score, {
      evaluator_id: req.body.evaluator_id,
      evaluated_at: req.body.evaluated_at || score.evaluated_at,
      context: req.body.context,
      score: req.body.score
    });

    await score.save();

    req.flash('success_msg', 'Cập nhật chấm điểm thành công.');
    res.redirect('/score');
  } catch (error) {
    logger.error('Error updating score:', error);
    req.flash('error_msg', 'Lỗi khi cập nhật chấm điểm.');
    res.redirect('/score');
  }
};

// DELETE Score
export const deleteScore = async (req, res) => {
  try {
    await Score.findByIdAndDelete(req.params.id);
    console.log('Score deleted:', req.params.id);
    req.flash('success_msg', 'Xóa chấm điểm thành công.');
    res.redirect('/score');
  } catch (error) {
    logger.error('Error deleting score:', error);
    req.flash('error_msg', 'Lỗi khi xóa chấm điểm.');
    res.redirect('/score');
  }
};
