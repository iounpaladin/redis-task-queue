const { RedisManager } = require('./index');
const Redis = require("redis");

describe('redis manager', () => {
  const redis = Redis.createClient({
    db: 1
  });

  it('should initialize correctly', () => {
    const manager = new RedisManager(redis);
  });

  it('should fetch without error', () => {
    const manager = new RedisManager(redis);
    const a = manager.get("a");
    console.log(a.b);
  });
});