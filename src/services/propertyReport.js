/**
 * Property Report Service
 * รายงานสถานะอสังหาริมทรัพย์ประจำวัน
 */
const db = require('../store/db');

/**
 * สร้างข้อความรายงานอสังหาริมทรัพย์
 * @returns {string} ข้อความรายงาน
 */
function buildPropertyReport() {
  const properties = db.read('properties');

  const byStatus = properties.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const STATUS_LABEL = {
    available:   '🟢 ว่าง',
    reserved:    '🟡 จอง',
    sold:        '🔴 ขายแล้ว',
    rented:      '🔵 เช่าแล้ว',
    maintenance: '🔧 ซ่อมบำรุง',
  };

  const lines = [
    `🏢 รายงานอสังหาริมทรัพย์ — ${new Date().toISOString().slice(0, 10)}`,
    `รวมทั้งหมด: ${properties.length} รายการ`,
    '',
  ];

  Object.entries(byStatus).forEach(([status, count]) => {
    const label = STATUS_LABEL[status] || status;
    lines.push(`${label}: ${count} รายการ`);
  });

  // แสดงรายการที่ถูกจองแต่ยังไม่ปิดการขาย
  const reserved = properties.filter((p) => p.status === 'reserved');
  if (reserved.length > 0) {
    lines.push('', '— รายการที่รอปิดการขาย —');
    reserved.slice(0, 5).forEach((p) => {
      lines.push(`🟡 ${p.name} (${p.type || 'N/A'}) — ${p.price ? `฿${Number(p.price).toLocaleString()}` : 'ไม่ระบุราคา'}`);
    });
  }

  return lines.join('\n');
}

module.exports = { buildPropertyReport };
