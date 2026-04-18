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
import Link from "next/link";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/schema/registerSchema";
import z from "zod";

// Register -  backend imports
import { registerAction, signInWithGoogle } from "@/actions/auth-action";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { isSubmitting } = form.formState;
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const { user } = useUserStore();

  useEffect(() => {
    if (user) {
      router.push("/trasa");
    }
  }, [user, router]);

  useEffect(() => {
    router.prefetch("/login");
  }, [router])

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setServerError(null);

    const result = await registerAction(data);

    if (result.error) {
      setServerError(result.error);
    } else {
      alert("Konto utworzone. Sprawdź email, aby potwierdzić rejestrację!");
      router.push("/trasa");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md pt-5 pb-0 ">
        <CardHeader className=" gap-0 flex justify-between">
          <div>
            <h1 className=" text-xl font-bold">Register a new account</h1>
            <p className=" text-muted-foreground">
              Enter your email below to create a new account
            </p>
          </div>
          <Link
            href="/login"
            className=" font-medium text-[15px] hover:underline"
          >
            Sign in
          </Link>
        </CardHeader>
        <CardContent>
          {serverError && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
              {serverError}
            </div>
          )}
          <form onSubmit={form.handleSubmit(onSubmit)} id="register-form">
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className=" gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="fieldgroup-name"
                      className=" text-[15px]"
                    >
                      Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="fieldgroup-name"
                      placeholder="Jordan Lee"
                      aria-invalid={fieldState.invalid}
                      autoComplete="name"
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
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className=" gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="fieldgroup-email"
                      className=" text-[15px]"
                    >
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      id="fieldgroup-email"
                      placeholder="jordan.lee@example.com"
                      aria-invalid={fieldState.invalid}
                      autoComplete="email"
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
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className=" gap-1" data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="fieldgroup-password"
                      className=" text-[15px] flex justify-between w-full"
                    >
                      <p>Password</p>
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
                      className=" text-[15px]"
                    >
                      Confirm Password
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
          <FieldGroup className=" gap-3">
            <Button
              className=" w-full "
              type="submit"
              form="register-form"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="w-full flex justify-center">
                  <span className="md-2 w-full">Creating account</span>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                </div>
              ): "Register"}
            </Button>
            <Button
              className=" w-full bg-white text-black hover:bg-white/20"
              variant="outline"
              type="button"
              disabled={isGoogleLoading}
              onClick={async () => {
                setIsGoogleLoading(true);
                await signInWithGoogle();
                setIsGoogleLoading(false);
              }}
            >
              {isGoogleLoading ? (
                <div className="w-full flex justify-center">
                  <span className="md-2 w-full">Creating account with Google</span>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                </div>
              ) : "Register with Google"}
            </Button>
          </FieldGroup>
        </CardFooter>
      </Card>
    </div>
  );
}
