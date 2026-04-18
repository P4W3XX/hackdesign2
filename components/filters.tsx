"use client";

import React, { useState, useEffect } from "react";
import { 
  Zap, 
  ChevronDown, 
  Briefcase, 
  Globe, 
  RotateCcw,
  Banknote
} from "lucide-react";
import {
  useSalaryRange,
  useEmploymentType,
  useWorkStyle,
  useUpdateSalaryRange,
  useToggleEmploymentType,
  useToggleWorkStyle,
  useResetFilters,
} from "@/store/filters";
import { createClient } from "@/lib/supabase/client";

export const Filters: React.FC = () => {
  const [maxSalaryInDb, setMaxSalaryInDb] = useState(30000);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    salary: true,
    employment: true,
    style: true,
  });

  const salaryRange = useSalaryRange();
  const employmentType = useEmploymentType();
  const workStyle = useWorkStyle();
  
  const updateSalaryRange = useUpdateSalaryRange();
  const toggleEmploymentType = useToggleEmploymentType();
  const toggleWorkStyle = useToggleWorkStyle();
  const resetFilters = useResetFilters();

  const supabase = createClient();

  useEffect(() => {
    const fetchMaxSalary = async () => {
      const { data } = await supabase
        .from("job_offers")
        .select("salary_gross")
        .order("salary_gross", { ascending: false })
        .limit(1)
        .single();
      
      if (data) {
        setMaxSalaryInDb(data.salary_gross);
      }
    };
    fetchMaxSalary();
  }, [supabase]);

  // Obsługa zmiany pensji MIN
  const handleMinSalaryChange = (value: string) => {
    const newMin = parseInt(value);
    // Nie pozwól, aby MIN było większe niż obecne MAX
    if (newMin <= salaryRange[1]) {
      updateSalaryRange([newMin, salaryRange[1]]);
    }
  };

  // Obsługa zmiany pensji MAX
  const handleMaxSalaryChange = (value: string) => {
    const newMax = parseInt(value);
    // Nie pozwól, aby MAX było mniejsze niż obecne MIN
    if (newMax >= salaryRange[0]) {
      updateSalaryRange([salaryRange[0], newMax]);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const employmentTypeOptions = ["Full-time", "Part-time", "Project work"];
  const workStyleOptions = ["Office", "Hybrid", "Remote"];

  return (
    <div className="flex flex-col bg-white h-full max-h-[80vh] overflow-y-auto shadow-xl rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-600 fill-orange-600" />
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Filtry</h2>
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-orange-600 transition-colors group"
        >
          <RotateCcw size={16} className="group-hover:rotate-[-45deg] transition-transform" />
          Resetuj
        </button>
      </div>

      <div className="flex-1">
        {/* Sekcja: Wynagrodzenie (Dwa suwaki) */}
        <div className="border-b">
          <button
            onClick={() => toggleSection("salary")}
            className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition group"
          >
            <div className="flex items-center gap-3 text-slate-700">
              <Banknote className="w-5 h-5 text-orange-600" />
              <span className="font-bold">Widełki płacowe (PLN)</span>
            </div>
            <ChevronDown
              size={20}
              className={`text-slate-400 transition-transform ${expandedSections.salary ? "rotate-180" : ""}`}
            />
          </button>
          
          {expandedSections.salary && (
            <div className="px-5 pb-8 space-y-6">
              <div className="flex justify-between items-center gap-4">
                <div className="flex-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Od</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-black text-slate-700">
                    {salaryRange[0].toLocaleString()} zł
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Do</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-black text-slate-700">
                    {salaryRange[1].toLocaleString()} zł
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Suwak MIN */}
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max={maxSalaryInDb}
                    step="500"
                    value={salaryRange[0]}
                    onChange={(e) => handleMinSalaryChange(e.target.value)}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <p className="text-[9px] text-slate-400 mt-1 font-bold uppercase tracking-tighter">Ustaw minimum</p>
                </div>

                {/* Suwak MAX */}
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max={maxSalaryInDb}
                    step="500"
                    value={salaryRange[1]}
                    onChange={(e) => handleMaxSalaryChange(e.target.value)}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <p className="text-[9px] text-slate-400 mt-1 font-bold uppercase tracking-tighter">Ustaw maksimum</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sekcja: Typ umowy */}
        <div className="border-b">
          <button
            onClick={() => toggleSection("employment")}
            className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition group"
          >
            <div className="flex items-center gap-3 text-slate-700">
              <Briefcase className="w-5 h-5 text-orange-600" />
              <span className="font-bold">Typ umowy</span>
            </div>
            <ChevronDown
              size={20}
              className={`text-slate-400 transition-transform ${expandedSections.employment ? "rotate-180" : ""}`}
            />
          </button>

          {expandedSections.employment && (
            <div className="px-5 pb-4 grid grid-cols-1 gap-2">
              {employmentTypeOptions.map((option) => (
                <label key={option} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 cursor-pointer transition group">
                  <span className="text-sm font-bold text-slate-600 group-hover:text-orange-700">{option}</span>
                  <input
                    type="checkbox"
                    checked={employmentType.includes(option)}
                    onChange={() => toggleEmploymentType(option)}
                    className="w-5 h-5 rounded-lg border-2 border-slate-300 text-orange-600 cursor-pointer focus:ring-orange-500"
                  />
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Sekcja: Tryb pracy */}
        <div className="border">
          <button
            onClick={() => toggleSection("style")}
            className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition group"
          >
            <div className="flex items-center gap-3 text-slate-700">
              <Globe className="w-5 h-5 text-orange-600" />
              <span className="font-bold">Tryb pracy</span>
            </div>
            <ChevronDown
              size={20}
              className={`text-slate-400 transition-transform ${expandedSections.style ? "rotate-180" : ""}`}
            />
          </button>

          {expandedSections.style && (
            <div className="px-5 pb-4 grid grid-cols-1 gap-2">
              {workStyleOptions.map((option) => (
                <label key={option} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 cursor-pointer transition group">
                  <span className="text-sm font-bold text-slate-600 group-hover:text-orange-700">{option}</span>
                  <input
                    type="checkbox"
                    checked={workStyle.includes(option)}
                    onChange={() => toggleWorkStyle(option)}
                    className="w-5 h-5 rounded-lg border-2 border-slate-300 text-orange-600 cursor-pointer focus:ring-orange-500"
                  />
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};