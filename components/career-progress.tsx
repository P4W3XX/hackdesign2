"use client";

import React, { useState } from "react";
import { CareerLevel, UserProgress } from "@/app/types";
import {
  ChevronDown,
  TrendingUp,
  Award,
  BookOpen,
  Target,
  CheckCircle2,
} from "lucide-react";

interface CareerProgressProps {
  levels: CareerLevel[];
  userProgress: UserProgress;
}

export const CareerProgress: React.FC<CareerProgressProps> = ({
  levels,
  userProgress,
}) => {
  const [expandedLevel, setExpandedLevel] = useState<number | null>(userProgress.currentLevel);

  // Calculate progress percentage for a level
  const calculateLevelProgress = (levelIndex: number): number => {
    const level = levels[levelIndex];
    const completedReqs = userProgress.completedRequirements[level.level]?.length || 0;
    const completedSkills = userProgress.acquiredSkills[level.level]?.length || 0;
    const totalItems = level.requirements.length + level.skills.length;
    
    if (totalItems === 0) return 0;
    return Math.round(((completedReqs + completedSkills) / totalItems) * 100);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Career Growth Path
        </h2>
        <p className="text-slate-300">
          Follow these steps to advance your career and increase your earning
          potential
        </p>
      </div>

      <div className="relative space-y-4">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-cyan-500 to-transparent" />

        {levels.map((level, index) => {
          const isCompleted = index < userProgress.currentLevel;
          const isCurrent = index === userProgress.currentLevel;
          const progress = calculateLevelProgress(index);
          const completedReqs = userProgress.completedRequirements[level.level]?.length || 0;
          const totalReqs = level.requirements.length;
          
          return (
          <div key={level.level} className="relative">
            {/* Timeline Dot */}
            <div
              className={`absolute left-0 top-8 w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                isCompleted
                  ? "bg-green-500 border-green-600"
                  : isCurrent
                    ? "bg-blue-500 border-blue-600"
                    : "bg-slate-700 border-slate-600"
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-8 h-8 text-white" />
              ) : (
                <span className="text-white font-bold text-lg">{level.level}</span>
              )}
            </div>

            {/* Card */}
            <div
              className={`ml-32 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                expandedLevel === index
                  ? "bg-gradient-to-r from-slate-800 to-slate-700 border-blue-500 shadow-lg shadow-blue-500/20"
                  : "bg-slate-800/50 border-slate-700 hover:border-slate-500"
              } ${isCompleted ? "opacity-75" : ""}`}
              onClick={() =>
                setExpandedLevel(expandedLevel === index ? null : index)
              }
            >
              {/* Progress Bar */}
              {!isCompleted && (
                <div className="mb-4 bg-slate-700/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Award className="w-6 h-6 text-blue-400" />
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {level.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-slate-300">
                        Current: ${level.currentSalary.toLocaleString()}/month
                      </span>
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-semibold text-green-400">
                        ${level.nextSalary.toLocaleString()}/month
                      </span>
                    </div>
                    {!isCompleted && (
                      <div className="text-xs text-slate-400 mt-2">
                        {completedReqs}/{totalReqs} requirements completed ({progress}%)
                      </div>
                    )}
                  </div>
                </div>
                <ChevronDown
                  className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${
                    expandedLevel === index ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Expanded Content */}
              {expandedLevel === index && (
                <div className="mt-6 pt-6 border-t border-slate-600 space-y-6 animate-in fade-in slide-in-from-top-2">
                  {/* Requirements */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-cyan-400" />
                      <h4 className="font-semibold text-white">
                        Requirements to reach {level.title}
                      </h4>
                    </div>
                    <ul className="space-y-2 ml-7">
                      {level.requirements.map((req, idx) => {
                        const isReqCompleted = userProgress.completedRequirements[level.level]?.includes(idx);
                        return (
                        <li
                          key={idx}
                          className={`flex items-start gap-2 ${
                            isReqCompleted
                              ? "text-green-300"
                              : "text-slate-300"
                          }`}
                        >
                          <span className={`text-bold mt-1 ${
                            isReqCompleted
                              ? "text-green-400"
                              : "text-slate-500"
                          }`}>
                            {isReqCompleted ? "✓" : "○"}
                          </span>
                          <span className={isReqCompleted ? "line-through opacity-60" : ""}>
                            {req}
                          </span>
                        </li>
                      );
                      })}
                    </ul>
                  </div>

                  {/* Skills */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-5 h-5 text-purple-400" />
                      <h4 className="font-semibold text-white">
                        Skills to develop
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-7">
                      {level.skills.map((skill, idx) => {
                        const isSkillAcquired = userProgress.acquiredSkills[level.level]?.includes(idx);
                        return (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${
                            isSkillAcquired
                              ? "bg-green-500/20 text-green-300 border-green-500/50 line-through opacity-60"
                              : "bg-purple-500/20 text-purple-300 border-purple-500/50"
                          }`}
                        >
                          {skill}
                        </span>
                      );
                      })}
                    </div>
                  </div>

                  {/* Time Estimate */}
                  <div className="bg-slate-700/50 rounded-lg p-4 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div>
                      <p className="text-sm text-slate-400">Estimated time</p>
                      <p className="text-white font-semibold">
                        {level.estimatedTime}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  {isCurrent && (
                    <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
                      Continue Your Journey
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
};
