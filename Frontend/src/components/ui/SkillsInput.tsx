import { useState } from "react";
import { X, Plus } from "lucide-react";

interface SkillsInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
  label?: string;
  error?: string;
  placeholder?: string;
}

const commonSkills = [
  "Software Development",
  "UI/UX Design",
  "Digital Marketing",
  "Data Science",
  "Product Management",
  "Business Strategy",
  "Finance & Accounting",
  "Sales",
  "Operations",
  "Content Creation",
  "Mobile Development",
  "AI/ML",
  "Blockchain",
  "Agriculture",
  "Healthcare",
  "Education",
  "E-commerce",
  "IoT",
  "Cybersecurity",
  "Cloud Computing",
];

const SkillsInput = ({
  value,
  onChange,
  label,
  error,
  placeholder = "Type a skill...",
}: SkillsInputProps) => {
  const [inputVal, setInputVal] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputVal("");
    setShowSuggestions(false);
  };

  const removeSkill = (skill: string) => {
    onChange(value.filter((s) => s !== skill));
  };

  const filtered = commonSkills.filter(
    (s) =>
      s.toLowerCase().includes(inputVal.toLowerCase()) && !value.includes(s)
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputVal.trim()) {
      e.preventDefault();
      addSkill(inputVal);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-center text-lg font-semibold text-slate-700">
          {label}
        </label>
      )}

      <div className="relative">
        <div className="flex min-h-[64px] flex-wrap items-center gap-2 rounded-3xl border-2 border-slate-300 px-5 py-4 transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20">
          {value.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-100 to-violet-100 px-4 py-2 text-base font-medium text-blue-700"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="text-blue-500 hover:text-blue-700"
              >
                <X size={16} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[140px] bg-transparent text-center text-lg outline-none placeholder-slate-400"
          />
        </div>

        {showSuggestions && inputVal && filtered.length > 0 && (
          <div className="absolute z-10 mt-2 w-full rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
            {filtered.slice(0, 8).map((skill) => (
              <button
                key={skill}
                type="button"
                onMouseDown={() => addSkill(skill)}
                className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-lg text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Plus size={18} className="text-primary" />
                {skill}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-center text-base font-medium text-red-600">{error}</p>
      )}
    </div>
  );
};

export default SkillsInput;
