/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Heart, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import { JobModal } from "./job-modal";

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
}

interface JobCardProps {
  job: JobOfferDB;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const formattedDate = new Date(job.posted_date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });

  return (
    <>
      <style jsx>{`
        @keyframes heartBeat {
          0% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.3);
          }
          50% {
            transform: scale(1.1);
          }
          75% {
            transform: scale(1.25);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(239, 68, 68, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }
        .heart-animate {
          animation: heartBeat 0.6s ease-in-out;
        }
        .pulse-animate {
          animation: pulse-ring 0.6s ease-out;
        }
      `}</style>

      <div
        className={`relative ${job.bg_color} border border-black/5 rounded-[32px] p-6 hover:shadow-2xl transition-all duration-500 w-full max-w-[340px] cursor-pointer group flex flex-col justify-between h-full`}
        onClick={() => setIsModalOpen(true)}
      >
        <div>
          {/* Salary */}
          <div className="text-sm font-bold text-slate-500 mb-2">
            {job.salary_gross.toLocaleString()} zł / month
          </div>

          {/* Title and Company */}
          <div className="flex justify-between items-start gap-4 mb-4">
            <div className="flex flex-col flex-1">  
              <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                {job.title}
              </h3>
              <p className="font-bold text-slate-600 opacity-80 mt-1">
                {job.company}
              </p>
            </div>
            <div className="bg-white p-2 rounded-2xl shadow-sm">
              <img
                src={job.logo_url || "/default-offer-photo.png"}
                alt={`${job.company} logo`}
                width={40}
                height={40}
                className="w-10 h-10 rounded-lg object-contain"
              />
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 mb-3 text-slate-600 font-medium">
            <MapPin size={16} className="text-slate-400" />
            <span className="text-sm">{job.location}</span>
          </div>

          {/* Date and Applicants */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-6 pb-4 border-b border-black/10">
            <div className="flex items-center gap-1.5 font-bold">
              <Clock size={14} />
              {formattedDate}
            </div>
            <div className="font-bold">{job.applicants_count} applicants</div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[job.employment_type, job.work_style, job.experience_level].map(
              (tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/50 border border-black/5 text-slate-700"
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-auto">
          <button
            className="flex-1 bg-slate-900 text-white py-3.5 rounded-2xl font-black text-sm hover:bg-black hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-slate-200"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Apply now
          </button>

          <button
            onClick={handleLikeClick}
            className={`p-3.5 rounded-2xl transition-all duration-300 border ${
              isFavorite
                ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-200"
                : "bg-white border-black/5 text-slate-400 hover:text-red-500 hover:border-red-200"
            } ${isAnimating ? "heart-animate" : ""} ${isFavorite && isAnimating ? "pulse-animate" : ""}`}
          >
            <Heart
              size={20}
              fill={isFavorite ? "currentColor" : "none"}
              strokeWidth={isFavorite ? 0 : 2.5}
            />
          </button>
        </div>
      </div>

      <JobModal
        job={job as any}
        isOpen={isModalOpen}
        onCloseAction={() => setIsModalOpen(false)}
        isFavorite={isFavorite}
        onFavoriteClickAction={() => setIsFavorite(!isFavorite)}
      />
    </>
  );
};
