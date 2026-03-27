/**
 * Daily Summary Service
 * สรุปงานประจำวัน — tasks ที่ต้องทำ, ค้างอยู่, และเสร็จแล้ว
 */
const db = require('../store/db');

/**
 * สร้างข้อความสรุปงานประจำวัน
 * @returns {string} ข้อความสรุป
 */
function buildDailySummary() {
  const tasks = db.read('tasks');
  const today = new Date().toISOString().slice(0, 10);

  const todayTasks = tasks.filter((t) => t.dueDate === today);
  const pending = tasks.filter((t) => t.status === 'pending');
  const done = tasks.filter((t) => t.status === 'done' && t.updatedAt?.startsWith(today));
  const overdue = tasks.filter(
    (t) => t.status !== 'done' && t.dueDate && t.dueDate < today
  );

  const lines = [
    `📋 สรุปงานประจำวัน — ${today}`,
    '',
    `✅ เสร็จวันนี้: ${done.length} งาน`,
    `📌 งานวันนี้: ${todayTasks.length} งาน`,
    `⏳ งานค้างอยู่: ${pending.length} งาน`,
    `🚨 งานเกินกำหนด: ${overdue.length} งาน`,
  ];

  if (todayTasks.length > 0) {
    lines.push('', '— งานที่ต้องทำวันนี้ —');
    todayTasks.forEach((t) => {
      const status = t.status === 'done' ? '✅' : '🔲';
      lines.push(`${status} ${t.title}`);
    });
  }

  if (overdue.length > 0) {
    lines.push('', '— งานเกินกำหนด —');
    overdue.slice(0, 5).forEach((t) => {
      lines.push(`🚨 ${t.title} (ครบกำหนด: ${t.dueDate})`);
    });
  }

  return lines.join('\n');
}

module.exports = { buildDailySummary };
