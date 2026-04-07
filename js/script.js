/* ============================================================
   MR INJETADOS — Fábrica de Solados
   script.js — Catálogo Digital Profissional
   Funcionalidades: Catálogo, Filtros, Busca, Modal, WhatsApp
============================================================ */

'use strict';

/* ============================================================
   1. CONFIGURAÇÃO DA EMPRESA
   ➜ Altere o número de WhatsApp aqui
============================================================ */
const CONFIG = {
  whatsapp: '5514996402866',       // Número com DDI + DDD + número (sem espaços ou traços)
  empresa:  'MR Injetados',        // Nome da empresa na mensagem WhatsApp
  moeda:    'R$',                  // Símbolo de moeda
};

/* ============================================================
   2. BASE DE PRODUTOS
   ➜ Adicione, remova ou edite produtos aqui

   Campos:
   - id:          Identificador único (string)
   - codigo:      Código do produto exibido no catálogo
   - nome:        Nome do modelo
   - categoria:   Categoria (ex: "Casual", "Esportivo", "Infantil")
   - preco:       Preço por par (number, sem símbolo)
   - numeracoes:  Array de numerações disponíveis
   - imagem:      Caminho da imagem (ex: "img/modelo-tr001.jpg") ou "" para placeholder
   - status:      "disponivel" | "encomenda" | "novo"
   - disponivel:  true | false (false exibe overlay de indisponível)
   - novidade:    true | false (exibe badge NOVO em conjunto com o status "novo")

   ➜ Como adicionar uma foto:
   1. Coloque a imagem na pasta img/ (crie a pasta se não existir)
   2. No campo "imagem", informe o caminho: "img/nome-do-arquivo.jpg"
============================================================ */
const PRODUTOS = [
  {
    id:          'tr-001',
    codigo:      'TR-001',
    nome:        'Tração Premium',
    categoria:   'Casual',
    preco:       18.90,
    numeracoes:  [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44],
    imagem:      '',
    status:      'disponivel',
    disponivel:  true,
    novidade:    false,
  },
  {
    id:          'sp-002',
    codigo:      'SP-002',
    nome:        'Sport Run',
    categoria:   'Esportivo',
    preco:       24.50,
    numeracoes:  [36, 37, 38, 39, 40, 41, 42, 43, 44],
    imagem:      '',
    status:      'disponivel',
    disponivel:  true,
    novidade:    false,
  },
  {
    id:          'cl-003',
    codigo:      'CL-003',
    nome:        'Classic Line',
    categoria:   'Social',
    preco:       21.00,
    numeracoes:  [38, 39, 40, 41, 42, 43, 44],
    imagem:      '',
    status:      'disponivel',
    disponivel:  true,
    novidade:    false,
  },
  {
    id:          'in-004',
    codigo:      'IN-004',
    nome:        'Infantil Flex',
    categoria:   'Infantil',
    preco:       14.90,
    numeracoes:  [25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
    imagem:      '',
    status:      'novo',
    disponivel:  true,
    novidade:    true,
  },
  {
    id:          'ws-005',
    codigo:      'WS-005',
    nome:        'Work Safe',
    categoria:   'Segurança',
    preco:       32.00,
    numeracoes:  [38, 39, 40, 41, 42, 43, 44, 45, 46],
    imagem:      '',
    status:      'disponivel',
    disponivel:  true,
    novidade:    false,
  },
  {
    id:          'lt-006',
    codigo:      'LT-006',
    nome:        'Light Step',
    categoria:   'Casual',
    preco:       19.50,
    numeracoes:  [35, 36, 37, 38, 39, 40, 41, 42],
    imagem:      '',
    status:      'encomenda',
    disponivel:  true,
    novidade:    false,
  },
  {
    id:          'hk-007',
    codigo:      'HK-007',
    nome:        'High Kick',
    categoria:   'Esportivo',
    preco:       28.90,
    numeracoes:  [36, 37, 38, 39, 40, 41, 42, 43, 44],
    imagem:      '',
    status:      'novo',
    disponivel:  true,
    novidade:    true,
  },
  {
    id:          'fm-008',
    codigo:      'FM-008',
    nome:        'Femme Elegance',
    categoria:   'Feminino',
    preco:       22.00,
    numeracoes:  [33, 34, 35, 36, 37, 38, 39, 40],
    imagem:      '',
    status:      'disponivel',
    disponivel:  true,
    novidade:    false,
  },
  {
    id:          'rr-009',
    codigo:      'RR-009',
    nome:        'Road Ranger',
    categoria:   'Segurança',
    preco:       38.00,
    numeracoes:  [40, 41, 42, 43, 44, 45, 46],
    imagem:      '',
    status:      'encomenda',
    disponivel:  true,
    novidade:    false,
  },
  {
    id:          'sb-010',
    codigo:      'SB-010',
    nome:        'Soft Boost',
    categoria:   'Casual',
    preco:       17.50,
    numeracoes:  [35, 36, 37, 38, 39, 40, 41, 42, 43, 44],
    imagem:      '',
    status:      'disponivel',
    disponivel:  true,
    novidade:    false,
  },
  {
    id:          'mx-011',
    codigo:      'MX-011',
    nome:        'Max Grip',
    categoria:   'Esportivo',
    preco:       26.90,
    numeracoes:  [37, 38, 39, 40, 41, 42, 43, 44],
    imagem:      '',
    status:      'novo',
    disponivel:  true,
    novidade:    true,
  },
  {
    id:          'jn-012',
    codigo:      'JN-012',
    nome:        'Junior Steps',
    categoria:   'Infantil',
    preco:       13.50,
    numeracoes:  [25, 26, 27, 28, 29, 30, 31, 32],
    imagem:      '',
    status:      'disponivel',
    disponivel:  true,
    novidade:    false,
  },
];

/* ============================================================
   3. ESTADO DA APLICAÇÃO
============================================================ */
const state = {
  filtroStatus: 'all',
  filtroTamanho: 'all',
  filtroPreco: 'all',
  busca: '',
  ordenacao: 'default',
  modalProduto: null,
  tamanhoSelecionado: null,
};

/* ============================================================
   4. UTILITÁRIOS
============================================================ */

/**
 * Formata preço para exibição em reais
 * @param {number} valor
 * @returns {string}
 */
function formatarPreco(valor) {
  return `${CONFIG.moeda} ${valor.toFixed(2).replace('.', ',')}`;
}

/**
 * Retorna o label do badge de status
 * @param {string} status
 * @returns {string}
 */
function labelStatus(status) {
  switch (status) {
    case 'disponivel': return 'Disponível';
    case 'encomenda':  return 'Sob Encomenda';
    case 'novo':       return 'Novo';
    default:           return '';
  }
}

/**
 * Gera o HTML do badge
 * @param {Object} produto
 * @returns {string}
 */
function htmlBadges(produto) {
  let html = '';
  html += `<span class="badge badge-${produto.status}">${labelStatus(produto.status)}</span>`;
  if (produto.novidade && produto.status !== 'novo') {
    html += `<span class="badge badge-novo">Novo</span>`;
  }
  return html;
}

/**
 * Gera o placeholder SVG para produtos sem imagem
 * @returns {string}
 */
function htmlPlaceholder() {
  return `
    <div class="card-img-placeholder">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="16" width="56" height="32" rx="4" stroke="#ffffff" stroke-width="1.5"/>
        <path d="M4 28 C12 20 20 36 28 28 C36 20 44 36 52 28 C56 24 60 26 60 26" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M10 40 L54 40" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="4 3"/>
        <circle cx="32" cy="48" r="3" fill="#ffffff"/>
      </svg>
      <span>Foto em breve</span>
    </div>
  `;
}

/**
 * Extrai todos os tamanhos únicos dos produtos
 * @returns {number[]}
 */
function obterTamanhos() {
  const set = new Set();
  PRODUTOS.forEach(p => p.numeracoes.forEach(n => set.add(n)));
  return Array.from(set).sort((a, b) => a - b);
}

/**
 * Abre o WhatsApp com mensagem pré-formatada
 * @param {Object} produto
 * @param {number|null} numeracao
 * @param {number} quantidade
 */
function abrirWhatsApp(produto, numeracao, quantidade) {
  const num = numeracao ? numeracao : 'A confirmar';
  const msg = [
    `Olá, gostaria de solicitar este solado:`,
    ``,
    `Modelo: ${produto.codigo}`,
    `Nome: ${produto.nome}`,
    `Numeração: ${num}`,
    `Quantidade: ${quantidade} par(es)`,
    `Preço unitário: ${formatarPreco(produto.preco)}`,
    ``,
    `Empresa: ${CONFIG.empresa}`,
  ].join('\n');

  const encoded = encodeURIComponent(msg);
  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encoded}`;
  window.open(url, '_blank');
}

/* ============================================================
   5. FILTROS E BUSCA
============================================================ */

/**
 * Aplica todos os filtros ativos na lista de produtos
 * @returns {Object[]}
 */
function filtrarProdutos() {
  let lista = [...PRODUTOS];

  // Busca por nome ou código
  if (state.busca.trim()) {
    const q = state.busca.toLowerCase();
    lista = lista.filter(p =>
      p.nome.toLowerCase().includes(q) ||
      p.codigo.toLowerCase().includes(q) ||
      p.categoria.toLowerCase().includes(q)
    );
  }

  // Filtro de status
  if (state.filtroStatus !== 'all') {
    lista = lista.filter(p => p.status === state.filtroStatus);
  }

  // Filtro de tamanho
  if (state.filtroTamanho !== 'all') {
    const tam = Number(state.filtroTamanho);
    lista = lista.filter(p => p.numeracoes.includes(tam));
  }

  // Filtro de preço
  if (state.filtroPreco !== 'all') {
    const [min, max] = state.filtroPreco.split('-').map(Number);
    lista = lista.filter(p => p.preco >= min && p.preco <= max);
  }

  // Ordenação
  switch (state.ordenacao) {
    case 'name-asc':
      lista.sort((a, b) => a.nome.localeCompare(b.nome));
      break;
    case 'name-desc':
      lista.sort((a, b) => b.nome.localeCompare(a.nome));
      break;
    case 'price-asc':
      lista.sort((a, b) => a.preco - b.preco);
      break;
    case 'price-desc':
      lista.sort((a, b) => b.preco - a.preco);
      break;
    default:
      break;
  }

  return lista;
}

/* ============================================================
   6. RENDERIZAÇÃO DO GRID
============================================================ */

/**
 * Cria o HTML de um card de produto
 * @param {Object} produto
 * @param {number} index - índice para delay de animação
 * @returns {string}
 */
function htmlCard(produto, index) {
  const sizes = produto.numeracoes;
  const sizeLabel = sizes.length > 0
    ? `Numeração: ${sizes[0]} ao ${sizes[sizes.length - 1]}`
    : 'Numeração a consultar';

  const imgHtml = produto.imagem
    ? `<img src="${produto.imagem}" alt="${produto.nome}" class="card-img" loading="lazy" onerror="this.parentElement.innerHTML='${htmlPlaceholder().replace(/'/g, "\\'")}'" />`
    : htmlPlaceholder();

  const overlayHtml = !produto.disponivel
    ? `<div class="card-unavail-overlay"><span class="card-unavail-label">Indisponível</span></div>`
    : '';

  return `
    <article
      class="product-card"
      data-id="${produto.id}"
      style="animation-delay: ${index * 0.05}s"
      role="button"
      tabindex="0"
      aria-label="Ver detalhes de ${produto.nome}"
    >
      <div class="card-img-wrap">
        ${imgHtml}
        <div class="card-badges">
          ${htmlBadges(produto)}
        </div>
        ${overlayHtml}
      </div>

      <div class="card-body">
        <div class="card-meta">
          <span class="card-code">${produto.codigo}</span>
          <span class="card-category">${produto.categoria}</span>
        </div>

        <h3 class="card-name">${produto.nome}</h3>
        <p class="card-sizes">${sizeLabel}</p>

        <div class="card-footer">
          <div>
            <span class="card-price">${formatarPreco(produto.preco)}</span>
            <span class="card-price-label">por par</span>
          </div>

          <div class="card-actions">
            <!-- Botão Ver Detalhes -->
            <button
              class="card-btn card-btn-details"
              data-action="details"
              data-id="${produto.id}"
              aria-label="Ver detalhes de ${produto.nome}"
              title="Ver detalhes"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>

            <!-- Botão Solicitar WhatsApp -->
            <button
              class="card-btn card-btn-wpp"
              data-action="wpp"
              data-id="${produto.id}"
              aria-label="Solicitar ${produto.nome} via WhatsApp"
              title="Solicitar no WhatsApp"
              ${!produto.disponivel ? 'disabled' : ''}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

/**
 * Renderiza o grid de produtos com base nos filtros ativos
 */
function renderizarGrid() {
  const grid       = document.getElementById('product-grid');
  const emptyState = document.getElementById('empty-state');
  const countEl    = document.getElementById('results-count');

  const lista = filtrarProdutos();

  if (lista.length === 0) {
    grid.innerHTML    = '';
    emptyState.style.display = 'block';
    countEl.textContent      = 'Nenhum produto encontrado';
    return;
  }

  emptyState.style.display = 'none';
  countEl.textContent = `${lista.length} produto${lista.length !== 1 ? 's' : ''} encontrado${lista.length !== 1 ? 's' : ''}`;
  grid.innerHTML = lista.map((p, i) => htmlCard(p, i)).join('');

  // Re-bind card events after render
  bindCardEvents();
}

/* ============================================================
   7. FILTROS — CHIPS
============================================================ */

/**
 * Popula dinamicamente os chips de tamanho
 */
function popularFiltrosTamanho() {
  const container = document.getElementById('size-filters');
  const tamanhos  = obterTamanhos();

  tamanhos.forEach(n => {
    const btn = document.createElement('button');
    btn.className    = 'chip';
    btn.dataset.filter = 'size';
    btn.dataset.value  = String(n);
    btn.textContent    = String(n);
    container.appendChild(btn);
  });
}

/**
 * Ativa o estado visual dos chips e atualiza o state
 * @param {string} grupo - "status" | "size" | "price"
 * @param {string} valor
 */
function ativarChip(grupo, valor) {
  const chips = document.querySelectorAll(`[data-filter="${grupo}"]`);
  chips.forEach(c => c.classList.toggle('active', c.dataset.value === valor));

  if (grupo === 'status')  state.filtroStatus   = valor;
  if (grupo === 'size')    state.filtroTamanho  = valor;
  if (grupo === 'price')   state.filtroPreco    = valor;
}

/**
 * Reseta todos os filtros para o estado padrão
 */
function limparFiltros() {
  ativarChip('status', 'all');
  ativarChip('size',   'all');
  ativarChip('price',  'all');

  state.busca      = '';
  state.ordenacao  = 'default';

  const searchInput  = document.getElementById('search-input');
  const searchClear  = document.getElementById('search-clear');
  const sortSelect   = document.getElementById('sort-select');

  if (searchInput) searchInput.value = '';
  if (searchClear) searchClear.classList.remove('visible');
  if (sortSelect)  sortSelect.value  = 'default';

  renderizarGrid();
}

/* ============================================================
   8. MODAL
============================================================ */

/**
 * Abre o modal para o produto especificado
 * @param {string} id
 */
function abrirModal(id) {
  const produto = PRODUTOS.find(p => p.id === id);
  if (!produto) return;

  state.modalProduto     = produto;
  state.tamanhoSelecionado = null;

  // Preenche dados do modal
  const imgEl     = document.getElementById('modal-img');
  const badgeWrap = document.getElementById('modal-badge-wrap');
  const codeEl    = document.getElementById('modal-code');
  const catEl     = document.getElementById('modal-category');
  const titleEl   = document.getElementById('modal-title');
  const priceEl   = document.getElementById('modal-price');
  const sizeGrid  = document.getElementById('modal-size-grid');
  const noticeEl  = document.getElementById('modal-notice');
  const qtyInput  = document.getElementById('modal-qty');

  // Imagem
  if (produto.imagem) {
    imgEl.src = produto.imagem;
    imgEl.alt = produto.nome;
    imgEl.style.display = 'block';
  } else {
    imgEl.style.display = 'none';
    // Placeholder
    imgEl.parentElement.querySelector('.card-img-placeholder')?.remove();
    const ph = document.createElement('div');
    ph.innerHTML = htmlPlaceholder();
    imgEl.parentElement.appendChild(ph.firstElementChild);
  }

  // Badge
  badgeWrap.innerHTML = htmlBadges(produto);

  // Textos
  codeEl.textContent  = produto.codigo;
  catEl.textContent   = produto.categoria;
  titleEl.textContent = produto.nome;
  priceEl.textContent = formatarPreco(produto.preco);

  // Numerações
  sizeGrid.innerHTML = produto.numeracoes.map(n => `
    <button class="size-btn" data-size="${n}" aria-label="Numeração ${n}">${n}</button>
  `).join('');

  // Notice
  if (produto.status === 'encomenda') {
    noticeEl.textContent = '⚠ Produto sob encomenda. Prazo a confirmar via WhatsApp.';
  } else {
    noticeEl.textContent = '';
  }

  // Qty
  qtyInput.value = '1';

  // Bind tamanho buttons
  sizeGrid.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sizeGrid.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.tamanhoSelecionado = Number(btn.dataset.size);
    });
  });

  // Mostra modal
  document.getElementById('modal-overlay').classList.add('open');
  document.body.classList.add('no-scroll');
}

/**
 * Fecha o modal
 */
function fecharModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.classList.remove('no-scroll');

  // Limpa placeholder eventual
  const imgWrap = document.querySelector('.modal-img-wrap');
  const ph = imgWrap?.querySelector('.card-img-placeholder');
  if (ph) ph.remove();

  state.modalProduto       = null;
  state.tamanhoSelecionado = null;
}

/* ============================================================
   9. EVENTOS DOS CARDS (delegação)
============================================================ */

/**
 * Vincula eventos de clique nos cards após cada render
 */
function bindCardEvents() {
  const grid = document.getElementById('product-grid');

  grid.querySelectorAll('.product-card').forEach(card => {
    // Clique no card inteiro → abre modal (exceto em botões)
    card.addEventListener('click', e => {
      if (e.target.closest('[data-action]')) return;
      const id = card.dataset.id;
      abrirModal(id);
    });

    // Acessibilidade: teclado
    card.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('[data-action]')) {
        e.preventDefault();
        abrirModal(card.dataset.id);
      }
    });

    // Botão detalhes
    card.querySelector('[data-action="details"]')?.addEventListener('click', e => {
      e.stopPropagation();
      abrirModal(card.dataset.id);
    });

    // Botão WhatsApp direto do card
    card.querySelector('[data-action="wpp"]')?.addEventListener('click', e => {
      e.stopPropagation();
      const produto = PRODUTOS.find(p => p.id === card.dataset.id);
      if (produto) {
        // Abre modal para selecionar numeração primeiro
        abrirModal(card.dataset.id);
      }
    });
  });
}

/* ============================================================
   10. MODAL — BOTÃO WHATSAPP
============================================================ */
function bindModalWppBtn() {
  const btn = document.getElementById('modal-wpp-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const produto = state.modalProduto;
    if (!produto) return;

    if (!state.tamanhoSelecionado) {
      // Pulsa o grid de tamanhos para chamar atenção
      const sizeGrid = document.getElementById('modal-size-grid');
      sizeGrid.style.transition = 'none';
      sizeGrid.style.outline = '2px solid #e67e22';
      sizeGrid.style.borderRadius = '4px';
      setTimeout(() => {
        sizeGrid.style.outline = '';
        sizeGrid.style.borderRadius = '';
      }, 1500);

      const notice = document.getElementById('modal-notice');
      const original = notice.textContent;
      notice.textContent = '⚠ Selecione uma numeração antes de solicitar.';
      notice.style.color = '#e67e22';
      setTimeout(() => {
        notice.textContent = original;
        notice.style.color = '';
      }, 2500);
      return;
    }

    const qty = parseInt(document.getElementById('modal-qty')?.value || '1', 10);
    abrirWhatsApp(produto, state.tamanhoSelecionado, qty);
  });
}

/* ============================================================
   11. CONTROLE DE QUANTIDADE NO MODAL
============================================================ */
function bindQtyControls() {
  const minus = document.getElementById('qty-minus');
  const plus  = document.getElementById('qty-plus');
  const input = document.getElementById('modal-qty');

  if (!minus || !plus || !input) return;

  minus.addEventListener('click', () => {
    const v = parseInt(input.value, 10);
    if (v > 1) input.value = v - 1;
  });

  plus.addEventListener('click', () => {
    const v = parseInt(input.value, 10);
    input.value = v + 1;
  });

  input.addEventListener('change', () => {
    let v = parseInt(input.value, 10);
    if (isNaN(v) || v < 1) v = 1;
    input.value = v;
  });
}

/* ============================================================
   12. HEADER SCROLL
============================================================ */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on init
}

/* ============================================================
   13. HAMBURGER MENU
============================================================ */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });

  // Fecha ao clicar em link
  nav.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.classList.remove('open');
    });
  });
}

/* ============================================================
   14. SCROLL REVEAL
============================================================ */
function initScrollReveal() {
  const targets = document.querySelectorAll('.section-heading, .sobre-content, .sobre-visual, .footer-brand, .footer-col');
  targets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    targets.forEach(el => obs.observe(el));
  } else {
    // Fallback para browsers antigos
    targets.forEach(el => el.classList.add('visible'));
  }
}

/* ============================================================
   15. SMOOTH SCROLL (LINKS ÂNCORA)
============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // altura do header
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   16. LOADING SCREEN
============================================================ */
function esconderLoading() {
  const loading = document.getElementById('loading-screen');
  if (!loading) return;

  setTimeout(() => {
    loading.classList.add('hidden');
  }, 1800);
}

/* ============================================================
   17. INIT — MONTAGEM PRINCIPAL
============================================================ */
function init() {
  /* --- Loading --- */
  esconderLoading();

  /* --- Header --- */
  initHeaderScroll();
  initHamburger();

  /* --- Smooth scroll --- */
  initSmoothScroll();

  /* --- Filtros de tamanho dinâmicos --- */
  popularFiltrosTamanho();

  /* --- Render inicial do catálogo --- */
  renderizarGrid();

  /* --- Chips de filtro (delegação no container) --- */
  document.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    ativarChip(chip.dataset.filter, chip.dataset.value);
    renderizarGrid();
  });

  /* --- Campo de busca --- */
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      state.busca = searchInput.value;
      searchClear.classList.toggle('visible', searchInput.value.length > 0);
      renderizarGrid();
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      state.busca = '';
      searchClear.classList.remove('visible');
      renderizarGrid();
    });
  }

  /* --- Ordenação --- */
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      state.ordenacao = sortSelect.value;
      renderizarGrid();
    });
  }

  /* --- Limpar filtros --- */
  document.getElementById('clear-filters')?.addEventListener('click', limparFiltros);
  document.getElementById('empty-clear-btn')?.addEventListener('click', limparFiltros);

  /* --- Modal --- */
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose   = document.getElementById('modal-close');

  modalClose?.addEventListener('click', fecharModal);

  modalOverlay?.addEventListener('click', e => {
    if (e.target === modalOverlay) fecharModal();
  });

  // Fechar com ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') fecharModal();
  });

  /* --- Modal — botão WhatsApp --- */
  bindModalWppBtn();

  /* --- Modal — controles de quantidade --- */
  bindQtyControls();

  /* --- Scroll Reveal --- */
  initScrollReveal();

  /* --- Links da nav mobile --- */
  document.querySelectorAll('.mobile-nav-link[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('mobile-nav')?.classList.remove('open');
      document.getElementById('hamburger')?.classList.remove('open');
    });
  });
}

/* ============================================================
   18. BOOTSTRAP
============================================================ */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}