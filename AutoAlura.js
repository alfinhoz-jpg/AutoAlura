// ==UserScript==
// @name         AutoAlura
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Automatiza o Alura. Clique (´) para esconder ou mostrar a Overlay
// @author       Alfinhoz
// @match        https://cursos.alura.com.br/*
// @license GNU GPLv3
// ==/UserScript==

(function () {
  "use strict";

  let isScriptActive = true;
  let overlayVisible = true;
  let blockClickDelay = 1000;

  function createOverlay() {
    if (document.getElementById("script-overlay")) return;

    let overlay = document.createElement("div");
    overlay.id = "script-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "10px";
    overlay.style.right = "10px";
    overlay.style.width = "240px";
    overlay.style.padding = "20px";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
    overlay.style.color = "white";
    overlay.style.fontFamily = "Arial, sans-serif";
    overlay.style.borderRadius = "8px";
    overlay.style.zIndex = "9999999";
    overlay.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.9)";
    overlay.style.display = "block";
    overlay.style.pointerEvents = "auto";
    overlay.style.overflow = "hidden";

    let title = document.createElement("h3");
    title.innerText = "Controle do Script";
    title.style.margin = "0 0 15px";
    title.style.fontSize = "18px";
    title.style.color = "#fff";
    overlay.appendChild(title);

    let toggleButton = document.createElement("button");
    toggleButton.innerText = "Desativar Script";
    toggleButton.style.padding = "10px";
    toggleButton.style.width = "100%";
    toggleButton.style.marginBottom = "10px";
    toggleButton.style.cursor = "pointer";
    toggleButton.style.backgroundColor = "#e74c3c";
    toggleButton.style.border = "none";
    toggleButton.style.color = "white";
    toggleButton.style.borderRadius = "5px";
    toggleButton.style.fontSize = "14px";
    toggleButton.onclick = function () {
      isScriptActive = !isScriptActive;
      toggleButton.innerText = isScriptActive
        ? "Desativar Script"
        : "Ativar Script";
      toggleButton.style.backgroundColor = isScriptActive
        ? "#e74c3c"
        : "#2ecc71";
    };
    overlay.appendChild(toggleButton);

    let hideButton = document.createElement("button");
    hideButton.innerText = "Esconder Overlay";
    hideButton.style.padding = "10px";
    hideButton.style.width = "100%";
    hideButton.style.cursor = "pointer";
    hideButton.style.backgroundColor = "#3498db";
    hideButton.style.border = "none";
    hideButton.style.color = "white";
    hideButton.style.borderRadius = "5px";
    hideButton.style.fontSize = "14px";
    hideButton.onclick = function () {
      overlay.style.display = "none";
    };
    overlay.appendChild(hideButton);

    document.body.appendChild(overlay);
  }

  async function autoPlayVideo() {
    let video = document.querySelector("video");
    if (video) {
      video.play();
      console.log("Vídeo iniciado.");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return true; // Verdadeiro se houver vídeo
    }
    return false; // Falso se não houver vídeo
  }

  function clickCorrectAlternatives() {
    let correctAlternatives = document.querySelectorAll(
      'ul.alternativeList li[data-correct="true"]'
    );
    if (correctAlternatives.length > 0) {
      correctAlternatives.forEach((li) => {
        const radioInput = li.querySelector('input[type="radio"]');
        if (radioInput && !li.classList.contains("clicked")) {
          // Verifica se já foi clicado
          radioInput.click();
          console.log("Clicando na alternativa correta: " + li.innerText);
          const event = new Event("change", {
            bubbles: true,
            cancelable: true,
          });
          radioInput.dispatchEvent(event);
          li.classList.add("clicked"); // Adiciona a classe 'clicked' para marcar como clicado
        }
      });
      return true; // Retorna verdadeiro se alternativas foram clicadas
    }
    return false; // Retorna falso se não houver alternativas corretas
  }

  function decodeBase64(encoded) {
    const decoded = atob(encoded);
    return decoded;
  }
  async function clickBlocksInOrder() {
    console.log("Iniciando a função clickBlocksInOrder.");
    const blocksContainer = document.querySelector('.blocks');
    if (blocksContainer) {
        const correctOrder = blocksContainer.dataset.correctOrder;
        const firstDecoding = decodeBase64(correctOrder);
        const secondDecoding = decodeBase64(firstDecoding);
        let decodedTexts = decodeURIComponent(escape(secondDecoding)).split(',').map(text => text.trim());
        console.log("Textos decodificados:", decodedTexts);
        let blockButtons = Array.from(blocksContainer.querySelectorAll('.block')); // Alterado para let
        console.log("Total de botões disponíveis:", blockButtons.length);

        for (const text of decodedTexts) {
            let blockButton; // Alterado para let
            let attempts = 0;

            while (attempts < 5) {
                blockButton = blockButtons.find(button => button.textContent.trim() === text);
                if (blockButton && !blockButton.classList.contains('clicked')) {
                    try {
                        blockButton.click();
                        console.log("Clicando no bloco: " + text);
                        blockButton.classList.add('clicked');
                        await new Promise(resolve => setTimeout(resolve, blockClickDelay));
                        break; // Sai do loop após clicar
                    } catch (error) {
                        console.error("Erro ao clicar no bloco: ", error);
                    }
                } else {
                    console.log("Tentativa " + (attempts + 1) + ": Botão não encontrado ou já clicado para o texto: " + text);
                }
                attempts++;
                await new Promise(resolve => setTimeout(resolve, 500)); // Esperar um pouco antes de tentar novamente
            }

            // Atualizar a lista de botões
            blockButtons = blockButtons.filter(button => !button.classList.contains('clicked'));
        }

        // Após clicar todos os blocos, submeter a resposta
        await submitAnswer();

        // Esperar 3 segundos antes de clicar em Próxima Atividade
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Avançar para a próxima atividade
        let nextButton = document.querySelector(
            'button.next, ' +
            'a.next, ' +
            'input[type="submit"].next, ' +
            '.task-actions-button .task-body-actions-button .task-actions-button-next, ' +
            '.bootcamp-next-button, ' +
            '.bootcamp-primary-button-theme'
        );
        if (nextButton) {
            nextButton.click();
            console.log("Avançando para a próxima página após clicar nos blocos.");
        }
    } else {
        console.log("Container de blocos não encontrado.");
    }
}


  function submitAnswer() {
    let submitButton = document.querySelector("#submitBlocks");
    if (submitButton) {
      submitButton.click();
      console.log("Clicando em 'Submeter resposta'.");
    }
  }

  function monitorPage() {
    let interval = setInterval(async () => {
      if (!isScriptActive) return; // Se o script estiver desativado, não faz nada

      const videoPlayed = await autoPlayVideo();
      if (videoPlayed) {
        console.log("Avançando para a próxima página após o vídeo.");
        let nextButton = document.querySelector(
          "button.next, " +
            "a.next, " +
            'input[type="submit"].next, ' +
            ".task-actions-button .task-body-actions-button .task-actions-button-next, " +
            ".bootcamp-next-button, " +
            ".bootcamp-primary-button-theme"
        );
        if (nextButton) {
          nextButton.click();
          return; // Sai da função
        }
      }

      const alternativesClicked = clickCorrectAlternatives();
      if (alternativesClicked) {
        // Verifica se ainda há alternativas disponíveis
        let remainingAlternatives = document.querySelectorAll(
          'ul.alternativeList li[data-correct="true"]:not(.clicked)'
        );
        if (remainingAlternatives.length === 0) {
          let nextButton = document.querySelector(
            "button.next, " +
              "a.next, " +
              'input[type="submit"].next, ' +
              ".task-actions-button .task-body-actions-button .task-actions-button-next, " +
              ".bootcamp-next-button, " +
              ".bootcamp-primary-button-theme"
          );
          if (nextButton) {
            nextButton.click();
            console.log(
              "Avançando para a próxima página após clicar na alternativa correta."
            );
          }
        }
        return; // Sai da função
      }

      await clickBlocksInOrder(); // Tenta clicar nos blocos

      // Se não houver blocos, tenta avançar para a próxima atividade
      let nextButton = document.querySelector(
        "button.next, " +
          "a.next, " +
          'input[type="submit"].next, ' +
          ".task-actions-button .task-body-actions-button .task-actions-button-next, " +
          ".bootcamp-next-button, " +
          ".bootcamp-primary-button-theme"
      );
      if (nextButton) {
        nextButton.click();
        console.log("Avançando para a próxima página.");
      }
    }, 3000); // Executa a cada 3 segundos
  }

  function toggleOverlay() {
    let overlay = document.getElementById("script-overlay");
    if (overlay) {
      overlay.style.display = overlayVisible ? "none" : "block";
      overlayVisible = !overlayVisible;
    }
  }

  function init() {
    createOverlay();
    monitorPage();
  }

  window.addEventListener("keydown", function (event) {
    if ((event.key === "Dead" / event.key) === "´") {
      // Tecla "´"
      toggleOverlay();
    }
  });

  init();
})();
