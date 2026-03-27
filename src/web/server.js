/**
 * Express Web Dashboard
 * แสดงการแจ้งเตือน + CRUD สำหรับ tasks, properties, appointments
 * - GET  /           → dashboard UI
 * - GET  /api/tasks
 * - POST /api/tasks
 * - PUT  /api/tasks/:id
 * - DELETE /api/tasks/:id
 * - GET  /api/properties
 * - POST /api/properties
 * - PUT  /api/properties/:id
 * - GET  /api/appointments
 * - POST /api/appointments
 * - PUT  /api/appointments/:id
 * - GET  /api/notify/summary   → trigger manual summary
 * - GET  /events               → Server-Sent Events stream
 */
const express = require('express');
const path = require('path');
const db = require('../store/db');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/* ─── SSE broadcast ─────────────────────────────────────────── */
const clients = new Set();

function broadcast(data) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  clients.forEach((res) => res.write(payload));
}

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  clients.add(res);
  req.on('close', () => clients.delete(res));
});

/* ─── Generic CRUD factory ──────────────────────────────────── */
function crudRouter(resource) {
  const router = express.Router();

  router.get('/', (_, res) => res.json(db.read(resource)));

  router.post('/', (req, res) => {
    const item = db.add(resource, req.body);
    broadcast({ type: 'update', resource });
    res.status(201).json(item);
  });

  router.put('/:id', (req, res) => {
    const item = db.update(resource, Number(req.params.id), req.body);
    if (!item) return res.status(404).json({ error: 'ไม่พบรายการ' });
    broadcast({ type: 'update', resource });
    res.json(item);
  });

  router.delete('/:id', (req, res) => {
    db.remove(resource, Number(req.params.id));
    broadcast({ type: 'update', resource });
    res.json({ ok: true });
  });

  return router;
}

app.use('/api/tasks', crudRouter('tasks'));
app.use('/api/properties', crudRouter('properties'));
app.use('/api/appointments', crudRouter('appointments'));

/* ─── Manual trigger ────────────────────────────────────────── */
app.get('/api/notify/summary', async (req, res) => {
  // Import lazily to avoid circular dependency at startup
  const { buildDailySummary } = require('../services/dailySummary');
  const { buildTodaySchedule } = require('../services/reminders');
  const { sendLineNotify } = require('../notifiers/line');

  const msg = `${buildDailySummary()}\n\n${buildTodaySchedule()}`;
  broadcast({ message: msg, timestamp: new Date().toISOString() });
  await sendLineNotify(process.env.LINE_NOTIFY_TOKEN, '\n' + msg);
  res.json({ ok: true, message: msg });
});

/* ─── Start ─────────────────────────────────────────────────── */
function startServer(port = process.env.PORT || 3000) {
  app.listen(port, () => {
    console.log(`[Web] Dashboard พร้อมใช้งาน → http://localhost:${port}`);
  });
}

module.exports = { startServer, broadcast };
