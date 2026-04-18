"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useRouter, useSearchParams } from "next/navigation";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/schema/resetPasswordSchema";
import z from "zod";
import { useEffect, useState } from "react";
import { unsafeDirectResetPasswordAction } from "@/actions/auth-action";


export default function ResetPasswordPage() {
const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailToReset = searchParams.get("email");

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    router.prefetch("/login");
    router.prefetch("/forgot-password");
  }, [router])

  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!emailToReset) {
      router.push("/forgot-password");
    }
  }, [emailToReset, router]);

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setServerError(null);

    if (!emailToReset) {
        setServerError("There is no email to reset password for.");
        return;
    }

    const result = await unsafeDirectResetPasswordAction({
        email: emailToReset,
        password: data.newPassword
    });

    if (result?.error) {
      setServerError(result.error);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md pt-5 pb-0 ">
        <CardHeader className=" gap-0 flex justify-between">
          <div>
            <h1 className=" text-xl font-bold">Reset your password</h1>
            <p className=" text-muted-foreground">
              Enter your new password below to reset your password
            </p>
          </div>
        </CardHeader>
        <CardHeader>
          <p className="text-muted-foreground">
              Resetting password for: <span className="font-bold text-foreground">{emailToReset}</span>
          </p>
        </CardHeader>
        <CardContent>
          {serverError && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4 border border-destructive/20">
              {serverError}
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} id="reset-password-form">
            <FieldGroup>
              <Controller
                name="newPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className=" gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="fieldgroup-password"
                      className=" text-[15px] flex justify-between w-full"
                    >
                      <p>New password</p>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="fieldgroup-password"
                      placeholder="••••••••"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      autoComplete="new-password"
                    />
                    {fieldState.error && (
                      <p className="text-sm text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className=" gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="fieldgroup-confirm-password"
                      className=" text-[15px] flex justify-between w-full"
                    >
                      <p>Confirm New Password</p>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="fieldgroup-confirm-password"
                      placeholder="••••••••"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      autoComplete="new-password"
                    />
                    {fieldState.error && (
                      <p className="text-sm text-destructive">
                        {fieldState.error.message}
                      </p>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className=" border-t bg-muted pb-6">
          <Field orientation={"horizontal"} className=" gap-3 w-full">
            <Button
              disabled={isSubmitting}
              className=" flex-1"
              type="submit"
              form="reset-password-form"
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
            <Button
              onClick={() => router.push("/login")}
              className=" w-full flex-1 bg-white text-black hover:bg-white/20"
              variant="outline"
            >
              Cancel
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
