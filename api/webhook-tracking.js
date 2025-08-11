// api/webhook-tracking.js
// Endpoint para recibir data de n8n

export default async function handler(req, res) {
  // Solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const trackingData = req.body;
    
    console.log('📡 Data recibida de n8n:', JSON.stringify(trackingData, null, 2));

    // Validar que tenga la estructura esperada
    if (!trackingData || !trackingData[0]?.ruta_calculada) {
      return res.status(400).json({ error: 'Invalid tracking data format' });
    }

    // Responder a n8n que se recibió OK
    res.status(200).json({ 
      status: 'received', 
      timestamp: new Date().toISOString(),
      message: 'Tracking data processed successfully' 
    });

    // HTML para inyectar los datos al frontend
    const scriptInject = `
      <script>
        if (window.receiveTrackingData) {
          window.receiveTrackingData(${JSON.stringify(trackingData)});
        } else {
          console.log('Frontend not ready, storing data');
          window.pendingTrackingData = ${JSON.stringify(trackingData)};
        }
      </script>
    `;

    console.log('✅ Tracking data enviado al frontend');

  } catch (error) {
    console.error('❌ Error procesando tracking data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}