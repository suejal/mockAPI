"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [schema, setSchema] = useState(null);
  const [resources, setResources] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setSchema(null);
    setResources([]);
    setData(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setSchema(data.schema);
      setResources(data.resources);
      setData(data.data);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="w-full max-w-3xl px-6 py-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Mock API Generator
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Describe your data in plain English and get a working REST API with fake data.
          </p>
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder='e.g. "users with name, email, age"'
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            disabled={loading}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Results */}
        {schema && (
          <div className="mt-10 space-y-8">
            {/* Schema */}
            <section>
              <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Generated Schema
              </h2>
              <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-100 p-4 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                {JSON.stringify(schema, null, 2)}
              </pre>
            </section>

            {/* Endpoints */}
            <section>
              <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Available Endpoints
              </h2>
              <div className="space-y-3">
                {resources.map((resource) => {
                  const url = `${baseUrl}/api/${resource}`;
                  return (
                    <div
                      key={resource}
                      className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900"
                    >
                      <div>
                        <span className="mr-2 inline-block rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-300">
                          GET
                        </span>
                        <code className="text-sm text-zinc-700 dark:text-zinc-300">
                          /api/{resource}
                        </code>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(url)}
                        className="rounded px-3 py-1 text-xs text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-zinc-800"
                        title="Copy URL"
                      >
                        Copy URL
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Data Preview */}
            {data && resources.map((resource) => (
              <section key={resource}>
                <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Data: <code className="text-blue-600 dark:text-blue-400">{resource}</code>
                  <span className="ml-2 text-sm font-normal text-zinc-500">
                    ({data[resource]?.length || 0} records)
                  </span>
                </h2>
                <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                        {data[resource]?.[0] &&
                          Object.keys(data[resource][0]).map((key) => (
                            <th
                              key={key}
                              className="px-4 py-2 text-left font-medium text-zinc-700 dark:text-zinc-300"
                            >
                              {key}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data[resource]?.map((row, i) => (
                        <tr
                          key={i}
                          className="border-b border-zinc-100 dark:border-zinc-800"
                        >
                          {Object.values(row).map((val, j) => (
                            <td
                              key={j}
                              className="max-w-[200px] truncate px-4 py-2 text-zinc-700 dark:text-zinc-300"
                            >
                              {String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}

            {/* Sample Fetch */}
            <section>
              <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Sample Fetch
              </h2>
              <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-100 p-4 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
{`fetch("${baseUrl}/api/${resources[0]}")
  .then(res => res.json())
  .then(data => console.log(data));`}
              </pre>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
