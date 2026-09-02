 //animaÃ§Ã£o do incio do ste//

let introCompleta = false;
let introLiberada = false;
let scrollTravado = 0;

const nav = document.querySelector(".navegacao");
const botaoHero3d = document.querySelector(".botao-3d");

if (botaoHero3d) {
  botaoHero3d.addEventListener("click", () => {
    botaoHero3d.classList.add("botao-3d-fixado");
    botaoHero3d.setAttribute("aria-pressed", "true");
  });
}

function atualizarNavVidro() {
  if(!nav) return;
  nav.classList.toggle("nav-vidro", window.scrollY > 24);
}

window.addEventListener("scroll", atualizarNavVidro , { passive: true });
atualizarNavVidro();

// ====== Navegação deslizante e alternância de tema ======
const controleNav = document.querySelector(".nav-uiverse");
const linksNav = [...document.querySelectorAll(".nav-uiverse .menu-link")];
const botaoTema = document.querySelector(".tema-toggle");
const raizDocumento = document.documentElement;
let indiceNavManual = null;
let tempoNavManual = 0;

function selecionarItemNav(indice) {
  if (!controleNav) return;
  controleNav.style.setProperty("--indice-nav", indice);
  linksNav.forEach((link, posicao) => {
    link.classList.toggle("ativo", posicao === indice);
    if (posicao === indice) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

linksNav.forEach((link, indice) => {
  link.addEventListener("click", () => {
    indiceNavManual = indice;
    tempoNavManual = performance.now();
    selecionarItemNav(indice);
  });
});

let frameNavAtiva = 0;
function atualizarItemNavPeloScroll() {
  if (frameNavAtiva) return;
  frameNavAtiva = requestAnimationFrame(() => {
    frameNavAtiva = 0;
    const linhaLeitura = window.innerHeight * 0.38;

    if (indiceNavManual !== null) {
      const linkDestino = linksNav[indiceNavManual];
      const secaoDestino = linkDestino && document.querySelector(linkDestino.getAttribute("href"));
      const chegouAoDestino = secaoDestino && Math.abs(secaoDestino.getBoundingClientRect().top) < 140;
      const tempoEsgotado = performance.now() - tempoNavManual > 1400;

      if (!chegouAoDestino && !tempoEsgotado) return;
      indiceNavManual = null;
    }

    let indiceAtivo = 0;

    linksNav.forEach((link, indice) => {
      const secao = document.querySelector(link.getAttribute("href"));
      if (secao && secao.getBoundingClientRect().top <= linhaLeitura) indiceAtivo = indice;
    });

    selecionarItemNav(indiceAtivo);
  });
}

window.addEventListener("scroll", atualizarItemNavPeloScroll, { passive: true });
atualizarItemNavPeloScroll();

function aplicarTema(temaClaro, salvar = true) {
  if (temaClaro) raizDocumento.dataset.theme = "light";
  else delete raizDocumento.dataset.theme;

  if (botaoTema) {
    botaoTema.setAttribute("aria-pressed", String(temaClaro));
    botaoTema.setAttribute(
      "aria-label",
      temaClaro ? "Ativar tema escuro" : "Ativar tema claro"
    );
  }

  if (salvar) {
    try {
      localStorage.setItem("portfolio-tema", temaClaro ? "light" : "dark");
    } catch (_) {}
  }

  window.dispatchEvent(new CustomEvent("portfolio:tema", { detail: { temaClaro } }));
}

aplicarTema(raizDocumento.dataset.theme === "light", false);

if (botaoTema) {
  botaoTema.addEventListener("click", () => {
    aplicarTema(raizDocumento.dataset.theme !== "light");
  });
}

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

const animarHeroResponsiva =
  window.matchMedia("(max-width: 820px)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const elementosHeroResponsiva = animarHeroResponsiva
  ? gsap.utils.toArray(
      ".cabecalho .botao-3d, " +
      ".cabecalho .inicio-titulo, " +
      ".cabecalho .inicio-subtitulo, " +
      ".cabecalho .inicio-descricao, " +
      ".cabecalho .inicio-tecnologias, " +
      ".cabecalho .inicio-acoes, " +
      ".cabecalho .container-noot"
    )
  : [];

if (elementosHeroResponsiva.length) {
  gsap.set(elementosHeroResponsiva, {
    autoAlpha: 0,
    y: 28,
    filter: "blur(7px)",
    force3D: true
  });
}

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

  const timelineSaidaIntro = gsap.timeline({
    defaults: {
      ease: "power3.inOut"
    },
    onComplete: () => {
      destravarScroll();
    }
  });

  timelineSaidaIntro
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

  if (elementosHeroResponsiva.length) {
    timelineSaidaIntro.to(elementosHeroResponsiva, {
      autoAlpha: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.62,
      stagger: 0.075,
      ease: "power3.out",
      force3D: true,
      clearProps: "transform,filter,willChange"
    }, "-=0.42");
  }
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

// ====== Entrada GSAP do título "Sobre Mim" ======
if (
  titulo &&
  window.gsap &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  gsap.set(titulo, { autoAlpha: 0, y: 38, scale: 0.975, force3D: true });

  const observarTituloSobre = new IntersectionObserver((entradas, observador) => {
    if (!entradas.some((entrada) => entrada.isIntersecting)) return;

    gsap.to(titulo, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.76,
      ease: "power3.out",
      force3D: true,
      clearProps: "transform,willChange"
    });
    observador.disconnect();
  }, { threshold: 0.28, rootMargin: "0px 0px -8% 0px" });

  observarTituloSobre.observe(titulo);
}

// ====== Entrada otimizada da seção Sobre ======
const conteudoSobre = document.querySelector(".sobre-conteudo");
const elementosSobre = gsap.utils.toArray(
  ".sobre-titulo, .sobre-paragrafo, .sobre-acoes, .sobre-imagem"
);
const caixaStatsSobre = document.querySelector(".sobre-stats");
const cardsSobre = gsap.utils.toArray(".sobre-stat-card");
const reduzirAnimacaoSobre = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduzirAnimacaoSobre && window.gsap) {
  gsap.set(elementosSobre, { autoAlpha: 0, y: 26, force3D: true });
  gsap.set(cardsSobre, { autoAlpha: 0, y: 34, scale: 0.985, force3D: true });

  function observarEntradaUmaVez(alvo, aoEntrar, threshold = 0.15) {
    if (!alvo) return;
    const observador = new IntersectionObserver((entradas) => {
      if (!entradas.some((entrada) => entrada.isIntersecting)) return;
      aoEntrar();
      observador.disconnect();
    }, { threshold, rootMargin: "0px 0px -8% 0px" });
    observador.observe(alvo);
  }

  observarEntradaUmaVez(conteudoSobre, () => {
    gsap.to(elementosSobre, {
      autoAlpha: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.075,
      ease: "power2.out",
      force3D: true,
      clearProps: "transform,willChange"
    });
  });

  observarEntradaUmaVez(caixaStatsSobre, () => {
    gsap.to(cardsSobre, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.62,
      stagger: 0.065,
      ease: "power2.out",
      force3D: true,
      clearProps: "transform,willChange"
    });
  }, 0.1);
}

// ====== Entrada GSAP da seção Projetos ======
const secaoProjetosAnimada = document.querySelector("#projetos");
const tituloProjetosAnimado = document.querySelector(".projeto-titulo");
const caixaProjetosAnimada = document.querySelector(".projetos-caixa");
const cardsProjetosAnimados = gsap.utils.toArray(".projetos-card");

if (
  secaoProjetosAnimada &&
  tituloProjetosAnimado &&
  caixaProjetosAnimada &&
  cardsProjetosAnimados.length &&
  window.gsap &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  gsap.set(tituloProjetosAnimado, {
    autoAlpha: 0,
    y: 34,
    scale: 0.98,
    force3D: true
  });

  gsap.set(cardsProjetosAnimados, {
    autoAlpha: 0,
    y: 52,
    scale: 0.965,
    force3D: true
  });

  const observarTituloProjetos = new IntersectionObserver((entradas, observador) => {
    if (!entradas.some((entrada) => entrada.isIntersecting)) return;

    gsap.to(tituloProjetosAnimado, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.72,
      ease: "power3.out",
      force3D: true,
      clearProps: "transform,willChange"
    });
    observador.disconnect();
  }, { threshold: 0.22, rootMargin: "0px 0px -10% 0px" });

  const observarCardsProjetos = new IntersectionObserver((entradas, observador) => {
    if (!entradas.some((entrada) => entrada.isIntersecting)) return;

    gsap.to(cardsProjetosAnimados, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.78,
      stagger: 0.11,
      ease: "power3.out",
      force3D: true,
      clearProps: "transform,willChange"
    });
    observador.disconnect();
  }, { threshold: 0.08, rootMargin: "0px 0px -7% 0px" });

  observarTituloProjetos.observe(tituloProjetosAnimado);
  observarCardsProjetos.observe(caixaProjetosAnimada);
}

