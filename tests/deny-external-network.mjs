import dns from "node:dns";
import net from "node:net";

function isLoopback(host) {
  if (host == null) return true;
  const normalized = String(host).replace(/^\[|\]$/g, "").toLowerCase();
  return normalized === "localhost" || normalized === "::1" || normalized.startsWith("127.");
}

const originalLookup = dns.lookup;
dns.lookup = function lookup(hostname, ...args) {
  if (!isLoopback(hostname)) {
    const callback = args.at(-1);
    const error = Object.assign(new Error(`External network denied: ${hostname}`), {
      code: "ENETUNREACH",
    });
    if (typeof callback === "function") return queueMicrotask(() => callback(error));
    throw error;
  }
  return originalLookup.call(this, hostname, ...args);
};

const originalConnect = net.Socket.prototype.connect;
net.Socket.prototype.connect = function connect(...args) {
  const options = typeof args[0] === "object"
    ? args[0]
    : { port: args[0], host: typeof args[1] === "string" ? args[1] : undefined };

  if (options.path == null && !isLoopback(options.host)) {
    throw Object.assign(new Error(`External network denied: ${options.host}`), {
      code: "ENETUNREACH",
    });
  }
  return originalConnect.apply(this, args);
};
