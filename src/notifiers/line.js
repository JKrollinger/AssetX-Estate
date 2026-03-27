/**
 * LINE Notify integration
 * ส่งข้อความแจ้งเตือนผ่าน LINE Notify API
 * Docs: https://notify-bot.line.me/doc/en/
 */
const axios = require('axios');

const LINE_NOTIFY_URL = 'https://notify-api.line.me/api/notify';

/**
 * ส่งข้อความไปยัง LINE Notify
 * @param {string} token  - LINE Notify token จาก .env
 * @param {string} message - ข้อความที่ต้องการส่ง
 * @param {object} [options] - stickerPackageId, stickerId, imageFullsize, imageThumbnail
 */
async function sendLineNotify(token, message, options = {}) {
  if (!token) {
    console.warn('[LINE] LINE_NOTIFY_TOKEN ไม่ได้ตั้งค่า — ข้ามการส่ง');
    return;
  }

  const params = new URLSearchParams({ message, ...options });

  try {
    const res = await axios.post(LINE_NOTIFY_URL, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(`[LINE] ส่งสำเร็จ: ${res.data.message}`);
  } catch (err) {
    const detail = err.response?.data?.message || err.message;
    console.error(`[LINE] ส่งไม่สำเร็จ: ${detail}`);
  }
}

module.exports = { sendLineNotify };
