"use client";

import * as React from "react";

interface TagsInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}

export function TagsInput({ value, onChange, placeholder }: TagsInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag) return;
    if (value.includes(tag)) return;
    onChange([...value, tag]);
    setInputValue("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue.length === 0 && value.length > 0) {
      e.preventDefault();
      onChange(value.slice(0, -1));
    }
  };

  const onBlur = () => {
    addTag(inputValue);
  };

  return (
    <div className="min-h-10 w-full rounded-md border border-input bg-background px-2 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
            <span>{tag}</span>
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              className="rounded-full p-0.5 hover:bg-muted-foreground/10"
              onClick={() => removeTag(tag)}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          className="flex-1 min-w-[8rem] bg-transparent outline-none placeholder:text-muted-foreground"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          placeholder={placeholder ?? "Type and press Enter"}
        />
      </div>
    </div>
  );
}

export default TagsInput;


