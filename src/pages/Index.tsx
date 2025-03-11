import React, { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";
import EntryCard from "@/components/EntryCard";
import EntryCardSkeleton from "@/components/EntryCardSkeleton";
import { mockEntries as initialMockEntries, updateEntryMood } from "@/lib/journalData";
import { MoodType } from "@/components/MoodSelector";

const Index = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setEntries(initialMockEntries);
      setIsLoading(false);
    }, 250);
  }, []);

  const handleMoodChange = useCallback((entryId: string, newMood: MoodType) => {
    setEntries(prevEntries => {
      return prevEntries.map(entry => {
        if (entry.id === entryId) {
          return { ...entry, mood: newMood };
        }
        return entry;
      });
    });
  }, []);

  return (
    <div className="min-h-screen pb-24 px-4">
      <Header />
      
      <main>
        <h1 className="text-2xl font-medium tracking-tight mb-6 animate-slide-down">My Journal</h1>
        
        <div className="space-y-1 mb-8 animate-fade-in">
          <h2 className="text-sm text-muted-foreground font-medium">RECENT ENTRIES</h2>
          <div className="h-px bg-border w-full"></div>
        </div>
        
        <div className="space-y-4">
          {isLoading ? (
            <>
              <EntryCardSkeleton />
              <EntryCardSkeleton />
              <EntryCardSkeleton />
            </>
          ) : (
            entries.map((entry, index) => (
              <EntryCard 
                key={entry.id} 
                entry={entry} 
                className={`animate-scale-in transition-all delay-${index}`}
                onMoodChange={(newMood) => handleMoodChange(entry.id, newMood)}
              />
            ))
          )}
        </div>
      </main>
      
      <BottomBar />
    </div>
  );
};

export default Index;
