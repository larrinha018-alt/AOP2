// Interações locais: menu, filtros de leitura e preparação de mensagens.
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu-principal');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('is-open', open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton) {
    menuButton.setAttribute('aria-expanded','false');
    menu.classList.remove('is-open');
  }
});
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed',String(b === button)));
    let count = 0;
    document.querySelectorAll('[data-category]').forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
      if (!card.hidden) count++;
    });
    document.querySelector('#filter-status').textContent = `${count} ${count === 1 ? 'história disponível' : 'histórias disponíveis'}.`;
  });
});
async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const field = document.createElement('textarea');
  field.value = text;
  field.style.position = 'fixed';
  field.style.left = '-9999px';
  document.body.append(field);
  field.select();
  const copied = document.execCommand('copy');
  field.remove();
  if (!copied) throw new Error('Não foi possível copiar automaticamente.');
}
document.querySelector('.copy-article')?.addEventListener('click', async () => {
  const status = document.querySelector('.copy-status');
  try { await copyText(window.location.href.split('#')[0]); status.textContent = 'Link copiado. Compartilhe essa história!'; }
  catch { status.textContent = 'Selecione o endereço na barra do navegador para copiar o link.'; }
});
const form = document.querySelector('#contact-form');
form?.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const name = String(data.get('nome')).trim();
  const message = String(data.get('mensagem')).trim();
  if (!name || message.length < 10) {
    document.querySelector('#form-status').textContent = 'Preencha seu nome e uma mensagem com pelo menos 10 caracteres.';
    return;
  }
  const email = String(data.get('email')).trim();
  document.querySelector('#mensagem-pronta').value = `Para: Ponto de Respawn\nAssunto: ${data.get('assunto')}\nDe: ${name}${email ? `\nE-mail: ${email}` : ''}\n\n${message}`;
  document.querySelector('#message-result').hidden = false;
  document.querySelector('#form-status').textContent = 'Mensagem preparada. Copie o texto abaixo para compartilhar.';
  document.querySelector('#mensagem-pronta').focus();
});
document.querySelector('#copy-message')?.addEventListener('click', async () => {
  const field = document.querySelector('#mensagem-pronta');
  try { await copyText(field.value); document.querySelector('#form-status').textContent = 'Mensagem copiada! Agora você pode compartilhar com a responsável pelo blog.'; }
  catch { field.focus(); field.select(); document.querySelector('#form-status').textContent = 'Selecionei o texto. Use a opção Copiar do seu dispositivo.'; }
});