// ====== Entrada GSAP da seção Contato ======
const secaoContatoAnimada = document.querySelector("#contato");
const tituloContatoAnimado = document.querySelector(".contato-titulo");
const formularioContatoAnimado = document.querySelector(".contato-form-uiverse");

if (
  secaoContatoAnimada &&
  tituloContatoAnimado &&
  formularioContatoAnimado &&
  window.gsap &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const itensContatoAnimados = gsap.utils.toArray(
    ".contato-painel[data-painel='mensagem'] > *, .contato-botao-container, .projeto-toggle"
  );

  gsap.set(tituloContatoAnimado, {
    autoAlpha: 0,
    y: 34,
    scale: 0.98,
    force3D: true
  });
  gsap.set(formularioContatoAnimado, {
    autoAlpha: 0,
    y: 42,
    scale: 0.985,
    force3D: true
  });
  gsap.set(itensContatoAnimados, { autoAlpha: 0, y: 18, force3D: true });

  const observarTituloContato = new IntersectionObserver((entradas, observador) => {
    if (!entradas.some((entrada) => entrada.isIntersecting)) return;

    gsap.to(tituloContatoAnimado, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.68,
      ease: "power3.out",
      force3D: true,
      clearProps: "transform,willChange"
    });
    observador.disconnect();
  }, { threshold: 0.25, rootMargin: "0px 0px -8% 0px" });

  const observarFormularioContato = new IntersectionObserver((entradas, observador) => {
    if (!entradas.some((entrada) => entrada.isIntersecting)) return;

    const timelineContato = gsap.timeline({ defaults: { ease: "power2.out" } });
    timelineContato
      .to(formularioContatoAnimado, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.62,
        force3D: true,
        clearProps: "transform,willChange"
      })
      .to(itensContatoAnimados, {
        autoAlpha: 1,
        y: 0,
        duration: 0.46,
        stagger: 0.055,
        force3D: true,
        clearProps: "transform,willChange"
      }, "-=0.3");

    observador.disconnect();
  }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });

  observarTituloContato.observe(tituloContatoAnimado);
  observarFormularioContato.observe(formularioContatoAnimado);
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

// ====== Formulário de contato: envio por e-mail via FormSubmit ======
const formularioContato = document.querySelector("#formulario");

