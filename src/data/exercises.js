import originalTexts from '../db/texts.json'

// Os textos originais foram preservados e receberam metadados para filtragem.
const originalExercises = originalTexts.map((item, index) => ({
  ...item,
  category: ['Tecnologia', 'Natureza', 'Tecnologia', 'Cotidiano'][index] ?? 'Cotidiano',
  difficulty: index === 0 ? 'intermediario' : 'iniciante',
  description: 'Texto completo para praticar ritmo, atenção e consistência.',
}))

const additionalExercises = [
  {
    id: 5,
    title: 'Aquecimento: fileira inicial',
    category: 'Fundamentos',
    difficulty: 'iniciante',
    description: 'Comece devagar e priorize a precisão dos movimentos.',
    content: 'asdf jklç asdf jklç\nA prática constante ajuda a desenvolver memória muscular.\nMantenha os ombros relaxados e os pulsos em posição confortável.',
  },
  {
    id: 6,
    title: 'Rotina de estudos',
    category: 'Cotidiano',
    difficulty: 'iniciante',
    description: 'Frases curtas para ganhar confiança ao digitar.',
    content: 'Aprender exige tempo, atenção e prática.\nOrganize suas tarefas, faça pequenas pausas e continue avançando.\nCada exercício concluído representa um novo passo.',
  },
  {
    id: 7,
    title: 'Comunicação digital',
    category: 'Tecnologia',
    difficulty: 'intermediario',
    description: 'Treine palavras variadas e pontuação.',
    content: 'Uma boa comunicação digital combina clareza, contexto e respeito.\nAntes de enviar uma mensagem, revise o conteúdo, confira os destinatários e confirme se a informação está correta.\nPequenos cuidados evitam grandes confusões.',
  },
  {
    id: 8,
    title: 'Lógica de programação',
    category: 'Programação',
    difficulty: 'intermediario',
    description: 'Vocabulário comum no desenvolvimento de software.',
    content: 'Um algoritmo descreve uma sequência finita de passos para resolver um problema.\nNa programação, variáveis armazenam valores, condições orientam decisões e laços repetem instruções.\nCódigo legível também faz parte de uma boa solução.',
  },
  {
    id: 9,
    title: 'Pontuação e símbolos',
    category: 'Fundamentos',
    difficulty: 'intermediario',
    description: 'Pratique acentos, números e sinais especiais.',
    content: 'Atenção aos detalhes: você digitou 25, 48 ou 103 caracteres?\nTeste sinais como ponto final, vírgula, dois-pontos e ponto e vírgula.\nTambém pratique: @, #, %, &, ?, ! e parênteses ( ).',
  },
  {
    id: 10,
    title: 'Código limpo',
    category: 'Programação',
    difficulty: 'avancado',
    description: 'Trecho textual com termos técnicos e maior extensão.',
    content: 'Código limpo não depende de fórmulas mágicas: ele nasce de decisões consistentes.\nUse nomes claros, funções pequenas e responsabilidades bem definidas. Evite duplicação, valide entradas e trate falhas de maneira previsível.\nUma implementação sustentável deve ser compreensível para quem a criou e para quem dará manutenção depois.',
  },
  {
    id: 11,
    title: 'Pensamento crítico',
    category: 'Cotidiano',
    difficulty: 'avancado',
    description: 'Treine períodos longos mantendo o ritmo.',
    content: 'Pensar criticamente significa analisar informações, identificar pressupostos e avaliar evidências antes de chegar a uma conclusão.\nEm vez de aceitar a primeira resposta, procure compreender o problema, comparar possibilidades e reconhecer limites.\nA qualidade de uma decisão melhora quando curiosidade e responsabilidade caminham juntas.',
  },
  {
    id: 12,
    title: 'Tecnologia e sociedade',
    category: 'Tecnologia',
    difficulty: 'avancado',
    description: 'Um desafio mais longo para consolidar velocidade e precisão.',
    content: 'A tecnologia amplia possibilidades, mas seu impacto depende das escolhas humanas. Sistemas acessíveis podem facilitar serviços, aproximar pessoas e democratizar o conhecimento; por outro lado, decisões automatizadas exigem transparência, segurança e responsabilidade.\nDesenvolver soluções úteis envolve ouvir usuários, testar hipóteses e considerar diferentes realidades. O melhor produto não é necessariamente o mais complexo, mas aquele que resolve um problema de forma confiável.',
  },
  {
    id: 13,
    title: 'Cuidado com o ambiente',
    category: 'Natureza',
    difficulty: 'intermediario',
    description: 'Pratique textos de tamanho médio com vocabulário variado.',
    content: `Preservar os recursos naturais depende de escolhas individuais e coletivas.
Reduzir o desperdício, reutilizar materiais e planejar o consumo são atitudes que ajudam a diminuir impactos ambientais.
A mudança acontece quando bons hábitos se tornam parte da rotina.`,
  },
  {
    id: 14,
    title: 'Equilíbrio dos ecossistemas',
    category: 'Natureza',
    difficulty: 'avancado',
    description: 'Desafio de leitura contínua com frases mais extensas.',
    content: `Os ecossistemas funcionam por meio de relações complexas entre seres vivos e elementos não vivos. A disponibilidade de água, luz e nutrientes influencia a distribuição das espécies, enquanto alterações no clima e no uso do solo podem modificar esse equilíbrio.
Compreender essas conexões é essencial para planejar ações de conservação, recuperar áreas degradadas e utilizar recursos naturais de maneira responsável.`,
  },
  {
    id: 15,
    title: 'Organização pessoal',
    category: 'Cotidiano',
    difficulty: 'intermediario',
    description: 'Treine acentuação e frases de extensão intermediária.',
    content: `Uma rotina organizada não precisa ser rígida. Defina prioridades, reserve períodos para tarefas importantes e mantenha espaço para imprevistos.
Ao revisar seus planos, observe o que funcionou e ajuste o que for necessário. Pequenas melhorias, repetidas com frequência, podem gerar bons resultados.`,
  },
  {
    id: 16,
    title: 'Primeiros passos no código',
    category: 'Programação',
    difficulty: 'iniciante',
    description: 'Vocabulário inicial para quem está aprendendo programação.',
    content: `Todo programa começa com um objetivo.
Escreva uma instrução, execute o código e observe o resultado.
Quando algo não funcionar, leia a mensagem de erro e tente novamente.`,
  },

  {
    id: 17,
    title: 'Símbolos e combinações',
    category: 'Fundamentos',
    difficulty: 'avancado',
    description: 'Desafio avançado de números, pontuação e caracteres especiais.',
    content: `Em um relatório, registre: total = 128; taxa = 7,5%; status = "em análise".
Confira também os símbolos: @, #, $, %, &, *, +, =, / e ?.
Atenção à sequência, aos espaços e à acentuação: ação, frequência, usuário e precisão.`,
  },
]

export const exercises = [...originalExercises, ...additionalExercises]

export const categories = [
  'Todas',
  'Fundamentos',
  'Cotidiano',
  'Tecnologia',
  'Natureza',
  'Programação',
]

export const levels = [
  { value: 'todos', label: 'Todos os níveis' },
  { value: 'iniciante', label: 'Iniciante' },
  { value: 'intermediario', label: 'Intermediário' },
  { value: 'avancado', label: 'Avançado' },
]

export const levelLabels = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
}
