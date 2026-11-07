# keyflow
KeyFlow — Treinamento de Digitação
Aplicação web para praticar digitação, acompanhar velocidade (PPM), precisão e erros, realizar testes cronometrados e consultar o histórico de desempenho.
Tecnologias
- React 18
- JavaScript (ES Modules)
- CSS3 e CSS Modules para encapsulamento dos estilos dos componentes
- Vite 5
- localStorage para persistência local das sessões e da meta de velocidade
Não há dependências de runtime além de React e React DOM.
Requisitos
- Node.js 20 ou superior (o projeto foi configurado e validado para Node.js 22)
- npm
Instalação e execução
Clone o repositório e acesse a pasta do projeto:
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
cd SEU-REPOSITORIO
Instale as dependências e inicie o servidor de desenvolvimento:
npm install / npm run dev
O Vite exibirá o endereço local, normalmente http://localhost:5173.
Scripts disponíveis
Comando	Descrição
npm run dev	Inicia o servidor de desenvolvimento.
npm run build	Gera a versão de produção na pasta dist/.
npm run preview	Executa uma prévia local da versão de produção.
npm run lint	Analisa o código com ESLint.
npm test	Executa os testes automatizados das funções de cálculo.


Antes de publicar, execute:
npm run lint / npm test / npm run build
