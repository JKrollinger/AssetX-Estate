/**
 * Appointment Reminder Service
 * แจ้งเตือนนัดหมายที่ใกล้ถึง
 */
const db = require('../store/db');

/**
 * ดึงนัดหมายในช่วงเวลาที่กำหนด
 * @param {number} withinMinutes - แจ้งเตือนล่วงหน้ากี่นาที (default 60)
 * @returns {{ upcoming: object[], message: string }}
 */
function getUpcomingReminders(withinMinutes = 60) {
  const appointments = db.read('appointments');
  const now = new Date();
  const cutoff = new Date(now.getTime() + withinMinutes * 60 * 1000);

  const upcoming = appointments.filter((a) => {
    if (a.done) return false;
    const apptTime = new Date(a.datetime);
    return apptTime >= now && apptTime <= cutoff;
  });

  if (upcoming.length === 0) {
    return { upcoming: [], message: '' };
  }

  const lines = [`⏰ แจ้งเตือนนัดหมาย (อีก ${withinMinutes} นาที)`, ''];

  upcoming.forEach((a) => {
    const time = new Date(a.datetime).toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    });
    lines.push(`📅 ${time} — ${a.title}`);
    if (a.location) lines.push(`   📍 ${a.location}`);
    if (a.note) lines.push(`   📝 ${a.note}`);
  });

  return { upcoming, message: lines.join('\n') };
}

/**
 * สรุปนัดหมายทั้งหมดของวันนี้
 * @returns {string}
 */
function buildTodaySchedule() {
  const appointments = db.read('appointments');
  const today = new Date().toISOString().slice(0, 10);

  const todayAppts = appointments
    .filter((a) => a.datetime?.startsWith(today) && !a.done)
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

  if (todayAppts.length === 0) {
    return '📅 วันนี้ไม่มีนัดหมาย';
  }

  const lines = [`📅 นัดหมายวันนี้ (${todayAppts.length} รายการ)`, ''];

  todayAppts.forEach((a) => {
    const time = new Date(a.datetime).toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    });
    lines.push(`🕐 ${time} — ${a.title}`);
    if (a.location) lines.push(`   📍 ${a.location}`);
  });

  return lines.join('\n');
}

module.exports = { getUpcomingReminders, buildTodaySchedule };
