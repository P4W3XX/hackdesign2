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
    <div className="min-h-screen bg-[#F8F9FD] text-slate-800 font-sans w-full">
      <main className="max-w-7xl mx-auto p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Cześć, {user?.name || "Użytkowniku"} 👋
            </h1>
            <p className="text-slate-500 text-sm">Twoja analiza finansowa,</p>
          </div>
        </header>

        <div className="bg-white border border-slate-200 rounded-[24px] p-6 mb-8 flex flex-col lg:flex-row items-center gap-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
            <h2 className="font-semibold flex items-center gap-2 mb-6">
              <Wallet className="text-indigo-500" size={20} /> Twoja Pensja
            </h2>

            <div className="flex items-center bg-slate-50 rounded-2xl p-2 border border-slate-100 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <input
                type="number"
                value={salaryInput}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSalaryInput(val);
                  syncSalaryToDb(val, salaryType);
                }}
                className="text-4xl font-black text-slate-800 focus:outline-none w-full bg-transparent px-4"
              />
              <button
                onClick={() => {
                  const newType = salaryType === "brutto" ? "netto" : "brutto";
                  setSalaryType(newType);
                  syncSalaryToDb(salaryInput, newType);
                }}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold text-indigo-600 shadow-sm hover:bg-slate-50 transition-colors uppercase"
              >
                {salaryType}
              </button>
            </div>

            <div className="flex gap-6 mt-6 px-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Szacowane Netto
                </span>
                <span className="font-bold text-slate-600">
                  {Math.round(calculation.currentNetto)} zł
                </span>
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-[24px] shadow-sm border ${calculation.balance > 0 ? "bg-indigo-600 text-white" : "bg-red-500 text-white"}`}
          >
            <h2 className="font-medium opacity-80 mb-1">
              Zostaje na czysto (Netto)
            </h2>
            <div className="text-4xl font-black mb-4">
              {Math.round(calculation.balance)} zł
            </div>
            <p className="text-sm opacity-90 font-medium">
              {calculation.balance > 0
                ? "Możesz odłożyć na marzenia!"
                : "Przekraczasz budżet!"}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingDown size={20} className="text-orange-500" /> Dodatkowe
            wydatki miesięczne (subskrybcje)
          </h3>
          <div className="flex flex-col gap-3 mb-6">
            <input
              placeholder="Np. Netflix, Siłownia, Leasing"
              className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500/20"
              value={newExpenseTitle}
              onChange={(e) => setNewExpenseTitle(e.target.value)}
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Kwota (zł)"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none"
                value={newExpenseAmount}
                onChange={(e) => setNewExpenseAmount(e.target.value)}
              />
              <button
                onClick={addExpense}
                disabled={isAddingExpense}
                className="bg-slate-900 text-white px-6 rounded-xl font-bold hover:bg-black transition-colors disabled:opacity-50"
              >
                {isAddingExpense ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Dodaj"
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {personalExpenses.map((exp) => (
              <div
                key={exp.id}
                className="flex justify-between items-center p-3 bg-orange-50/50 rounded-xl border border-orange-100"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-slate-700">
                    {exp.title}
                  </span>
                  <span className="text-xs text-orange-600 font-bold">
                    {exp.amount} zł / mies.
                  </span>
                </div>
                <button
                  onClick={() => deleteExpense(exp.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {personalExpenses.length === 0 && (
              <p className="text-center text-slate-400 text-sm py-4 italic">
                Brak dodatkowych obciążeń.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 mb-8 rounded-[24px] shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-semibold mb-6 flex items-center gap-2">
            <TrendingDown size={20} className="text-red-500" /> Wykaz kosztów
          </h3>

          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Dach nad głową
                </span>
                <span className="font-semibold text-slate-700">
                  {housing === "rent_room"
                    ? "Wynajem pokoju"
                    : housing === "rent_studio"
                      ? "Własna kawalerka"
                      : "Mieszkanie (2+ pokoje)"}
                </span>
              </div>
              <span className="font-black text-red-500">
                -{Math.round(calculation.rent)} zł
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Przewidywane tryb wydawania pieniędzy na jedzenie i podstawowe
                  przedmioty
                </span>
                <span className="font-semibold text-slate-700">
                  {lifestyle}
                </span>
              </div>
              <span className="font-black text-red-500">
                -{calculation.foodAndLife.toFixed(0)} zł
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  Transport
                </span>
                <span className="font-semibold text-slate-700">
                  Bilet w {city}
                </span>
              </div>
              <span className="font-black text-red-500">
                -{calculation.transport} zł
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-orange-400 uppercase">
                  Własne wydatki
                </span>
              </div>
              <span className="font-black text-red-500">
                -{calculation.sumPersonalExpenses} zł
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-dashed border-slate-200">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900 text-lg">
                Łączne wydatki:
              </span>
              <span className="text-2xl font-black text-red-600">
                {Math.round(calculation.totalCosts)}
                zł
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-right uppercase tracking-widest font-bold">
              Pieniądze nie dają szczęścia, ale ich brak daje smutek.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Plus size={20} className="text-indigo-500" /> Dodaj nowy cel
            </h3>
            <div className="flex flex-col gap-3">
              <input
                placeholder="Nazwa (np. MacBook Pro)"
                className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Cena (zł)"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none"
                  value={newGoalPrice}
                  onChange={(e) => setNewGoalPrice(e.target.value)}
                />
                <button
                  onClick={addGoal}
                  disabled={isAdding}
                  className="bg-indigo-600 text-white px-6 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isAdding ? <Loader2 className="animate-spin" /> : "Dodaj"}
                </button>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                Twoje Cele
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {goals.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => setSelectedGoalId(g.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedGoalId === g.id ? "border-indigo-500 bg-indigo-50" : "border-slate-100 hover:border-slate-300"}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="font-bold">{g.title}</span>
                        <span className="text-indigo-600 font-black">
                          {g.price} zł
                        </span>
                      </div>
                      <button
                        onClick={(e) => deleteGoal(e, g.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={28} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
            <Smartphone size={48} className="text-indigo-100 mb-4" />
            <h3 className="text-xl font-bold mb-2">Czas realizacji celu</h3>
            {calculation.selectedGoal ? (
              <>
                <p className="text-slate-500 mb-6 font-medium">
                  Odkładając całą nadwyżkę na Twoje cele:
                </p>
                <div className="text-6xl font-black text-slate-800 mb-2">
                  {calculation.monthsToGoal === Infinity
                    ? "∞"
                    : calculation.monthsToGoal}
                  <span className="text-xl ml-2">mies.</span>
                </div>
                <p className="text-slate-400 text-sm italic">
                  To tylko {(calculation.monthsToGoal / 12).toFixed(1)} lat
                  Twojej młodości
                </p>
              </>
            ) : (
              <p className="text-slate-400">
                Dodaj cel, aby sprawdzić kiedy go osiągniesz.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function FilterSelect({ label, icon, value, onChange, options, labels }: any) {
  return (
    <div>
      <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase mb-3">
        {icon} {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20"
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