if (formularioContato) {
  const botaoAlternarProjeto = formularioContato.querySelector(".projeto-toggle");
  const textoAlternarProjeto = formularioContato.querySelector(".projeto-toggle-texto");
  const textoEnviarContato = formularioContato.querySelector(".contato-enviar-texto");
  const botaoEnviarContato = formularioContato.querySelector(".contato-botao");
  const statusEnvioContato = formularioContato.querySelector(".contato-envio-status");
  const assuntoContato = formularioContato.querySelector("input[name='_subject']");
  const tipoEnvioContato = formularioContato.querySelector(".contato-tipo-envio");
  const caixaPaineisContato = formularioContato.querySelector(".contato-paineis");
  const paineisContato = [...formularioContato.querySelectorAll(".contato-painel")];
  const selectsProjeto = [...formularioContato.querySelectorAll(".projeto-select-campo")];
  const chaveLimiteContato = "portfolio-envios-email";
  const intervaloMinimoContato = 60 * 1000;
  const janelaLimiteContato = 60 * 60 * 1000;
  const maximoEnviosContato = 3;
  let alternandoFormulario = false;

  function obterEnviosRecentesContato() {
    try {
      const agora = Date.now();
      const registros = JSON.parse(localStorage.getItem(chaveLimiteContato) || "[]");
      return Array.isArray(registros)
        ? registros.filter((registro) => Number.isFinite(registro) && agora - registro < janelaLimiteContato)
        : [];
    } catch (_) {
      return [];
    }
  }

  function salvarEnviosContato(registros) {
    try {
      localStorage.setItem(chaveLimiteContato, JSON.stringify(registros));
    } catch (_) {}
  }

  function exibirStatusContato(mensagem, tipo = "") {
    statusEnvioContato.textContent = mensagem;
    statusEnvioContato.classList.toggle("sucesso", tipo === "sucesso");
    statusEnvioContato.classList.toggle("erro", tipo === "erro");
  }

  function restaurarSelectsProjeto() {
    selectsProjeto.forEach((campo) => {
      const select = campo.querySelector(".projeto-select-native");
      const valorVisual = campo.querySelector(".projeto-select-valor");
      const textoInicial = select.options[0]?.textContent || "Selecione";
      valorVisual.textContent = textoInicial;
      campo.querySelectorAll("[role='option']").forEach((opcao) => {
        opcao.setAttribute("aria-selected", "false");
      });
    });
  }

  function fecharSelectsProjeto(excecao = null) {
    selectsProjeto.forEach((campo) => {
      if (campo === excecao) return;
      campo.classList.remove("aberto");
      campo.querySelector(".projeto-select-gatilho").setAttribute("aria-expanded", "false");
    });
  }

  selectsProjeto.forEach((campo) => {
    const select = campo.querySelector(".projeto-select-native");
    const gatilho = campo.querySelector(".projeto-select-gatilho");
    const valorVisual = campo.querySelector(".projeto-select-valor");
    const opcoes = [...campo.querySelectorAll(".projeto-select-menu button")];

    gatilho.addEventListener("click", () => {
      const vaiAbrir = !campo.classList.contains("aberto");
      fecharSelectsProjeto(campo);
      campo.classList.toggle("aberto", vaiAbrir);
      gatilho.setAttribute("aria-expanded", String(vaiAbrir));
    });

    opcoes.forEach((opcao) => {
      opcao.setAttribute("role", "option");
      opcao.setAttribute("aria-selected", "false");
      opcao.addEventListener("click", () => {
        select.value = opcao.dataset.value;
        valorVisual.textContent = opcao.dataset.value;
        opcoes.forEach((item) => {
          item.setAttribute("aria-selected", String(item === opcao));
        });
        campo.classList.remove("aberto");
        gatilho.setAttribute("aria-expanded", "false");
        gatilho.focus();
      });
    });

    select.addEventListener("invalid", (event) => {
      event.preventDefault();
      fecharSelectsProjeto(campo);
      campo.classList.add("aberto");
      gatilho.setAttribute("aria-expanded", "true");
      gatilho.focus();
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".projeto-select-campo")) fecharSelectsProjeto();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") fecharSelectsProjeto();
  });

  function ajustarAlturaPaineis() {
    const painelAtivo = formularioContato.querySelector(".contato-painel.ativo");
    if (painelAtivo) caixaPaineisContato.style.height = `${painelAtivo.scrollHeight}px`;
  }

  function ativarModoContato(modo) {
    const modoProjeto = modo === "projeto";
    formularioContato.dataset.modo = modo;

    paineisContato.forEach((painel) => {
      const ativo = painel.dataset.painel === modo;
      painel.classList.toggle("ativo", ativo);
      painel.setAttribute("aria-hidden", String(!ativo));
      painel.querySelectorAll("input, select, textarea").forEach((campo) => {
        campo.disabled = !ativo;
      });
      painel.querySelectorAll(".projeto-select-gatilho").forEach((gatilho) => {
        gatilho.disabled = !ativo;
      });
    });

    fecharSelectsProjeto();

    botaoAlternarProjeto.setAttribute("aria-expanded", String(modoProjeto));
    textoAlternarProjeto.textContent = modoProjeto ? "Enviar uma mensagem" : "Projeto em mente?";
    textoEnviarContato.textContent = modoProjeto ? "Enviar briefing por e-mail" : "Enviar por e-mail";
    requestAnimationFrame(ajustarAlturaPaineis);
  }

  function focarTopoFormulario() {
    const alturaNav = document.querySelector(".navegacao")?.offsetHeight || 0;
    const topoFormulario = formularioContato.getBoundingClientRect().top + window.scrollY;
    const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: Math.max(0, topoFormulario - alturaNav - 28),
      behavior: reduzirMovimento ? "auto" : "smooth"
    });
  }

  botaoAlternarProjeto.addEventListener("click", () => {
    if (alternandoFormulario) return;
    alternandoFormulario = true;
    exibirStatusContato("");
    botaoEnviarContato.disabled = false;
    formularioContato.classList.add("trocando");
    const proximoModo = formularioContato.dataset.modo === "mensagem" ? "projeto" : "mensagem";

    setTimeout(() => {
      ativarModoContato(proximoModo);
      if (proximoModo === "mensagem") requestAnimationFrame(focarTopoFormulario);
    }, 310);
    setTimeout(() => {
      formularioContato.classList.remove("trocando");
      alternandoFormulario = false;
    }, 720);
  });

  const observadorPaineisContato = new ResizeObserver((entradas) => {
    if (entradas.some((entrada) => entrada.target.classList.contains("ativo"))) {
      ajustarAlturaPaineis();
    }
  });
  paineisContato.forEach((painel) => observadorPaineisContato.observe(painel));
  window.addEventListener("resize", ajustarAlturaPaineis, { passive: true });
  ajustarAlturaPaineis();

  formularioContato.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!formularioContato.checkValidity()) {
      formularioContato.reportValidity();
      return;
    }

    if (formularioContato.elements._honey.value) {
      textoEnviarContato.textContent = "Enviado";
      exibirStatusContato("Mensagem enviada com sucesso.", "sucesso");
      return;
    }

    const agora = Date.now();
    const enviosRecentes = obterEnviosRecentesContato();
    const ultimoEnvio = enviosRecentes.at(-1) || 0;
    const esperaRestante = intervaloMinimoContato - (agora - ultimoEnvio);

    if (enviosRecentes.length >= maximoEnviosContato) {
      textoEnviarContato.textContent = "Limite atingido";
      exibirStatusContato("Limite de 3 envios por hora atingido. Tente novamente mais tarde.", "erro");
      return;
    }

    if (esperaRestante > 0) {
      textoEnviarContato.textContent = "Aguarde um pouco";
      exibirStatusContato(`Espere ${Math.ceil(esperaRestante / 1000)} segundos antes de enviar novamente.`, "erro");
      return;
    }

    const modoProjeto = formularioContato.dataset.modo === "projeto";
    assuntoContato.value = modoProjeto
      ? "Novo briefing de projeto pelo portfólio"
      : "Nova mensagem pelo portfólio";
    tipoEnvioContato.value = modoProjeto ? "Briefing de projeto" : "Mensagem";
    textoEnviarContato.textContent = "Enviando...";
    botaoEnviarContato.disabled = true;
    exibirStatusContato("Enviando sua mensagem...");

    try {
      const dadosFormulario = Object.fromEntries(new FormData(formularioContato).entries());
      const endpointAjax = formularioContato.action.replace("formsubmit.co/", "formsubmit.co/ajax/");
      const resposta = await fetch(endpointAjax, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(dadosFormulario)
      });
      const resultado = await resposta.json().catch(() => ({}));

      if (!resposta.ok || resultado.success === false || resultado.success === "false") {
        throw new Error(resultado.message || "Não foi possível concluir o envio.");
      }

      salvarEnviosContato([...enviosRecentes, Date.now()]);
      formularioContato.reset();
      restaurarSelectsProjeto();
      textoEnviarContato.textContent = "Enviado";
      exibirStatusContato("Mensagem enviada. Obrigado pelo contato!", "sucesso");
      requestAnimationFrame(ajustarAlturaPaineis);
    } catch (_) {
      botaoEnviarContato.disabled = false;
      textoEnviarContato.textContent = modoProjeto ? "Tentar enviar o briefing" : "Tentar novamente";
      exibirStatusContato("Não foi possível enviar agora. Verifique sua conexão e tente novamente.", "erro");
    }
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

  let comprimentoJornada = 0;
  let topoJornadaDocumento = 0;
  let alturaJornada = 1;
  let frameJornada = 0;
  let frameRecalculoJornada = 0;
  let mapaJornada = [];
  let progressoAtualJornada = 0;
  let progressoDestinoJornada = 0;

  function criarPercursoJornada(largura, altura, inicioProjetosRelativo) {
    const entradaProjetos = Math.max(0.28, Math.min(0.72, inicioProjetosRelativo));
    const inicioCurva = entradaProjetos - 0.035;
    const trechoProjetos = 1 - entradaProjetos;
    const y1 = entradaProjetos + trechoProjetos * 0.22;
    const y2 = entradaProjetos + trechoProjetos * 0.5;
    const y3 = entradaProjetos + trechoProjetos * 0.74;
    const yFinal = entradaProjetos + trechoProjetos * 0.995;

    if (largura <= 800) {
      // No mobile, o trecho da seção Sobre permanece junto à margem para não
      // atravessar textos; as curvas só começam quando os projetos entram.
      const trilhoMobile = Math.max(1.5, largura * 0.008);

      return [
        `M ${trilhoMobile} 0`,
        `L ${trilhoMobile} ${altura * inicioCurva}`,
        `C ${trilhoMobile} ${altura * entradaProjetos}, ${largura * 0.08} ${altura * (y1 - 0.06)}, ${largura * 0.16} ${altura * y1}`,
        `C ${largura * 0.38} ${altura * (y1 + 0.045)}, ${largura * 0.9} ${altura * (y2 - 0.055)}, ${largura * 0.94} ${altura * y2}`,
        `C ${largura * 0.97} ${altura * (y2 + 0.05)}, ${largura * 0.2} ${altura * (y3 - 0.05)}, ${largura * 0.06} ${altura * y3}`,
        `C ${largura * 0.025} ${altura * (y3 + 0.055)}, ${largura * 0.48} ${altura * (yFinal - 0.025)}, ${largura * 0.82} ${altura * yFinal}`
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
    const mobileJornada = window.innerWidth <= 800;
    const fimJornadaDocumento = topoJornadaDocumento + alturaJornada;
    let yAlvo;

    if (mobileJornada) {
      const inicioScroll = topoJornadaDocumento - window.innerHeight * 0.6;
      const fimScroll = fimJornadaDocumento - window.innerHeight * 0.78;
      const intervaloScroll = Math.max(1, fimScroll - inicioScroll);
      const progressoScroll = Math.max(
        0,
        Math.min(1, (window.scrollY - inicioScroll) / intervaloScroll)
      );

      yAlvo = alturaJornada * progressoScroll;
    } else {
      yAlvo = Math.max(
        0,
        Math.min(
        alturaJornada,
          window.scrollY + window.innerHeight * 0.56 - topoJornadaDocumento
        )
      );
    }

    if (mapaJornada.length < 2) return yAlvo / alturaJornada;

    let inicio = 0;
    let fim = mapaJornada.length - 1;

    while (inicio < fim) {
      const meio = Math.floor((inicio + fim) / 2);

      if (mapaJornada[meio].y < yAlvo) {
        inicio = meio + 1;
      } else {
        fim = meio;
      }
    }

    const depois = mapaJornada[inicio];
    const antes = mapaJornada[Math.max(0, inicio - 1)];
    const intervaloY = depois.y - antes.y;
    const fracao = intervaloY > 0 ? (yAlvo - antes.y) / intervaloY : 0;

    return antes.progresso + (depois.progresso - antes.progresso) * fracao;
  }

  function desenharLinhaJornada(progresso) {
    const progressoSeguro = Math.max(0, Math.min(1, progresso));
    const comprimentoVisivel = comprimentoJornada * progressoSeguro;
    const ponto = caminhoProgresso.getPointAtLength(comprimentoVisivel);
    const limiteVertical = Math.max(0, Math.min(100, (ponto.y / alturaJornada) * 100));
    const recorte = `inset(0 0 ${100 - limiteVertical}% 0)`;

    caminhoBrilho.style.clipPath = recorte;
    caminhoProgresso.style.clipPath = recorte;
  }

  function animarLinhaJornada() {
    const distancia = progressoDestinoJornada - progressoAtualJornada;

    if (Math.abs(distancia) < 0.0005) {
      progressoAtualJornada = progressoDestinoJornada;
      desenharLinhaJornada(progressoAtualJornada);
      frameJornada = 0;
      return;
    }

    // Interpolação curta: suaviza sem criar uma animação atrasada ou pesada.
    progressoAtualJornada += distancia * 0.24;
    desenharLinhaJornada(progressoAtualJornada);
    frameJornada = requestAnimationFrame(animarLinhaJornada);
  }

  function solicitarAnimacaoJornada() {
    progressoDestinoJornada = obterProgressoJornada();

    if (!frameJornada) {
      frameJornada = requestAnimationFrame(animarLinhaJornada);
    }
  }

  function recalcularLinhaJornada() {
    const largura = document.documentElement.clientWidth;
    const topoSobre = sobreJornada.getBoundingClientRect().top + window.scrollY;
    const topoProjetos = projetosJornada.getBoundingClientRect().top + window.scrollY;
    const fimProjetos = projetosJornada.getBoundingClientRect().bottom + window.scrollY;
    const margemFinal = largura <= 800 ? 28 : 12;
    const altura = Math.max(1, fimProjetos - topoSobre + margemFinal);
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

    caminhoBrilho.removeAttribute("stroke-dasharray");
    caminhoProgresso.removeAttribute("stroke-dasharray");
    caminhoBrilho.removeAttribute("stroke-dashoffset");
    caminhoProgresso.removeAttribute("stroke-dashoffset");

    comprimentoJornada = caminhoProgresso.getTotalLength();
    // A curva não tem comprimento uniforme na vertical. Este mapa é calculado
    // somente quando o layout muda e evita medições SVG caras durante o scroll.
    const quantidadeAmostras = 120;
    mapaJornada = Array.from({ length: quantidadeAmostras + 1 }, (_, indice) => {
      const progresso = indice / quantidadeAmostras;
      const ponto = caminhoProgresso.getPointAtLength(comprimentoJornada * progresso);

      return { y: ponto.y, progresso };
    });

    progressoDestinoJornada = obterProgressoJornada();
    progressoAtualJornada = progressoDestinoJornada;
    desenharLinhaJornada(progressoAtualJornada);
  }

  function solicitarRecalculoJornada() {
    if (frameRecalculoJornada) return;

    frameRecalculoJornada = requestAnimationFrame(() => {
      frameRecalculoJornada = 0;
      recalcularLinhaJornada();
    });
  }

  window.addEventListener("scroll", solicitarAnimacaoJornada, { passive: true });

  window.addEventListener("resize", solicitarRecalculoJornada, { passive: true });
  window.addEventListener("load", solicitarRecalculoJornada, { once: true });

  if ("ResizeObserver" in window) {
    const observadorJornada = new ResizeObserver(solicitarRecalculoJornada);
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

  const itensInterativosStack = Array.from(painelStack.querySelectorAll(".stack-item"));

  itensInterativosStack.forEach((item) => {
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-pressed", "false");

    const alternarStack = () => {
      const ativar = !item.classList.contains("ativo");

      itensInterativosStack.forEach((outroItem) => {
        outroItem.classList.remove("ativo");
        outroItem.setAttribute("aria-pressed", "false");
      });

      if (ativar) {
        item.classList.add("ativo");
        item.setAttribute("aria-pressed", "true");
      }
    };

    item.addEventListener("click", alternarStack);
    item.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      alternarStack();
    });
  });
}

