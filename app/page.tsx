/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useCallback } from "react";
import { Menu } from "@/components/menu";
import { JobsPage } from "@/components/jobs-page";
import { CareerProgress } from "@/components/career-progress";
import { careerLevels } from "./data/jobs";
import { careerPaths } from "./data/careers";
import { UserProgress, CareerPath } from "./types";
import { CareerAiPath } from "@/components/career-path";

// Static user progress data
const userProgress: UserProgress = {
  currentLevel: 2,
  completedRequirements: {
    1: [0, 1, 2, 3],
    2: [0, 1, 2, 3, 4],
    3: [0, 1],
    4: [],
  },
  acquiredSkills: {
    1: [0, 1, 2, 3],
    2: [0, 1, 2, 3, 4],
    3: [0, 1],
    4: [],
  },
  experienceYears: 3,
};

const calculateCurrentLevel = (
  progress: UserProgress,
  levels: typeof careerLevels,
): UserProgress => {
  let calculatedLevel = levels.length - 1;
  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];
    const levelNumber = level.level;
    const completedReqs = progress.completedRequirements[levelNumber] || [];
    const completedSkills = progress.acquiredSkills[levelNumber] || [];
    const allRequirementsCompleted =
      completedReqs.length === level.requirements.length;
    const allSkillsCompleted = completedSkills.length === level.skills.length;
    if (!allRequirementsCompleted || !allSkillsCompleted) {
      calculatedLevel = i;
      break;
    }
  }
  return { ...progress, currentLevel: calculatedLevel };
};

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"home" | "jobs" | "career">(
    "jobs",
  );
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const [selectedCareerPath, setSelectedCareerPath] =
    useState<CareerPath | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  // Custom career levels
  const [customLevels, setCustomLevels] = useState<any[]>([]);
  const [showLevelForm, setShowLevelForm] = useState(false);
  const [levelTitle, setLevelTitle] = useState("");
  const [levelSalary, setLevelSalary] = useState({ current: 0, next: 0 });
  const [levelRequirements, setLevelRequirements] = useState<string[]>([]);
  const [levelSkills, setLevelSkills] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState("");
  const [newSkill, setNewSkill] = useState("");

  const handleToggleMenu = useCallback(() => {
    setIsMenuExpanded((prev) => !prev);
  }, []);

  // Calculate current level based on completion status
  const progressWithCalculatedLevel = calculateCurrentLevel(
    userProgress,
    careerLevels,
  );

  // Create custom career path from custom levels
  const customCareerPath: CareerPath | null =
    categoryName && customLevels.length > 0
      ? {
          id: `custom-path`,
          name: categoryName.replace(/^[^\w\sąćęłńóśźż]+\s*/i, "").trim(),
          emoji: categoryName.charAt(0).match(/[\p{Emoji}]/u)
            ? categoryName.charAt(0)
            : "📝",
          description: "Twoja niestandardowa ścieżka kariery",
          levels: customLevels.map((level, idx) => ({
            level: idx + 1,
            title: level.title,
            currentSalary: level.currentSalary,
            nextSalary: level.nextSalary,
            requirements: level.requirements,
            skills: level.skills,
            estimatedTime: "Do ustalenia",
          })),
        }
      : null;

  const addLevel = () => {
    if (
      levelTitle.trim() &&
      levelRequirements.length > 0 &&
      levelSkills.length > 0
    ) {
      setCustomLevels([
        ...customLevels,
        {
          title: levelTitle,
          currentSalary: levelSalary.current,
          nextSalary: levelSalary.next,
          requirements: levelRequirements,
          skills: levelSkills,
        },
      ]);
      resetLevelForm();
    }
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setLevelRequirements([...levelRequirements, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setLevelSkills([...levelSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeRequirement = (idx: number) => {
    setLevelRequirements(levelRequirements.filter((_, i) => i !== idx));
  };

  const removeSkill = (idx: number) => {
    setLevelSkills(levelSkills.filter((_, i) => i !== idx));
  };

  const resetLevelForm = () => {
    setShowLevelForm(false);
    setLevelTitle("");
    setLevelSalary({ current: 0, next: 0 });
    setLevelRequirements([]);
    setLevelSkills([]);
    setNewRequirement("");
    setNewSkill("");
  };

  const removeLevel = (idx: number) => {
    setCustomLevels(customLevels.filter((_, i) => i !== idx));
  };

  return (
    <main className="flex min-h-screen">
      <Menu
        onNavigate={setCurrentPage}
        isExpanded={isMenuExpanded}
        onToggleMenu={handleToggleMenu}
      />

      <div
        className={`flex-1 overflow-auto transition-all duration-500 ease-in-out ${
          isMenuExpanded ? "ml-90" : "ml-20"
        }`}
      >
        {currentPage === "jobs" && <JobsPage />}

        {currentPage === "career" && (
          <div className="animate-in fade-in duration-500">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-black text-slate-900 mb-4">
                Twoja Ścieżka Awansu
              </h1>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Wykorzystujemy sztuczną inteligencję, aby przeanalizować Twoje
                dane i stworzyć plan, który zaprowadzi Cię do wymarzonych
                zarobków.
              </p>
            </div>
            <CareerAiPath />
          </div>
        )}

        {currentPage === "home" && (
          <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
            <div className="max-w-4xl">
              <h1 className="text-4xl font-bold text-white mb-4">
                Witaj w panelu analiz
              </h1>
              <p className="text-slate-300 text-lg mb-8">
                Wybierz funkcję z menu po lewej stronie, aby rozpocząć pracę z
                narzędziami do analizy ofert pracy.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  onClick={() => setCurrentPage("jobs")}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-600 transition-all cursor-pointer hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <div className="text-3xl mb-3">💼</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Porównaj oferty
                  </h3>
                  <p className="text-slate-400">
                    Łatwo porównuj warunki zatrudnienia, wynagrodzenie i
                    benefity między różnymi ofertami pracy.
                  </p>
                </div>
                <div
                  onClick={() => setCurrentPage("career")}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-green-600 transition-all cursor-pointer hover:shadow-lg hover:shadow-green-500/20"
                >
                  <div className="text-3xl mb-3">🚀</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Ścieżka rozwoju
                  </h3>
                  <p className="text-slate-400">
                    Poznaj wymagania do awansu i zarobienia więcej pieniędzy.
                  </p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-600 transition-all cursor-pointer hover:shadow-lg hover:shadow-cyan-500/20">
                  <div className="text-3xl mb-3">✅</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Walidacja formularza
                  </h3>
                  <p className="text-slate-400">
                    Sprawdź, czy formularz jest poprawnie wypełniony i zgodny z
                    wymogami.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
