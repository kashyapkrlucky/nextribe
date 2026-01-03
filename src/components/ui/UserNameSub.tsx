import { CheckIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function UserNameSub({ username, setUsername }: { username: string, setUsername: (username: string) => void }) {
  const [usernameStatus, setUsernameStatus] = useState<{
    available: boolean | null;
    checking: boolean;
    message: string;
    suggestions: string[];
  }>({
    available: null,
    checking: false,
    message: "",
    suggestions: [],
  });

  // Debounced username check function
  const checkUsernameAvailability = useCallback(async (username: string) => {
    if (username.length < 7) {
      setUsernameStatus({
        available: null,
        checking: false,
        message: "",
        suggestions: [],
      });
      return;
    }

    setUsernameStatus((prev) => ({ ...prev, checking: true }));

    try {
      const response = await fetch(
        `/api/auth/username?username=${encodeURIComponent(username)}`
      );
      const data = await response.json();

      if (response.ok) {
        setUsernameStatus({
          available: data.available,
          checking: false,
          message: data.message,
          suggestions: data.suggestions || [],
        });
      } else {
        setUsernameStatus({
          available: null,
          checking: false,
          message: data.error || "Error checking username",
          suggestions: [],
        });
      }
    } catch {
      setUsernameStatus({
        available: null,
        checking: false,
        message: "Network error",
        suggestions: [],
      });
    }
  }, []);



  
    // Debounce effect for username checking
    useEffect(() => {
      const timer = setTimeout(() => {
        if (username.length >= 7) {
          checkUsernameAvailability(username);
        }
      }, 500);
  
      return () => clearTimeout(timer);
    }, [username, checkUsernameAvailability]);

  return (
    <div className="px-1">
      {usernameStatus.checking && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="animate-spin rounded-full h-3 w-3 border border-gray-300 border-t-transparent"></div>
          Checking availability...
        </div>
      )}

      {!usernameStatus.checking && usernameStatus.available !== null && (
        <div className="space-y-1">
          <div
            className={`flex items-center gap-2 text-sm ${
              usernameStatus.available ? "text-green-600" : "text-red-600"
            }`}
          >
            {usernameStatus.available ? (
              <CheckIcon className="h-4 w-4" />
            ) : (
              <XIcon className="h-4 w-4" />
            )}
            {usernameStatus.message}
          </div>

          {/* Show suggestions if username is taken */}
          {!usernameStatus.available &&
            usernameStatus.suggestions.length > 0 && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Suggestions: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {usernameStatus.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setUsername(suggestion);
                      }}
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-700 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
