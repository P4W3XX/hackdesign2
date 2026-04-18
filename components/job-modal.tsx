/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { X, Heart, MapPin, Briefcase, Globe, Clock, Users } from "lucide-react";

// Definicja typu zgodna z Twoją bazą danych Supabase
interface JobOfferDB {
  id: string;
  title: string;
  company: string;
  salary_gross: number;
  location: string;
  posted_date: string;
  applicants_count: number;
  employment_type: string;
  work_style: string;
  experience_level: string;
  bg_color: string;
  logo_url?: string;
  description?: string; // Jeśli dodałeś opis do bazy
}

interface JobModalProps {
  job: JobOfferDB;
  isOpen: boolean;
  onCloseAction: () => void;
  isFavorite?: boolean;
  onFavoriteClickAction?: () => void;
}

export const JobModal: React.FC<JobModalProps> = ({
  job,
  isOpen,
  onCloseAction,
  isFavorite = false,
  onFavoriteClickAction,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFavoriteWithAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    onFavoriteClickAction?.();
  };

  if (!isOpen) return null;

  // Formatowanie daty
  const formattedDate = new Date(job.posted_date).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes heartBeat {
          0% { transform: scale(1); }
          25% { transform: scale(1.3); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-slide-up { animation: slideUp 0.4s ease-out; }
        .heart-animate { animation: heartBeat 0.6s ease-in-out; }
      `}</style>

      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onCloseAction}
        />

        {/* Modal Content */}
        <div className="relative bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl animate-slide-up max-h-[90vh] flex flex-col">
          
          {/* Header Section with Background Color from DB */}
          <div className={`${job.bg_color || 'bg-slate-100'} p-8 relative`}>
            <button 
              onClick={onCloseAction}
              className="absolute right-6 top-6 p-2 bg-white/50 hover:bg-white rounded-full transition-colors text-slate-700"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="bg-white p-4 rounded-2xl shadow-sm w-20 h-20 flex items-center justify-center shrink-0">
                <img 
                  src={job.logo_url || "/default-logo.png"} 
                  alt={job.company}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                   <span className="px-3 py-1 bg-white/60 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-600">
                    {job.experience_level}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-1">{job.title}</h2>
                <p className="text-xl font-bold text-slate-700 opacity-80">{job.company}</p>
              </div>
            </div>
          </div>

          {/* Body Section */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="flex flex-col p-4 bg-slate-50 rounded-2xl">
                <Banknote size={18} className="text-orange-600 mb-2" />
                <span className="text-xs font-bold text-slate-400 uppercase">Pensja</span>
                <span className="font-black text-slate-900">{job.salary_gross.toLocaleString()} zł</span>
              </div>
              <div className="flex flex-col p-4 bg-slate-50 rounded-2xl">
                <MapPin size={18} className="text-blue-600 mb-2" />
                <span className="text-xs font-bold text-slate-400 uppercase">Lokalizacja</span>
                <span className="font-black text-slate-900">{job.location}</span>
              </div>
              <div className="flex flex-col p-4 bg-slate-50 rounded-2xl">
                <Users size={18} className="text-purple-600 mb-2" />
                <span className="text-xs font-bold text-slate-400 uppercase">Aplikanci</span>
                <span className="font-black text-slate-900">{job.applicants_count}</span>
              </div>
              <div className="flex flex-col p-4 bg-slate-50 rounded-2xl">
                <Clock size={18} className="text-emerald-600 mb-2" />
                <span className="text-xs font-bold text-slate-400 uppercase">Opublikowano</span>
                <span className="font-black text-slate-900">{formattedDate}</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-black text-slate-900 mb-4">Szczegóły oferty</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-sm font-bold text-slate-700">
                  <Briefcase size={16} /> {job.employment_type}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-sm font-bold text-slate-700">
                  <Globe size={16} /> {job.work_style}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 mb-4">Opis stanowiska</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                {job.description || `Dołącz do zespołu ${job.company} jako ${job.title}. Szukamy osoby na poziomie ${job.experience_level}, która pomoże nam rozwijać nasze innowacyjne projekty w lokalizacji ${job.location}. Oferujemy stabilne zatrudnienie typu ${job.employment_type} w trybie ${job.work_style}.`}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4">
            <button 
              className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl shadow-slate-200"
              onClick={() => alert("Aplikacja wysłana!")}
            >
              Aplikuj teraz
            </button>
            <button
              onClick={handleFavoriteWithAnimation}
              className={`p-4 rounded-2xl border transition-all duration-300 ${
                isFavorite
                  ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-200"
                  : "bg-white border-slate-200 text-slate-400 hover:text-red-500"
              } ${isAnimating ? "heart-animate" : ""}`}
            >
              <Heart
                size={24}
                fill={isFavorite ? "currentColor" : "none"}
                strokeWidth={isFavorite ? 0 : 2.5}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

function Banknote({ size, className }: { size: number; className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}