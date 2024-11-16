// ==UserScript==
// @name         AutoAlura
// @namespace    http://tampermonkey.net/
// @version      16/11
// @description  Ninguem aguenta mais o alura :smile:
// @author       Alfinhoz
// @match        https://cursos.alura.com.br/*
// @license GNU GPLv3
// @icon ttps://imgs.search.brave.com/q-X8zxRbD9z64iH9Hr2d2LpfwG1L1kDsjKs1SUzyjNI/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9hdHRh/Y2htZW50cy5ndXB5/LmlvL3Byb2R1Y3Rp/b24vY29tcGFuaWVz/Lzg4ODEvY2FyZWVy/LzIwNjAyL2ltYWdl/cy8yMDI0LTA3LTEy/XzE1LTEzX2NvbXBh/bnlMb2dvVXJsLmpw/Zw
// @downloadURL https://update.greasyfork.org/scripts/510828/AutoAlura.user.js
// @updateURL https://update.greasyfork.org/scripts/510828/AutoAlura.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let isScriptActive = true;
  let blockClickDelay = 1000;

  const water_mark = document.querySelector(".formattedText");
  if (water_mark) {
    water_mark.innerHTML = "É o Alfinhoz vida!";
  }

  // NAO AGUENTO MAIS ERRO NA PARTE DO VIODEO
  async function autoPlayVideo() {
    const video = document.querySelector("video");
    if (video && video.paused) {
      console.log("Vídeo encontrado, iniciando...");
      video.play();
      await new Promise((resolve) => {
        video.onplay = resolve; // <= ARRUMEEEEEEI
      });
      console.log("Vídeo reproduzido.");
      return true;
    }
    return false;
  }

  async function clickCorrectAlternatives() {
    const multitaskSections = document.querySelectorAll(
      "section.task.class-page-for-MULTIPLE_CHOICE"
    );
    let alternativesClicked = false;

    console.log("Verificando as seções MULTIPLE_CHOICE.");

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
                      console.log("Alternativas corretas encontradas.");
                      correctAlternatives.forEach((li) => {
                        const checkboxInput = li.querySelector(
                          'input[type="checkbox"]'
                        );
                        if (checkboxInput) {
                          if (!li.classList.contains("clicked")) {
                            checkboxInput.click();
                            console.log(
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
                      console.log("Nenhuma alternativa correta encontrada.");
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
          console.log(
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
      console.log("Avançando para a próxima página.");
    } else {
      console.log("Botão de avanço não encontrado.");
    }
  }

  // Tava dando erro AQUIIIIIIIIIIIIIII
  async function monitorPage() {
    let attempts = 0;
    const maxAttempts = 10;

    const interval = setInterval(async () => {
      if (attempts >= maxAttempts) {
        console.log("Máximo de tentativas atingido. Encerrando.");
        clearInterval(interval);
        return;
      }

      const videoPlayed = await autoPlayVideo();
      if (videoPlayed) {
        console.log("Vídeo iniciado, aguardando.");
        await advanceToNextPage();
        return;
      }

      const multitaskClicked = await clickCorrectAlternatives();
      if (multitaskClicked) {
        console.log("Alternativas múltiplas clicadas, aguardando avanço.");
        await advanceToNextPage();
        return;
      }

      const alternativeClicked = await oneAlternative();
      if (alternativeClicked) {
        console.log("Alternativa única clicada, aguardando avanço.");
        await advanceToNextPage();
        return;
      }

      console.log("Nenhuma alternativa encontrada. Tentando avançar...");
      await advanceToNextPage();

      attempts++;
    }, 3000);
  }

  function init() {
    monitorPage();
  }

  init();
})();
