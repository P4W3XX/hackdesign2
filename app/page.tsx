/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useCallback } from "react";
import { Briefcase, TrendingUp, CheckCircle2, ArrowRight } from "lucide-react";
import { Menu } from "@/components/menu";
import { JobsPage } from "@/components/jobs-page";
import { careerLevels } from "./data/jobs";
import { careerPaths } from "./data/careers";
import { UserProgress, CareerPath } from "./types";
import { CareerAiPath } from "@/components/career-path";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

  const [customLevels, setCustomLevels] = useState<any[]>([]);

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
            : "",
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

  const homeTiles = [
    {
      icon: Briefcase,
      title: "Porównaj oferty",
      description:
        "Łatwo porównuj warunki zatrudnienia, wynagrodzenie i benefity.",
      page: "jobs" as const,
    },
    {
      icon: TrendingUp,
      title: "Ścieżka rozwoju",
      description:
        "Poznaj wymagania do awansu i wyższych zarobków dzięki AI.",
      page: "career" as const,
    },
    {
      icon: CheckCircle2,
      title: "Walidacja formularza",
      description:
        "Sprawdź, czy formularz jest poprawnie wypełniony i zgodny z wymogami.",
      page: "home" as const,
    },
  ];

  return (
    <main className="flex min-h-screen bg-background">
      <Menu
        onNavigate={setCurrentPage}
        isExpanded={isMenuExpanded}
        onToggleMenu={handleToggleMenu}
      />

      <div
        className={cn(
          "flex-1 overflow-auto transition-all duration-500 ease-in-out",
          isMenuExpanded ? "ml-72" : "ml-20",
        )}
      >
        {currentPage === "jobs" && <JobsPage />}

        {currentPage === "career" && (
          <div className="animate-in fade-in duration-500">
            <div className="max-w-4xl mx-auto text-center pt-12 px-6">
              <h1 className="text-4xl font-bold text-foreground mb-3 tracking-tight text-balance">
                Twoja Ścieżka Awansu
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
                Wykorzystujemy sztuczną inteligencję, aby przeanalizować Twoje
                dane i stworzyć plan, który zaprowadzi Cię do wymarzonych
                zarobków.
              </p>
            </div>
            <CareerAiPath />
          </div>
        )}

        {currentPage === "home" && (
          <div className="min-h-screen bg-background p-8 md:p-12">
            <div className="max-w-5xl mx-auto">
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-accent px-3 py-1 text-xs font-medium text-accent-foreground mb-4">
                  <span className="size-1.5 rounded-full bg-primary" />
                  Panel analiz
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3 text-balance">
                  Witaj w panelu analiz
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl text-pretty">
                  Wybierz funkcję z menu po lewej stronie, aby rozpocząć pracę z
                  narzędziami do analizy ofert pracy.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {homeTiles.map((tile) => {
                  const Icon = tile.icon;
                  return (
                    <Card
                      key={tile.title}
                      onClick={() => setCurrentPage(tile.page)}
                      className="group cursor-pointer transition-all hover:border-primary hover:shadow-md"
                    >
                      <CardHeader>
                        <div className="flex size-11 items-center justify-center rounded-lg bg-accent text-primary mb-2 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="size-5" />
                        </div>
                        <CardTitle className="text-xl">{tile.title}</CardTitle>
                        <CardDescription>{tile.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary hover:bg-accent -ml-2.5"
                        >
                          Przejdź
                          <ArrowRight className="size-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
