const { RedisManager } = require("../src/index");
const Redis = require("redis");

const redis = Redis.createClient({
  db: 1
});

const manager = new RedisManager(redis);

const a = manager.get("a", { 'b': { 'q': Number }, 'c': Number, 'd': [ Number ], 'e': [ { a: Number } ]});
async function test() {
  console.log('a as an object is:', a); // should be an object
  console.log('a.b is:', a.b); // should be an object
  console.log('a.c is:', await a.c); // should be 2
  console.log('a.b.q is:', await (a.b.q)); // should be 1
  console.log('a.d[0] is:', await (a.d[0])); // should be 4
  console.log('a.d[1] is:', await (a.d[1])); // should be 7
  console.log('a.e[0].a is:', await (a.e[0].a)); // should be 69
  console.log('a.e[1].a is:', await (a.e[1].a)); // should be 420

  redis.quit();
}

test();