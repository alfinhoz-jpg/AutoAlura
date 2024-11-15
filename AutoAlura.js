// ==UserScript==
// @name         AutoAlura
// @namespace    http://tampermonkey.net/
// @version      0
// @description  Ninguem aguenta mais o alura :smile:
// @author       Alfinhoz
// @match        https://cursos.alura.com.br/*
// @license GNU GPLv3
// @icon https://i.imgur.com/gP1LZq9.png
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

  async function autoPlayVideo() {
    let video = document.querySelector("video");
    if (video) {
      video.play();
      console.log("Vídeo iniciado.");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return true; 
    }
    return false; 
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
          li.classList.add("clicked");
        }
      });
      return true; 
    }
    return false; 
  }

  async function clickMultitaskAlternatives() {
    const multitaskAlternatives = document.querySelectorAll(
      'ul.alternativeList li[data-correct="true"]'
    );

    let clicked = false;

    multitaskAlternatives.forEach((li) => {
      const checkboxInput = li.querySelector('input[type="checkbox"]');
      if (checkboxInput && !li.classList.contains("clicked")) {
        checkboxInput.click();
        console.log("Clicando na alternativa multitask correta: " + li.innerText);
        li.classList.add("clicked");
        clicked = true;
      }
    });

    return clicked;
  }

  function decodeBase64(encoded) {
    const decoded = atob(encoded);
    return decoded;
  }

  async function clickBlocksInOrder() {
    console.log("Iniciando a função clickBlocksInOrder.");
    const blocksContainer = document.querySelector(".blocks");
    if (blocksContainer) {
      const correctOrder = blocksContainer.dataset.correctOrder;
      const firstDecoding = decodeBase64(correctOrder);
      const secondDecoding = decodeBase64(firstDecoding);
      let decodedTexts = decodeURIComponent(escape(secondDecoding))
        .split(",")
        .map((text) => text.trim());
      console.log("Textos decodificados:", decodedTexts);
      let blockButtons = Array.from(blocksContainer.querySelectorAll(".block")); // Alterado para let
      console.log("Total de botões disponíveis:", blockButtons.length);

      for (const text of decodedTexts) {
        let blockButton;
        let attempts = 0;

        while (attempts < 5) {
          blockButton = blockButtons.find(
            (button) => button.textContent.trim() === text
          );
          if (blockButton && !blockButton.classList.contains("clicked")) {
            try {
              blockButton.click();
              console.log("Clicando no bloco: " + text);
              blockButton.classList.add("clicked");
              await new Promise((resolve) =>
                setTimeout(resolve, blockClickDelay)
              );
              break;
            } catch (error) {
              console.error("Erro ao clicar no bloco: ", error);
            }
          } else {
            console.log(
              "Tentativa " +
                (attempts + 1) +
                ": Botão não encontrado ou já clicado para o texto: " +
                text
            );
          }
          attempts++;
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        // Atualizar a lista de botões
        blockButtons = blockButtons.filter(
          (button) => !button.classList.contains("clicked")
        );
      }

      // Organizou os blocos, clicar para avançar
      await submitAnswer();

      // 3 Segundos para a outra atividade
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Avançar para a próxima atividade
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

  async function handlePageActivity() {
    console.log("Verificando atividade na página.");

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
        return;
      }
    }

    // Verificando uma escolha
    const alternativesClicked = clickCorrectAlternatives();
    if (alternativesClicked) {
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
        console.log("Avançando para a próxima página após clicar na alternativa correta.");
      }
      return;
    }

    // Verificando multitask
    const multitaskClicked = await clickMultitaskAlternatives();
    if (multitaskClicked) {
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
        console.log("Avançando para a próxima página após clicar na alternativa multitask.");
      }
      return;
    }
    
    await clickBlocksInOrder(); 
    
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
  }

  function monitorPage() {
    let interval = setInterval(async () => {
      if (!isScriptActive) return; 

      await handlePageActivity();
    }, 3000);
  }

  function init() {
    monitorPage();
  }

  init();
})();
