# Usar REACH Content Studio en la MacBook

Guía para Ariel. La app funciona en la propia Mac (no hay enlace en internet). El calendario, los carruseles y las
imágenes viajan con el repositorio de GitHub (carpeta `data/`).

## Antes de empezar

- Acepta la invitación como colaboradora: https://github.com/jsansi/reach-content-studio/invitations
  (o desde el correo de GitHub). Sin eso puedes descargar, pero no subir cambios.

## Instalación (una sola vez)

1. Instala **Node 24 o más reciente** desde https://nodejs.org (versión "Current").
2. Abre **Terminal**. Si macOS pide instalar las herramientas de desarrollador para `git`, acepta.
3. Copia y pega:

   ```
   git clone https://github.com/jsansi/reach-content-studio.git
   cd reach-content-studio
   npm install && npx playwright install chromium
   ```

## Cada vez que vayas a trabajar

1. En Terminal:

   ```
   cd reach-content-studio
   git pull
   npm start
   ```

2. Abre **http://localhost:4600** en el navegador.

## Al terminar

1. En la Terminal donde corre la app, presiona **Ctrl + C** para cerrarla.
2. Sube los cambios:

   ```
   git add -A && git commit -m "Datos: avances" && git push
   ```

## Importante

- **Trabajen en una sola computadora a la vez.** La base de datos (`data/studio.db`) es un archivo único; Git no puede
  combinar cambios hechos en dos computadoras al mismo tiempo. Siempre `git pull` al empezar y `git push` al terminar.
- Si `git pull` da un conflicto, no lo resuelvas a mano: avísale a Jaime.
- La generación con IA queda en modo manual (Claude Code), igual que en la PC de Jaime.
