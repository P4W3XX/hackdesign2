/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCircle2, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const CareerStepCard = ({
  step,
  index,
}: {
  step: any;
  index: number;
}) => {
  return (
    <Card className="group transition-all hover:border-primary hover:shadow-md">
      <CardContent className="flex flex-col md:flex-row gap-5 items-start">
        <div className="flex md:flex-col items-center md:items-center md:self-stretch gap-3 md:gap-0">
          <div className="size-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-semibold text-base flex-shrink-0">
            {index + 1}
          </div>
          <div className="hidden md:block w-px flex-1 bg-border mt-2" />
        </div>

        <div className="flex-1 w-full">
          <div className="flex flex-wrap justify-between items-start gap-3 mb-2">
            <div>
              <h4 className="text-lg font-semibold text-foreground tracking-tight">
                {step.role}
              </h4>
              <span className="text-xs font-medium text-primary uppercase tracking-wide">
                {step.timeframe}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
              <TrendingUp className="size-3.5" /> {step.salary}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {step.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {step.skills.map((skill: string) => (
              <div
                key={skill}
                className="flex items-center gap-2 text-xs font-medium text-foreground bg-muted/50 px-3 py-2 rounded-md border border-border"
              >
                <CheckCircle2 className="size-3.5 text-primary flex-shrink-0" />
                <span className="truncate">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
