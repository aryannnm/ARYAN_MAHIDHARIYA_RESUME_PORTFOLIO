// ── MODAL ─────────────────────────────────────────────
function openModal(src, title) {
  document.getElementById('modal').classList.add('open');
  document.getElementById('modal-img').src = src;
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-open').href = src;
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('modal')) {
    document.getElementById('modal').classList.remove('open');
  }
}

// ── CREDENTIALS FILTER ────────────────────────────────
function filterCreds(type, btn) {
  document.querySelectorAll('.cred-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.cred-card').forEach(card => {
    if (type === 'all' || card.dataset.type === type) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// ── KEYBOARD CLOSE MODAL ──────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});