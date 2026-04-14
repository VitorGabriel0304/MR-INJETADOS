/**
 * MR INJETADOS - Interações do Catálogo
 */

// CONTROLE DO CARROSSEL
function mudarSlide(botao, direcao) {
    const container = botao.closest('.carrossel-container');
    const slides = container.querySelector('.slides');
    const total = slides.querySelectorAll('img').length;
    const pontos = container.querySelectorAll('.ponto');
    
    let index = parseInt(container.getAttribute('data-index') || 0);
    index = (index + direcao + total) % total;
    
    slides.style.transform = `translateX(${-index * 100}%)`;
    container.setAttribute('data-index', index);
    
    pontos.forEach((p, i) => p.classList.toggle('ativo', i === index));
}

// LIGHTBOX (VIEWER DE IMAGEM)
function abrirImagem(img) {
    const lightbox = document.getElementById('lightbox');
    const imgFull = document.getElementById('img-full');
    
    imgFull.src = img.src;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
}

function fecharImagem() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Fechar ao clicar fora da imagem
document.getElementById('lightbox')?.addEventListener('click', function(e) {
    if(e.target === this) fecharImagem();
});

// BUSCA DINÂMICA
document.getElementById('buscaModelo')?.addEventListener('input', function(e) {
    const termo = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.card-vidro');
    
    cards.forEach(card => {
        const nome = card.querySelector('h3').innerText.toLowerCase();
        if (nome.includes(termo)) {
            card.style.display = 'block';
            card.style.opacity = '1';
        } else {
            card.style.display = 'none';
        }
    });
});

// FILTROS POR CATEGORIA
const filtros = document.querySelectorAll('.filtro-btn');
filtros.forEach(btn => {
    btn.addEventListener('click', () => {
        filtros.forEach(b => b.classList.remove('ativo'));
        btn.classList.add('ativo');
        
        const tipo = btn.dataset.tipo;
        const cards = document.querySelectorAll('.card-vidro');
        
        cards.forEach(card => {
            if(tipo === 'todos' || card.dataset.categoria === tipo) {
                card.style.display = 'block';
                setTimeout(() => card.style.opacity = '1', 10);
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// WHATSAPP - PEDIDO DIRETO
function fazerPedido(modelo) {
    const saudacao = "Olá MR Injetados!";
    const mensagem = `${saudacao} Tenho interesse no modelo: *${modelo.toUpperCase()}*. Pode me enviar mais informações?`;
    const url = `https://wa.me/5514996402866?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Atalho Teclado para Lightbox
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") fecharImagem();
});