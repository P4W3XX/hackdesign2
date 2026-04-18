/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { JobCard } from "@/components/job-card";
import { Filters } from "@/components/filters";
import { createClient } from "@/lib/supabase/client"; 
import { Search, ChevronDown, Loader2 } from "lucide-react";
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

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = !searchTerm || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSalary = job.salary_gross >= salaryRange[0] && job.salary_gross <= salaryRange[1];
      const matchesEmployment = employmentType.length === 0 || employmentType.includes(job.employment_type);
      const matchesStyle = workStyle.length === 0 || workStyle.includes(job.work_style);

      return matchesSearch && matchesSalary && matchesEmployment && matchesStyle;
    });
  }, [jobs, searchTerm, salaryRange, employmentType, workStyle]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header & Search (z Twojego kodu) */}
      <div className="bg-white border-b sticky top-0 z-10 p-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex gap-4 relative" ref={filtersRef}>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => updateSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold flex items-center gap-2 hover:bg-black transition-all"
            >
              Filtry <ChevronDown size={18} className={showFilters ? "rotate-180" : ""} />
            </button>

            {showFilters && (
              <div className="absolute top-full right-0 mt-4 w-96 bg-white border border-gray-200 rounded-3xl shadow-2xl z-50 p-6">
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
            <h2 className="text-3xl font-black text-slate-900">Available Positions</h2>
            <p className="text-slate-500">{filteredJobs.length} jobs found</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={48} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};