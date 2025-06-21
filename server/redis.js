// server/redis.js
import Redis from 'ioredis';
const redis = new Redis(); // defaults to localhost:6379

function getTodayKey() {
  const today = new Date().toISOString().slice(0,10).replace(/-/g, '');
  return `order_seq:${today}`;
}

export async function getNextSequence() {
  const key = getTodayKey();
  const seq = await redis.incr(key);
  if (seq === 1) {
    const now = new Date();
    const expireAt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const secondsUntilMidnight = Math.floor((expireAt - now) / 1000);
    await redis.expire(key, secondsUntilMidnight);
  }
  return seq;
}
