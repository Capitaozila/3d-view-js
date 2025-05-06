import { initScene, renderer, scene, camera } from "./modules/scene.js";
import { createGeometry } from "./modules/shapes.js";
import { createMaterial, updateMaterial } from "./modules/materials.js";
import { showToast, updateValueDisplay } from "./modules/ui.js";
import { shapeDescriptions } from "./modules/descriptions.js";

let formas = [];
let formaSelecionada = null;
let materialAtual;
let estaTransicionando = false;
let tempoMorph;
let estaArrastando = false;
let posicaoAnteriorMouse = { x: 0, y: 0 };
let velocidadeRotacao = { x: 0, y: 0 };
let tempo = 0;

function iniciar() {
  initScene();

  const luzDirecional = new THREE.DirectionalLight(0xffffff, 1);
  luzDirecional.position.set(1, 1, 1);
  scene.add(luzDirecional);

  const luzAmbiente = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(luzAmbiente);

  document.body.appendChild(renderer.domElement);

  configurarEventListeners();

  criarMultiplasFormas();

  animar();

  setTimeout(() => {
    document.querySelector(".loader").classList.add("hidden");
  }, 800);

  atualizarTodasExibicoes();
}

function criarMultiplasFormas() {
  formas.forEach((forma) => {
    scene.remove(forma);
    if (forma.geometry) forma.geometry.dispose();
    if (forma.material) forma.material.dispose();
  });
  formas = [];

  const cuboGeometria = createGeometry(
    "cube",
    parseInt(document.getElementById("segments").value)
  );
  const cuboMaterial = createMaterial();
  const cubo = new THREE.Mesh(cuboGeometria, cuboMaterial);
  cubo.position.set(-2.5, 0, 0);
  cubo.userData.tipo = "cube";
  formas.push(cubo);
  scene.add(cubo);

  const cilindroGeometria = createGeometry(
    "cylinder",
    parseInt(document.getElementById("segments").value)
  );
  const cilindroMaterial = createMaterial();
  const cilindro = new THREE.Mesh(cilindroGeometria, cilindroMaterial);
  cilindro.position.set(0, 0, 0);
  cilindro.userData.tipo = "cylinder";
  formas.push(cilindro);
  scene.add(cilindro);

  const esferaGeometria = createGeometry(
    "sphere",
    parseInt(document.getElementById("segments").value)
  );
  const esferaMaterial = createMaterial();
  const esfera = new THREE.Mesh(esferaGeometria, esferaMaterial);
  esfera.position.set(2.5, 0, 0);
  esfera.userData.tipo = "sphere";
  formas.push(esfera);
  scene.add(esfera);

  const escala = parseFloat(document.getElementById("scale").value);
  formas.forEach((forma) => {
    forma.scale.set(escala, escala, escala);
  });

  formaSelecionada = cilindro;
  showToast("Três formas adicionadas à cena!");
}

