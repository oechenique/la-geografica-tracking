// api/tracking.js - Endpoint para recibir datos de n8n
let latestTrackingData = null;
let dataTimestamp = null;

export default function handler(req, res) {
  // Configurar CORS para todos los métodos
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    // 📡 RECIBIR datos de n8n
    try {
      console.log('📡 POST recibido de n8n:', req.body);
      
      // Almacenar datos en memoria
      latestTrackingData = req.body;
      dataTimestamp = new Date().toISOString();
      
      console.log('✅ Datos almacenados correctamente');
      
      res.status(200).json({ 
        success: true, 
        message: 'Tracking data recibida y almacenada',
        timestamp: dataTimestamp,
        preview: {
          pedido_id: req.body?.pedido_id || req.body?.[0]?.pedido_id,
          cliente: req.body?.ruta_calculada?.cliente?.nombre || req.body?.[0]?.ruta_calculada?.cliente?.nombre
        }
      });
      
    } catch (error) {
      console.error('❌ Error procesando data:', error);
      res.status(400).json({ 
        success: false, 
        error: 'Error procesando data de tracking',
        details: error.message
      });
    }
  }

  else if (req.method === 'GET') {
    // 🗺️ DEVOLVER datos para el mapa
    try {
      // Si hay datos y no son muy viejos (máximo 30 minutos)
      const isDataFresh = dataTimestamp && 
        (new Date() - new Date(dataTimestamp)) < 30 * 60 * 1000;
      
      if (latestTrackingData && isDataFresh) {
        res.status(200).json({
          success: true,
          data: latestTrackingData,
          timestamp: dataTimestamp,
          age_minutes: Math.round((new Date() - new Date(dataTimestamp)) / 60000)
        });
      } else {
        // No hay datos o son muy viejos
        res.status(200).json({
          success: true,
          data: null,
          message: latestTrackingData ? 'Datos expirados' : 'Sin datos disponibles',
          timestamp: null
        });
      }
      
    } catch (error) {
      console.error('❌ Error devolviendo data:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Error interno del servidor' 
      });
    }
  }

  else {
    // Método no permitido
    res.status(405).json({ 
      success: false,
      error: 'Método no permitido. Use GET o POST.' 
    });
  }
}