if (
  secaoStack &&
  window.gsap &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const cabecalhoStack = document.querySelector(".stack-cabecalho");
  const textosStack = gsap.utils.toArray(
    ".stack-sobretitulo, .stack-titulo, .stack-cabecalho p"
  );
  const itensStack = gsap.utils.toArray(".stack-item");

  gsap.set(textosStack, { y: 22, autoAlpha: 0, force3D: true });
  gsap.set(itensStack, { y: 28, scale: 0.985, autoAlpha: 0, force3D: true });

  const observarCabecalhoStack = new IntersectionObserver((entradas, observador) => {
    if (!entradas.some((entrada) => entrada.isIntersecting)) return;

    gsap.to(textosStack, {
      y: 0,
      autoAlpha: 1,
      duration: 0.58,
      stagger: 0.065,
      ease: "power2.out",
      force3D: true,
      clearProps: "transform,willChange"
    });
    observador.disconnect();
  }, { threshold: 0.16, rootMargin: "0px 0px -7% 0px" });

  const observarPainelStack = new IntersectionObserver((entradas, observador) => {
    if (!entradas.some((entrada) => entrada.isIntersecting)) return;

    gsap.to(itensStack, {
      y: 0,
      scale: 1,
      autoAlpha: 1,
      duration: 0.52,
      stagger: 0.042,
      ease: "power2.out",
      force3D: true,
      clearProps: "transform,willChange"
    });
    observador.disconnect();
  }, { threshold: 0.055, rootMargin: "0px 0px -5% 0px" });

  if (cabecalhoStack) observarCabecalhoStack.observe(cabecalhoStack);
  observarPainelStack.observe(painelStack);
}

