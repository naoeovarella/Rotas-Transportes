# RotasTransportes — Documento de Progresso

## Status geral: 30% concluído

---

## O que foi implementado (30%)

### 1. Dependências instaladas
- `@react-navigation/native` + `@react-navigation/native-stack` — navegação entre telas
- `react-native-screens` + `react-native-safe-area-context` — suporte à navegação
- `@react-native-async-storage/async-storage` — persistência local dos usuários

### 2. Estrutura de pastas criada
```
src/
  context/
    AuthContext.js        ← gerenciamento de autenticação
  navigation/
    AppNavigator.js       ← roteamento das telas
  screens/
    auth/
      LoginScreen.js      ← tela de login
      RegisterScreen.js   ← tela de cadastro
    home/
      HomeScreen.js       ← tela principal
  components/             ← pasta reservada para componentes reutilizáveis
```

### 3. AuthContext (`src/context/AuthContext.js`)
- Armazena usuários localmente no AsyncStorage (`@users`)
- Persiste sessão do usuário logado (`@current_user`)
- Funções disponíveis via hook `useAuth()`:
  - `register(name, email, password)` — cadastra novo usuário
  - `login(email, password)` — autentica usuário existente
  - `logout()` — encerra sessão

### 4. AppNavigator (`src/navigation/AppNavigator.js`)
- Fluxo de autenticação: se `user === null` → telas de Login/Register; se autenticado → Home
- Exibe loading enquanto verifica sessão salva

### 5. LoginScreen (`src/screens/auth/LoginScreen.js`)
- Campos: E-mail, Senha
- Validação básica dos campos
- Link para tela de cadastro

### 6. RegisterScreen (`src/screens/auth/RegisterScreen.js`)
- Campos: Nome completo, E-mail, Senha, Confirmar Senha
- Validação: campos obrigatórios, senhas iguais, mínimo 6 caracteres
- Link para voltar ao login

### 7. HomeScreen (`src/screens/home/HomeScreen.js`)
- Header com nome do usuário e botão de logout
- Campo "Localização atual" (origem)
- Campo "Destino"
- Botão "Buscar Rotas"
- Cards de rotas **simulados** (dados fictícios) como placeholder visual
- Banner amarelo indicando que os dados são simulados

---

## O que NÃO foi implementado (70% restante)

### Próximo passo: Serviço Google Maps
**Arquivo a criar:** `src/services/mapsService.js`

```js
// Estrutura esperada:
export async function fetchRoutes(origin, destination) {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=transit&language=pt-BR&key=SUA_CHAVE_AQUI`;
  const response = await fetch(url);
  const data = await response.json();
  // processar data.routes e retornar lista formatada
}
```

**Chave necessária:** Ativar "Directions API" e "Maps SDK for Android/iOS" no Google Cloud Console.

---

### Checklist dos 70% restantes

- [ ] **Obter chave da Google Maps API** (Google Cloud Console → Directions API + Maps SDK)
- [ ] **Criar `src/services/mapsService.js`** — chamada real à Directions API com mode=transit
- [ ] **Conectar HomeScreen ao mapsService** — substituir os placeholders na função `handleSearch()`
- [ ] **Instalar `react-native-maps`** — `npx expo install react-native-maps`
- [ ] **Criar `src/screens/home/RouteDetailScreen.js`** — tela de detalhe de uma rota selecionada com:
  - Mapa com polyline do trajeto
  - Pontos de embarque/desembarque marcados
  - Lista de passos (walking + transit)
- [ ] **Criar `src/components/RouteCard.js`** — componente real de card de rota com dados da API
- [ ] **Adicionar navegação** para RouteDetailScreen ao pressionar um card de rota
- [ ] **Exibir horários previstos** dos transportes (campo `departure_time` e `arrival_time` da API)
- [ ] **Tratar erros de API** (sem conexão, localização inválida, sem rotas disponíveis)

---

## De onde continuar

Abra `src/screens/home/HomeScreen.js` e localize o comentário:
```js
// TODO (70%): Chamar mapsService.fetchRoutes(origin, destination)
```

Esse é o ponto de entrada para integrar a API real. Implemente o `mapsService.js` primeiro,
depois substitua os `RouteCardPlaceholder` pelos dados reais.

---

## Como rodar o projeto

```bash
npx expo start
```
Escanear o QR Code com o app **Expo Go** (Android/iOS) ou usar emulador.
