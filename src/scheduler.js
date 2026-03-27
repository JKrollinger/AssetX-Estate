/**
 * Cron Scheduler
 * กำหนดตารางการแจ้งเตือนอัตโนมัติ
 *
 * Cron syntax: ┌─ วินาที (0-59)
 *              │ ┌─ นาที (0-59)
 *              │ │ ┌─ ชั่วโมง (0-23)
 *              │ │ │ ┌─ วัน (1-31)
 *              │ │ │ │ ┌─ เดือน (1-12)
 *              │ │ │ │ │ ┌─ วันในสัปดาห์ (0=อาทิตย์)
 *              │ │ │ │ │ │
 *             "s m h d M w"
 */
const cron = require('node-cron');
const { sendLineNotify } = require('./notifiers/line');
const { buildDailySummary } = require('./services/dailySummary');
const { buildPropertyReport } = require('./services/propertyReport');
const { getUpcomingReminders, buildTodaySchedule } = require('./services/reminders');
const { broadcast } = require('./web/server');

const LINE_TOKEN = process.env.LINE_NOTIFY_TOKEN;

/** ส่งทั้ง LINE และ Web dashboard */
async function notify(message) {
  if (!message) return;
  broadcast({ message, timestamp: new Date().toISOString() });
  await sendLineNotify(LINE_TOKEN, '\n' + message);
}

function startScheduler() {
  const TZ = process.env.TZ || 'Asia/Bangkok';

  // 08:00 — สรุปงานประจำวัน + ตารางนัดหมาย
  cron.schedule('0 8 * * *', async () => {
    console.log('[Cron] 08:00 — สรุปงานประจำวัน');
    const summary = buildDailySummary();
    const schedule = buildTodaySchedule();
    await notify(`${summary}\n\n${schedule}`);
  }, { timezone: TZ });

  // 09:00 — รายงานอสังหาริมทรัพย์
  cron.schedule('0 9 * * 1-5', async () => {
    console.log('[Cron] 09:00 — รายงานอสังหาริมทรัพย์ (จ-ศ)');
    await notify(buildPropertyReport());
  }, { timezone: TZ });

  // ทุก 30 นาที — ตรวจสอบนัดหมายที่ใกล้ถึง
  cron.schedule('*/30 * * * *', async () => {
    const { message } = getUpcomingReminders(60);
    if (message) {
      console.log('[Cron] แจ้งเตือนนัดหมาย');
      await notify(message);
    }
  }, { timezone: TZ });

  // 17:30 — สรุปงานปิดวัน
  cron.schedule('30 17 * * 1-5', async () => {
    console.log('[Cron] 17:30 — สรุปปิดวัน');
    await notify(buildDailySummary());
  }, { timezone: TZ });

  console.log('[Scheduler] เริ่มทำงานแล้ว (timezone:', TZ, ')');
}

module.exports = { startScheduler };
