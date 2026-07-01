'use strict';

// ─── Tab navigation ───

const tabs = document.querySelectorAll('.editor-tab');
const pages = document.querySelectorAll('.page');
const activityBtns = document.querySelectorAll('.activity-btn[data-activity]');
const breadcrumb = document.getElementById('breadcrumb-current');

function switchTab(tabName) {
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
  pages.forEach(p => p.classList.toggle('active', p.dataset.page === tabName));
  activityBtns.forEach(b => b.classList.toggle('active', b.dataset.activity === tabName));
  if (breadcrumb) breadcrumb.textContent = tabName + '.md';
  generateLineNumbers();

  if (tabName === 'experience') {
    setTimeout(animateTimeline, 80);
  }
}

tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));
activityBtns.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.activity)));

// ─── Line numbers ───

function generateLineNumbers() {
  const activePage = document.querySelector('.page.active');
  if (!activePage) return;
  const lnEl = activePage.querySelector('.line-numbers');
  if (!lnEl) return;
  const content = activePage.querySelector('.page-content');
  if (!content) return;
  const lineHeight = 24.5;
  const count = Math.max(Math.ceil(content.scrollHeight / lineHeight), 30);
  let html = '';
  for (let i = 1; i <= count; i++) {
    html += `<div style="padding:0 12px;line-height:${lineHeight}px">${i}</div>`;
  }
  lnEl.innerHTML = html;
}

// ─── Timeline animations ───

function animateTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  const timeline = document.querySelector('.timeline');

  // Reset first (so re-visiting the tab re-plays)
  items.forEach(item => {
    item.classList.remove('visible');
  });
  if (timeline) timeline.classList.remove('line-drawn');

  // Stagger items in
  items.forEach((item, i) => {
    setTimeout(() => item.classList.add('visible'), i * 90);
  });

  // Draw line after first item appears
  if (timeline) {
    setTimeout(() => timeline.classList.add('line-drawn'), 150);
  }
}

// ─── Init ───

window.addEventListener('load', () => {
  generateLineNumbers();
});
