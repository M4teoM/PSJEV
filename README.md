# TestPasarelaEV

Portal web para el conjunto residencial Parques de San Jeronimo, con una landing principal y un modulo de pagos para recarga de vehiculos electricos usando Wompi (sandbox).

## Objetivo

Este proyecto prototipa un flujo de recarga para residentes:

1. Inicio de sesion con una base de datos simulada en archivo de texto.
2. Ingreso de monto de recarga.
3. Apertura del widget oficial de Wompi para procesar el pago.
4. Visualizacion de resultado de transaccion y panel administrativo basico.

## Caracteristicas principales

- Landing page institucional del conjunto.
- Navegacion con menu responsive y dropdown para modulos de pago.
- Login de residentes con lectura de credenciales desde `data/usuarios.txt`.
- Flujo de recarga con validacion de monto minimo (COP 2.000).
- Integracion con Wompi Checkout Widget (sandbox).
- Generacion de referencia unica por transaccion.
- Calculo de firma de integridad SHA-256:
  - Usa Web Crypto API cuando esta disponible.
  - Incluye fallback SHA-256 en JavaScript puro para contextos sin `crypto.subtle`.
- Panel admin con metricas y graficas (Chart.js) cuando inicia sesion el usuario `admin`.

## Estructura del proyecto

```
TestPasarelaEV/
├── index.html              # Landing principal
├── css/
│   └── styles.css          # Estilos de landing y modulo de pagos
├── data/
│   └── usuarios.txt        # Credenciales simuladas (usuario,contrasena)
├── img/
│   └── PSJ.png             # Recursos graficos
├── js/
│   ├── config.js           # Llaves sandbox Wompi
│   └── app.js              # Logica de login, recarga y graficas
└── pages/
    └── pagos.html          # Vista de login, recarga y panel admin
```

## Tecnologias usadas

- HTML5
- CSS3
- JavaScript (vanilla)
- Wompi Checkout Widget
- Chart.js

## Requisitos

- Navegador moderno (Chrome, Edge, Firefox, Safari).
- Conexion a internet (para cargar Widget Wompi, Chart.js y Google Fonts).
- Servidor local HTTP para evitar restricciones de `fetch` y cargar `data/usuarios.txt`.

## Como ejecutar en local

Desde la raiz del proyecto:

```bash
cd /Users/josemadrigal/Downloads/TestPasarelaEV
python3 -m http.server 5500
```

Luego abre en el navegador:

- Home: http://localhost:5500/
- Pagos: http://localhost:5500/pages/pagos.html

## Credenciales de prueba

Archivo: `data/usuarios.txt`

- `admin,admin`
- `usuario,usuario`

Comportamiento:

- `admin`: habilita panel de estadisticas con graficas.
- `usuario`: usa el flujo normal de recarga.

## Flujo de pago (sandbox)

1. Iniciar sesion en `pages/pagos.html`.
2. Seleccionar cargador.
3. Ingresar monto (>= 2000 COP).
4. Confirmar monto para abrir widget Wompi.
5. Completar pago con tarjetas de prueba del entorno sandbox.
6. Revisar mensaje de resultado en pantalla.

Tarjetas de prueba visibles en UI:

- `4242 4242 4242 4242` (aprobada)
- `4111 1111 1111 1111` (rechazada)

## Configuracion Wompi

Las credenciales se encuentran en `js/config.js`:

- `LLAVE_PUBLICA_WOMPI`
- `SECRETO_INTEGRIDAD_WOMPI`

Para pruebas, usar credenciales sandbox de Wompi.

## Seguridad y consideraciones

Este proyecto es un prototipo de frontend.

- La firma de integridad se calcula en cliente para demo.
- En produccion, la firma debe calcularse en backend para no exponer secretos.
- `data/usuarios.txt` simula una base de datos y no es apto para produccion.
- El control de acceso actual es solo para demostracion.

## Proximos pasos recomendados

- Mover autenticacion y validaciones a backend.
- Proteger credenciales y secretos con variables de entorno.
- Persistir transacciones en base de datos real.
- Integrar webhook de Wompi para confirmar estado real de pagos.
- Implementar pruebas automatizadas (unitarias y de integracion).

## Estado

Proyecto funcional como demo de integracion inicial de pagos y estructura de paginas.
