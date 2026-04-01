# Harmoniq - Notas de Lançamento (Releases)

Acompanhe as últimas melhorias, correções e novas funcionalidades da plataforma Harmoniq.

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
