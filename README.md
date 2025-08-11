# 🗺️ La Geográfica - Live Tracking

Sistema de tracking en tiempo real para delivery con análisis espacial termonuclear.

## 🚀 Características

- **Mapa en tiempo real** con rutas optimizadas por pgRouting + OpenStreetMap
- **Rider animado** siguiendo la ruta real metro por metro
- **Auto-actualización** desde n8n webhook
- **Diseño limpio** estilo Strava/Waze sin distracciones
- **Auto-limpieza** retorna a vista CABA después de 10 minutos
- **Deduplicación inteligente** de coordenadas con algoritmo Nearest Neighbor

## 📁 Estructura

```
├── index.html                 # Frontend principal
├── assets/
│   └── logo-geografica.png   # Logo de La Geográfica
├── api/
│   └── webhook-tracking.js   # Endpoint para recibir data de n8n
└── vercel.json               # Configuración de deploy
```

## 🛠️ Setup

### 1. Clonar y configurar
```bash
git clone https://github.com/tu-usuario/la-geografica-tracking.git
cd la-geografica-tracking
```

### 2. Agregar logo
- Colocar el logo en `assets/logo-geografica.png`
- Formato: PNG transparente, máximo 200x200px

### 3. Deploy en Vercel
```bash
# Conectar repo a Vercel
# URL automática: https://la-geografica-tracking.vercel.app
```

## 🔗 Integración n8n

### Configurar webhook en n8n:
```
HTTP Request Node:
- Method: POST
- URL: https://tu-web.vercel.app/webhook-tracking
- Headers: Content-Type: application/json
- Body: {{ $json }}
```

### Formato de data esperado:
```json
[{
  "ruta_calculada": {
    "tienda": {
      "lat": -34.56077965377718,
      "lon": -58.461592938922614,
      "nombre": "La Geográfica",
      "direccion": "Blanco Encalada 2680, CABA"
    },
    "cliente": {
      "lat": -34.5668707,
      "lon": -58.4623573,
      "nombre": "Marco Tero",
      "direccion": "Echeverria 3096"
    },
    "ruta": {
      "tiempo_calculado_minutos": 3.3,
      "coordenadas_array": [
        [-58.461592938922614, -34.56077965377718],
        [-58.4626763, -34.5599313],
        // ... más coordenadas
      ]
    }
  },
  "rider": {
    "nombre": "Carlos Delivery"
  },
  "eta_minutos": 3
}]
```

## 🎯 Funcionamiento

1. **Estado inicial:** Mapa centrado en CABA esperando data
2. **Recibe data:** n8n envía POST con tracking completo
3. **Procesamiento:** Deduplicación + reordenamiento por cercanía
4. **Visualización:** Zoom automático + rider animado
5. **Auto-limpieza:** Vuelve a estado inicial en 10 minutos

## 🛣️ Tecnologías

- **Frontend:** HTML5 + Leaflet.js + CartoDB tiles
- **Backend:** Vercel Serverless Functions
- **Routing:** pgRouting + OpenStreetMap + H3 Spatial
- **Geocoding:** Nominatim + buffer espacial 1000m
- **Algoritmos:** Dijkstra + Nearest Neighbor path optimization

## 🌍 Stack Espacial

- **H3 Hexagonal System** (Uber Technologies)
- **PostGIS** para almacenamiento geométrico
- **pgRouting** con algoritmo Dijkstra
- **OpenStreetMap** vía Overpass API
- **Gusano espacial** con buffer 1000m para cobertura completa

## 📱 Demo

1. Abrir: https://tu-web.vercel.app
2. Enviar data desde n8n al webhook
3. Ver tracking en tiempo real

## 🔧 Desarrollo

```bash
# Servidor local
npx serve .

# Testing webhook
curl -X POST https://tu-web.vercel.app/webhook-tracking \
  -H "Content-Type: application/json" \
  -d @sample-data.json
```

## 📊 Métricas

- **Precisión:** Metro por metro sobre calles reales
- **Performance:** <2s rendering de rutas complejas
- **Cobertura:** 16+ calles OSM analizadas por pedido
- **Optimización:** 3-5x reducción de puntos redundantes

---

**Desarrollado para La Geográfica**  
*"Sabores mapeados con precisión"* 🛵🗺️
