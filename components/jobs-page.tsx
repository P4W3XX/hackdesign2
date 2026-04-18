/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { JobCard } from "@/components/job-card";
import { Filters } from "@/components/filters";
import { createClient } from "@/lib/supabase/client";
import { Search, SlidersHorizontal, Loader2, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useFilterSearchTerm,
  useSalaryRange,
  useWorkSchedule,
  useEmploymentType,
  useWorkStyle,
  useUpdateSearchTerm,
} from "@/store/filters";

export const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const searchTerm = useFilterSearchTerm();
  const salaryRange = useSalaryRange();
  const employmentType = useEmploymentType();
  const workStyle = useWorkStyle();
  const updateSearchTerm = useUpdateSearchTerm();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("job_offers")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setJobs(data);
      setLoading(false);
    };
    fetchJobs();
  }, [supabase]);

  useEffect(() => {
    if (!showFilters) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilters]);

  const activeFilterCount =
    employmentType.length + workStyle.length + (salaryRange[0] > 0 ? 1 : 0);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        !searchTerm ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSalary =
        job.salary_gross >= salaryRange[0] &&
        job.salary_gross <= salaryRange[1];
      const matchesEmployment =
        employmentType.length === 0 ||
        employmentType.includes(job.employment_type);
      const matchesStyle =
        workStyle.length === 0 || workStyle.includes(job.work_style);

      return (
        matchesSearch && matchesSalary && matchesEmployment && matchesStyle
      );
    });
  }, [jobs, searchTerm, salaryRange, employmentType, workStyle]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header & Search */}
      <div className="bg-background border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3 relative" ref={filtersRef}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Szukaj stanowiska lub firmy..."
                className="pl-9 h-10"
                value={searchTerm}
                onChange={(e) => updateSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="size-4" />
              Filtry
              {activeFilterCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center rounded-full bg-primary-foreground text-primary text-xs size-5 font-semibold">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {showFilters && (
              <div className="absolute top-full right-0 mt-2 w-96 z-50">
                <Filters />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 py-10 w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground tracking-tight text-balance">
              Dostępne stanowiska
            </h2>
            <p className="text-muted-foreground mt-1 text-sm flex items-center gap-2">
              <Briefcase className="size-4" />
              {filteredJobs.length}{" "}
              {filteredJobs.length === 1 ? "oferta" : "ofert"} znaleziono
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary size-10" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-16 rounded-full bg-accent text-primary flex items-center justify-center mb-4">
              <Search className="size-7" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Brak wyników
            </h3>
            <p className="text-muted-foreground text-sm">
              Spróbuj zmienić kryteria wyszukiwania lub zresetować filtry.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
