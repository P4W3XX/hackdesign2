"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/supabaseAdmin"
import { registerSchema } from "@/schema/registerSchema"
import { loginSchema } from "@/schema/loginSchema"
import { useUserStore } from "@/store/user"
import { redirect } from "next/navigation"
import z from "zod"

export async function registerAction(data: z.infer<typeof registerSchema>) {
  const supabase = await createClient()

  const { setUser } = useUserStore.getState()

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.name,
      },
    },
  })

  if (authError) return { error: authError.message }
  if (!authData.user) return { error: "Coś poszło nie tak." }

  console.log("User registered:", authData.user)
  setUser({
    id: authData.user.id,
    email: authData.user.email!,
    name: data.name,
    salary: 0,
  })

  await supabase.from("profiles").upsert({
    id: authData.user!.id,
    full_name: data.name,
    username: data.email.split("@")[0] + Math.floor(Math.random() * 1000),
  })

  redirect("/")
}

export async function loginAction(data: z.infer<typeof loginSchema>) {
  const supabase = await createClient()
  const { setUser } = useUserStore.getState()

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    return { error: "Nieprawidłowy email lub hasło." }
  }

  if (authData.user) {
    console.log("User logged in:", authData.user)
    setUser({
      id: authData.user.id,
      email: authData.user.email!,
      name: authData.user.user_metadata.full_name,
      salary: Number(authData.user.user_metadata.salary ?? 0),
    })
  }
  redirect("/")
}

export async function unsafeDirectResetPasswordAction(data: {
  email: string
  password: string
}) {
  const supabaseAdmin = createAdminClient()

  const {
    data: { users },
    error: findError,
  } = await supabaseAdmin.auth.admin.listUsers()

  if (findError) return { error: findError.message }

  const user = users.find((u) => u.email === data.email)

  if (!user) {
    return { error: "User not found." }
  }

  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    user.id,
    { password: data.password }
  )

  if (updateError) {
    return { error: updateError.message }
  }

  await supabaseAdmin
    .from("profiles")
    .update({ password: data.password })
    .eq("id", user.id)

  return { success: true }
}

export async function signInWithGoogle() {
  const supabase = await createClient()

  const origin = (await (await import("next/headers")).headers()).get("origin")

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/api/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function logoutAction() {
  const supabase = await createClient()

  await supabase.auth.signOut()

  redirect("/login")
}
