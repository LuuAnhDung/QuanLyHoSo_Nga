document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/case/all');
    const data = await res.json();

    const cases = data.cases;
    const attachments = data.attachments;

    const tbody = document.getElementById('caseTableBody');
    tbody.innerHTML = '';

    cases.forEach(item => {
      const relatedAttachments = attachments.filter(att => att.case_id._id === item._id);

      const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
      };

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.case_code}</td>
        <td>${item.summary}</td>
        <td>${item.file_type_id?.name || ''}</td>
        <td>${item.registrar_id?.username || ''}</td>
        <td>${item.manager_id?.username || ''}</td>
        <td>${item.status || ''}</td>
        <td>${item.note || ''}</td>
        <td>${formatDate(item.registered_at)}</td>
        <td>${formatDate(item.ended_at)}</td>
        <td>${formatDate(item.archived_at)}</td>
        <td>${formatDate(item.transferred_at)}</td>
    
        <td>
          ${relatedAttachments.map(att => {
            const fileUrl = '/' + att.file_path.replace(/\\/g, '/');
            return `<a href="${fileUrl}" download="${att.original_name}">${att.original_name}</a>`;
          }).join('<br>')}
        </td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="viewCaseDetail('${item._id}')">Xem</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error('Lỗi khi lấy danh sách hồ sơ:', err);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const cases = [
    {
      case_code: 'HS001',
      summary: 'Hồ sơ A',
      file_type_id: { name: 'Loại 1' },
      registrar_id: { username: 'Người đăng ký A' },
      manager_id: { username: 'Quản lý A' },
      status: 'Đang xử lý',
      note: 'Ghi chú A',
      // score: 85,
      registered_at: '2024-05-20T10:00:00Z',
      ended_at: '2024-06-01T15:00:00Z',
      submitted_at: '2024-06-02T09:00:00Z',
      transitioned_at: '2024-06-05T14:00:00Z',
      attached_file: 'fileA.pdf'
    },
    // Thêm các hồ sơ khác
  ];

  const tbody = document.getElementById('caseTableBody');

  cases.forEach(c => {
    const tr = document.createElement('tr');
{/* <td>${c.score ?? ''}</td> */}
    tr.innerHTML = `
      <td>${c.case_code}</td>
      <td>${c.summary}</td>
      <td>${c.file_type_id?.name || ''}</td>
      <td>${c.registrar_id?.username || ''}</td>
      <td>${c.manager_id?.username || ''}</td>
      <td>${c.status || ''}</td>
      <td>${c.note || ''}</td>
      <td>${c.registered_at ? c.registered_at.substr(0,10) : ''}</td>
      <td>${c.ended_at ? c.ended_at.substr(0,10) : ''}</td>
      <td>${c.submitted_at ? c.submitted_at.substr(0,10) : ''}</td>
      <td>${c.transitioned_at ? c.transitioned_at.substr(0,10) : ''}</td>
      <td>${c.attached_file || ''}</td>
      <td>
        <button class="btn btn-sm btn-info btn-view-case" data-case='${JSON.stringify(c).replace(/'/g, "&apos;")}'>
          Xem
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  const modal = new bootstrap.Modal(document.getElementById('caseDetailModal'));
  const detailContent = document.getElementById('caseDetailContent');
//  <li><strong>Điểm chấm:</strong> ${caseData.score ?? ''}</li>
  tbody.addEventListener('click', e => {
    if (e.target.classList.contains('btn-view-case')) {
      const caseData = JSON.parse(e.target.getAttribute('data-case'));

      // Tạo nội dung chi tiết (ví dụ)
      detailContent.innerHTML = `
        <ul class="list-unstyled mb-0">
          <li><strong>Mã hồ sơ:</strong> ${caseData.case_code}</li>
          <li><strong>Trích yếu:</strong> ${caseData.summary}</li>
          <li><strong>Loại hồ sơ:</strong> ${caseData.file_type_id?.name || ''}</li>
          <li><strong>Cán bộ đăng ký:</strong> ${caseData.registrar_id?.username || ''}</li>
          <li><strong>Cán bộ quản lý:</strong> ${caseData.manager_id?.username || ''}</li>
          <li><strong>Trạng thái:</strong> ${caseData.status || ''}</li>
          <li><strong>Ghi chú:</strong> ${caseData.note || ''}</li>
          <li><strong>Ngày đăng ký:</strong> ${caseData.registered_at ? caseData.registered_at.substr(0,10) : ''}</li>
          <li><strong>Ngày kết thúc:</strong> ${caseData.ended_at ? caseData.ended_at.substr(0,10) : ''}</li>
          <li><strong>Ngày nộp lưu:</strong> ${caseData.submitted_at ? caseData.submitted_at.substr(0,10) : ''}</li>
          <li><strong>Ngày chuyển:</strong> ${caseData.transitioned_at ? caseData.transitioned_at.substr(0,10) : ''}</li>
          <li><strong>File đính kèm:</strong> ${caseData.attached_file || 'Không có'}</li>
        </ul>
      `;

      modal.show();
    }
  });
});

