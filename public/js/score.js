document.addEventListener('DOMContentLoaded', () => {
  const scoreDetailModal = new bootstrap.Modal(document.getElementById('scoreDetailModal'));

  document.querySelectorAll('.btn-view-score').forEach(button => {
    button.addEventListener('click', () => {
      let data;
      try {
        data = JSON.parse(button.dataset.score);
      } catch (e) {
        console.error('Lỗi parse data-score:', e);
        return;
      }

      document.getElementById('detail-case').textContent = data.case_id?.case_code || '';
      document.getElementById('detail-evaluator').textContent = data.evaluator_id?.username || '';

      const dateStr = data.evaluated_at ? data.evaluated_at.substr(0, 10) : '';
      document.getElementById('detail-evaluated-at').textContent = dateStr;

      document.getElementById('detail-context').textContent = data.context || '';
      document.getElementById('detail-score').textContent = data.score ?? '';
      document.getElementById('detail-grade').textContent = data.grade || '';
      document.getElementById('detail-note').textContent = data.note || '';

      scoreDetailModal.show();
    });
  });
});
