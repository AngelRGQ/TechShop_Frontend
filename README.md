# TechShop - Frontend (angular-tailwind-main)

Sistema de gestión de pedidos para la empresa TechShop.

## Tecnologías
- **Angular 17+** (Arquitectura basada en Módulos)
- **TypeScript**
- **Tailwind CSS**

## Estructura de Directorios

El proyecto sigue una estructura modular estricta dentro de `angular-tailwind-main/src/app`:

- `core/`: Servicios, guards e interceptores globales.
- `modules/`: Funcionalidades por roles. Cada carpeta incluye su `.module.ts` y `.routing-module.ts`.
  - Ejemplo: `modules/mi-perfil/cambiar-contrasena/` (Componente hijo).
- `shared/components/`: Componentes comunes como `barra-carga`.
- `assets/`: Imágenes, iconos y recursos estáticos.

## Instalación

1. Clonar el repositorio y entrar en la carpeta:
   ```bash
   cd angular-tailwind-main
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar servidor de desarrollo:
   ```bash
   ng serve
   ```

## Notas de Desarrollo
Al crear nuevos componentes, asegúrese de usar el flag `--standalone false` para mantener la consistencia con el sistema de módulos definido.