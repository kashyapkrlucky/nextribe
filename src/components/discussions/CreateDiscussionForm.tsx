import { createSlug } from "@/core/utils/helpers";
import React, { useState } from "react";

interface CreateDiscussionFormProps {
  setShowCreateDiscussion: (show: boolean) => void;
  onClose: () => void;
  communityId: string;
}

export default function CreateDiscussionForm({
  setShowCreateDiscussion,
  onClose,
  communityId,
}: CreateDiscussionFormProps) {
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    body: "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);
    if (!form.title.trim()) {
      setCreateError("Title is required");
      return;
    }
    try {
      setCreateLoading(true);
      const res = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          slug: createSlug(form.title.trim()) || undefined,
          body: form.body.trim() || undefined,
          community: communityId
        }),
      });
      if (res.status === 401) {
        window.location.href = "/sign-in";
        return;
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to create");
      // success
      setShowCreateDiscussion(false);
      setForm({
        title: "",
        slug: "",
        body: "",
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create";
      setCreateError(msg);
    } finally {
      setCreateLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setShowCreateDiscussion(false)}
      />
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 p-5">
        <h3 className="text-lg font-semibold mb-3">Create Discussion</h3>
        {createError ? (
          <div className="mb-3 text-sm text-red-600">{createError}</div>
        ) : null}
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="e.g., What's on your mind?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Body
            </label>
            <textarea
              value={form.body}
              onChange={(e) =>
                setForm((f) => ({ ...f, body: e.target.value }))
              }
              className="w-full min-h-[120px] border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 resize-none"
              rows={3}
              placeholder="Write your discussion content..."
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateDiscussion(false)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg"
              disabled={createLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLoading}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg disabled:opacity-60"
            >
              {createLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
