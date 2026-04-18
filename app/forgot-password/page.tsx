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
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/schema/forgotPasswordSchema";
import z from "zod";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { isSubmitting } = form.formState;
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/login");
  }, [router])

  const onSubmit = async (data: { email: string }) => {
    router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md pt-5 pb-0">
        <CardHeader>
          <h1 className="text-xl font-bold">Reset your password</h1>
          <p className="text-muted-foreground">
            Enter your email address to continue the password reset process
          </p>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="forgot-password-form"
          >
            {serverError && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
                {serverError}
              </div>
            )}
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="gap-1">
                    <FieldLabel className="text-[15px]">Email</FieldLabel>
                    <Input
                      {...field}
                      placeholder="jordan.lee@example.com"
                      type="email"
                      aria-invalid={fieldState.invalid}
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
        <CardFooter className="border-t bg-muted pb-6 pt-6 flex flex-col gap-3">
          <Field orientation={"horizontal"}>
            <Button
              className="w-full flex-1"
              type="submit"
              form="forgot-password-form"
              disabled={isSubmitting}
            >
              Continue
            </Button>
            <Button
              variant={"outline"}
              onClick={() => router.push("/login")}
              className="text-sm text-center w-full flex-1 dark:text-black bg-white hover:bg-gray-50"
            >
              Cancel
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
