"use client";

import React, { useState, useEffect } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  Briefcase,
  Globe,
  RotateCcw,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
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
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
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

  const handleMinSalaryChange = (value: string) => {
    const newMin = parseInt(value);
    if (newMin <= salaryRange[1]) {
      updateSalaryRange([newMin, salaryRange[1]]);
    }
  };

  const handleMaxSalaryChange = (value: string) => {
    const newMax = parseInt(value);
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
    <div className="flex flex-col bg-popover text-popover-foreground border border-border rounded-xl shadow-lg max-h-[80vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Filtry
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="size-3.5" />
          Resetuj
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Salary */}
        <Section
          icon={Banknote}
          label="Widełki płacowe (PLN)"
          expanded={expandedSections.salary}
          onToggle={() => toggleSection("salary")}
        >
          <div className="px-4 pb-5 space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
                  Od
                </label>
                <div className="bg-muted border border-border rounded-md px-3 py-2 text-sm font-semibold text-foreground">
                  {salaryRange[0].toLocaleString("pl-PL")} zł
                </div>
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
                  Do
                </label>
                <div className="bg-muted border border-border rounded-md px-3 py-2 text-sm font-semibold text-foreground">
                  {salaryRange[1].toLocaleString("pl-PL")} zł
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <input
                  type="range"
                  min="0"
                  max={maxSalaryInDb}
                  step="500"
                  value={salaryRange[0]}
                  onChange={(e) => handleMinSalaryChange(e.target.value)}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <p className="text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-wide">
                  Minimum
                </p>
              </div>
              <div>
                <input
                  type="range"
                  min="0"
                  max={maxSalaryInDb}
                  step="500"
                  value={salaryRange[1]}
                  onChange={(e) => handleMaxSalaryChange(e.target.value)}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <p className="text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-wide">
                  Maksimum
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Employment */}
        <Section
          icon={Briefcase}
          label="Typ umowy"
          expanded={expandedSections.employment}
          onToggle={() => toggleSection("employment")}
        >
          <div className="px-4 pb-4 flex flex-col gap-1">
            {employmentTypeOptions.map((option) => (
              <CheckboxRow
                key={option}
                label={option}
                checked={employmentType.includes(option)}
                onChange={() => toggleEmploymentType(option)}
              />
            ))}
          </div>
        </Section>

        {/* Work style */}
        <Section
          icon={Globe}
          label="Tryb pracy"
          expanded={expandedSections.style}
          onToggle={() => toggleSection("style")}
          last
        >
          <div className="px-4 pb-4 flex flex-col gap-1">
            {workStyleOptions.map((option) => (
              <CheckboxRow
                key={option}
                label={option}
                checked={workStyle.includes(option)}
                onChange={() => toggleWorkStyle(option)}
              />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
};

function Section({
  icon: Icon,
  label,
  expanded,
  onToggle,
  children,
  last,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={cn(!last && "border-b border-border")}>
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/60 transition-colors"
      >
        <div className="flex items-center gap-2.5 text-foreground">
          <Icon className="size-4 text-primary" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform",
            expanded && "rotate-180"
          )}
        />
      </button>
      {expanded && children}
    </div>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={cn(
        "flex items-center justify-between px-3 py-2 rounded-md border cursor-pointer transition-colors",
        checked
          ? "border-primary bg-accent text-accent-foreground"
          : "border-transparent hover:border-border hover:bg-muted/50 text-foreground"
      )}
    >
      <span className="text-sm font-medium">{label}</span>
      <Checkbox checked={checked} onCheckedChange={onChange} />
    </label>
  );
}
