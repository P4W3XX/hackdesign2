/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect } from "react";
import {
  X,
  Heart,
  MapPin,
  Briefcase,
  Globe,
  Clock,
  Users,
  Banknote,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  description?: string;
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
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseAction();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onCloseAction]);

  if (!isOpen) return null;

  const formattedDate = new Date(job.posted_date).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const stats = [
    {
      icon: Banknote,
      label: "Pensja",
      value: `${job.salary_gross.toLocaleString("pl-PL")} zł`,
    },
    { icon: MapPin, label: "Lokalizacja", value: job.location },
    { icon: Users, label: "Kandydaci", value: `${job.applicants_count}` },
    { icon: Clock, label: "Opublikowano", value: formattedDate },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onCloseAction}
      />

      {/* Modal Content */}
      <div className="relative bg-card text-card-foreground w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl border border-border max-h-[90vh] flex flex-col slide-in">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <button
            onClick={onCloseAction}
            className="absolute right-4 top-4 size-9 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Zamknij"
          >
            <X className="size-5" />
          </button>

          <div className="flex flex-col sm:flex-row gap-4 items-start pr-10">
            <div className="size-16 rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src={job.logo_url || "/default-logo.png"}
                alt={job.company}
                className="w-full h-full object-contain p-2"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground mb-2">
                <Award className="size-3" />
                {job.experience_level}
              </div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight text-balance">
                {job.title}
              </h2>
              <p className="text-base text-muted-foreground mt-0.5">
                {job.company}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {stats.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex flex-col p-3 rounded-lg border border-border bg-muted/50"
              >
                <Icon className="size-4 text-primary mb-1.5" />
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                  {label}
                </span>
                <span className="text-sm font-semibold text-foreground truncate">
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
              Szczegóły oferty
            </h3>
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background text-sm font-medium text-foreground">
                <Briefcase className="size-4 text-muted-foreground" />
                {job.employment_type}
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background text-sm font-medium text-foreground">
                <Globe className="size-4 text-muted-foreground" />
                {job.work_style}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
              Opis stanowiska
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {job.description ||
                `Dołącz do zespołu ${job.company} jako ${job.title}. Szukamy osoby na poziomie ${job.experience_level}, która pomoże nam rozwijać nasze innowacyjne projekty w lokalizacji ${job.location}. Oferujemy stabilne zatrudnienie typu ${job.employment_type} w trybie ${job.work_style}.`}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/30 flex gap-3">
          <Button
            className="flex-1"
            size="lg"
            onClick={() => alert("Aplikacja wysłana!")}
          >
            Aplikuj teraz
          </Button>
          <Button
            variant={isFavorite ? "default" : "outline"}
            size="lg"
            onClick={onFavoriteClickAction}
            aria-label="Zapisz ofertę"
            className={cn(isFavorite && "bg-primary")}
          >
            <Heart
              className="size-5"
              fill={isFavorite ? "currentColor" : "none"}
              strokeWidth={2}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};
