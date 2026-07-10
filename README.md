# My Travel Tracker 🗺️✈️

Una aplicación web personal construida con **Next.js** para llevar un registro visual y detallado de los lugares que he visitado.

Esta es la **Versión 1.0**, diseñada para funcionar de manera local, almacenando los datos en un archivo JSON en el disco duro mediante las API Routes de Next.js, preparando el terreno para una futura migración a bases de datos en la nube.

## 🌟 Características Principales

- **Mapa Interactivo:** Integración con Leaflet para visualizar todos los lugares visitados con pines personalizados.
- **Captura de Coordenadas:** Al hacer clic en cualquier lugar del mapa, el formulario de registro se abre con la latitud y longitud pre-llenadas.
- **Navegación Sincronizada:** Al hacer clic en un destino desde la lista lateral, el mapa hace una animación (_flyTo_) hacia el lugar exacto y despliega las notas guardadas.
- **Gestión Completa (CRUD):** Capacidad de agregar nuevos destinos, editar notas, corregir fechas o eliminar registros.
- **Almacenamiento Local:** Los datos persisten en un archivo local (`places.json`) gestionado por un backend integrado en el mismo proyecto.

## 🛠️ Tecnologías Utilizadas

- **Framework:** Next.js (App Router)
- **Librería UI:** React 18
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Mapas:** Leaflet y `react-leaflet`

## Screenshots

### Vista Principal

![image-1](public/image-1.png)

### Vista de Edición

![image-2](public/image-2.png)

### Vista popup

![image-3](public/image-3.png)
