/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Wallet,
  MapPin,
  Home,
  Coffee,
  Smartphone,
  Briefcase,
  Plus,
  Trash2,
  Loader2,
  TrendingDown,
} from "lucide-react";
import { useUserStore } from "@/store/user";
import { createClient } from "@/lib/supabase/client";

const TAX_FACTOR = 0.79;
const LIFESTYLES: Record<string, number> = {
  "Student (Przetrwanie)": 0.6,
  "Normalny człowiek": 1.0,
  "Żymianin ✡️ (Premium)": 1.8,
};

export default function JobFinderSalaryDashboard() {
  const { user, setUser } = useUserStore();
  const supabase = createClient();

  const [isMounted, setIsMounted] = useState(false);
  const [cityData, setCityData] = useState<any[]>([]);

  const [salaryInput, setSalaryInput] = useState<number>(0);
  const [salaryType, setSalaryType] = useState<"brutto" | "netto">("netto");

  const [city, setCity] = useState("Warszawa");
  const [housing, setHousing] = useState("rent_studio");
  const [lifestyle, setLifestyle] = useState("Normalny człowiek");

  const [goals, setGoals] = useState<any[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string>("");

  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalPrice, setNewGoalPrice] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const [personalExpenses, setPersonalExpenses] = useState<any[]>([]);
  const [newExpenseTitle, setNewExpenseTitle] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [isAddingExpense, setIsAddingExpense] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const initData = async () => {
      const { data: cities } = await supabase.from("city_costs").select("*");
      if (cities) setCityData(cities);

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, salary, city_name, housing_type, lifestyle_type")
        .eq("id", authUser.id)
        .single();

      if (profile) {
        setUser({
          id: authUser.id,
          email: authUser.email!,
          name: profile.full_name,
          salary: profile.salary,
        });

        const initialSalary = profile.salary || 0;
        setSalaryInput(initialSalary);
        setSalaryType("brutto");

        setCity(profile.city_name || "Warszawa");
        setHousing(profile.housing_type || "rent_studio");
        setLifestyle(profile.lifestyle_type || "Normalny człowiek");

        const { data: userExpenses } = await supabase
          .from("personal_expenses")
          .select("*")
          .order("created_at", { ascending: false });
        if (userExpenses) setPersonalExpenses(userExpenses);
      }

      const { data: userGoals } = await supabase
        .from("goals")
        .select("*")
        .order("created_at", { ascending: false });
      if (userGoals) {
        setGoals(userGoals);
        if (userGoals.length > 0) setSelectedGoalId(userGoals[0].id);
      }
    };

    if (isMounted) initData();
  }, [isMounted, supabase, setUser]);

  const syncSalaryToDb = async (value: number, type: "brutto" | "netto") => {
    if (!user) return;
    const grossValue =
      type === "brutto" ? value : Math.round(value / TAX_FACTOR);

    const { error } = await supabase
      .from("profiles")
      .update({ salary: grossValue })
      .eq("id", user.id);

    if (error) console.error("DB Error:", error.message);
  };

  const updateProfile = async (updates: any) => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);
    if (error) console.error("Błąd aktualizacji profilu:", error.message);
  };

  const addGoal = async () => {
    if (!newGoalTitle || !newGoalPrice || !user) return;
    setIsAdding(true);
    const { data, error } = await supabase
      .from("goals")
      .insert([
        { title: newGoalTitle, price: Number(newGoalPrice), user_id: user.id },
      ])
      .select()
      .single();
    if (!error) {
      setGoals([data, ...goals]);
      setSelectedGoalId(data.id);
      setNewGoalTitle("");
      setNewGoalPrice("");
    }
    setIsAdding(false);
  };

  const deleteGoal = async (e: React.MouseEvent, goalId: string) => {
    e.stopPropagation();
    const { error } = await supabase.from("goals").delete().eq("id", goalId);
    if (!error) {
      const updated = goals.filter((g) => g.id !== goalId);
      setGoals(updated);
      if (selectedGoalId === goalId) setSelectedGoalId(updated[0]?.id || "");
    }
  };

  const addExpense = async () => {
    if (!newExpenseTitle || !newExpenseAmount || !user) return;
    setIsAddingExpense(true);
    const { data, error } = await supabase
      .from("personal_expenses")
      .insert([
        {
          title: newExpenseTitle,
          amount: Number(newExpenseAmount),
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (!error) {
      setPersonalExpenses([data, ...personalExpenses]);
      setNewExpenseTitle("");
      setNewExpenseAmount("");
    }
    setIsAddingExpense(false);
  };

  const deleteExpense = async (id: string) => {
    const { error } = await supabase
      .from("personal_expenses")
      .delete()
      .eq("id", id);
    if (!error)
      setPersonalExpenses(personalExpenses.filter((e) => e.id !== id));
  };

  const calculation = useMemo(() => {
    const currentCity =
      cityData.find((c) => c.city_name === city) || cityData[0];
    if (!currentCity) return null;

    const currentNetto =
      salaryType === "netto" ? salaryInput : salaryInput * TAX_FACTOR;
    const currentBrutto =
      salaryType === "brutto" ? salaryInput : salaryInput / TAX_FACTOR;

    const rent = Number(currentCity[housing]) || 0;
    const foodAndLife =
      (Number(currentCity.food_base) || 0) * (LIFESTYLES[lifestyle] || 1);
    const transport = Number(currentCity.transport_cost) || 0;
    const sumPersonalExpenses = personalExpenses.reduce(
      (acc, curr) => acc + (Number(curr.amount) || 0),
      0,
    );
    const totalCosts = rent + foodAndLife + transport + sumPersonalExpenses;
    const balance = currentNetto - totalCosts;

    const selectedGoal = goals.find((g) => g.id === selectedGoalId);
    const monthsToGoal =
      balance > 0 && selectedGoal
        ? Math.ceil(selectedGoal.price / balance)
        : Infinity;

    return {
      rent,
      foodAndLife,
      transport,
      monthsToGoal,
      selectedGoal,
      currentBrutto,
      currentNetto,
      sumPersonalExpenses,
      totalCosts,
      balance,
    };
  }, [
    salaryInput,
    salaryType,
    city,
    housing,
    lifestyle,
    goals,
    selectedGoalId,
    cityData,
    personalExpenses,
  ]);

  if (!isMounted || !calculation) return null;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans w-full">
      <main className="max-w-7xl mx-auto p-6 md:p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Cześć, {user?.name || "Użytkowniku"}
            </h1>
            <p className="text-muted-foreground text-sm">
              Twoja analiza finansowa
            </p>
          </div>
        </header>

        <div className="bg-card text-card-foreground border border-border rounded-xl p-5 mb-6 flex flex-col lg:flex-row items-center gap-6 shadow-xs">
          <nav className="flex flex-col lg:flex-row gap-6 w-full items-center lg:items-end">
            <FilterSelect
              label="Lokalizacja"
              icon={<MapPin size={14} />}
              value={city}
              onChange={(val: React.SetStateAction<string>) => {
                setCity(val);
                updateProfile({ city_name: val });
              }}
              options={cityData.map((c) => c.city_name)}
            />
            <FilterSelect
              label="Rodzaj lokum"
              icon={<Home size={14} />}
              value={housing}
              onChange={(val: string) => {
                setHousing(val);
                updateProfile({ housing_type: val });
              }}
              options={["rent_room", "rent_studio", "rent_apartment"]}
              labels={{
                rent_room: "Pokój",
                rent_studio: "Kawalerka",
                rent_apartment: "Apartament",
              }}
            />
            <FilterSelect
              label="Styl życia"
              icon={<Coffee size={14} />}
              value={lifestyle}
              onChange={(val: React.SetStateAction<string>) => {
                setLifestyle(val);
                updateProfile({ lifestyle_type: val });
              }}
              options={Object.keys(LIFESTYLES)}
            />
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          <div className="lg:col-span-2 bg-card text-card-foreground p-5 rounded-xl shadow-xs border border-border">
            <h2 className="font-semibold text-sm text-foreground flex items-center gap-2 mb-4">
              <Wallet className="text-primary size-4" /> Twoja Pensja
            </h2>

            <div className="flex items-center bg-muted rounded-lg p-2 border border-border focus-within:ring-2 focus-within:ring-ring/30 transition-all">
              <input
                type="number"
                value={salaryInput}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSalaryInput(val);
                  syncSalaryToDb(val, salaryType);
                }}
                className="text-3xl font-bold text-foreground focus:outline-none w-full bg-transparent px-3"
              />
              <button
                onClick={() => {
                  const newType = salaryType === "brutto" ? "netto" : "brutto";
                  setSalaryType(newType);
                  syncSalaryToDb(salaryInput, newType);
                }}
                className="bg-background border border-border rounded-md px-3 py-1.5 text-sm font-semibold text-primary hover:bg-accent transition-colors uppercase"
              >
                {salaryType}
              </button>
            </div>

            <div className="flex gap-6 mt-4 px-1">
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Szacowane Netto
                </span>
                <span className="font-semibold text-foreground">
                  {Math.round(calculation.currentNetto)} zł
                </span>
              </div>
            </div>
          </div>

          <div
            className={`p-5 rounded-xl shadow-xs border ${calculation.balance > 0 ? "bg-primary text-primary-foreground border-primary" : "bg-destructive text-primary-foreground border-destructive"}`}
          >
            <h2 className="font-medium text-sm opacity-90 mb-1">
              Zostaje na czysto (Netto)
            </h2>
            <div className="text-3xl font-bold mb-3">
              {Math.round(calculation.balance)} zł
            </div>
            <p className="text-xs opacity-90 font-medium">
              {calculation.balance > 0
                ? "Możesz odłożyć na marzenia!"
                : "Przekraczasz budżet!"}
            </p>
          </div>
        </div>

        <div className="bg-card text-card-foreground p-5 rounded-xl shadow-xs border border-border flex flex-col mb-6">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <TrendingDown className="size-4 text-primary" /> Dodatkowe wydatki
            miesięczne (subskrypcje)
          </h3>
          <div className="flex flex-col gap-2 mb-4">
            <input
              placeholder="Np. Netflix, Siłownia, Leasing"
              className="bg-background border border-input rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
              value={newExpenseTitle}
              onChange={(e) => setNewExpenseTitle(e.target.value)}
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Kwota (zł)"
                className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
                value={newExpenseAmount}
                onChange={(e) => setNewExpenseAmount(e.target.value)}
              />
              <button
                onClick={addExpense}
                disabled={isAddingExpense}
                className="bg-primary text-primary-foreground px-5 rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isAddingExpense ? (
                  <Loader2 className="animate-spin size-4" />
                ) : (
                  "Dodaj"
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {personalExpenses.map((exp) => (
              <div
                key={exp.id}
                className="flex justify-between items-center p-3 bg-muted/50 rounded-md border border-border"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-foreground text-sm">
                    {exp.title}
                  </span>
                  <span className="text-xs text-primary font-semibold">
                    {exp.amount} zł / mies.
                  </span>
                </div>
                <button
                  onClick={() => deleteExpense(exp.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
            {personalExpenses.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-4 italic">
                Brak dodatkowych obciążeń.
              </p>
            )}
          </div>
        </div>

        <div className="bg-card text-card-foreground p-5 mb-6 rounded-xl shadow-xs border border-border flex flex-col">
          <h3 className="font-semibold text-sm mb-5 flex items-center gap-2">
            <TrendingDown className="size-4 text-destructive" /> Wykaz kosztów
          </h3>

          <div className="space-y-3 flex-1">
            <CostRow
              label="Dach nad głową"
              value={
                housing === "rent_room"
                  ? "Wynajem pokoju"
                  : housing === "rent_studio"
                    ? "Własna kawalerka"
                    : "Mieszkanie (2+ pokoje)"
              }
              amount={`-${Math.round(calculation.rent)} zł`}
            />
            <CostRow
              label="Jedzenie i podstawy"
              value={lifestyle}
              amount={`-${calculation.foodAndLife.toFixed(0)} zł`}
            />
            <CostRow
              label="Transport"
              value={`Bilet w ${city}`}
              amount={`-${calculation.transport} zł`}
            />
            <CostRow
              label="Własne wydatki"
              value="Subskrypcje i inne"
              amount={`-${calculation.sumPersonalExpenses} zł`}
              highlight
            />
          </div>

          <div className="mt-5 pt-5 border-t border-dashed border-border">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">
                Łączne wydatki:
              </span>
              <span className="text-xl font-bold text-destructive">
                {Math.round(calculation.totalCosts)} zł
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-card text-card-foreground p-5 rounded-xl shadow-xs border border-border">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <Plus className="size-4 text-primary" /> Dodaj nowy cel
            </h3>
            <div className="flex flex-col gap-2">
              <input
                placeholder="Nazwa (np. MacBook Pro)"
                className="bg-background border border-input rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Cena (zł)"
                  className="flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
                  value={newGoalPrice}
                  onChange={(e) => setNewGoalPrice(e.target.value)}
                />
                <button
                  onClick={addGoal}
                  disabled={isAdding}
                  className="bg-primary text-primary-foreground px-5 rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isAdding ? (
                    <Loader2 className="animate-spin size-4" />
                  ) : (
                    "Dodaj"
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Twoje Cele
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {goals.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => setSelectedGoalId(g.id)}
                    className={`p-3 rounded-md border cursor-pointer transition-all ${
                      selectedGoalId === g.id
                        ? "border-primary bg-accent"
                        : "border-border hover:border-foreground/20 bg-background"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-sm text-foreground truncate">
                          {g.title}
                        </span>
                        <span className="text-primary font-semibold text-sm">
                          {g.price} zł
                        </span>
                      </div>
                      <button
                        onClick={(e) => deleteGoal(e, g.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {goals.length === 0 && (
                  <p className="text-center text-muted-foreground text-sm py-4 italic">
                    Brak dodanych celów.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-card text-card-foreground p-6 rounded-xl shadow-xs border border-border flex flex-col justify-center items-center text-center">
            <div className="size-14 rounded-full bg-accent text-primary flex items-center justify-center mb-3">
              <Smartphone className="size-6" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Czas realizacji celu</h3>
            {calculation.selectedGoal ? (
              <>
                <p className="text-muted-foreground text-sm mb-5">
                  Odkładając całą nadwyżkę na Twoje cele:
                </p>
                <div className="text-5xl font-bold text-foreground mb-2 tracking-tight">
                  {calculation.monthsToGoal === Infinity
                    ? "∞"
                    : calculation.monthsToGoal}
                  <span className="text-lg ml-2 text-muted-foreground font-medium">
                    mies.
                  </span>
                </div>
                <p className="text-muted-foreground text-xs italic">
                  To tylko {(calculation.monthsToGoal / 12).toFixed(1)} lat
                  Twojej młodości
                </p>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">
                Dodaj cel, aby sprawdzić kiedy go osiągniesz.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function CostRow({
  label,
  value,
  amount,
  highlight,
}: {
  label: string;
  value: string;
  amount: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center p-3 rounded-md ${
        highlight ? "bg-accent" : "bg-muted/50"
      }`}
    >
      <div className="flex flex-col min-w-0">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
        <span className="font-medium text-foreground text-sm truncate">
          {value}
        </span>
      </div>
      <span className="font-semibold text-destructive text-sm flex-shrink-0">
        {amount}
      </span>
    </div>
  );
}

function FilterSelect({ label, icon, value, onChange, options, labels }: any) {
  return (
    <div className="w-full">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
        {icon} {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 bg-background border border-input rounded-md text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
      >
        {options.map((o: string) => (
          <option key={o} value={o}>
            {labels ? labels[o] : o}
          </option>
        ))}
      </select>
    </div>
  );
}