// ====== Entrada GSAP do rodapé ======
const rodapeAnimado = document.querySelector(".rodape");

if (
  rodapeAnimado &&
  window.gsap &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const colunasRodapeAnimadas = gsap.utils.toArray(".rodape-topo > *");
  const metaRodapeAnimada = document.querySelector(".rodape-meta");
  const palavraRodapeAnimada = document.querySelector(".rodape-palavra");
  const elementosFinaisRodape = [metaRodapeAnimada, palavraRodapeAnimada].filter(Boolean);

  gsap.set(colunasRodapeAnimadas, { autoAlpha: 0, y: 28, force3D: true });
  gsap.set(elementosFinaisRodape, { autoAlpha: 0, y: 24, force3D: true });

  const observarRodape = new IntersectionObserver((entradas, observador) => {
    if (!entradas.some((entrada) => entrada.isIntersecting)) return;

    const timelineRodape = gsap.timeline({ defaults: { ease: "power2.out" } });
    timelineRodape
      .to(colunasRodapeAnimadas, {
        autoAlpha: 1,
        y: 0,
        duration: 0.58,
        stagger: 0.075,
        force3D: true,
        clearProps: "transform,willChange"
      })
      .to(elementosFinaisRodape, {
        autoAlpha: 1,
        y: 0,
        duration: 0.62,
        stagger: 0.1,
        force3D: true,
        clearProps: "transform,willChange"
      }, "-=0.24");

    observador.disconnect();
  }, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" });

  observarRodape.observe(rodapeAnimado);
}

// ====== Cards de projetos: revela informações antes de abrir o site ======
const cardsProjetos = document.querySelectorAll(".projetos-card");

function fecharCardProjeto(card) {
  card.classList.remove("ativo");
  card.setAttribute("aria-expanded", "false");
}

cardsProjetos.forEach((card) => {
  card.addEventListener("click", (event) => {
    const clicouEmAbrir = event.target.closest(".projeto-abrir");

    if (card.classList.contains("ativo") && clicouEmAbrir) return;

    event.preventDefault();

    cardsProjetos.forEach((outroCard) => {
      if (outroCard !== card) fecharCardProjeto(outroCard);
    });

    const abrir = !card.classList.contains("ativo");
    card.classList.toggle("ativo", abrir);
    card.setAttribute("aria-expanded", String(abrir));
  });
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".projetos-card")) return;
  cardsProjetos.forEach(fecharCardProjeto);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  cardsProjetos.forEach(fecharCardProjeto);
});

// ====== Escultura GPU de partículas ======
const secaoEscultura = document.querySelector(".escultura-particulas");
const canvasEscultura = document.querySelector(".escultura-particulas-canvas");
const cabecalhoEscultura = document.querySelector(".escultura-cabecalho");
const informacoesEscultura = [...document.querySelectorAll(".escultura-info-bloco")];
let entradaEsculturaAgendada = null;
let entradaEsculturaConcluida = false;
let tituloEsculturaRevelado = false;

if (window.gsap && cabecalhoEscultura && informacoesEscultura.length) {
  gsap.set(cabecalhoEscultura, {
    autoAlpha: 0,
    y: 34,
    filter: "blur(6px)"
  });
  gsap.set(informacoesEscultura, {
    autoAlpha: 0,
    x: (indice) => indice < 2 ? -34 : 34,
    y: 12,
    filter: "blur(8px)"
  });
}

function revelarTituloEscultura(reduzirMovimento = false) {
  if (tituloEsculturaRevelado || !window.gsap || !cabecalhoEscultura) return;
  tituloEsculturaRevelado = true;

  gsap.to(cabecalhoEscultura, {
    autoAlpha: 1,
    y: 0,
    filter: "blur(0px)",
    duration: reduzirMovimento ? 0.01 : 0.9,
    ease: "power3.out",
    clearProps: "transform,filter"
  });
}

if (secaoEscultura && cabecalhoEscultura && "IntersectionObserver" in window) {
  const observadorTituloEscultura = new IntersectionObserver((entradas, observador) => {
    if (!entradas.some((entrada) => entrada.isIntersecting)) return;
    revelarTituloEscultura(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    observador.disconnect();
  }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });

  observadorTituloEscultura.observe(secaoEscultura);
}

function revelarInformacoesEscultura(reduzirMovimento = false) {
  if (entradaEsculturaConcluida || entradaEsculturaAgendada || !window.gsap) return;

  const atrasoMontagem = reduzirMovimento ? 0.15 : 2.35;
  entradaEsculturaAgendada = gsap.delayedCall(atrasoMontagem, () => {
    entradaEsculturaConcluida = true;
    entradaEsculturaAgendada = null;

    revelarTituloEscultura(reduzirMovimento);
    gsap.to(informacoesEscultura, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      duration: reduzirMovimento ? 0.01 : 0.68,
      stagger: reduzirMovimento ? 0 : 0.11,
      ease: "power3.out",
      clearProps: "transform,filter"
    });
  });
}

