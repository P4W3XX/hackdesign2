"use client";

import { Suspense } from "react";
import ResetPasswordContent from "./reset-password-content";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
