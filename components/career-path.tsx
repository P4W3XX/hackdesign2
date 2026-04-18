/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Brain, GraduationCap, Target, Sparkles, Loader2, ChevronRight } from "lucide-react";
import { CareerStepCard } from "@/components/career-step-card";


export const CareerAiPath = () => {
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState<any[] | null>(null);

  const [formData, setFormData] = useState({
    education: "",
    interests: "",
    experience: "",
    goal: ""
  });

  const generatePath = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate-career", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setPath(data.steps);
    } catch (error) {
      console.error("Błąd generowania ścieżki:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
            <Brain size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">AI Kreator Ścieżki Kariery</h2>
            <p className="text-slate-500 font-medium">Powiedz nam o sobie, a Gemini zaplanuje Twój rozwój.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wykształcenie */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase">
              <GraduationCap size={16} /> Wykształcenie
            </label>
            <select 
              className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setFormData({...formData, education: e.target.value})}
            >
              <option value="">Wybierz poziom...</option>
              <option value="Szkolne">Średnie / Techniczne</option>
              <option value="Licencjat">Licencjat / Inżynier</option>
              <option value="Magister">Magister</option>
              <option value="Samouk">Samouk (Kursy/Projekty)</option>
            </select>
          </div>

          {/* Zainteresowania */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase">
              <Target size={16} /> Zainteresowania / Branża
            </label>
            <input 
              type="text" 
              placeholder="np. AI, Marketing, Finanse..."
              className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setFormData({...formData, interests: e.target.value})}
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase">
              <Sparkles size={16} /> Twój cel zawodowy
            </label>
            <textarea 
              placeholder="Gdzie chcesz być za 5 lat? (np. Senior Developer w Google, Własna agencja...)"
              className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
              onChange={(e) => setFormData({...formData, goal: e.target.value})}
            />
          </div>
        </div>

        <button 
          onClick={generatePath}
          disabled={loading || !formData.education}
          className="w-full mt-8 py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-2xl font-black text-lg transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> Generowanie planu...
            </>
          ) : (
            <>Generuj moją ścieżkę <ChevronRight /></>
          )}
        </button>
      </div>

      {/* Wyniki AI */}
      {path && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h3 className="text-xl font-black text-slate-900 px-2 mb-6 flex items-center gap-2">
            Twoja spersonalizowana ścieżka <div className="h-1 flex-1 bg-slate-100 rounded-full" />
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {path.map((step, index) => (
              <CareerStepCard key={index} step={step} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};