function iniciarEsculturaCanvas() {
  if (!secaoEscultura || !canvasEscultura || canvasEscultura.dataset.iniciada) return;
  canvasEscultura.dataset.iniciada = "canvas";
  canvasEscultura.replaceChildren();

  const canvas = document.createElement("canvas");
  const contexto = canvas.getContext("2d", { alpha: true, desynchronized: true });
  const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!contexto) return;
  canvasEscultura.appendChild(canvas);

  const poucosNucleos = (navigator.hardwareConcurrency || 4) <= 4;
  const total = window.innerWidth <= 700 ? 2600 : poucosNucleos ? 4200 : 5600;
  const pontos = [];
  const camadasDesenho = Array.from({ length: 7 }, () => []);
  const coresCamadas = [
    "rgba(112, 112, 120, 0.34)",
    "rgba(134, 134, 142, 0.42)",
    "rgba(155, 155, 163, 0.5)",
    "rgba(176, 176, 184, 0.59)",
    "rgba(198, 198, 205, 0.69)",
    "rgba(221, 221, 226, 0.8)",
    "rgba(244, 244, 247, 0.9)"
  ];
  const coresCamadasClaras = [
    "rgba(48, 43, 61, 0.28)",
    "rgba(58, 51, 76, 0.36)",
    "rgba(70, 60, 94, 0.44)",
    "rgba(80, 66, 112, 0.52)",
    "rgba(91, 72, 132, 0.62)",
    "rgba(103, 79, 153, 0.72)",
    "rgba(83, 58, 145, 0.82)"
  ];
  let temaClaroCanvas = document.documentElement.dataset.theme === "light";
  const mouse = {
    x: -9999,
    y: -9999,
    alvoX: -9999,
    alvoY: -9999,
    ativo: false
  };
  let largura = 1;
  let altura = 1;
  let raio = 1;
  let frame = 0;
  let visivel = false;
  let inicio = 0;

  for (let indice = 0; indice < total; indice++) {
    const y = Math.random() * 2 - 1;
    const angulo = Math.random() * Math.PI * 2;
    const horizontal = Math.sqrt(1 - y * y);
    const camada = 0.16 + Math.pow(Math.random(), 0.4) * 0.86;

    pontos.push({
      x: Math.cos(angulo) * horizontal * camada,
      y: y * camada,
      z: Math.sin(angulo) * horizontal * camada,
      origemX: Math.random() * 2 - 1,
      origemY: Math.random() * 2 - 1,
      deslocamentoX: 0,
      deslocamentoY: 0,
      velocidadeX: 0,
      velocidadeY: 0,
      telaX: 0,
      telaY: 0,
      tamanhoTela: 1,
      tamanho: 0.65 + Math.pow(Math.random(), 3) * 2.8,
      fase: Math.random() * Math.PI * 2
    });
  }

  function redimensionar() {
    const proporcaoPixel = Math.min(window.devicePixelRatio || 1, 1.35);
    largura = canvasEscultura.clientWidth;
    altura = canvasEscultura.clientHeight;
    raio = Math.min(largura, altura) * (largura <= 700 ? 0.4 : 0.38);
    canvas.width = Math.round(largura * proporcaoPixel);
    canvas.height = Math.round(altura * proporcaoPixel);
    canvas.style.width = `${largura}px`;
    canvas.style.height = `${altura}px`;
    contexto.setTransform(proporcaoPixel, 0, 0, proporcaoPixel, 0, 0);

    if (visivel && reduzirMovimento.matches) iniciar();
  }

  function desenhar(tempo) {
    if (!visivel) {
      frame = 0;
      return;
    }

    contexto.clearRect(0, 0, largura, altura);
    const segundos = tempo * 0.001;
    const delta = Math.min(1.5, Math.max(0.5, (tempo - (desenhar.ultimoTempo || tempo - 16.67)) / 16.67));
    desenhar.ultimoTempo = tempo;
    const montagem = reduzirMovimento.matches
      ? 1
      : Math.min(1, Math.max(0, (tempo - inicio) / 2300));
    const montagemSuave = 1 - Math.pow(1 - montagem, 3);
    const cos = Math.cos(segundos * 0.11);
    const sin = Math.sin(segundos * 0.11);
    const centroX = largura * 0.5;
    const centroY = altura * 0.5;
    const alcanceMouse = Math.min(165, raio * 0.38);
    const alcanceMouseQuadrado = alcanceMouse * alcanceMouse;

    mouse.x += (mouse.alvoX - mouse.x) * 0.2;
    mouse.y += (mouse.alvoY - mouse.y) * 0.2;
    camadasDesenho.forEach((camadaDesenho) => {
      camadaDesenho.length = 0;
    });

    pontos.forEach((ponto) => {
      const xRotacionado = ponto.x * cos - ponto.z * sin;
      const zRotacionado = ponto.x * sin + ponto.z * cos;
      const pulso = Math.sin(segundos * 0.48 + ponto.fase) * 0.004;
      const perspectiva = 1 / (1.18 - zRotacionado * 0.16);
      const esferaX = xRotacionado * (1 + pulso) * raio * perspectiva;
      const esferaY = ponto.y * (1 + pulso) * raio * perspectiva;
      const dispersoX = ponto.origemX * largura * 0.72;
      const dispersoY = ponto.origemY * altura * 0.72;
      let telaX = centroX + dispersoX * (1 - montagemSuave) + esferaX * montagemSuave;
      let telaY = centroY + dispersoY * (1 - montagemSuave) + esferaY * montagemSuave;

      if (mouse.ativo && !reduzirMovimento.matches) {
        const dx = telaX - mouse.x;
        const dy = telaY - mouse.y;
        const distanciaQuadrada = dx * dx + dy * dy;

        // O teste quadrado evita milhares de raízes quadradas fora da área
        // de influência; a força só é calculada para partículas próximas.
        if (distanciaQuadrada < alcanceMouseQuadrado && distanciaQuadrada > 1) {
          const distancia = Math.sqrt(distanciaQuadrada);
          const proximidade = 1 - distancia / alcanceMouse;
          const impulso = proximidade * proximidade * 1.7 * delta;
          ponto.velocidadeX += (dx / distancia) * impulso;
          ponto.velocidadeY += (dy / distancia) * impulso;
        }
      }

      // Retorno elástico amortecido: afasta, desacelera e volta à esfera
      // sem saltos ou deslocamentos permanentes.
      ponto.velocidadeX -= ponto.deslocamentoX * 0.026 * delta;
      ponto.velocidadeY -= ponto.deslocamentoY * 0.026 * delta;
      const amortecimento = Math.pow(0.9, delta);
      ponto.velocidadeX *= amortecimento;
      ponto.velocidadeY *= amortecimento;
      ponto.deslocamentoX += ponto.velocidadeX * delta;
      ponto.deslocamentoY += ponto.velocidadeY * delta;
      telaX += ponto.deslocamentoX;
      telaY += ponto.deslocamentoY;

      const profundidade = Math.max(0, Math.min(1, zRotacionado * 0.5 + 0.5));
      const indiceCamada = Math.min(6, Math.floor(profundidade * 7));
      ponto.telaX = telaX;
      ponto.telaY = telaY;
      ponto.tamanhoTela = ponto.tamanho * (0.7 + profundidade * 0.78);
      camadasDesenho[indiceCamada].push(ponto);
    });

    // Sete preenchimentos por frame no lugar de um por partícula. Além de
    // reduzir o custo, desenhar de trás para frente reforça o volume 3D.
    camadasDesenho.forEach((camadaDesenho, indiceCamada) => {
      contexto.beginPath();
      camadaDesenho.forEach((ponto) => {
        contexto.moveTo(ponto.telaX + ponto.tamanhoTela, ponto.telaY);
        contexto.arc(
          ponto.telaX,
          ponto.telaY,
          ponto.tamanhoTela,
          0,
          Math.PI * 2
        );
      });
      contexto.fillStyle = (temaClaroCanvas ? coresCamadasClaras : coresCamadas)[indiceCamada];
      contexto.fill();
    });

    frame = reduzirMovimento.matches ? 0 : requestAnimationFrame(desenhar);
  }

  function iniciar() {
    if (frame) return;
    frame = requestAnimationFrame(desenhar);
  }

  function atualizarInteracaoCanvas(event) {
    const caixa = canvasEscultura.getBoundingClientRect();
    mouse.alvoX = event.clientX - caixa.left;
    mouse.alvoY = event.clientY - caixa.top;
    if (!mouse.ativo) {
      mouse.x = mouse.alvoX;
      mouse.y = mouse.alvoY;
    }
    mouse.ativo = true;
  }

  function encerrarInteracaoCanvas() {
    mouse.ativo = false;
    mouse.alvoX = -9999;
    mouse.alvoY = -9999;
  }

  canvasEscultura.addEventListener("pointerdown", atualizarInteracaoCanvas, { passive: true });
  canvasEscultura.addEventListener("pointermove", atualizarInteracaoCanvas, { passive: true });
  canvasEscultura.addEventListener("pointerup", encerrarInteracaoCanvas, { passive: true });
  canvasEscultura.addEventListener("pointercancel", encerrarInteracaoCanvas, { passive: true });
  canvasEscultura.addEventListener("pointerleave", encerrarInteracaoCanvas, { passive: true });

  window.addEventListener("portfolio:tema", (event) => {
    temaClaroCanvas = event.detail.temaClaro;
    if (visivel && reduzirMovimento.matches) iniciar();
  });

  new ResizeObserver(redimensionar).observe(canvasEscultura);
  new IntersectionObserver((entradas) => {
    visivel = entradas[0].isIntersecting;

    if (visivel) {
      if (!inicio) inicio = performance.now();
      iniciar();
      revelarInformacoesEscultura(reduzirMovimento.matches);
    } else if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }, { threshold: 0.34 }).observe(secaoEscultura);

  redimensionar();
}

