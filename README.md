# Las Hermanas — E-commerce móvil (React Native + Expo)

App móvil con catálogo por **categorías**, **carrito** con Redux Toolkit, **persistencia offline (SQLite)**, **Auth** por email/contraseña y **Firebase Realtime Database** (órdenes + ubicación). Incluye **ubicación del dispositivo** con Expo Location.

## Stack
- **Expo (React Native)**
- **React Navigation** (Stack / Bottom Tabs / Top Tabs)
- **Redux Toolkit + React-Redux**
- **SQLite** (`expo-sqlite`) para carrito offline
- **Firebase Auth** (email/password)
- **Firebase Realtime Database** (órdenes y ubicación)
- **Expo Location** (permisos + reverse geocoding)
- Fuentes: DM Serif Display + Lora

## Estructura
rc/
components/ # UI reutilizable (ProductCard, etc.)
features/
cart/ # slice de carrito
auth/ # slice de auth
location/ # slice de ubicación
products/ # mock + types
navigation/ # AppNavigator, tabs y stacks
screens/ # Welcome, Home, CategoryList, ProductDetail, Cart, Profile
services/ # firebase.ts, db.ts (SQLite), orders.ts, users.ts, location.ts
store/ # store, hooks, persistencias y listeners (AuthListener, LoadUserLocation)
theme/ # colores


## Requisitos del curso (cumplidos)
- **Navegación** (Stack + Bottom Tabs + Top Tabs por categoría)
- **Manejo de estado** (Redux Toolkit)
- **Persistencia offline** (SQLite: carrito)
- **Conexión con Firebase**
  - Auth (email/contraseña)
  - Realtime Database (órdenes + ubicación de usuario)
- **Interfaz del dispositivo**: **Ubicación** (Expo Location)
- **Documentación**: este README
- **Lista optimizada + componentes reutilizables**: `FlatList`, `ProductCard` reutilizable
- **Opcional**: build Android con EAS (abajo)

## Configuración y ejecución

### 1) Instalación
```bash
npm install
npx expo start