function configurarEventListeners() {
  document.getElementById("shape").addEventListener("change", (e) => {
    if (!estaTransicionando && formaSelecionada) {
      transformarForma(
        formaSelecionada,
        e.target.value,
        parseInt(document.getElementById("segments").value)
      );
      atualizarDescricaoForma(e.target.value);
    }
  });

  document.getElementById("materialType").addEventListener("change", () => {
    if (formaSelecionada && !estaTransicionando) {
      const escalaAntiga = formaSelecionada.scale.x;
      const rotacaoAntiga = formaSelecionada.rotation.clone();

      materialAtual = createMaterial();
      formaSelecionada.material = materialAtual;

      formaSelecionada.scale.set(escalaAntiga, escalaAntiga, escalaAntiga);
      formaSelecionada.rotation.copy(rotacaoAntiga);
    }
  });

  document.getElementById("color").addEventListener("input", (e) => {
    if (formaSelecionada && !estaTransicionando) {
      const novaCor = new THREE.Color(e.target.value);
      if (formaSelecionada.material.uniforms) {
        formaSelecionada.material.uniforms.color1.value.copy(novaCor);
      } else {
        formaSelecionada.material.color.copy(novaCor);
      }
      formaSelecionada.material.needsUpdate = true;
    }
  });

  document.getElementById("color2").addEventListener("input", (e) => {
    if (formaSelecionada && formaSelecionada.material.uniforms) {
      const novaCor = new THREE.Color(e.target.value);
      formaSelecionada.material.uniforms.color2.value.copy(novaCor);
      formaSelecionada.material.needsUpdate = true;
    }
  });

  document.getElementById("bg-color").addEventListener("input", (e) => {
    renderer.setClearColor(new THREE.Color(e.target.value), 1);
  });

  document.getElementById("scale").addEventListener("input", (e) => {
    if (formaSelecionada && !estaTransicionando) {
      const escala = parseFloat(e.target.value);
      formaSelecionada.scale.set(escala, escala, escala);
      updateValueDisplay("scale-value", escala.toFixed(1));
    }
  });

  document.getElementById("segments").addEventListener("input", (e) => {
    updateValueDisplay("segments-value", e.target.value);
  });

  document.getElementById("segments").addEventListener("change", (e) => {
    if (formaSelecionada && !estaTransicionando) {
      const segmentos = parseInt(e.target.value);
      const nomeForma = document.getElementById("shape").value;

      const geometria = createGeometry(nomeForma, segmentos);
      formaSelecionada.geometry.dispose();
      formaSelecionada.geometry = geometria;
    }
  });

  document.getElementById("metalness").addEventListener("input", (e) => {
    updateMaterial();
    updateValueDisplay("metalness-value", e.target.value);
  });

  document.getElementById("roughness").addEventListener("input", (e) => {
    updateMaterial();
    updateValueDisplay("roughness-value", e.target.value);
  });

  document.getElementById("direction").addEventListener("input", (e) => {
    updateValueDisplay("direction-value", e.target.value);
  });

  document.getElementById("toggle-panel").addEventListener("click", () => {
    const controles = document.getElementById("controls");
    controles.classList.toggle("collapsed");

    const icone = document.querySelector("#toggle-panel i");
    if (controles.classList.contains("collapsed")) {
      icone.className = "fas fa-chevron-left";
    } else {
      icone.className = "fas fa-chevron-right";
    }

    setTimeout(atualizarPosicaoCamera, 300);
  });

  document
    .getElementById("mode-toggle")
    .addEventListener("click", alternarModoCorPagina);

  document
    .getElementById("reset-camera")
    .addEventListener("click", resetarCamera);
  document
    .getElementById("reset-all")
    .addEventListener("click", resetarTodasConfiguracoes);

  renderer.domElement.addEventListener("mousedown", tratarMouseDown);
  renderer.domElement.addEventListener("mousemove", tratarMouseMove);
  renderer.domElement.addEventListener("mouseup", tratarMouseUp);
  renderer.domElement.addEventListener("touchstart", tratarTouchStart, {
    passive: false,
  });
  renderer.domElement.addEventListener("touchmove", tratarTouchMove, {
    passive: false,
  });
  renderer.domElement.addEventListener("touchend", tratarTouchEnd);

  window.addEventListener("resize", tratarRedimensionamentoJanela);

  renderer.domElement.addEventListener("click", selecionarObjetoPorClique);
}

function selecionarObjetoPorClique(event) {
  if (estaTransicionando) return;

  const rect = renderer.domElement.getBoundingClientRect();
  const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(mouseX, mouseY);
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(formas);

  if (intersects.length > 0) {
    formaSelecionada = intersects[0].object;
    showToast(`Selecionado: ${formaSelecionada.userData.tipo}`);

    document.getElementById("shape").value = formaSelecionada.userData.tipo;
    atualizarDescricaoForma(formaSelecionada.userData.tipo);
  }
}

function atualizarDescricaoForma(nomeForma) {
  const elementoDescricao = document.getElementById("shape-description");
  const descricao = shapeDescriptions[nomeForma] || "Descrição não disponível.";
  elementoDescricao.innerHTML = descricao;
}

