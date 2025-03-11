import React from "react";
import { Link } from "react-router-dom";
import { Bookmark, HeartHandshake, Image, Music, Video, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MoodType } from "./MoodSelector";

export interface EntryProps {
  id: string;
  title: string;
  content: string;
  date: Date;
  favorite: boolean;
  media: {
    type: "photo" | "video" | "audio" | "gallery";
    url: string;
  }[];
  mood?: MoodType;
  kickCount?: number;
  isShared?: boolean;
}

interface EntryCardProps {
  entry: EntryProps;
  className?: string;
  onFavoriteToggle?: (id: string) => void;
  onMoodChange?: (newMood: MoodType) => void;
}

const EntryCard: React.FC<EntryCardProps> = ({
  entry,
  className,
  onFavoriteToggle,
  onMoodChange
}) => {
  const {
    id,
    title,
    content,
    date,
    favorite,
    media,
    mood,
    isShared,
  } = entry;

  const renderMediaPreview = () => {
    if (!media || media.length === 0) return null;

    const firstMedia = media[0];

    if (firstMedia.type === "photo") {
      return (
        <div className="relative h-32 rounded-lg overflow-hidden mb-3">
          <img src={firstMedia.url} alt="" className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
            <Image className="w-4 h-4 text-white" />
          </div>
        </div>
      );
    }

    if (firstMedia.type === "gallery" && media.length > 0) {
      return (
        <div className="grid grid-cols-3 gap-1 mb-3">
          {media.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="relative h-20 rounded-lg overflow-hidden"
            >
              <img src={item.url} alt="" className="w-full h-full object-cover" />
              {index === 2 && media.length > 3 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-medium">
                  +{media.length - 3}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (firstMedia.type === "audio" && firstMedia.url) {
      return (
        <div className="bg-secondary/50 rounded-lg p-3 flex items-center gap-2 mb-3">
          <Music className="w-4 h-4" />
          <span className="text-xs">Audio recording</span>
        </div>
      );
    }

    if (firstMedia.type === "video" && firstMedia.url) {
      return (
        <div className="relative h-32 rounded-lg overflow-hidden mb-3 bg-black/10 flex items-center justify-center">
          <Video className="w-8 h-8" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-16 border-l-white border-b-8 border-b-transparent ml-1"></div>
            </div>
          </div>
        </div>
      );
    }
  };

  // For mood emoji mapping
  const getMoodEmoji = (mood: MoodType | undefined) => {
    switch (mood) {
      case "happy":
        return "😊";
      case "content":
        return "😌";
      case "neutral":
        return "😐";
      case "sad":
        return "😔";
      case "stressed":
        return "😰";
      default:
        return null;
    }
  };

  // For mood colors
  const getMoodColor = (mood: MoodType | undefined) => {
    switch (mood) {
      case "happy":
        return "bg-[#FFDA6B]"; // Golden Yellow
      case "content":
        return "bg-[#A7D1AB]"; // Seafoam Green
      case "neutral":
        return "bg-[#D3D3D3]"; // Light Gray
      case "sad":
        return "bg-[#90AFC5]"; // Steel Blue
      case "stressed":
        return "bg-[#F28F8F]"; // Dusty Rose
      default:
        return "bg-transparent";
    }
  };

  // Function to determine contrasting color (light or dark)
  const getContrastColor = (hexColor: string): string => {
    if (!hexColor) return "black";
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "black" : "white";
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(id);
    }
  };

  return (
    <Link
      to={`/entry/${id}`}
      className={cn(
        "block rounded-xl p-4 transition-colors duration-300",
        className,
        getMoodColor(mood)
      )}
    >
      {renderMediaPreview()}

      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-black transition-colors duration-300">{title}</h3>
        <button
          onClick={handleFavoriteClick}
          className="group p-1.5 -mt-1 -mr-1"
        >
          <Bookmark
            className={cn(
              "w-4 h-4 transition-colors",
              favorite ? "fill-primary stroke-primary" : "group-hover:fill-primary/20"
            )}
          />
        </button>
      </div>

      <p className="text-[#444444] line-clamp-2 mb-3 text-sm transition-colors duration-300">
        {content}
      </p>

      <div className="flex justify-between items-center text-xs transition-colors duration-300">
        <div className="flex items-center rounded-full px-2 py-1 bg-black/10">
          {isShared ? (
            <HeartHandshake className="w-3 h-3 mr-1" />
          ) : (
            <Lock className="w-3 h-3 mr-1" />
          )}
          <span className="text-[#A9A9A9]">{format(date, "MMM d, yyyy")}</span>
        </div>
        <div className="flex gap-2 items-center">
          {mood && (
            <button onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onMoodChange) {
                const moods: MoodType[] = ["happy", "content", "neutral", "sad", "stressed"];
                const currentMoodIndex = moods.indexOf(mood);
                const nextMoodIndex = (currentMoodIndex + 1) % moods.length;
                onMoodChange(moods[nextMoodIndex]);
              }
            }}
            className="flex items-center justify-center w-5 h-5 rounded-full" 
                  style={{ backgroundColor: getMoodColor(mood) }}>
              {getMoodEmoji(mood)}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default EntryCard;
