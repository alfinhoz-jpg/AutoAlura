O script funciona dentro do navegador usando a extensão Tampermonkey ou outras que suportem UserScripts.

Funcionalidades
Reprodução automática de vídeos: Se o curso possui um vídeo, ele será reproduzido automaticamente.
Respostas automáticas para quizzes: Se houver perguntas de alternativas corretas, o script as seleciona automaticamente e avança.
Clicar nos blocos na ordem correta: Quando houver uma atividade de organização de blocos, o script os clicará na ordem correta e avançará após a conclusão.
Avanço automático para a próxima atividade: O script avança automaticamente para a próxima atividade após completar a atual, seja vídeo, quiz ou organização de blocos.
Overlay de controle: Um painel de controle sobreposto permite ativar/desativar o script e ocultar a interface.
Customização de delays: Pode-se configurar o tempo de espera entre cliques para um funcionamento mais suave.
Requisitos
Navegador: O script foi testado e funciona em navegadores como Google Chrome e Mozilla Firefox.
Extensão Tampermonkey: Certifique-se de ter a extensão Tampermonkey (ou Greasemonkey) instalada no seu navegador.
Instalação
Instalar Tampermonkey: Se ainda não o tiver, instale o Tampermonkey ou outra extensão de UserScripts no seu navegador.
Adicionar o script: No Tampermonkey, crie um novo script e cole o conteúdo do arquivo AutoAlura.user.js.
Salve o script e certifique-se de que ele esteja ativado.
Como Usar
Ativação do Script: Assim que você entrar em uma página de curso na Alura, o script será ativado automaticamente.
Controle do Script: Uma pequena overlay no canto superior direito permite que você ative ou desative o script conforme necessário.
Para ocultar a interface, pressione a tecla ´ (aspas agudas).
Navegação Automática: O script verificará automaticamente se há vídeo, quiz ou blocos na página e executará a ação correspondente.
Caso não haja vídeos, ele irá tentar responder os quizzes.
Se não houver quizzes, ele organizará os blocos na ordem correta e enviará as respostas automaticamente.
Configuração
Você pode ajustar o delay entre as interações com vídeos, quizzes e blocos alterando os valores dentro do código:

blockClickDelay: Define o tempo (em milissegundos) entre os cliques nos blocos.
submitClickDelay: Ajuste o tempo de espera entre submeter respostas e clicar em "Próxima Atividade".
Contribuições
Contribuições são bem-vindas! Se você encontrar problemas ou tiver sugestões para melhorias, sinta-se à vontade para abrir uma issue ou fazer um pull request.

Licença
Este script é de código aberto e está disponível sob a licença GNU. Consulte o arquivo LICENSE para mais detalhes.
