"use client";

import React, { useEffect, useState } from "react";
import { useTopicStore } from "@/store/useTopicStore";
import { useCommunityStore } from "@/store/useCommunityStore";

interface CreateCommunityFormProps {
  setShowCreate: (show: boolean) => void;
}

export default function CreateCommunityForm({
  setShowCreate,
}: CreateCommunityFormProps) {
  const [createError, setCreateError] = useState<string | null>(null);
  const { topics, fetchTopics } = useTopicStore();
  const [form, setForm] = useState({
    name: "",
    description: "",
    isPrivate: false,
    topicIds: [] as string[],
    guidelines: "",
  });

  const { isLoading, createCommunity } = useCommunityStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    if (!form.name.trim()) {
      setCreateError("Name is required");
      return;
    }
    try {
      const data = await createCommunity({
        name: form.name,
        description: form.description.trim() || undefined,
        isPrivate: !!form.isPrivate,
        topics: form.topicIds.map((id) => ({ _id: id })),
        guidelines: form.guidelines
          .split(",")
          .map((g) => g.trim())
          .filter((g) => g),
      });
      console.log("Created community:", data);
      setShowCreate(false);
      setForm({
        name: "",
        description: "",
        isPrivate: false,
        topicIds: [],
        guidelines: "",
      });

      window.location.href = `/community/${data.slug}`;
    } catch (err: unknown) {
      console.error("Error creating community:", err);
      const msg =
        err instanceof Error ? err.message : "Failed to create community";
      setCreateError(msg);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  return (
    <div className="fixed h-screen w-screen inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setShowCreate(false)}
      />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md mx-4 p-5">
        <h3 className="text-lg font-semibold mb-3">Create Community</h3>
        {createError ? (
          <div className="mb-3 text-sm text-red-600">{createError}</div>
        ) : null}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="e.g., Next.js Builders"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              rows={3}
              placeholder="Describe the community"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Topics</label>
            <select
              multiple
              value={form.topicIds}
              onChange={(e) => {
                const selected = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                setForm((f) => ({ ...f, topicIds: selected }));
              }}
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 h-auto min-h-[100px]"
            >
              {topics.map((topic) => (
                <option key={topic._id} value={topic._id}>
                  {topic.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Hold down the Ctrl (Windows/Linux) or Command (Mac) button to
              select multiple options.
            </p>
          </div>

          

          <div>
            <label className="block text-sm font-medium mb-1">Guidelines</label>
            <textarea
              value={form.guidelines}
              onChange={(e) =>
                setForm((f) => ({ ...f, guidelines: e.target.value }))
              }
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              rows={3}
              placeholder="Enter community guidelines (comma separated)"
            />
          </div>

          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isPrivate}
              onChange={(e) =>
                setForm((f) => ({ ...f, isPrivate: e.target.checked }))
              }
              className="h-4 w-4 rounded border border-gray-300 dark:border-gray-600"
            />
            Private community
          </label>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-3 py-2 text-sm bg-indigo-600 text-white dark:bg-indigo-500 rounded-lg disabled:opacity-60"
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
