# Harmoniq - Notas de Lançamento (Releases)

Acompanhe as últimas melhorias, correções e novas funcionalidades da plataforma Harmoniq.

## 📅 [1.6.0] - 2026-04-26 - "Identidade Visual & Compactação Extrema"
 
Esta atualização traz um novo nível de profissionalismo visual com a introdução de fotos de artistas e um sistema de versões expandido, além de uma otimização radical de espaço na interface desktop.

### 🚀 Novas Funcionalidades

- **Suporte Total a Múltiplas Versões**: Agora o Harmoniq identifica e permite alternar entre **todas** as versões de uma música disponíveis no Cifra Club (Principal, Simplificada, Versão 3, 4, etc.). O menu "Mais..." inteligente organiza as versões secundárias de forma limpa.
- **Identidade Visual (Foto de Perfil)**: Integrada a foto oficial do artista no cabeçalho da música. O avatar circular premium com sombra suave traz uma experiência mais imersiva e profissional.
- **Barra de Utilidades Ultra-Compacta**: Redesenho total da barra de ferramentas desktop para maximizar a área de leitura. Redução de ~40% na altura total através de tipografia densa e espaçamentos atômicos.
- **Scroll Dinâmico no Mobile**: Reintrodução do botão de "Auto Scroll" na linha principal da barra mobile, atendendo ao pedido de músicos que precisam de acesso rápido durante a performance.

### 🛠️ Melhorias Técnicas

- **Scraper de Versões (V3)**: Backend reescrito para limpar metadados concatenados (dificuldade, visualizações, contribuidores) dos links do Cifra Club, entregando nomes padronizados como "Versao-3".
- **Otimização de Espaço (UI)**: Migração para escalas de `8.5px` e `9px` na barra de utilidades, utilizando grids de 2 linhas otimizadas para evitar sobreposição de elementos.
- **Robustez de Dados**: Atualização do DTO de músicas para suportar campos de imagem e múltiplas versões de forma tipada e segura.

---

 ## 📅 [1.5.0] - 2026-04-20 - "Descoberta Musical & Experiência Imersiva"

Esta atualização introduz o motor de recomendações "Toque Também", transformando o Harmoniq em uma ferramenta não apenas de leitura, mas de descoberta para músicos.

### 🚀 Novas Funcionalidades

- **Toque Também (Recomendações)**: Implementação de um motor de sugestões curadas que exibe músicas relacionadas por gênero e estilo. O visual é inspirado em playlists de elite, com fotos de artistas em formato circular e tipografia minimalista.
- **Visualização de Artista Premium**: As fotos dos artistas agora são tratadas com filtros de escala e cor dinâmicos, proporcionando um feedback visual luxuoso durante a navegação.
- **Tratamento de Fallbacks**: Sistema inteligente de imagens que detecta fotos corrompidas ou inexistentes e as substitui automaticamente por placeholders oficiais do Cifra Club.

### 🎨 Design & Experiência "Sensational" (Landing Page Overhaul)

- **Experiência Visual de Elite**: Transformação completa da Landing Page para uma estética premium e minimalista. Cada sessão foi repaginada para oferecer um visual "sensational" que mistura editorial moderno com alta tecnologia.
- **Hero Aceternity-Inspired**: Implementação de efeitos de iluminação avançados (`Spotlight` e `BackgroundBeams`) com física de mola que reagem ao mouse, criando um ambiente imersivo e luxuoso desde o primeiro contato.
- **Showcase de Performance**: Novo design da sessão de interface com mockups flutuantes em fundo claro (`bg-zinc-50`), utilizando anotações em **glassmorphism** para destacar o Modo Performance.
- **Stats Dinâmicos (Counter-Up)**: Implementação de contadores numéricos reais que animam do zero ao valor final com suavidade, fornecendo dados precisos sobre o catálogo e a performance da plataforma.
- **Trending Cards Pro**: Componentização da sessão de tendências com cards em glassmorphism, micro-interações de play no hover e tipografia de alto impacto.
- **Navegação Mobile Premium**: O menu mobile foi redesenhado para garantir paridade total com o desktop, permitindo acesso rápido a "Meus Repertórios" e autenticação com design de pílula pulsante.

### 📱 Experiência App (Full PWA Support)

- **Harmoniq Mobile App**: A plataforma agora é um **PWA (Progressive Web App)** completo. Os usuários podem instalar o Harmoniq diretamente em seus smartphones (iOS e Android), transformando o site em um aplicativo nativo com splash screen e sem barras de navegação.
- **Smart Install Toast**: Implementado um sistema de convite para instalação inteligente no canto inferior esquerdo. O aviso é resiliente: se ignorado, ele utiliza persistência via cookies para reaparecer apenas após **7 dias**, mantendo a interface limpa.
- **Branding Unificado**: Substituição total de ícones genéricos pelo **Logo Oficial do Harmoniq** em toda a interface (Navbar, Footer, CTA e Manifest), garantindo uma experiência de marca coesa do browser à tela inicial do celular.

### 🛠️ Melhorias Técnicas

- **Scraper de Elite (V2)**: O crawler do backend foi totalmente reescrito para identificar com precisão a estrutura `.playToo` do Cifra Club, permitindo extrair dados mais variados e em alta resolução.
- **Otimização com Next.js Image**: Migração total das miniaturas de recomendações para o componente `<Image />` do Next.js. Isso garante carregamento sob demanda, compressão automática e melhor performance no mobile.
- **Configuração de Domínios Remotos**: Atualização do `next.config.ts` para suportar nativamente os domínios de mídia do Cifra Club (`sscdn.co`, `studiosol.com.br`), permitindo processamento de imagens externas com segurança.

---

## 📅 [1.4.0] - 2026-04-12

Esta atualização atende a um dos pedidos mais frequentes dos músicos que buscam uma leitura limpa durante o show, permitindo focar exclusivamente na letra e nos acordes sem distrações técnicas.

### 🚀 Novas Funcionalidades

- **Alternância de Tablaturas**: Introduzida a capacidade de ocultar ou exibir tablaturas instantaneamente. O motor do Harmoniq agora identifica blocos de tablatura (`|---`) e oferece um controle dinâmico para removê-los da visualização.
- **Shapes no Mobile**: Integrada a opção de ativar/desativar os diagramas de acordes (Shapes) diretamente no menu de configurações mobile, garantindo controle total em telas pequenas.
- **Paleta de Cores Expandida**: A barra utilitária desktop agora exibe todas as 5 variações de cores premium para os acordes, garantindo paridade visual com o menu de configurações.
- **Modo Palco Inteligente**: O cabeçalho no Modo Performance agora utiliza detecção de presença. Ele aparece ao tocar na tela ou mover o mouse e se oculta automaticamente após 3 segundos de inatividade, garantindo imersão total sem perder o botão de "Sair".

### 🛠️ Melhorias Técnicas

- **Parser de Conteúdo Inteligente**: Refatoração do `CifraRenderer` para processar o DOM da cifra de forma seletiva, filtrando nós de texto e elementos `<span>` que contenham padrões de tablatura.
- **UX de Navegação**: Implementação de listeners globais de interação (`mousemove`, `touchstart`, `mousedown`) para controle de visibilidade da interface em modos de alta imersão.
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