function alternarModoCorPagina() {
  document.body.classList.toggle("light-mode");

  const icone = document.querySelector("#mode-toggle i");
  if (document.body.classList.contains("light-mode")) {
    icone.className = "fas fa-sun";
    showToast("Modo claro ativado");
  } else {
    icone.className = "fas fa-moon";
    showToast("Modo escuro ativado");
  }
}

function resetarCamera() {
  camera.position.set(0, 0, 5);
  camera.lookAt(0, 0, 0);
  showToast("Câmera resetada");
}

function resetarTodasConfiguracoes() {
  document.getElementById("scale").value = 1;
  document.getElementById("segments").value = 32;
  document.getElementById("direction").value = "all";
  document.getElementById("materialType").value = "standard";
  document.getElementById("color").value = "#00ff9d";
  document.getElementById("color2").value = "#ff00ff";
  document.getElementById("metalness").value = 0.5;
  document.getElementById("roughness").value = 0.5;
  document.getElementById("bg-color").value = "#000000";

  renderer.setClearColor(0x000000, 1);
  resetarCamera();

  if (formaSelecionada) {
    formaSelecionada.scale.set(1, 1, 1);

    materialAtual = createMaterial();
    formaSelecionada.material = materialAtual;
  }

  atualizarTodasExibicoes();

  showToast("Todas as configurações foram resetadas");
}

function atualizarTodasExibicoes() {
  updateValueDisplay("scale-value", document.getElementById("scale").value);
  updateValueDisplay(
    "segments-value",
    document.getElementById("segments").value
  );
  updateValueDisplay(
    "metalness-value",
    document.getElementById("metalness").value
  );
  updateValueDisplay(
    "roughness-value",
    document.getElementById("roughness").value
  );
}

function tratarRedimensionamentoJanela() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  atualizarPosicaoCamera();
}

function atualizarPosicaoCamera() {
  const painelControles = document.getElementById("controls");
  const painelRetraido = painelControles.classList.contains("collapsed");
  const larguraPainel = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue("--panel-width")
  );

  if (!painelRetraido) {
    camera.setViewOffset(
      window.innerWidth,
      window.innerHeight,
      -larguraPainel / 4,
      0,
      window.innerWidth,
      window.innerHeight
    );
  } else {
    camera.clearViewOffset();
  }
}

function tratarMouseDown(e) {
  estaArrastando = true;
  document.body.style.cursor = "grabbing";
  posicaoAnteriorMouse = {
    x: e.offsetX,
    y: e.offsetY,
  };
  e.preventDefault();
}

function tratarMouseMove(e) {
  if (!estaArrastando || estaTransicionando) return;

  const deltaMovimento = {
    x: e.offsetX - posicaoAnteriorMouse.x,
    y: e.offsetY - posicaoAnteriorMouse.y,
  };

  velocidadeRotacao = {
    x: deltaMovimento.y * 0.005,
    y: deltaMovimento.x * 0.005,
  };

  if (formaSelecionada) {
    formaSelecionada.rotation.x += velocidadeRotacao.x;
    formaSelecionada.rotation.y += velocidadeRotacao.y;
  }

  posicaoAnteriorMouse = {
    x: e.offsetX,
    y: e.offsetY,
  };
}

function tratarMouseUp() {
  estaArrastando = false;
  document.body.style.cursor = "grab";
}

function tratarTouchStart(e) {
  if (e.touches.length === 1) {
    estaArrastando = true;
    posicaoAnteriorMouse = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }
  e.preventDefault();
}

function tratarTouchMove(e) {
  if (!estaArrastando || estaTransicionando || e.touches.length !== 1) return;

  const deltaMovimento = {
    x: e.touches[0].clientX - posicaoAnteriorMouse.x,
    y: e.touches[0].clientY - posicaoAnteriorMouse.y,
  };

  velocidadeRotacao = {
    x: deltaMovimento.y * 0.005,
    y: deltaMovimento.x * 0.005,
  };

  if (formaSelecionada) {
    formaSelecionada.rotation.x += velocidadeRotacao.x;
    formaSelecionada.rotation.y += velocidadeRotacao.y;
  }

  posicaoAnteriorMouse = {
    x: e.touches[0].clientX,
    y: e.touches[0].clientY,
  };

  e.preventDefault();
}