function iniciarEsculturaWebGL() {
  if (!secaoEscultura || !canvasEscultura || canvasEscultura.dataset.iniciada) return;

  if (!window.THREE) {
    iniciarEsculturaCanvas();
    return;
  }

  try {
    canvasEscultura.dataset.iniciada = "webgl";
    const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");
    const rendererEscultura = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance"
    });
    const cenaEscultura = new THREE.Scene();
    const cameraEscultura = new THREE.PerspectiveCamera(42, 1, 0.1, 20);
    const poucosRecursos =
      (navigator.hardwareConcurrency || 4) <= 4 ||
      (navigator.deviceMemory || 4) <= 4;
    const quantidadeParticulas = window.innerWidth <= 700
      ? (poucosRecursos ? 6500 : 9000)
      : (poucosRecursos ? 12000 : 18000);
    const posicoes = new Float32Array(quantidadeParticulas * 3);
    const dispersao = new Float32Array(quantidadeParticulas * 3);
    const sementes = new Float32Array(quantidadeParticulas);

    cameraEscultura.position.z = 3.7;
    rendererEscultura.setClearColor(0x000000, 0);
    rendererEscultura.setPixelRatio(
      Math.min(window.devicePixelRatio, poucosRecursos || window.innerWidth <= 700 ? 1.25 : 1.5)
    );
    canvasEscultura.appendChild(rendererEscultura.domElement);

    for (let indice = 0; indice < quantidadeParticulas; indice++) {
     
      const yDirecao = Math.random() * 2 - 1;
      const raioHorizontal = Math.sqrt(1 - yDirecao * yDirecao);
      const angulo = Math.random() * Math.PI * 2;
      // Volume esférico denso, com maior presença perto da casca, como o
      // loader do Tripo — não representa o modelo que está sendo gerado.
      const variacao = 0.08 + Math.pow(Math.random(), 0.38) * 0.94;
      const i3 = indice * 3;

      posicoes[i3] = Math.cos(angulo) * raioHorizontal * variacao;
      posicoes[i3 + 1] = yDirecao * variacao;
      posicoes[i3 + 2] = Math.sin(angulo) * raioHorizontal * variacao * 0.92;

      const raioDispersao = 1.45 + Math.random() * 1.8;
      const anguloDispersao = Math.random() * Math.PI * 2;
      const alturaDispersao = Math.random() * 2 - 1;
      const circuloDispersao = Math.sqrt(1 - alturaDispersao * alturaDispersao);

      dispersao[i3] = Math.cos(anguloDispersao) * circuloDispersao * raioDispersao;
      dispersao[i3 + 1] = alturaDispersao * raioDispersao;
      dispersao[i3 + 2] = Math.sin(anguloDispersao) * circuloDispersao * raioDispersao;
      sementes[indice] = Math.random();
    }

    const geometriaEscultura = new THREE.BufferGeometry();
    geometriaEscultura.setAttribute("position", new THREE.BufferAttribute(posicoes, 3));
    geometriaEscultura.setAttribute("aDispersao", new THREE.BufferAttribute(dispersao, 3));
    geometriaEscultura.setAttribute("aSemente", new THREE.BufferAttribute(sementes, 1));

    const uniformsEscultura = {
      uTempo: { value: 0 },
      uMontagem: { value: reduzirMovimento.matches ? 1 : 0 },
      uMouse: { value: new THREE.Vector2(10, 10) },
      uForcaMouse: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) }
    };

    const materialEscultura = new THREE.ShaderMaterial({
      uniforms: uniformsEscultura,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      vertexShader: `
        attribute vec3 aDispersao;
        attribute float aSemente;
        uniform float uTempo;
        uniform float uMontagem;
        uniform vec2 uMouse;
        uniform float uForcaMouse;
        uniform float uPixelRatio;
        varying float vBrilho;
        varying float vSemente;
        varying float vProfundidade;

        float easeOut(float t) {
          return 1.0 - pow(1.0 - t, 3.0);
        }

        void main() {
          float montagem = easeOut(clamp(uMontagem * 1.16 - aSemente * 0.16, 0.0, 1.0));
          vec3 posicao = mix(aDispersao, position, montagem);

          // Movimento individual preso à superfície: dá vida às partículas
          // sem deformar a silhueta ou descaracterizar o objeto.
          vec3 normalSuperficie = normalize(position);
          vec3 eixoApoio = abs(normalSuperficie.y) < 0.9
            ? vec3(0.0, 1.0, 0.0)
            : vec3(1.0, 0.0, 0.0);
          vec3 tangente = normalize(cross(normalSuperficie, eixoApoio));
          vec3 bitangente = normalize(cross(normalSuperficie, tangente));
          float fase = aSemente * 24.0;
          vec3 movimentoOrganico =
            tangente * sin(uTempo * 0.52 + fase) * 0.006 +
            bitangente * cos(uTempo * 0.41 + fase * 1.37) * 0.006 +
            normalSuperficie * sin(uTempo * 0.34 + fase * 0.73) * 0.004;
          posicao += movimentoOrganico * montagem;

          vec2 diferenca = posicao.xy - uMouse;
          float distancia = length(diferenca);
          float influencia = smoothstep(0.68, 0.0, distancia) * uForcaMouse * montagem;
          vec2 direcao = diferenca / max(distancia, 0.025);
          posicao.xy += direcao * influencia * 0.36;
          posicao.z += influencia * 0.2;

          vec4 posicaoCamera = modelViewMatrix * vec4(posicao, 1.0);
          gl_Position = projectionMatrix * posicaoCamera;
          float profundidade = clamp(position.z * 0.55 + 0.5, 0.0, 1.0);
          float escalaProfundidade = mix(0.88, 1.16, profundidade);
          float tamanhoIrregular = 2.7 + pow(aSemente, 3.2) * 5.4;
          gl_PointSize = (tamanhoIrregular + influencia * 2.2)
            * escalaProfundidade * uPixelRatio
            * (3.7 / max(1.0, -posicaoCamera.z));

          vBrilho = 0.32 + profundidade * 0.7 + influencia * 0.45;
          vSemente = aSemente;
          vProfundidade = profundidade;
        }
      `,
      fragmentShader: `
        varying float vBrilho;
        varying float vSemente;
        varying float vProfundidade;

        void main() {
          vec2 centro = gl_PointCoord - 0.5;
          float distancia = length(centro);
          float alfa = smoothstep(0.5, 0.08, distancia);
          if (alfa < 0.02) discard;

          vec3 fundo = vec3(0.38, 0.38, 0.4);
          vec3 meio = vec3(0.69, 0.69, 0.71);
          vec3 frente = vec3(0.96, 0.96, 0.96);
          vec3 cor = mix(fundo, meio, smoothstep(0.0, 0.6, vProfundidade));
          cor = mix(cor, frente, smoothstep(0.55, 1.0, vProfundidade) * 0.62);
          cor *= 0.78 + vSemente * 0.35;
          gl_FragColor = vec4(cor, alfa * min(0.92, 0.42 + vBrilho * 0.54));
        }
      `
    });

    const pontosEscultura = new THREE.Points(geometriaEscultura, materialEscultura);
    cenaEscultura.add(pontosEscultura);

    let frameEscultura = 0;
    let visivelEscultura = false;
    let inicioMontagem = 0;
    let alvoForcaMouse = 0;
    let ultimoTempo = 0;

    function redimensionarEscultura() {
      const largura = canvasEscultura.clientWidth;
      const altura = canvasEscultura.clientHeight;

      if (!largura || !altura) return;

      rendererEscultura.setSize(largura, altura, false);
      cameraEscultura.aspect = largura / altura;
      cameraEscultura.updateProjectionMatrix();

      const escala = largura <= 700 ? 0.98 : Math.min(1.42, 0.98 + largura / 3600);
      pontosEscultura.scale.setScalar(escala);
    }

    function renderizarEscultura(tempo) {
      if (!visivelEscultura) {
        frameEscultura = 0;
        return;
      }

      const segundos = tempo * 0.001;
      const delta = Math.min(0.05, segundos - ultimoTempo || 0);
      ultimoTempo = segundos;
      uniformsEscultura.uTempo.value = segundos;

      if (!reduzirMovimento.matches) {
        const montagem = Math.min(1, (tempo - inicioMontagem) / 2300);
        uniformsEscultura.uMontagem.value +=
          (montagem - uniformsEscultura.uMontagem.value) * 0.075;
        uniformsEscultura.uForcaMouse.value +=
          (alvoForcaMouse - uniformsEscultura.uForcaMouse.value) *
          Math.min(1, delta * 9);
        pontosEscultura.rotation.y = segundos * 0.105;
        pontosEscultura.rotation.x = Math.sin(segundos * 0.2) * 0.065;
      }

      rendererEscultura.render(cenaEscultura, cameraEscultura);

      if (reduzirMovimento.matches) {
        frameEscultura = 0;
      } else {
        frameEscultura = requestAnimationFrame(renderizarEscultura);
      }
    }

    function iniciarEscultura() {
      if (frameEscultura) return;
      ultimoTempo = performance.now() * 0.001;
      frameEscultura = requestAnimationFrame(renderizarEscultura);
    }

    function atualizarInteracaoWebGL(event) {
      if (reduzirMovimento.matches) return;
      const caixa = canvasEscultura.getBoundingClientRect();
      const x = ((event.clientX - caixa.left) / caixa.width) * 2 - 1;
      const y = -(((event.clientY - caixa.top) / caixa.height) * 2 - 1);
      const proporcao = caixa.width / caixa.height;

      uniformsEscultura.uMouse.value.set(x * 1.45 * proporcao, y * 1.45);
      alvoForcaMouse = 1;
    }

    function encerrarInteracaoWebGL() {
      alvoForcaMouse = 0;
      uniformsEscultura.uMouse.value.set(10, 10);
    }

    canvasEscultura.addEventListener("pointerdown", atualizarInteracaoWebGL, { passive: true });
    canvasEscultura.addEventListener("pointermove", atualizarInteracaoWebGL, { passive: true });
    canvasEscultura.addEventListener("pointerup", encerrarInteracaoWebGL, { passive: true });
    canvasEscultura.addEventListener("pointercancel", encerrarInteracaoWebGL, { passive: true });
    canvasEscultura.addEventListener("pointerleave", encerrarInteracaoWebGL, { passive: true });

    const observadorEscultura = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        visivelEscultura = entrada.isIntersecting;

        if (visivelEscultura) {
          if (!inicioMontagem) inicioMontagem = performance.now();
          iniciarEscultura();
          revelarInformacoesEscultura(reduzirMovimento.matches);
        } else if (frameEscultura) {
          cancelAnimationFrame(frameEscultura);
          frameEscultura = 0;
        }
      });
    }, { threshold: 0.34 });

    const observadorTamanhoEscultura = new ResizeObserver(redimensionarEscultura);
    observadorTamanhoEscultura.observe(canvasEscultura);
    observadorEscultura.observe(secaoEscultura);
    redimensionarEscultura();
    rendererEscultura.render(cenaEscultura, cameraEscultura);
  } catch (erro) {
    delete canvasEscultura.dataset.iniciada;
    iniciarEsculturaCanvas();
  }
}

