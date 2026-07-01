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
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

activityBtns.forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.activity));
});

// ─── File tree folder toggle ───

function toggleFolder(id) {
  const folder = document.getElementById(id);
  if (folder) folder.classList.toggle('closed');
}

// ─── Line numbers ───

function generateLineNumbers() {
  const activePage = document.querySelector('.page.active');
  if (!activePage) return;
  const lnEl = activePage.querySelector('.line-numbers');
  if (!lnEl) return;

  const content = activePage.querySelector('.page-content');
  if (!content) return;

  const lineHeight = 24.5;
  const contentHeight = content.scrollHeight;
  const count = Math.max(Math.ceil(contentHeight / lineHeight), 30);

  let html = '';
  for (let i = 1; i <= count; i++) {
    html += `<div style="padding:0 12px;line-height:${lineHeight}px">${i}</div>`;
  }
  lnEl.innerHTML = html;
}

// ─── Init ───

window.addEventListener('load', () => {
  generateLineNumbers();
});
