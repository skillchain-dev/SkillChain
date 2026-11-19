// Minimal request de-duplication + in-memory cache for GET calls.
// The project has no react-query/SWR dependency, so this stays deliberately small:
// components that want caching call `queryClient.fetch(key, fn)` instead of calling the api directly.
const cache = new Map();
const inFlight = new Map();

async function fetchQuery(key, queryFn, { staleTimeMs = 15000 } = {}) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < staleTimeMs) {
    return cached.data;
  }
  if (inFlight.has(key)) return inFlight.get(key);

  const promise = queryFn()
    .then((data) => {
      cache.set(key, { data, timestamp: Date.now() });
      inFlight.delete(key);
      return data;
    })
    .catch((error) => {
      inFlight.delete(key);
      throw error;
    });

  inFlight.set(key, promise);
  return promise;
}

function invalidate(key) {
  if (key) cache.delete(key);
  else cache.clear();
}

export const queryClient = { fetch: fetchQuery, invalidate };
