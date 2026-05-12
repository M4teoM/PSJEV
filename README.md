# TestPasarelaEV

Portal web para el conjunto residencial Parques de San Jeronimo, con una landing principal y un modulo de pagos para recarga de vehiculos electricos usando Wompi (sandbox).

## Objetivo

Este proyecto prototipa un flujo de recarga para residentes:

1. Inicio de sesion con credenciales protegidas en archivos de configuracion.
2. Ingreso de monto de recarga.
3. Apertura del widget oficial de Wompi para procesar el pago.
4. Visualizacion de resultado de transaccion y panel administrativo.

## Estructura del proyecto

```
TestPasarelaEV/
├── backend/            # API Node.js (Express)
├── frontend/           # App React (Vite + Tailwind)
├── index.html          # Landing principal (Legacy/Static)
├── js/
│   ├── config.js       # Configuracion Vanilla JS
│   └── app.js          # Logica Vanilla JS
└── pages/
    └── pagos.html      # Vista de pagos Vanilla JS
```

## Requisitos

- Node.js y npm instalados.
- Navegador moderno.
- Conexion a internet.

## Como ejecutar en local

### 1. Backend (API)
Desde la raiz:
```bash
cd backend
npm install   # Solo la primera vez
npm run dev
```
El servidor correra en: http://localhost:3001

### 2. Frontend (React)
Desde la raiz:
```bash
cd frontend
npm install   # Solo la primera vez
npm run dev
```
La app correra en: http://localhost:5173

### 3. Landing Page (Static)
Puedes usar cualquier servidor estatico (como el que ya tienes):
```bash
python3 -m http.server 5500
```

## Configuracion de Credenciales (IMPORTANTE)

Para que el proyecto funcione correctamente, debes configurar los archivos de entorno:

### Backend
1. Copia `backend/.env.example` a `backend/.env`.
2. Inserta tus llaves de Wompi y define los usuarios de prueba.

### Frontend
1. Copia `frontend/.env.example` a `frontend/.env`.
2. Inserta tu `VITE_WOMPI_PUBLIC_KEY` y `VITE_WOMPI_INTEGRITY_SECRET`.

### Vanilla JS (Legacy)
1. Copia `js/config.example.js` a `js/config.js`.
2. Los usuarios y llaves se gestionan dentro de este archivo.

## Credenciales de prueba (Default)

- **Admin**: `admin / admin` (Habilita panel de estadisticas).
- **Usuario**: `usuario / usuario` (Flujo normal de recarga).

## Seguridad

- Todas las llaves y secretos estan fuera del control de versiones (incluidos en `.gitignore`).
- En produccion, la firma de integridad **siempre** debe calcularse en el backend.
- Los archivos `.env.example` sirven como guia para nuevos despliegues.
