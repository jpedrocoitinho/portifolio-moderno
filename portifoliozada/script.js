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
