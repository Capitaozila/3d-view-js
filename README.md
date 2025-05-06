# ShapeMorpher - Visualizador 3D

Uma ferramenta interativa para visualização e manipulação de formas 3D em tempo real.

## Funcionalidades

- **Seleção de Formas**: Escolha entre formas básicas como cubo, cilindro, cone e esfera.
- **Personalização**: Ajuste escala, segmentos e cores.
- **Modo Claro/Escuro**: Alterne entre os modos de exibição.

## Como Usar

1. **Seleção de Forma**:

   - Escolha uma forma no menu suspenso.
   - As formas disponíveis são: Cubo, Cilindro, Cone e Esfera.

2. **Personalização**:

   - Ajuste a escala da forma com o controle deslizante de **Escala**.
   - Modifique o número de segmentos com o controle deslizante de **Segmentos**.

3. **Personalização de Material**:

   - Escolha a cor primária da forma usando o seletor de cores.
   - Ajuste a cor de fundo da cena com o seletor de **Cor de Fundo**.

4. **Interface**:
   - Alterne entre o modo claro e escuro clicando no ícone de lua/sol.
   - Recolha ou expanda o painel de controle clicando no ícone de seta.
   - Restaure a posição da câmera ou redefina todas as configurações usando os botões de controle.

## Estrutura do Projeto

```plaintext
📦 ShapeMorpher
├── index.html               # Arquivo principal HTML
├── styles/
│   └── main.css             # Estilos principais
└── scripts/
    ├── app.js               # Lógica principal da aplicação
    └── modules/
        ├── scene.js         # Configuração da cena Three.js
        ├── shapes.js        # Funções para criação de formas 3D
        ├── materials.js     # Gerenciamento de materiais
        ├── ui.js            # Funções utilitárias para a interface
        └── descriptions.js  # Descrições das formas
```

## Pré-requisitos

- Um navegador moderno (Chrome, Firefox, Edge, etc.).
- Conexão com a internet para carregar a biblioteca Three.js.

## Como Executar

1. Clone o repositório:

2. Navegue até o diretório do projeto:
   ```bash
   cd ShapeMorpher
   ```
3. Abra o arquivo `index.html` no navegador.

## Tecnologias Utilizadas

- **Three.js**: Biblioteca para renderização 3D.
- **HTML5/CSS3**: Estrutura e estilos.
- **JavaScript**: Lógica da aplicação.
- **Font Awesome**: Ícones para a interface.

---