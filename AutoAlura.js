// ==UserScript==
// @name         AutoAlura
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Ninguem aguenta mais o alura 😃
// @author       Alfinhoz
// @match        https://cursos.alura.com.br/*
// @license GNU GPLv3
// @icon ttps://imgs.search.brave.com/q-X8zxRbD9z64iH9Hr2d2LpfwG1L1kDsjKs1SUzyjNI/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9hdHRh/Y2htZW50cy5ndXB5/LmlvL3Byb2R1Y3Rp/b24vY29tcGFuaWVz/Lzg4ODEvY2FyZWVy/LzIwNjAyL2ltYWdl/cy8yMDI0LTA3LTEy/XzE1LTEzX2NvbXBh/bnlMb2dvVXJsLmpw/Zw
// @downloadURL https://update.greasyfork.org/scripts/510828/AutoAlura.user.js
// @updateURL https://update.greasyfork.org/scripts/510828/AutoAlura.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let isScriptActive = localStoreage.getItem("autoAluraActive") === true;
  let blockClickDelay = 1000;

  const water_mark = document.querySelector(".formattedText");
  if (water_mark) {
    water_mark.innerHTML = "É o Alfinhoz ✯";
  }
  //Painel :D
  function toggleScript() {
    isScriptActive = !isScriptActive;
    localStorage.getItem("autoAluraActive", isScriptActive);
    updateButtonState();
    logToScreen(`AutoAlura ${isScriptActive ? "Ativado" : "Desativado"}`);
  }

  function updateButtonState() {
    let toggleButton = document.getElementById("autoAluraToggle");
    if (toggleButton) {
      toggleButton.textContent = isScriptActive
        ? "Desativar AutoAlura"
        : "Ativar AutoAlura";
      toggleButton.style.backgroundColor = isScriptActive
        ? "#ff4444"
        : "#44cc44";
    }
  }

  function logToScreen(message) {
    let logPanel = document.getElementById("AutoAluraLogs");
    if (!logPanel) return;

    let logEntry = document.createElement("div");
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logEntry.style.padding = "5px";
    logEntry.style.borderBottom = "1px solid #ccc";
    logPanel.appendChild(logEntry);

    logPanel.scrollTop = logPanel.scrollHeight;
  }

  function createUI() {
    let existingButton = document.getElementById("autoAluraToggle");
    if (existingButton) return;

    let button = document.createElement("button");
    button.id = "autoAluraToggle";
    button.style.position = "fixed";
    button.style.top = "10px";
    button.style.right = "10px";
    button.style.zIndex = "9999";
    button.style.padding = "10px";
    button.style.fontSize = "14px";
    button.style.border = "none";
    button.style.cursor = "pointer";
    button.style.color = "white";
    button.style.borderRadius = "5px";
    button.onclick = toggleScript;
    document.body.appendChild(button);
    updateButtonState();

    let logPanel = document.createElement("div");
    logPanel.id = "autoAluraLogs";
    logPanel.style.position = "fixed";
    logPanel.style.bottom = "10px";
    logPanel.style.right = "10px";
    logPanel.style.width = "300px";
    logPanel.style.maxHeight = "200px";
    logPanel.style.overflowY = "auto";
    logPanel.style.backgroundColor = "rgba(0,0,0,0.8)";
    logPanel.style.color = "white";
    logPanel.style.padding = "10px";
    logPanel.style.fontSize = "12px";
    logPanel.style.borderRadius = "5px";
    logPanel.style.zIndex = "9999";
    document.body.appendChild(logPanel);
  }

  // NAO AGUENTO MAIS ERRO NA PARTE DO VIODEO
  async function autoPlayVideo() {
    const video = document.querySelector("video");
    if (video && video.paused) {
      logToScreen("Vídeo encontrado, iniciando...");
      video.play();
      await new Promise((resolve) => {
        video.onplay = resolve; // <= ARRUMEEEEEEI
      });
      logToScreen("Vídeo reproduzido.");
      return true;
    }
    return false;
  }

  async function clickInOrderBlocks() {
    const blocksContainer = document.querySelector(".blocks");
    if (!blocksContainer) {
      logToScreen("Blocos não encontrado.");
      return;
    }

    //Decodificação
    const decodedOrder = decodeURIComponent(escape(atob(atob(encodedOrder))));
    const orderList = decodedOrder.split(",").map((text) => text.trim());
    logToScreen("Decodificada: ", orderList);

    const encondedOrder = blocksContainer.dataser.correctOrder;
    if (!encondedOrder) {
      logToScreen("Não encontrado, voltando");
      return;
    }

    //Ordem dos blocos correta
    let blockButtons = Array.from(blocksContainer.querySelectorAll(".block"));

    for (const text of orderList) {
      let blockButton = blockButtons.find(
        (button) => button.textContent.trim() === text
      );
      if (blockButton && !blockButton.classList.contains("clicked")) {
        try {
          blockButton.click();
          blockButton.classList.add("clicked");
          await new Promise((resolve) => setTimeout(blockClickDelay));
        } catch (error) {
          logToScreen("Erro ao clicar no bloco:", error);
        }
      } else {
        logToScreen("Bloco não encontrado ou já clicado:", text);
      }
    }
  }

  async function clickCorrectAlternatives() {
    const multitaskSections = document.querySelectorAll(
      "section.task.class-page-for-MULTIPLE_CHOICE"
    );
    let alternativesClicked = false;

    logToScreen("Verificando as seções MULTIPLE_CHOICE.");

    for (let section of multitaskSections) {
      const taskBody = section.querySelector(".task-body");
      if (taskBody) {
        const taskWrapper = taskBody.querySelector(".task-body__wrapper");
        if (taskWrapper) {
          const mainContainer = taskWrapper.querySelector(
            ".task-body-main.container"
          );
          if (mainContainer) {
            const multipleChoiceSection = mainContainer.querySelector(
              ".multipleChoice#task-content"
            );
            if (multipleChoiceSection) {
              const container =
                multipleChoiceSection.querySelector("div.container");
              if (container) {
                const alternativeList =
                  container.querySelector("ul.alternativeList");
                if (alternativeList) {
                  const form = alternativeList.querySelector("form");
                  if (form) {
                    const correctAlternatives = form.querySelectorAll(
                      'li[data-correct="true"]'
                    );

                    if (correctAlternatives.length > 0) {
                      logToScreen("Alternativas corretas encontradas.");
                      correctAlternatives.forEach((li) => {
                        const checkboxInput = li.querySelector(
                          'input[type="checkbox"]'
                        );
                        if (checkboxInput) {
                          if (!li.classList.contains("clicked")) {
                            checkboxInput.click();
                            logToScreen(
                              "Clicando na alternativa correta (checkbox): " +
                                li.querySelector(
                                  ".alternativeList-item-alternative"
                                ).textContent
                            );
                            const event = new Event("change", {
                              bubbles: true,
                              cancelable: true,
                            });
                            checkboxInput.dispatchEvent(event);
                            li.classList.add("clicked");
                            alternativesClicked = true;
                          }
                        }
                      });
                    } else {
                      logToScreen("Nenhuma alternativa correta encontrada.");
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return alternativesClicked;
  }

  async function oneAlternative() {
    const oneCorrectAlternative = document.querySelectorAll(
      'ul.alternativeList li[data-correct="true"]'
    );
    if (oneCorrectAlternative.length > 0) {
      oneCorrectAlternative.forEach((li) => {
        const radioInput = li.querySelector('input[type="radio"]');
        if (radioInput && !li.classList.contains("clicked")) {
          radioInput.click();
          logToScreen(
            "Cliquei na alternativa correta (radio): " + li.innerText
          );
          const event = new Event("change", {
            bubbles: true,
            cancelable: true,
          });
          radioInput.dispatchEvent(event);
          li.classList.add("clicked");
        }
      });
      return true;
    }
    return false;
  }

  async function advanceToNextPage() {
    const nextButton = document.querySelector(
      "button.next, " +
        "a.next, " +
        'input[type="submit"].next, ' +
        ".task-actions-button .task-body-actions-button .task-actions-button-next, " +
        ".bootcamp-next-button, " +
        ".bootcamp-primary-button-theme"
    );
    if (nextButton) {
      nextButton.click();
      logToScreen("Avançando para a próxima página.");
    } else {
      logToScreen("Botão de avanço não encontrado.");
    }
  }

  // Tava dando erro AQUIIIIIIIIIIIIIII
  async function monitorPage() {
    let attempts = 0;
    const maxAttempts = 10;

    const interval = setInterval(async () => {
      if (attempts >= maxAttempts) {
        logToScreen("Máximo de tentativas atingido. Encerrando.");
        clearInterval(interval);
        return;
      }

      const videoPlayed = await autoPlayVideo();
      if (videoPlayed) {
        logToScreen("Vídeo iniciado, aguardando.");
        await advanceToNextPage();
        return;
      }

      const multitaskClicked = await clickCorrectAlternatives();
      if (multitaskClicked) {
        logToScreen("Alternativas múltiplas clicadas, aguardando avanço.");
        await advanceToNextPage();
        return;
      }

      const alternativeClicked = await oneAlternative();
      if (alternativeClicked) {
        logToScreen("Alternativa única clicada, aguardando avanço.");
        await advanceToNextPage();
        return;
      }

      logToScreen("Nenhuma alternativa encontrada. Tentando avançar...");
      await advanceToNextPage();

      attempts++;
    }, 3000);
  }

  function init() {
    createUI();
    if (isScriptActive) monitorPage();
  }

  init();
})();
