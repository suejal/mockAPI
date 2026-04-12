/**
 * In-memory store for generated mock data.
 * Uses a global object to persist data across API route invocations
 * within the same server process.
 */

/** @type {{ schema: Record<string, Record<string, string>> | null, data: Record<string, Array<Record<string, unknown>>> }} */
const store = globalThis.__mockApiStore || {
  schema: null,
  data: {},
};

// Persist across hot reloads in development
globalThis.__mockApiStore = store;

/**
 * Save the generated schema and data to the store.
 * @param {Record<string, Record<string, string>>} schema
 * @param {Record<string, Array<Record<string, unknown>>>} data
 */
export function setStore(schema, data) {
  store.schema = schema;
  store.data = data;
}

/**
 * Get the current schema.
 * @returns {Record<string, Record<string, string>> | null}
 */
export function getSchema() {
  return store.schema;
}

/**
 * Get mock data for a specific resource.
 * @param {string} resource
 * @returns {Array<Record<string, unknown>> | null}
 */
export function getData(resource) {
  return store.data[resource] || null;
}

/**
 * Get all available resource names.
 * @returns {string[]}
 */
export function getResources() {
  return Object.keys(store.data);
}

