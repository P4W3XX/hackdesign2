/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Brain,
  GraduationCap,
  Target,
  Sparkles,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { CareerStepCard } from "@/components/career-step-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export const CareerAiPath = () => {
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState<any[] | null>(null);

  const [formData, setFormData] = useState({
    education: "",
    interests: "",
    experience: "",
    goal: "",
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
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-lg bg-accent text-primary">
              <Brain className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground tracking-tight">
                AI Kreator Ścieżki Kariery
              </h2>
              <p className="text-sm text-muted-foreground">
                Powiedz nam o sobie, a AI zaplanuje Twój rozwój.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Education */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                <GraduationCap className="size-3.5" /> Wykształcenie
              </Label>
              <select
                className="w-full h-10 px-3 bg-background border border-input rounded-md text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, education: e.target.value })
                }
              >
                <option value="">Wybierz poziom...</option>
                <option value="Szkolne">Średnie / Techniczne</option>
                <option value="Licencjat">Licencjat / Inżynier</option>
                <option value="Magister">Magister</option>
                <option value="Samouk">Samouk (Kursy/Projekty)</option>
              </select>
            </div>

            {/* Interests */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                <Target className="size-3.5" /> Zainteresowania / Branża
              </Label>
              <Input
                type="text"
                placeholder="np. AI, Marketing, Finanse..."
                onChange={(e) =>
                  setFormData({ ...formData, interests: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                <Sparkles className="size-3.5" /> Twój cel zawodowy
              </Label>
              <textarea
                placeholder="Gdzie chcesz być za 5 lat? (np. Senior Developer w Google, Własna agencja...)"
                className="w-full min-h-24 p-3 bg-background border border-input rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all resize-none"
                onChange={(e) =>
                  setFormData({ ...formData, goal: e.target.value })
                }
              />
            </div>
          </div>

          <Button
            onClick={generatePath}
            disabled={loading || !formData.education}
            size="lg"
            className="w-full mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin size-4" />
                Generowanie planu...
              </>
            ) : (
              <>
                Generuj moją ścieżkę <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* AI Results */}
      {path && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-base font-semibold text-foreground">
              Twoja spersonalizowana ścieżka
            </h3>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-1 gap-4">
            {path.map((step, index) => (
              <CareerStepCard key={index} step={step} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
