import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-TShock-Url'],
}));

app.use(express.json());

const tshockUrls = new Map();

app.post('/api/config', (req, res) => {
  const { clientId, tshockUrl } = req.body;
  if (!tshockUrl) {
    return res.status(400).json({ error: 'TShock URL is required' });
  }
  
  let baseUrl = tshockUrl.replace(/\/$/, '');
  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    baseUrl = 'http://' + baseUrl;
  }
  
  tshockUrls.set(clientId || 'default', baseUrl);
  res.json({ success: true, message: 'TShock URL configured' });
});

app.get('/api/config', (req, res) => {
  const clientId = req.query.clientId || 'default';
  const url = tshockUrls.get(clientId);
  res.json({ tshockUrl: url || null });
});

app.use('/api', createProxyMiddleware({
  router: (req) => {
    const clientId = req.headers['x-client-id'] || 'default';
    let targetUrl = tshockUrls.get(clientId);
    
    if (!targetUrl) {
      const urlParam = req.headers['x-tshock-url'];
      if (urlParam) {
        targetUrl = urlParam;
      } else {
        targetUrl = req.query.tshockUrl;
      }
    }
    
    if (!targetUrl) {
      return null;
    }
    
    targetUrl = targetUrl.replace(/\/$/, '');
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'http://' + targetUrl;
    }
    
    return targetUrl;
  },
  changeOrigin: true,
  pathRewrite: {
    '^/api': '',
  },
  onProxyReq: (proxyReq, req, res) => {
    const clientId = req.headers['x-client-id'] || 'default';
    const targetUrl = tshockUrls.get(clientId) || req.headers['x-tshock-url'] || req.query.tshockUrl;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${targetUrl}${req.path}`);
    
    proxyReq.setHeader('X-Forwarded-For', req.ip);
    proxyReq.setHeader('X-Forwarded-Proto', req.protocol);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
    res.status(500).json({ 
      status: '500', 
      response: null, 
      error: `Proxy error: ${err.message}` 
    });
  },
  onProxyRes: (proxyRes, req, res) => {
    proxyRes.headers['access-control-allow-origin'] = '*';
    proxyRes.headers['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['access-control-allow-headers'] = 'Content-Type, Authorization, X-TShock-Url, X-Client-Id';
  }
}));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`TShock Proxy Server running on http://localhost:${PORT}`);
  console.log('Configure TShock URL via POST /api/config');
});
