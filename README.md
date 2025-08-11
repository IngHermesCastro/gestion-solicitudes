# 🎯 Gestión de Solicitudes de Soporte
### Frontend Angular 19 + Backend Firebase Functions

[![Angular](https://img.shields.io/badge/Angular-19-red?style=flat&logo=angular)](https://angular.io/)
[![Firebase](https://img.shields.io/badge/Firebase-Functions-orange?style=flat&logo=firebase)](https://firebase.google.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat&logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)

---

## 📋 Descripción

Este proyecto es una **aplicación web para gestión de solicitudes de soporte** que incluye:
- **Frontend**: Angular 19 con interfaz moderna y responsiva
- **Backend**: Firebase Functions (ya desplegado en la nube)
- **Base de datos**: Firestore
- **Autenticación**: Firebase Auth
- **Inteligencia Artificial**: Para las respuestas a las solicitudes de soporte, el sistema utiliza la API de Gemini para generar el contenido automáticamente.
- **Dashboard de Soporte**: El administrador puede listar todas las solicitudes, modificarlas y enviar por correo electrónico las respuestas actualizadas.



> **Nota importante:** El backend ya está desplegado y funcionando en Firebase Cloud Functions, por lo que **solo necesitas configurar el frontend** para comenzar a trabajar.

---

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

| Herramienta | Versión Mínima | Comando de Instalación |
|-------------|----------------|------------------------|
| **Node.js** | v18+ (LTS recomendado) | [Descargar aquí](https://nodejs.org/) |
| **Angular CLI** | v19+ | `npm install -g @angular/cli` |
| **Git** | Cualquier versión | [Descargar aquí](https://git-scm.com/) |

### Verificar instalaciones:
```bash
node --version    # Debe mostrar v18 o superior
ng version        # Debe mostrar Angular CLI v19+
git --version     # Verificar que Git esté instalado


```
## 🚀 Instalación y Configuración
Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/IngHermesCastro/gestion-solicitudes.git

cd gestion-solicitudes
```
Paso 2: Instalar Dependencias
```bash
npm install
```
Paso 3: Instalar Angular CLI
```bash
npm install -g @angular/cli
```
Paso 4: Iniciar el Servidor de Desarrollo
```bash
ng serve
```
Paso 5: Abrir la Aplicación en tu navegador
```bash
Abre tu navegador y ve a: http://localhost:4200
La aplicación se recargará automáticamente cuando hagas cambios en el código
```
