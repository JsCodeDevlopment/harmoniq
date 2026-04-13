# Harmoniq - Notas de Lançamento (Releases)

Acompanhe as últimas melhorias, correções e novas funcionalidades da plataforma Harmoniq.

## 📅 [1.4.0] - 2026-04-12 - "Foco na Performance & Limpeza Visual"

Esta atualização atende a um dos pedidos mais frequentes dos músicos que buscam uma leitura limpa durante o show, permitindo focar exclusivamente na letra e nos acordes sem distrações técnicas.

### 🚀 Novas Funcionalidades

- **Alternância de Tablaturas**: Introduzida a capacidade de ocultar ou exibir tablaturas instantaneamente. O motor do Harmoniq agora identifica blocos de tablatura (`|---`) e oferece um controle dinâmico para removê-los da visualização.
- **Botão de Ação Rápida**: Novo atalho "Ocultar Tabs" adicionado à barra utilitária principal (Desktop) e ao cabeçalho do Modo Performance (Live), facilitando ajustes rápidos sem interromper o fluxo da música.
- **Configuração Mobile**: Integrado o controle de tablaturas no menu de configurações de exibição no celular, com um interruptor (toggle) otimizado para toque.

### 🛠️ Melhorias Técnicas

- **Parser de Conteúdo Inteligente**: Refatoração do `CifraRenderer` para processar o DOM da cifra de forma seletiva, filtrando nós de texto e elementos `<span>` que contenham padrões de tablatura.
- **Estabilidade de Interface**: Resolvido problema de identificação de propriedades no cabeçalho e utilitários que causavam erros de renderização em certas navegações.

---

## 📅 [1.3.0] - 2026-04-06 - "Teclado & Interface Premium"

Esta atualização foca na expansão para músicos de teclas e em uma refinação profunda da interface para reduzir a sobrecarga visual e melhorar a performance em qualquer tela.

### 🚀 Novas Funcionalidades

- **Suporte a Teclado (Piano)**: Adicionada a opção de alternar entre o instrumento **Violão/Guitarra** e **Teclado/Piano**. O sistema agora busca e exibe automaticamente a versão específica para tecladistas do Cifra Club.
- **Tom Original Permanente**: Agora, tanto no desktop quanto no mobile, o tom original da música é exibido como um selo ao lado do seletor de transposição, servindo como referência constante.
- **Escala de Fontes de Elite**: Personalização total da leitura com 6 níveis de tamanho: **PPP (Muito Pequena)**, **PP**, **P**, **M**, **G** até **XG (Extra Grande)**.
- **Sincronização de Instrumento**: Sua preferência de instrumento agora é salva no seu perfil e sincronizada entre todos os seus dispositivos.

### 📱 Experiência de Usuário (UX/UI)

- **Barra Utilitária de Duas Linhas (Desktop)**: Redesenhada do zero para evitar transbordamentos. Organiza os comandos em camadas lógicas: Ações Core na linha superior e Configurações Detalhadas na linha inferior.
- **Mobile Minimalista**: A barra inferior no celular foi simplificada para exibir apenas o essencial para a performance: **Tom, Auto Scroll e Live**, garantindo uma interface livre de distrações.
- **Design Estendido**: Melhoria na legibilidade dos acordes e diagramas, com transições mais suaves e feedback visual aprimorado.

### 🛠️ Melhorias Técnicas

- **Crawler Inteligente**: O motor de busca foi atualizado para identificar URLs de teclado dinamicamente através de heurísticas avançadas.
- **Migração de Dados**: Atualização do esquema do banco de dados para suportar preferências de instrumentos persistentes.
- **Refatoração de Componentes**: Limpeza de código e correção de lints em `SongUtilityBar` e `SongHeader`, reduzindo a carga de renderização.

---

## 📅 [1.2.0] - 2026-04-05 - "Arquitetura Modular & Versões"

Esta atualização representa um grande salto na organização do código e na flexibilidade para o músico, permitindo escolher entre diferentes arranjos da mesma canção.

### 🚀 Novas Funcionalidades

- **Versões de Cifra**: Adicionado suporte para alternar entre a versão **Principal** e **Simplificada** com um único clique. O sistema agora identifica automaticamente quando uma versão alternativa está disponível no Cifra Club.
- **Persistência de Arranjo**: Escolhas de versão agora são salvas individualmente por música dentro dos seus repertórios. Se você prefere a versão simples de uma canção mas a principal de outra, o Harmoniq lembrará disso para você.
- **Barra Utilitária Inteligente**: Refatorada para ser ultra-compacta no mobile (layout de 2 linhas), garantindo que todos os controles de tom, visual, versão e fluxo caibam perfeitamente na tela.

### 🛠️ Melhorias Técnicas (Refatoração)

- **Componentização Total**: O componente `SongViewer` foi dividido em módulos especializados (`SongHeader`, `SongUtilityBar`, `PerformanceHeader`, `Popovers`), tornando a plataforma mais rápida e fácil de evoluir.
- **Navegação Sem Sobreposição**: Substituídos os overlays por um sistema de detecção de clique global inteligente. Menus de configurações e seleção de setlist agora fecham ao clicar em qualquer lugar da tela, garantindo um comportamento de "app nativo".
- **Tipagem Estrita**: Implementação de interfaces centralizadas para músicas e repertórios, eliminando erros de dados e garantindo maior estabilidade no carregamento das cifras.

