 //animaÃ§Ã£o do incio do ste//

let introCompleta = false;
let introLiberada = false;
let scrollTravado = 0;

const nav = document.querySelector(".navegacao");

function atualizarNavVidro() {
  if(!nav) return;
  nav.classList.toggle("nav-vidro", window.scrollY > 24);
}

window.addEventListener("scroll", atualizarNavVidro , { passive: true });
atualizarNavVidro();

function travarScroll() {
  scrollTravado = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollTravado}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";
}

function destravarScroll() {
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  document.body.style.overflow = "";
  window.scrollTo(0, 0);
}

window.scrollTo(0, 0);
travarScroll();

gsap.set(".particulas, .navegacao, .cabecalho", {
  opacity: 0,
  y: 18
});

gsap.set(".button-container-inicio .button-inicio", {
  opacity: 0,
  y: -45,
  filter: "blur(8px)"
});

gsap.set(".intro-title", {
  opacity: 0,
  x: -90,
  filter: "blur(8px)"
});

gsap.set(".intro-words span", {
  opacity: 0,
  y: 24,
  filter: "blur(8px)"
});

const introTimeline = gsap.timeline({
  defaults : {
    ease : "power3.out"
  }
});

introTimeline
  .to(".button-container-inicio .button-inicio", {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    duration: 0.7,
    stagger: 0.15,
    clearProps: "transform"
  })
  .to(".intro-title", {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    duration: 0.8
  }, "-=0.1")
  .to(".intro-words span", {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    duration: 0.8,
    stagger: 0.18
  }, "-=0.2")
  .call(() => {
    introCompleta = true;
  });

function liberarIntro(event) {
  if (introLiberada) return;
  if (event) event.preventDefault();
  if (!introCompleta) return;

  introLiberada = true;

  gsap.timeline({
    defaults: {
      ease: "power3.inOut"
    },
    onComplete: () => {
      destravarScroll();
    }
  })
    .to(".intro-loader", {
      opacity: 0,
      y: -24,
      duration: 0.9,
      pointerEvents: "none"
    })
    .to(".particulas, .navegacao, .cabecalho", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.08
    }, "-=0.55");
}

window.addEventListener("wheel", liberarIntro, { passive: false });
window.addEventListener("touchmove", liberarIntro, { passive: false });

// ====== Efeito de digitação do subtítulo do início ======
const elementoTitulo = document.getElementById("titulo-principal");

if (elementoTitulo) {
  const textosTitulo = [
    "Técnico em Informática para Internet",
    "Desenvolvedor Front-End",
    "Criador de Interfaces modernas"
  ];

  let textoAtual = 0;
  let indiceLetra = 0;
  let apagando = false;

  function escreverTitulo() {
    const texto = textosTitulo[textoAtual];

    if (!apagando) {
      elementoTitulo.textContent = texto.substring(0, indiceLetra + 1);
      indiceLetra++;

      if (indiceLetra === texto.length) {
        apagando = true;
        setTimeout(escreverTitulo, 1500);
        return;
      }
    } else {
      elementoTitulo.textContent = texto.substring(0, indiceLetra - 1);
      indiceLetra--;

      if (indiceLetra === 0) {
        apagando = false;
        textoAtual = (textoAtual + 1) % textosTitulo.length;
      }
    }

    setTimeout(escreverTitulo, apagando ? 50 : 100);
  }

  escreverTitulo();
}


// ====== Animação do h1 "SOBRE" ======

const titulo = document.querySelector(".titulo-sobre");

titulo.addEventListener("mousemove", (e) => {
  const rect = titulo.getBoundingClientRect();

  titulo.style.setProperty("--x", `${e.clientX - rect.left}px`);
  titulo.style.setProperty("--y", `${e.clientY - rect.top}px`);
});

titulo.addEventListener("mouseleave", () => {
  titulo.style.setProperty("--x", "50%");
  titulo.style.setProperty("--y", "50%");
});

