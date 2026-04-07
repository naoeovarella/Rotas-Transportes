# RotasTransportes — Documentação do Projeto

## Visão Geral

**RotasTransportes** é um aplicativo mobile desenvolvido em **React Native com Expo** que permite ao usuário planejar trajetos de transporte público de forma simples e rápida. Toda a persistência de dados é feita localmente via **AsyncStorage**, sem necessidade de banco de dados ou API externa.

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| React Native | 0.81.5 | Framework mobile |
| Expo | ~54.0.33 | Ambiente de desenvolvimento |
| React Navigation | ^7.x | Navegação entre telas |
| AsyncStorage | 2.2.0 | Persistência local de dados |
| React Context API | — | Gerenciamento de estado global |

---

## Estrutura de Pastas

```
RotasTransportes/
├── App.js                          ← Entrada do app
├── src/
│   ├── components/
│   │   └── RouteCard.js            ← Card reutilizável de rota
│   ├── context/
│   │   ├── AuthContext.js          ← Autenticação global
│   │   └── ThemeContext.js         ← Tema claro/escuro global
│   ├── navigation/
│   │   └── AppNavigator.js         ← Roteamento das telas
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   └── RegisterScreen.js
│   │   ├── home/
│   │   │   ├── HomeScreen.js
│   │   │   └── RouteDetailScreen.js
│   │   ├── favorites/
│   │   │   └── FavoritesScreen.js
│   │   ├── popular/
│   │   │   └── PopularRoutesScreen.js
│   │   └── profile/
│   │       └── ProfileScreen.js
│   └── services/
│       ├── mapsService.js          ← Geração de rotas por palavra-chave
│       └── storageService.js       ← Histórico e favoritos
```

---

## Fluxo de Navegação

```
App
├── [Não autenticado]
│   ├── LoginScreen
│   └── RegisterScreen
│
└── [Autenticado]
    ├── HomeScreen
    │   ├── → RouteDetailScreen (ao clicar em um card)
    │   ├── → PopularRoutesScreen (botão ⭐)
    │   └── → ProfileScreen (avatar no header)
    ├── ProfileScreen
    │   └── → FavoritesScreen
    └── FavoritesScreen
        └── → RouteDetailScreen
```

---

## Funcionalidades

### 1. Autenticação

- **Cadastro**: nome, e-mail, senha e confirmação de senha
- **Login**: e-mail e senha com validação
- **Sessão persistente**: usuário continua logado após fechar o app
- **Logout**: com confirmação via Alert
- Dados armazenados em AsyncStorage com a chave `@users`
- Sessão ativa armazenada com a chave `@current_user`

---

### 2. Busca de Rotas (HomeScreen)

- Usuário digita **origem** e **destino**
- O app retorna **3 opções de rota** com base em palavras-chave detectadas no texto
- Exibe loading enquanto processa
- Cada rota mostra: linha, tipo, duração, distância, horário de saída e chegada

**Palavras-chave reconhecidas:**

| Região | Exemplos de entrada |
|---|---|
| Centro | "centro", "sé", "república", "luz" |
| Paulista | "paulista", "consolação", "jardins" |
| Tatuapé | "tatuapé", "penha", "aricanduva" |
| Santana | "santana", "tucuruvi", "mandaqui" |
| Vila Olímpia | "brooklin", "berrini", "itaim" |
| Pinheiros | "pinheiros", "vila madalena" |

---

### 3. Filtro e Ordenação de Rotas

Após a busca, o usuário pode:

- **Filtrar** por tipo de transporte: `Todos` / `Metrô` / `Ônibus` / `Trem`
- **Ordenar** por: `Tempo` (menor duração) ou `Distância` (menor km)

---

### 4. Detalhe da Rota (RouteDetailScreen)

Exibe o **passo a passo completo** da rota selecionada:

- Resumo: origem, destino, duração, distância, horário de saída e chegada
- **Passo 1**: Caminhada até o ponto (tempo + distância)
- **Passo 2**: Embarque na linha (nome da linha, paradas, horário de embarque/desembarque)
- **Passo 3**: Caminhada até o destino

---

### 5. Favoritos

