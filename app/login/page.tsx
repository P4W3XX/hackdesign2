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
import { loginSchema } from "@/schema/loginSchema";
import z from "zod";
import { useState } from "react";
import { loginAction, signInWithGoogle } from "@/actions/auth-action";
import { Loader2 } from "lucide-react";


export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
    
  const { isSubmitting } = form.formState;   

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setServerError(null);
    
    const result = await loginAction(data);

    if (result?.error) {
      setServerError(result.error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center w-full">
      <Card className="w-full max-w-md pt-5 pb-0 ">
        <CardHeader className=" gap-0 flex justify-between">
          <div>
            <h1 className=" text-xl font-bold">Login to your account</h1>
            <p className=" text-muted-foreground">
              Enter your email and password to log in
            </p>
          </div>
          <Link
            href="/register"
            className=" font-medium text-[15px] hover:underline"
          >
            Sign up
          </Link>
        </CardHeader>
        <CardContent>
          {serverError && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4 border border-destructive/20">
              {serverError}
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} id="login-form">
            <FieldGroup>
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
                      <Link
                        href="/forgot-password"
                        className="hover:underline cursor-pointer"
                      >
                        Forgot your password?
                      </Link>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="fieldgroup-password"
                      placeholder="••••••••"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      autoComplete="current-password"
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
        <CardFooter className=" border-t bg-muted pb-6 pt-6">
          <FieldGroup className=" gap-3 w-full">
            <Button 
              className=" w-full" 
              type="submit" 
              form="login-form"
              disabled={isSubmitting} 
            >
              {isSubmitting ? (
                <div className="w-full flex justify-center">
                  <span className="md-2 w-full">Logging in</span>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                </div>
              ) : "Login"}
            </Button>
            <Button
              disabled={isGoogleLoading}
              className=" w-full bg-white text-black hover:bg-white/20"
              variant="outline"
              type="button"
              onClick= {async () => {
                setIsGoogleLoading(true);
                await signInWithGoogle();
                setIsGoogleLoading(false);
              }}
            >
              {isGoogleLoading ? (  
                <div className="w-full flex justify-center">
                  <span className="md-2 w-full">Logging with Google</span>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                </div>      
                ) : "Continue with Google"}
            </Button>
          </FieldGroup>
        </CardFooter>
      </Card>
    </div>
  );
}