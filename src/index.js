const Warlock = require("node-redis-warlock");
const { promisify } = require("util");

class RedisManager {
  /**
   * @param client Redis client that this manager should manage
   * @param settings settings dictionary. Valid settings:
   *
   * -
   */
  constructor(client, settings = {}) {
    this.redisClient = client;
    this.warlock = Warlock(client);

    this.getAsync = promisify(client.get).bind(client);
  }

  navigateAlong(schema, path) {
    if(!path) return schema;

    const segments = path.split('.');
    let current = schema;

    for (let segment of segments) {
      if (Array.isArray(current)) {
        current = current[0];
      } else {
        current = current[segment];
      }
    }

    return current;
  }

  proxyify(object, schema) {
    const me = this;

    return new Proxy(object, {
      get: function(target, prop) {
        const sProp = prop.toString();
        const newRoot = target.$root ? target.$root + '.' + sProp : sProp;
        const thisObject = me.navigateAlong(schema, newRoot.split('.').slice(1).join('.'));

        if (typeof(thisObject) === "object") {
          // continue to proxy
          return me.proxyify({
            $root: newRoot
          }, schema);
        }

        return me.getAsync(target.$root + '.' + sProp);
      }
    });
  }

  get(key, objectSchema) {
    return this.proxyify({
      $root: key,
    }, objectSchema);
  }
}

module.exports.RedisManager = RedisManager;