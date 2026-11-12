(function () {
  var box = document.createElement('div');
  box.className = 'lb';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Image viewer');
  box.innerHTML =
    '<button class="lb-close" type="button" aria-label="Close">&times;</button>' +
    '<span class="lb-count"></span>' +
    '<button class="lb-nav lb-prev" type="button" aria-label="Previous">&#8249;</button>' +
    '<figure><img alt=""><figcaption></figcaption></figure>' +
    '<button class="lb-nav lb-next" type="button" aria-label="Next">&#8250;</button>';
  document.body.appendChild(box);

  var img = box.querySelector('img'),
      cap = box.querySelector('figcaption'),
      count = box.querySelector('.lb-count'),
      prev = box.querySelector('.lb-prev'),
      next = box.querySelector('.lb-next'),
      closeBtn = box.querySelector('.lb-close');
  var items = [], idx = 0, lastFocus = null;

  function show(i) {
    idx = (i + items.length) % items.length;
    var s = items[idx];
    img.src = s.dataset.full;
    img.alt = s.querySelector('img').alt;
    cap.textContent = s.dataset.cap || '';
    var many = items.length > 1;
    prev.hidden = next.hidden = !many;
    count.textContent = many ? (idx + 1) + ' / ' + items.length : '';
  }
  function open(card, i) {
    items = Array.prototype.slice.call(card.querySelectorAll('.shot'));
    lastFocus = document.activeElement;
    box.hidden = false;
    document.documentElement.classList.add('lb-open');
    show(i);
    closeBtn.focus();
  }
  function close() {
    box.hidden = true;
    document.documentElement.classList.remove('lb-open');
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('[data-gallery]').forEach(function (card) {
    card.querySelectorAll('.shot').forEach(function (s, i) {
      s.addEventListener('click', function () { open(card, i); });
    });
    var ex = card.querySelector('.expand');
    if (ex) ex.addEventListener('click', function () { open(card, 0); });
  });

  prev.addEventListener('click', function () { show(idx - 1); });
  next.addEventListener('click', function () { show(idx + 1); });
  closeBtn.addEventListener('click', close);
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft' && items.length > 1) show(idx - 1);
    if (e.key === 'ArrowRight' && items.length > 1) show(idx + 1);
  });
})();
