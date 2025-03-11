import React from "react";

interface EntryTitleInputProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

const EntryTitleInput: React.FC<EntryTitleInputProps> = ({ title, setTitle }) => {
  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Entry Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-2xl font-medium tracking-tight bg-transparent border-none outline-none placeholder:text-muted-foreground"
        autoFocus
      />
      <div className="h-px bg-border w-full"></div>
    </div>
  );
};

export default EntryTitleInput;
