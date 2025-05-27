// public/js/casetransition.js

// Hàm đổ dữ liệu lên form
function editTransition(data) {
  const form = document.getElementById('transition-form');
  // set ID và chuyển action
  document.getElementById('transition-id').value = data._id;
  form.action = '/casetransition/edit/' + data._id;

  // điền các field
  document.getElementById('case_id').value          = data.case_id._id;
  document.getElementById('transition_type').value  = data.transition_type;
  document.getElementById('transitioned_at').value  = data.transitioned_at?.substr(0,10) || '';
  document.getElementById('sender_name').value      = data.sender_name;
  document.getElementById('sender_unit_id').value   = data.sender_unit_id?._id || '';
  document.getElementById('receiver_name').value    = data.receiver_name;
  document.getElementById('receiver_unit_id').value = data.receiver_unit_id?._id || '';
  document.getElementById('manager_id').value       = data.manager_id?._id || '';
  document.getElementById('note').value             = data.note || '';
}

// Hàm reset form về trạng thái thêm mới
function clearForm() {
  const form = document.getElementById('transition-form');
  form.reset();
  form.action = '/casetransition/create';
  document.getElementById('transition-id').value = '';
}

// Đăng ký sự kiện cho các nút “Sửa” sau khi DOM ready
document.addEventListener('DOMContentLoaded', () => {
  clearForm(); // đảm bảo ban đầu là “thêm mới”
  document.querySelectorAll('.btn-edit-transition').forEach(btn => {
    btn.addEventListener('click', () => {
      const data = JSON.parse(btn.dataset.transition);
      editTransition(data);
    });
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const transitionModalEl = document.getElementById('transitionDetailModal');
  const transitionModal = new bootstrap.Modal(transitionModalEl);

  document.querySelectorAll('.btn-view-transition').forEach(button => {
    button.addEventListener('click', () => {
      const rawData = button.getAttribute('data-transition');
      let data;
      try {
        data = JSON.parse(rawData);
      } catch (e) {
        console.error('Lỗi parse data-transition:', e);
        return;
      }

      // Đưa dữ liệu vào modal
      document.getElementById('detail-case-code').textContent = data.case_id?.case_code || 'N/A';
      document.getElementById('detail-transition-type').textContent = data.transition_type || '';
      document.getElementById('detail-sender-name').textContent = data.sender_name || '';
      document.getElementById('detail-sender-unit').textContent = data.sender_unit_id?.name || 'N/A';
      document.getElementById('detail-receiver-name').textContent = data.receiver_name || '';
      document.getElementById('detail-receiver-unit').textContent = data.receiver_unit_id?.name || 'N/A';

      // Format ngày: YYYY-MM-DD
      const dateStr = data.transitioned_at ? data.transitioned_at.substr(0, 10) : '';
      document.getElementById('detail-transitioned-at').textContent = dateStr;

      document.getElementById('detail-manager').textContent = data.manager_id?.username || 'N/A';
      document.getElementById('detail-note').textContent = data.note || '';

      // Hiện modal
      transitionModal.show();
    });
  });
});
