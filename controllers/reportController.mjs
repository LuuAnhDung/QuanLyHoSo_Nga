import Case from '../models/Case.mjs';
import FileType from '../models/FileType.mjs';
import User from '../models/User.mjs';
import ExcelJS from 'exceljs';
import logger from '../config/logger.mjs';
import CaseTransition from '../models/CaseTransition.mjs';
import Score from '../models/Score.js';
import Unit from '../models/Unit.mjs';

export const generateFullReport = async (req, res) => {
  try {
    const filters = {};

    // Ví dụ filter đơn giản từ query params (có thể mở rộng)
    if (req.query.file_type_id) {
      filters.file_type_id = req.query.file_type_id;
    }
    if (req.query.status) {
      filters.status = req.query.status;
    }
    if (req.query.dateFrom && req.query.dateTo) {
      filters.registered_at = {
        $gte: new Date(req.query.dateFrom),
        $lte: new Date(req.query.dateTo)
      };
    }

    // Lấy danh sách case thỏa filter, populate các trường liên quan
    const cases = await Case.find(filters)
      .populate('file_type_id', 'name')
      .populate('registrar_id', 'username')
      .populate('manager_id', 'username')
      .lean();

    // Lấy tất cả case ids để query transition và score
    const caseIds = cases.map(c => c._id);

    // Lấy danh sách diễn biến của các hồ sơ trên
    const transitions = await CaseTransition.find({ case_id: { $in: caseIds } })
      .populate('case_id', 'case_code')
      .populate('sender_unit_id', 'name')
      .populate('receiver_unit_id', 'name')
      .populate('manager_id', 'username')
      .lean();

    // Lấy danh sách score của các hồ sơ trên
    const scores = await Score.find({ case_id: { $in: caseIds } })
      .populate('case_id', 'case_code')
      .populate('evaluator_id', 'username')
      .lean();

    // Gom transitions và scores theo case_id cho dễ xử lý
    const transitionsByCase = {};
    transitions.forEach(t => {
      const key = t.case_id._id.toString();
      if (!transitionsByCase[key]) transitionsByCase[key] = [];
      transitionsByCase[key].push(t);
    });

    const scoresByCase = {};
    scores.forEach(s => {
      const key = s.case_id._id.toString();
      if (!scoresByCase[key]) scoresByCase[key] = [];
      scoresByCase[key].push(s);
    });

    // Kết hợp dữ liệu report
    const reportData = cases.map(c => ({
      caseCode: c.case_code,
      summary: c.summary,
      fileType: c.file_type_id?.name || '',
      registrar: c.registrar_id?.username || '',
      manager: c.manager_id?.username || '',
      status: c.status,
      registeredAt: c.registered_at,
      endedAt: c.ended_at || '',
      archivedAt: c.archived_at || '',
      transferredAt: c.transferred_at || '',
      note: c.note || '',

      transitions: transitionsByCase[c._id.toString()] || [],
      scores: scoresByCase[c._id.toString()] || []
    }));

    // Trả về render hoặc JSON tuỳ mục đích
    res.render('admin/report', { reportData });
    // Hoặc res.json({ reportData }); nếu muốn trả JSON
  } catch (error) {
    logger.error('Error generating full report:', error);
    req.flash('error_msg', 'Lỗi khi tạo báo cáo tổng hợp hồ sơ.');
    res.redirect('/admin');
  }
};


export const generateReport = async (req, res) => {
  try {
    const filters = {};

    if (req.query.file_type_id) {
      filters.file_type_id = req.query.file_type_id;
    }

    if (req.query.status) {
      filters.status = req.query.status;
    }

    if (req.query.dateFrom && req.query.dateTo) {
      filters.registered_at = {
        $gte: new Date(req.query.dateFrom),
        $lte: new Date(req.query.dateTo)
      };
    }

    const cases = await Case.find(filters)
      .populate('file_type_id', 'name')
      .populate('registrar_id', 'username')
      .populate('manager_id', 'username');

    const reportData = cases.map(c => ({
      caseCode: c.case_code,
      summary: c.summary,
      fileType: c.file_type_id?.name || '',
      registrar: c.registrar_id?.username || '',
      manager: c.manager_id?.username || '',
      status: c.status,
      registeredAt: c.registered_at,
      endedAt: c.ended_at || '',
    }));

    res.render('admin/reports', { reportData });
  } catch (error) {
    logger.error('Error generating case report:', error);
    req.flash('error_msg', 'Lỗi khi tạo báo cáo hồ sơ.');
    res.redirect('/admin');
  }
};

