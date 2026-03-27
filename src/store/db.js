/**
 * Simple JSON file-based data store
 * ใช้ไฟล์ JSON เก็บข้อมูล tasks, properties, appointments
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');

function filePath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function read(name) {
  const fp = filePath(name);
  if (!fs.existsSync(fp)) return [];
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch {
    return [];
  }
}

function write(name, data) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2), 'utf8');
}

function add(name, item) {
  const records = read(name);
  const newItem = { id: Date.now(), createdAt: new Date().toISOString(), ...item };
  records.push(newItem);
  write(name, records);
  return newItem;
}

function update(name, id, changes) {
  const records = read(name);
  const idx = records.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  records[idx] = { ...records[idx], ...changes, updatedAt: new Date().toISOString() };
  write(name, records);
  return records[idx];
}

function remove(name, id) {
  const records = read(name).filter((r) => r.id !== id);
  write(name, records);
}

module.exports = { read, write, add, update, remove };
