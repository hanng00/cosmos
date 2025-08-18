import { useState } from "react";
import { MarketingButton } from "@/components/ui/marketing-button";

interface UrlInputProps {
  onSubmit: (url: string) => void;
}

export default function UrlInput({ onSubmit }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      new URL(url);
      setError(null);
      onSubmit(url);
    } catch {
      setError("Please enter a valid URL.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-xl mx-auto w-full bg-white/10 backdrop-blur rounded-lg p-4"
    >
      <input
        type="url"
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="Paste your website URL here"
        className="flex-1 text-lg px-4 py-3 border-0 bg-white/20 text-white placeholder:text-white/60 rounded-lg focus:ring-2 focus:ring-white/30 transition-all backdrop-blur-sm min-w-0"
        required
      />
      <MarketingButton type="submit" className="w-full sm:w-auto">
        Generate Clips
      </MarketingButton>
      {error && <div className="text-red-400 text-sm mt-2 w-full">{error}</div>}
    </form>
  );
} 