export const exportReport = async (req, res) => {
  try {
    const filters = {};

    if (req.query.file_type_id) {
      filters.file_type_id = req.query.file_type_id;
    }

    if (req.query.status) {
      filters.status = req.query.status;
    }

    if (req.query.dateFrom && req.query.dateTo) {
      filters.registered_at = {
        $gte: new Date(req.query.dateFrom),
        $lte: new Date(req.query.dateTo),
      };
    }

    // Lấy hồ sơ theo filter
    const cases = await Case.find(filters)
      .populate('file_type_id', 'name')
      .populate('registrar_id', 'username')
      .populate('manager_id', 'username')
      .lean();

    const caseIds = cases.map(c => c._id);

    // Lấy transitions liên quan với populate đầy đủ trường
    const transitions = await CaseTransition.find({ case_id: { $in: caseIds } })
      .populate('case_id', 'case_code')
      .populate('sender_unit_id', 'name')
      .populate('receiver_unit_id', 'name')
      .populate('manager_id', 'username')
      .lean();

    // Lấy scores liên quan với populate đầy đủ trường
    const scores = await Score.find({ case_id: { $in: caseIds } })
      .populate('case_id', 'case_code')
      .populate('evaluator_id', 'username')
      .lean();

    const workbook = new ExcelJS.Workbook();

    // Sheet 1: Cases
    const wsCases = workbook.addWorksheet('Danh sách hồ sơ');
    wsCases.columns = [
      { header: 'Số hồ sơ', key: 'caseCode', width: 20 },
      { header: 'Trích yếu hồ sơ', key: 'summary', width: 40 },
      { header: 'Loại hồ sơ', key: 'fileType', width: 20 },
      { header: 'Cán bộ đăng ký', key: 'registrar', width: 20 },
      { header: 'Cán bộ quản lý', key: 'manager', width: 20 },
      { header: 'Trạng thái', key: 'status', width: 20 },
      { header: 'Ngày tạo', key: 'createdAt', width: 25 },
      { header: 'Ngày đăng ký', key: 'registeredAt', width: 25 },
      { header: 'Ngày kết thúc', key: 'endedAt', width: 25 },
      { header: 'Ngày nộp lưu', key: 'archivedAt', width: 25 },
      { header: 'Ngày chuyển', key: 'transferredAt', width: 25 },
      { header: 'Ghi chú', key: 'note', width: 30 },
    ];

    cases.forEach(c => {
      wsCases.addRow({
        caseCode: c.case_code,
        summary: c.summary,
        fileType: c.file_type_id?.name || '',
        registrar: c.registrar_id?.username || '',
        manager: c.manager_id?.username || '',
        status: c.status,
        createdAt: c.created_at ? new Date(c.created_at).toISOString() : '',
        registeredAt: c.registered_at ? new Date(c.registered_at).toISOString() : '',
        endedAt: c.ended_at ? new Date(c.ended_at).toISOString() : '',
        archivedAt: c.archived_at ? new Date(c.archived_at).toISOString() : '',
        transferredAt: c.transferred_at ? new Date(c.transferred_at).toISOString() : '',
        note: c.note || '',
      });
    });

    // Sheet 2: Case Transitions
    const wsTransitions = workbook.addWorksheet('Diễn biến hồ sơ');
    wsTransitions.columns = [
      { header: 'Số hồ sơ', key: 'caseCode', width: 20 },
      { header: 'Loại diễn biến', key: 'transitionType', width: 20 },
      { header: 'Cán bộ gửi', key: 'senderName', width: 25 },
      { header: 'Đơn vị gửi', key: 'senderUnit', width: 25 },
      { header: 'Cán bộ nhận', key: 'receiverName', width: 25 },
      { header: 'Đơn vị nhận', key: 'receiverUnit', width: 25 },
      { header: 'Cán bộ quản lý', key: 'manager', width: 20 },
      { header: 'Ngày gửi', key: 'transitionedAt', width: 25 },
      { header: 'Ghi chú', key: 'note', width: 30 },
    ];

    transitions.forEach(t => {
      wsTransitions.addRow({
        caseCode: t.case_id?.case_code || '',
        transitionType: t.transition_type,
        senderName: t.sender_name,
        senderUnit: t.sender_unit_id?.name || '',
        receiverName: t.receiver_name,
        receiverUnit: t.receiver_unit_id?.name || '',
        manager: t.manager_id?.username || '',
        transitionedAt: t.transitioned_at ? new Date(t.transitioned_at).toISOString() : '',
        note: t.note || '',
      });
    });

    // Sheet 3: Scores
    const wsScores = workbook.addWorksheet('Chấm điểm hồ sơ');
    wsScores.columns = [
      { header: 'Số hồ sơ', key: 'caseCode', width: 20 },
      { header: 'Cán bộ chấm', key: 'evaluator', width: 20 },
      { header: 'Ngày chấm', key: 'evaluatedAt', width: 25 },
      { header: 'Trường hợp', key: 'context', width: 20 },
      { header: 'Điểm', key: 'score', width: 10 },
      { header: 'Xếp loại', key: 'grade', width: 15 },
    ];

    scores.forEach(s => {
      wsScores.addRow({
        caseCode: s.case_id?.case_code || '',
        evaluator: s.evaluator_id?.username || '',
        evaluatedAt: s.evaluated_at ? new Date(s.evaluated_at).toISOString() : '',
        context: s.context || '',
        score: s.score ?? '',
        grade: s.grade || '',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=full_case_report.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    logger.error('Error exporting full report:', error);
    req.flash('error_msg', 'Lỗi khi xuất báo cáo hồ sơ đầy đủ.');
    res.redirect('/admin/reports');
  }
};

