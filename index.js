'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  if (!app) {
    console.error('Элемент #app не найден');
    return;
  }

  app.innerHTML = `
    <h1>Зелёная Долина</h1>
    <p>Приложение работает корректно.</p>
  `;
});