// ====== Animação da seção Sobre conforme o scroll ======
const sobreAnimados = gsap.utils.toArray(
  ".sobre-titulo, .sobre-paragrafo, .sobre-acoes, .sobre-imagem, .sobre-stat-card"
);

if (sobreAnimados.length) {
  function posicaoInicialSobre(elemento, index) {
    if (elemento.matches(".sobre-titulo, .sobre-paragrafo, .sobre-acoes")) {
      return { x: -56, y: 0 };
    }

    if (elemento.matches(".sobre-imagem")) {
      return { x: 72, y: 0 };
    }

    const padraoCard = index % 3;

    if (padraoCard === 0) return { x: -44, y: 20 };
    if (padraoCard === 1) return { x: 0, y: 56 };
    return { x: 44, y: 20 };
  }

  function esconderSobre(elemento) {
    gsap.set(elemento, {
      autoAlpha: 0,
      x: Number(elemento.dataset.sobreX),
      y: Number(elemento.dataset.sobreY),
      filter: "blur(8px)"
    });

    elemento.dataset.sobreVisivel = "false";
  }

  sobreAnimados.forEach((elemento, index) => {
    elemento.dataset.sobreDelay = (index * 0.07).toFixed(2);
    const posicao = posicaoInicialSobre(elemento, index);
    elemento.dataset.sobreX = posicao.x;
    elemento.dataset.sobreY = posicao.y;
    esconderSobre(elemento);
  });

  const animarSobre = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      const elemento = entrada.target;

      if (entrada.isIntersecting && elemento.dataset.sobreVisivel !== "true") {
        elemento.dataset.sobreVisivel = "true";

        gsap.to(elemento, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          delay: Number(elemento.dataset.sobreDelay),
          ease: "power3.out",
          overwrite: true
        });
      } else {
        const caixa = elemento.getBoundingClientRect();
        const saiuDaTela = caixa.bottom < -140 || caixa.top > window.innerHeight + 140;

        if (!entrada.isIntersecting && saiuDaTela) {
          esconderSobre(elemento);
        }
      }
    });
  }, {
    threshold: 0.24,
    rootMargin: "0px 0px -12% 0px"
  });

  sobreAnimados.forEach((elemento) => animarSobre.observe(elemento));
}

// ====== Feixe de luz da foto: termina mesmo após tirar o mouse ======
const sobreImagem = document.querySelector(".sobre-imagem");

if (sobreImagem) {
  sobreImagem.addEventListener("mouseenter", () => {
    sobreImagem.classList.remove("animar-feixe");
    void sobreImagem.offsetWidth;
    sobreImagem.classList.add("animar-feixe");
  });

  sobreImagem.addEventListener("animationend", (event) => {
    if (event.target.classList.contains("feixe-luz-2")) {
      sobreImagem.classList.remove("animar-feixe");
    }
  });
}

// ====== Formulário de contato: mensagem pronta no WhatsApp ======
const formularioContato = document.querySelector("#formulario");

if (formularioContato) {
  formularioContato.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = formularioContato.elements.nome.value.trim();
    const mensagem = formularioContato.elements.mensagem.value.trim();

    if (!nome || !mensagem) {
      formularioContato.reportValidity();
      return;
    }

    const textoWhatsApp = [
      "Olá, João Pedro!",
      `Meu nome é ${nome}.`,
      "",
      mensagem
    ].join("\n");

    const destino = `https://wa.me/5548998468669?text=${encodeURIComponent(textoWhatsApp)}`;
    window.location.assign(destino);
  });
}

// ====== Linha que conecta Sobre e Projetos conforme o scroll ======
const linhaJornada = document.querySelector(".linha-jornada");
const sobreJornada = document.querySelector("#sobre");
const projetosJornada = document.querySelector("#projetos");

