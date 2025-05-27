// public/js/case.js

const form      = document.getElementById('case-form');
const tableBody = document.querySelector('table tbody');
const clearBtn  = document.getElementById('btn-clear');

// Reset form về “thêm mới”
function clearForm() {
  form.reset();
  form.action = '/case/add';
  document.getElementById('case-id').value = '';
}

// Điền dữ liệu lên form để sửa
function editCase(data) {
  document.getElementById('case-id').value       = data._id;
  document.getElementById('case_code').value     = data.case_code;
  document.getElementById('summary').value       = data.summary;
  document.getElementById('file_type_id').value  = data.file_type_id._id;
  document.getElementById('registered_at').value   = data.registered_at?.substr(0,10) || '';
  document.getElementById('ended_at').value      = data.ended_at?.substr(0,10) || '';
  document.getElementById('archived_at').value   = data.archived_at?.substr(0,10) || '';
  document.getElementById('transferred_at').value= data.transferred_at?.substr(0,10) || '';
  document.getElementById('registrar_id').value  = data.registrar_id?._id || '';
  document.getElementById('manager_id').value    = data.manager_id?._id || '';
  document.getElementById('status').value        = data.status;
  document.getElementById('note').value          = data.note;
  // document.getElementById('score').value         = data.score ?? '';
  // file attachments không giữ lại (user upload lại nếu cần)

  form.action = '/case/update/' + data._id;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Xóa case
async function deleteCase(id) {
  if (!confirm('Bạn có chắc muốn xóa?')) return;
  await fetch(`/case/delete/${id}`, { method: 'POST' }); 
  await loadCases();
}


// Tạo hành động cho nút Sửa / Xóa trên mỗi dòng
function bindRowEvents(row, item) {
  row.querySelector('.btn-edit').addEventListener('click', () => editCase(item));
  row.querySelector('.btn-delete').addEventListener('click', () => deleteCase(item._id));
}

const formatDate = (date) => {
  const d = new Date(date);
  const yy = String(d.getFullYear()).slice(0, 4); 
  const mm = String(d.getMonth() + 1).padStart(2, '0'); // tháng từ 0–11
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
};


// Load danh sách case từ API và render table
async function loadCases() {
  const res = await fetch('/case/all');
  // const data = await res.json();
  const json = await res.json();
  const data = json.cases || [];

  tableBody.innerHTML = '';

  data.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.case_code}</td>
      <td>${item.summary}</td>
      <td>${item.file_type_id?.name||''}</td>
      <td>${item.registrar_id?.username||''}</td>
      <td>${item.manager_id?.username||''}</td>
      <td>${item.status}</td>
      <td>${item.note||''}</td>
      <td>${formatDate(item.registered_at)}</td>
      <td>${formatDate(item.ended_at)}</td>
      <td>
        <button class="btn btn-sm btn-warning btn-edit">Sửa</button>
        <button class="btn btn-sm btn-danger btn-delete">Xóa</button>
      </td>
    `;
    tableBody.appendChild(tr);
    bindRowEvents(tr, item);
  });

  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="11" class="text-center">Chưa có hồ sơ nào.</td></tr>`;
  }
}

// Khởi tạo
document.addEventListener('DOMContentLoaded', () => {
  clearForm();
  clearBtn.addEventListener('click', clearForm);
  loadCases();
});
