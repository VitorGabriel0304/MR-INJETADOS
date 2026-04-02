const container = document.getElementById("produtos");

function render(lista){
  container.innerHTML="";
  lista.forEach((prod,i)=>{
    const card = document.createElement("div");
    card.className="card";
    card.style.animationDelay = `${i*0.1}s`;
    card.innerHTML=`
      <img src="${prod.imagens[0]}" onmouseover="this.src='${prod.imagens[1]}'" onmouseout="this.src='${prod.imagens[0]}'">
      <div class="info"><h3>${prod.nome}</h3></div>
    `;
    card.onclick=()=>abrirModal(prod);
    container.appendChild(card);
  });
}

function filtrar(cat){
  if(cat==="todos") render(produtos);
  else render(produtos.filter(p=>p.categoria===cat));
}

function abrirModal(prod){
  const modal = document.getElementById("modal");
  modal.style.display="flex";
  document.getElementById("modal-img").src=prod.imagens[0];
  document.getElementById("modal-nome").innerText=prod.nome;
  document.getElementById("modal-info").innerText=`${prod.material} | ${prod.numeracao}`;
  const galeria = document.getElementById("modal-galeria");
  galeria.innerHTML="";
  prod.imagens.forEach(img=>galeria.innerHTML+=`<img src="${img}" onclick="trocarImagem('${img}')">`);
  document.getElementById("btn-whats").onclick=()=>window.open(`https://wa.me/55SEUNUMERO?text=Quero ${prod.nome}`);
}

function trocarImagem(img){document.getElementById("modal-img").src=img;}
function fecharModal(){document.getElementById("modal").style.display="none";}
function abrirWhatsGeral(){window.open(`https://wa.me/55SEUNUMERO?text=Olá, podemos ajudar?`);}

render(produtos);