let promessaThree = null;

function carregarThreeSobDemanda() {
  if (window.THREE) return Promise.resolve(window.THREE);
  if (promessaThree) return promessaThree;

  promessaThree = new Promise((resolver, rejeitar) => {
    const scriptThree = document.createElement("script");
    scriptThree.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r160/three.min.js";
    scriptThree.async = true;
    scriptThree.onload = () => resolver(window.THREE);
    scriptThree.onerror = () => rejeitar(new Error("Não foi possível carregar Three.js"));
    document.head.appendChild(scriptThree);
  });

  return promessaThree;
}

if (secaoEscultura && canvasEscultura) {
  // A criação dos buffers e a compilação dos shaders são adiadas até a
  // escultura se aproximar da tela. Isso libera a primeira navegação pelas
  // seções e ainda deixa a animação pronta antes de o usuário alcançá-la.
  const prepararEscultura = () => {
    const iniciarQuandoLivre = () => {
      carregarThreeSobDemanda()
        .then(iniciarEsculturaWebGL)
        .catch(iniciarEsculturaCanvas);
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(iniciarQuandoLivre, { timeout: 700 });
    } else {
      window.setTimeout(iniciarQuandoLivre, 80);
    }
  };

  if ("IntersectionObserver" in window) {
    const observadorPreparoEscultura = new IntersectionObserver((entradas, observador) => {
      if (!entradas.some((entrada) => entrada.isIntersecting)) return;
      observador.disconnect();
      prepararEscultura();
    }, { rootMargin: "1200px 0px", threshold: 0 });

    observadorPreparoEscultura.observe(secaoEscultura);
  } else {
    prepararEscultura();
  }
}
