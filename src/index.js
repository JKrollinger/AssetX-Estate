/**
 * AssetX-Estate — Daily Notification System
 * จุดเริ่มต้นของระบบแจ้งเตือนการทำงานรายวัน
 */
require('dotenv').config();

const { startServer } = require('./web/server');
const { startScheduler } = require('./scheduler');

startServer();
startScheduler();

console.log('[AssetX] ระบบแจ้งเตือนเริ่มทำงานแล้ว');
