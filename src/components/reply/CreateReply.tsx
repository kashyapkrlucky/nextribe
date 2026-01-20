import { SendHorizonalIcon } from "lucide-react";

interface CreateReplyProps {
  submitAnswer: (e: React.FormEvent) => void;
  answer: string;
  setAnswer: (answer: string) => void;
  answerTag: "answer" | "tip" | "question";
  setAnswerTag: (tag: "answer" | "tip" | "question") => void;
  submitting: boolean;
}

export default function CreateReply({
  submitAnswer,
  answer,
  setAnswer,
  answerTag,
  setAnswerTag,
  submitting,
}: CreateReplyProps) {
  return (
    <form
      onSubmit={submitAnswer}
      className="space-y-2 border border-gray-300 dark:border-gray-700 p-2 rounded-md"
    >
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Share your knowledge..."
        className="w-full border-none rounded-lg p-3 text-sm min-h-16 resize-none outline-none"
      />
      <div className="flex justify-end items-center gap-2">
        <select
          value={answerTag}
          onChange={(e) =>
            setAnswerTag(e.target.value as "answer" | "tip" | "question")
          }
          className="border border-gray-200 rounded-lg px-2 py-1 text-xs capitalize dark:border-gray-700"
        >
          <option value="answer">answer</option>
          <option value="tip">tip</option>
          <option value="question">question</option>
        </select>
        <button
          type="submit"
          disabled={submitting || !answer.trim()}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white rounded-lg px-4 py-2 text-xs disabled:opacity-60"
        >
          <SendHorizonalIcon className="w-4 h-4" />{" "}
          {submitting ? "Posting..." : "Post answer"}
        </button>
      </div>
    </form>
  );
}