if (linhaJornada && sobreJornada && projetosJornada) {
  const svgJornada = linhaJornada.querySelector(".linha-jornada-svg");
  const caminhoBase = linhaJornada.querySelector(".linha-jornada-base");
  const caminhoBrilho = linhaJornada.querySelector(".linha-jornada-brilho");
  const caminhoProgresso = linhaJornada.querySelector(".linha-jornada-progresso");
  const pontoJornada = linhaJornada.querySelector(".linha-jornada-ponto");

  let comprimentoJornada = 0;
  let topoJornadaDocumento = 0;
  let alturaJornada = 1;
  let progressoAtual = 0;
  let progressoDestino = 0;
  let animacaoJornadaAtiva = false;

  function criarPercursoJornada(largura, altura, inicioProjetosRelativo) {
    const entradaProjetos = Math.max(0.28, Math.min(0.72, inicioProjetosRelativo));
    const inicioCurva = entradaProjetos - 0.035;
    const trechoProjetos = 1 - entradaProjetos;
    const y1 = entradaProjetos + trechoProjetos * 0.22;
    const y2 = entradaProjetos + trechoProjetos * 0.5;
    const y3 = entradaProjetos + trechoProjetos * 0.74;
    const yFinal = entradaProjetos + trechoProjetos * 0.94;

    if (largura <= 800) {
      return [
        `M ${largura * 0.055} 0`,
        `L ${largura * 0.055} ${altura * inicioCurva}`,
        `C ${largura * 0.055} ${altura * entradaProjetos}, ${largura * 0.1} ${altura * (y1 - 0.075)}, ${largura * 0.28} ${altura * y1}`,
        `C ${largura * 0.46} ${altura * (y1 + 0.075)}, ${largura * 0.87} ${altura * (y2 - 0.075)}, ${largura * 0.91} ${altura * y2}`,
        `C ${largura * 0.95} ${altura * (y2 + 0.075)}, ${largura * 0.3} ${altura * (y3 - 0.075)}, ${largura * 0.15} ${altura * y3}`,
        `C 0 ${altura * (y3 + 0.075)}, ${largura * 0.48} ${altura * yFinal}, ${largura * 0.76} ${altura * yFinal}`
      ].join(" ");
    }

    return [
      `M ${largura * 0.045} 0`,
      `L ${largura * 0.045} ${altura * inicioCurva}`,
      `C ${largura * 0.045} ${altura * entradaProjetos}, ${largura * 0.09} ${altura * (y1 - 0.075)}, ${largura * 0.27} ${altura * y1}`,
      `C ${largura * 0.45} ${altura * (y1 + 0.075)}, ${largura * 0.88} ${altura * (y2 - 0.075)}, ${largura * 0.92} ${altura * y2}`,
      `C ${largura * 0.96} ${altura * (y2 + 0.075)}, ${largura * 0.3} ${altura * (y3 - 0.075)}, ${largura * 0.15} ${altura * y3}`,
      `C 0 ${altura * (y3 + 0.075)}, ${largura * 0.5} ${altura * yFinal}, ${largura * 0.79} ${altura * yFinal}`
    ].join(" ");
  }

  function obterProgressoJornada() {
    const yAlvo = Math.max(
      0,
      Math.min(alturaJornada, window.scrollY + window.innerHeight * 0.72 - topoJornadaDocumento)
    );
    let inicioBusca = 0;
    let fimBusca = comprimentoJornada;

    for (let passo = 0; passo < 14; passo++) {
      const meio = (inicioBusca + fimBusca) / 2;
      const pontoMeio = caminhoProgresso.getPointAtLength(meio);

      if (pontoMeio.y < yAlvo) {
        inicioBusca = meio;
      } else {
        fimBusca = meio;
      }
    }

    return comprimentoJornada ? ((inicioBusca + fimBusca) / 2) / comprimentoJornada : 0;
  }

  function desenharLinhaJornada(progresso) {
    const deslocamento = comprimentoJornada * (1 - progresso);

    caminhoBrilho.style.strokeDashoffset = deslocamento;
    caminhoProgresso.style.strokeDashoffset = deslocamento;

    const ponto = caminhoProgresso.getPointAtLength(comprimentoJornada * progresso);
    pontoJornada.setAttribute("cx", ponto.x);
    pontoJornada.setAttribute("cy", ponto.y);
    pontoJornada.style.opacity = progresso > 0 ? "1" : "0";
  }

  function animarLinhaJornada() {
    const distancia = progressoDestino - progressoAtual;

    if (Math.abs(distancia) < 0.0002) {
      progressoAtual = progressoDestino;
      desenharLinhaJornada(progressoAtual);
      animacaoJornadaAtiva = false;
      return;
    }

    progressoAtual += distancia * 0.085;
    desenharLinhaJornada(progressoAtual);
    requestAnimationFrame(animarLinhaJornada);
  }

  function solicitarAnimacaoJornada() {
    progressoDestino = obterProgressoJornada();

    if (!animacaoJornadaAtiva) {
      animacaoJornadaAtiva = true;
      requestAnimationFrame(animarLinhaJornada);
    }
  }

  function recalcularLinhaJornada() {
    const largura = document.documentElement.clientWidth;
    const topoSobre = sobreJornada.getBoundingClientRect().top + window.scrollY;
    const topoProjetos = projetosJornada.getBoundingClientRect().top + window.scrollY;
    const fimProjetos = projetosJornada.getBoundingClientRect().bottom + window.scrollY;
    const altura = Math.max(1, fimProjetos - topoSobre);
    const inicioProjetosRelativo = (topoProjetos - topoSobre) / altura;
    const percurso = criarPercursoJornada(largura, altura, inicioProjetosRelativo);

    linhaJornada.style.top = `${topoSobre}px`;
    linhaJornada.style.height = `${altura}px`;
    svgJornada.setAttribute("viewBox", `0 0 ${largura} ${altura}`);
    topoJornadaDocumento = topoSobre;
    alturaJornada = altura;

    [caminhoBase, caminhoBrilho, caminhoProgresso].forEach((caminho) => {
      caminho.setAttribute("d", percurso);
    });

    comprimentoJornada = caminhoProgresso.getTotalLength();
    caminhoBrilho.style.strokeDasharray = comprimentoJornada;
    caminhoProgresso.style.strokeDasharray = comprimentoJornada;

    progressoDestino = obterProgressoJornada();
    progressoAtual = progressoDestino;
    desenharLinhaJornada(progressoAtual);
  }

  window.addEventListener("scroll", solicitarAnimacaoJornada, { passive: true });

  window.addEventListener("resize", recalcularLinhaJornada);
  window.addEventListener("load", recalcularLinhaJornada);

  if ("ResizeObserver" in window) {
    const observadorJornada = new ResizeObserver(recalcularLinhaJornada);
    observadorJornada.observe(sobreJornada);
    observadorJornada.observe(projetosJornada);
  }

  recalcularLinhaJornada();
}