### 📱 Ajustes Mobile (UX)

- **Layout de Grade Atômico**: Otimização dos botões da barra flutuante com labels dinâmicos e truncamento inteligente para evitar cortes de interface em dispositivos mini.
- **Ícones Dinâmicos**: Uso do ícone "Zap" para alternância rápida de versões e melhor feedback visual no estado ativo das ferramentas.

---

## 📅 [1.1.2] - 2026-04-05 - "Performance & Estabilidade"

Esta atualização atende ao feedback dos usuários que notaram lentidão durante a rolagem automática e dificuldades de navegação durante o uso prolongado.

### 🚀 Novas Funcionalidades

- **Barra de Ferramentas Fixa**: A barra de controles (tom, auto-scroll e visual) agora permanece fixa no topo da tela enquanto você navega pelos detalhes da música. Isso garante que o botão de "Pausa" e as "Shapes" estejam sempre ao alcance de um clique.
- **Scroll Inteligente**: Otimizado o motor de rolagem automática utilizando `requestAnimationFrame`. Isso elimina travamentos em navegadores de desktop, proporcionando uma rolagem fluida e leve.

### 🛠️ Melhorias de UX

- **Foco na Música**: Ao iniciar a rolagem, os controles permanecem visíveis sem sobrepor o conteúdo principal, garantindo uma experiência de leitura ininterrupta.

---

## 📅 [1.1.1] - 2026-04-05 - "Navegação de Elite"

Esta atualização atende ao feedback dos usuários que buscavam mais agilidade para alternar entre músicas e iniciar novas buscas.

### 🚀 Novas Funcionalidades

- **Botão de Início Global**: Adicionado ícone de "Home" fixo no cabeçalho das cifras para retorno instantâneo à tela de busca.
- **Navegação em Performance**: O Modo Live agora conta com atalho direto para o início, permitindo trocas rápidas de repertório sem sair da interface otimizada.
- **Recuperação de Erros**: Adicionado botão "Ir para o Início" na tela de falha de carregamento, evitando que o usuário fique "preso" em uma página de erro.

### 🛠️ Melhorias

- **UX Refinada**: Melhor organização dos botões de navegação no cabeçalho para evitar cliques acidentais em dispositivos móveis.
- **Limpeza de Código**: Removidos imports de ícones não utilizados (`Search`, `Pause`) e correção de variáveis órfãs.

---

## 📅 [1.1.0] - 2026-04-01 - "Mobile Mastery & Personalização Total"

Esta atualização foca em transformar a experiência de leitura em dispositivos móveis e dar controle total ao músico sobre como ele visualiza suas cifras.

### 🚀 Novas Funcionalidades

- **Ajustes em Tempo Real**: Adicionado menu de "Configurações de Exibição" (ícone "Aa") diretamente na página da música.
- **Ultra-Compacto**: Novas escalas de fonte **PPP (9px)** e **PP (10px)** para músicos que precisam de máxima densidade em telas pequenas.
- **Preferências para Visitantes**: Agora, mesmo usuários não logados têm suas escolhas de fonte e cor de acordes salvas no navegador (`localStorage`).
- **Navegação Dinâmica**: Melhorada a transição entre músicas dentro de um repertório, mantendo as preferências visuais.

### 📱 Experiência Mobile (UX)

- **Modal de Acordes**: O antigo popover flutuante foi substituído por um **Modal Centralizado** no mobile, garantindo que o diagrama nunca seja cortado pelas bordas da tela.
- **Backdrop Inteligente**: Fundo com desfoque (`backdrop-blur`) para focar a atenção no acorde, permitindo fechar o diálogo com um simples toque fora dele.
- **Botões Acessíveis**: Botões de ação ("Variar Acorde", "Salvar", "Cancelar") agora são maiores para facilitar o toque durante a performance.
- **Stacking Adaptativo**: No mobile, a lista de variações de acordes se empilha verticalmente para aproveitar melhor o espaço.

### 🛠️ Correções e Melhorias

- **Estabilidade Touch**: Corrigido problema onde o diálogo de acordes fechava sozinho ao tentar selecionar variações no celular.
- **Renderização de Fonte**: Substituído o sistema de classes Tailwind por **estilos inline garantidos**, resolvendo o bug onde o tamanho da fonte não mudava em certos dispositivos.
- **Propagação de Eventos**: Implementado `stopPropagation()` em todos os controles do modal para evitar comportamentos inesperados ao interagir com o conteúdo.
- **Limpeza de Build**: Removidos avisos de variáveis não utilizadas e polimento no código do `SongViewer`.

---

## 📅 [1.0.1] - 2026-03-31 - "Sincronização e Perfis"

- Implementação inicial da página de perfil.
- Sincronização de repertórios com o backend real.
- Troca de senha e edição de dados básicos.

---

## 📅 [1.0.0] - Lanzamento Inicial

- Visualizador de cifras com suporte a transposição.
- Busca integrada com o Cifra Club.
- Gestão de repertórios.
