# Bexo Pet 🐾

Mascota virtual gamificada para Bexo Wallet con integración de XO Connect.

## 🎮 Características

- ✅ Mascota pixel art personalizable con skins
- ✅ Escenarios modulares y decoraciones
- ✅ Doble sistema de puntos (Balance × 5 e Intereses de Staking)
- ✅ Integración real con XO Connect SDK
- ✅ 100% frontend, sin backend
- ✅ Compatible con Ethereum, Polygon y BSC
- ✅ Persistencia local con IndexedDB

## 🚀 Demo Live

**Development:** http://localhost:3000

## 🛠️ Desarrollo

### Instalación

```bash
npm install
```

### Variables de Entorno

Crear `.env.production`:

```bash
VITE_ETH_RPC=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
VITE_POLYGON_RPC=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
VITE_BSC_RPC=https://bsc-dataseed.binance.org
```

### Ejecutar en Desarrollo

```bash
npm run dev
```

Abre `http://localhost:3000` en tu navegador.

### Build de Producción

```bash
npm run build
npm run preview
```

## 🧪 Testing

```bash
npm test
```

## 📦 Deploy a GitHub Pages

El deploy es automático al hacer push a `main` vía GitHub Actions.

### Configuración Manual:

1. Settings → Pages → Source: GitHub Actions
2. Settings → Secrets → Add:
   - `VITE_ETH_RPC`
   - `VITE_POLYGON_RPC`
   - `VITE_BSC_RPC`

## 🔌 XO Connect Integration

Este proyecto utiliza XO Connect SDK para la integración con Bexo Wallet:

- `eth_requestAccounts` - Conexión de wallet
- `eth_getBalance` - Obtener balance
- `eth_chainId` - Obtener red actual
- Eventos EIP-1193: `accountsChanged`, `chainChanged`

Documentación: [https://xo-connect.xolabs.io/](https://xo-connect.xolabs.io/)

## 📄 Licencia

MIT