function tratarTouchEnd() {
  estaArrastando = false;
}

function transformarForma(formaOrigem, nomeFormaDestino, segmentos) {
  if (estaTransicionando) {
    clearTimeout(tempoMorph);
  }

  estaTransicionando = true;
  const escalaOriginal = formaOrigem.scale.x;
  const posicaoOriginal = formaOrigem.position.clone();
  const passos = 60;
  let passo = 0;

  const geometriaAlvo = createGeometry(nomeFormaDestino, segmentos);
  const formaAlvo = new THREE.Mesh(geometriaAlvo, createMaterial());
  formaAlvo.position.copy(posicaoOriginal);
  formaAlvo.scale.set(0.001, 0.001, 0.001);
  formaAlvo.userData.tipo = nomeFormaDestino;
  scene.add(formaAlvo);

  function animar() {
    if (passo >= passos) {
      const index = formas.indexOf(formaOrigem);
      if (index !== -1) {
        formas[index] = formaAlvo;
      }

      scene.remove(formaOrigem);
      formaAlvo.scale.set(escalaOriginal, escalaOriginal, escalaOriginal);
      formaSelecionada = formaAlvo;
      estaTransicionando = false;
      showToast(
        `Forma alterada para ${nomeFormaDestino
          .replace(/([A-Z])/g, " $1")
          .trim()}`
      );
      return;
    }

    const progresso = passo / passos;
    const progressoSuave = 0.5 - Math.cos(progresso * Math.PI) / 2;

    formaOrigem.scale.set(
      escalaOriginal * (1 - progressoSuave),
      escalaOriginal * (1 - progressoSuave),
      escalaOriginal * (1 - progressoSuave)
    );
    formaOrigem.rotation.x += 0.1;
    formaOrigem.rotation.y += 0.1;

    if (progresso > 0.5) {
      const progressoCrescimento = (progresso - 0.5) * 2;
      const crescimentoSuave =
        0.5 - Math.cos(progressoCrescimento * Math.PI) / 2;
      formaAlvo.scale.set(
        escalaOriginal * crescimentoSuave,
        escalaOriginal * crescimentoSuave,
        escalaOriginal * crescimentoSuave
      );
      formaAlvo.rotation.x += 0.1;
      formaAlvo.rotation.y += 0.1;
    }

    passo++;
    tempoMorph = setTimeout(animar, 1000 / 60);
  }

  animar();
}

function animar() {
  requestAnimationFrame(animar);
  tempo += 0.01;

  formas.forEach((forma) => {
    if (!estaArrastando && !estaTransicionando) {
      const direcao = document.getElementById("direction").value;

      const velocidade = parseFloat(document.getElementById("speed").value);

      if (velocidade > 0 && direcao !== "none") {
        switch (direcao) {
          case "all":
            forma.rotation.x += velocidade;
            forma.rotation.y += velocidade;
            forma.rotation.z += velocidade;
            break;
          case "x":
            forma.rotation.x += velocidade;
            break;
          case "y":
            forma.rotation.y += velocidade;
            break;
          case "z":
            forma.rotation.z += velocidade;
            break;
          case "xy":
            forma.rotation.x += velocidade;
            forma.rotation.y += velocidade;
            break;
          case "xz":
            forma.rotation.x += velocidade;
            forma.rotation.z += velocidade;
            break;
          case "yz":
            forma.rotation.y += velocidade;
            forma.rotation.z += velocidade;
            break;
          case "custom":
            forma.rotation.x = Math.sin(tempo) * velocidade * 10;
            forma.rotation.y = Math.cos(tempo * 1.5) * velocidade * 10;
            forma.rotation.z = Math.sin(tempo * 2) * velocidade * 10;
            break;
        }
      }
    }
  });

  TWEEN.update();

  renderer.render(scene, camera);
}

document.addEventListener("DOMContentLoaded", iniciar);
