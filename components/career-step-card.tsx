/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowUpRight, CheckCircle2, TrendingUp } from "lucide-react";

export const CareerStepCard = ({ step, index }: { step: any, index: number }) => {
  return (
    <div className="bg-white border border-slate-100 p-6 rounded-[24px] hover:shadow-xl transition-all group flex flex-col md:flex-row gap-6 items-start">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
          {index + 1}
        </div>
        {index < 4 && <div className="w-1 h-full bg-slate-100 rounded-full mt-2 hidden md:block" />}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="text-xl font-black text-slate-900">{step.role}</h4>
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">{step.timeframe}</span>
          </div>
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2">
            <TrendingUp size={16} /> {step.salary}
          </div>
        </div>

        <p className="text-slate-600 font-medium mb-4 leading-relaxed">
          {step.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {step.skills.map((skill: string) => (
            <div key={skill} className="flex items-center gap-2 text-sm font-bold text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <CheckCircle2 size={16} className="text-indigo-500" /> {skill}
            </div>
          ))}
        </div>
      </div>

      {/* <button className="self-center p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
        <ArrowUpRight size={24} />
      </button> */}
    </div>
  );
};