- Botão de **estrela (☆/★)** em cada RouteCard
- Tocar na estrela **salva ou remove** a rota dos favoritos
- Favoritos persistidos em AsyncStorage com a chave `@favorites`
- Tela dedicada **FavoritesScreen** lista todas as rotas salvas
- De lá é possível navegar para o detalhe de qualquer rota favorita

---

### 6. Histórico de Buscas

- As últimas **5 buscas** são salvas automaticamente
- Aparecem na HomeScreen como itens clicáveis
- Tocar em um item **preenche os campos** de origem e destino automaticamente
- Botão "Limpar" apaga todo o histórico
- Persistido em AsyncStorage com a chave `@search_history`

---

### 7. Rotas Populares (PopularRoutesScreen)

Lista de **9 rotas pré-definidas** para facilitar o uso:

| Rota | Tag |
|---|---|
| Estação Sé → Av. Paulista | Centro → Paulista |
| Santana → Centro | Norte → Centro |
| Vila Madalena → Pinheiros | Zona Oeste |
| Brooklin → Berrini | Vila Olímpia |
| Tatuapé → Consolação | Leste → Centro |
| Luz → República | Centro Histórico |
| USP Butantã → Av. Paulista | Universidade |
| Aeroporto Congonhas → Centro | Aeroporto |
| Hospital das Clínicas → República | Hospitais |

Tocar em uma rota leva de volta para a Home com os campos já preenchidos.

---

### 8. Perfil do Usuário (ProfileScreen)

- Exibe **avatar com iniciais**, nome completo e e-mail
- **Contador** de buscas realizadas e rotas favoritas
- Atalho para **Rotas Favoritas**
- Opção de **Limpar histórico**
- **Toggle de Tema Escuro/Claro**
- Botão de **Logout**

---

### 9. Dark Mode (Tema Escuro)

- Alternância entre tema **claro** e **escuro** via toggle no Perfil
- Preferência salva no AsyncStorage com a chave `@theme`
- **Todas as telas** adaptadas: cores de fundo, cards, inputs, textos e headers
- StatusBar adaptada automaticamente

---

### 10. Relógio ao Vivo

- Exibido no header da HomeScreen
- Atualiza a cada **1 segundo** via `setInterval`
- Mostra **hora** (HH:MM:SS) e **data** (dia da semana + dia + mês)

---

## Dados Armazenados (AsyncStorage)

| Chave | Conteúdo |
|---|---|
| `@users` | Array de todos os usuários cadastrados |
| `@current_user` | Objeto do usuário logado (sessão ativa) |
| `@search_history` | Array das últimas 5 buscas |
| `@favorites` | Array de rotas salvas como favorito |
| `@theme` | String `"light"` ou `"dark"` |

---

## Linhas de Transporte Simuladas

| Linha | Tipo | Cor |
|---|---|---|
| Linha 2 - Verde | Metrô | Verde |
| Linha 3 - Vermelha | Metrô | Vermelho |
| 8012-10 Exp. Paulista | Ônibus | Verde escuro |
| 7181-10 Centro | Ônibus | Verde escuro |
| CPTM Linha 7 - Rubi | Trem | Roxo |
| CPTM Linha 11 - Coral | Trem | Laranja |

---

## Como Rodar o Projeto

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor Expo
npx expo start

# 3. Escanear o QR Code com o app Expo Go (Android/iOS)
#    ou pressionar 'a' para abrir no emulador Android
#    ou pressionar 'i' para abrir no simulador iOS
```

---

## Decisões de Arquitetura

**Por que sem API de mapas?**
APIs de mapas como Google Maps exigem cadastro de cartão de crédito, configuração de projeto no Google Cloud Console e chave de API. Para o escopo do projeto, optou-se por dados locais realistas que simulam as linhas reais de São Paulo.

**Por que AsyncStorage e não banco de dados?**
O AsyncStorage é suficiente para os dados do app (usuários, favoritos, histórico) e elimina a necessidade de configurar um servidor ou banco de dados externo, simplificando o desenvolvimento e a execução local.

**Por que React Context API?**
O Context API é nativo do React, sem dependências extras, e resolve bem os casos de estado global do app: autenticação e tema.
