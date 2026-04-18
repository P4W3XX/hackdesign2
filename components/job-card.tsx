/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Heart, MapPin, Clock, Users, Banknote } from "lucide-react";
import { JobModal } from "./job-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const formattedDate = new Date(job.posted_date).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
  });

  return (
    <>
      <Card
        onClick={() => setIsModalOpen(true)}
        className="group cursor-pointer flex flex-col justify-between h-full transition-all hover:border-primary hover:shadow-md"
      >
        <CardContent className="flex flex-col h-full gap-4">
          {/* Top row: logo + company info */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="size-11 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  src={job.logo_url || "/default-offer-photo.png"}
                  alt={`${job.company} logo`}
                  className="w-full h-full object-contain p-1.5"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {job.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5 truncate">
                  {job.company}
                </p>
              </div>
            </div>
            <button
              onClick={handleLikeClick}
              aria-label="Zapisz ofertę"
              className={cn(
                "flex-shrink-0 size-9 rounded-lg border flex items-center justify-center transition-all",
                isFavorite
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-background border-border text-muted-foreground hover:text-primary hover:border-primary"
              )}
            >
              <Heart
                className="size-4"
                fill={isFavorite ? "currentColor" : "none"}
                strokeWidth={2}
              />
            </button>
          </div>

          {/* Salary highlight */}
          <div className="flex items-center gap-2 rounded-lg bg-accent px-3 py-2">
            <Banknote className="size-4 text-primary" />
            <span className="text-sm font-semibold text-accent-foreground">
              {job.salary_gross.toLocaleString("pl-PL")} zł
            </span>
            <span className="text-xs text-muted-foreground">/ miesiąc</span>
          </div>

          {/* Meta info */}
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="size-3.5 flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5 flex-shrink-0" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <Users className="size-3.5 flex-shrink-0" />
              <span>{job.applicants_count} kandydatów</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {[job.employment_type, job.work_style, job.experience_level]
              .filter(Boolean)
              .map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground"
                >
                  {tag}
                </span>
              ))}
          </div>

          {/* CTA */}
          <Button
            className="w-full mt-auto"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
          >
            Zobacz szczegóły
          </Button>
        </CardContent>
      </Card>

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