// ====== Interações da seção de tecnologias ======
const painelStack = document.querySelector(".stack-painel");
const secaoStack = document.querySelector(".stack");

if (painelStack) {
  painelStack.addEventListener("pointermove", (event) => {
    const caixa = painelStack.getBoundingClientRect();
    painelStack.style.setProperty("--stack-x", `${event.clientX - caixa.left}px`);
    painelStack.style.setProperty("--stack-y", `${event.clientY - caixa.top}px`);
  });

  painelStack.addEventListener("pointerleave", () => {
    painelStack.style.setProperty("--stack-x", "50%");
    painelStack.style.setProperty("--stack-y", "50%");
  });
}

if (
  secaoStack &&
  window.gsap &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const observarStack = new IntersectionObserver((entradas, observador) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;

      gsap.fromTo(".stack-sobretitulo, .stack-titulo, .stack-cabecalho p", {
        y: 34,
        autoAlpha: 0,
        filter: "blur(8px)"
      }, {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out"
      });

      gsap.fromTo(".stack-item", {
        y: 44,
        scale: 0.96,
        autoAlpha: 0
      }, {
        y: 0,
        scale: 1,
        autoAlpha: 1,
        duration: 0.8,
        stagger: 0.065,
        delay: 0.2,
        ease: "power3.out"
      });

      observador.unobserve(entrada.target);
    });
  }, { threshold: 0.16 });

  observarStack.observe(secaoStack);
}
