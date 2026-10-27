"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function FormLogin() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  async function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (mode === "signup") {
      setLoading(true);
      const result = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      if (result.error) {
        if (result.error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
          toast.add({
            type: "error",
            description: "Já existe um usuário com esse e-mail",
          });
          setData({ email: "", name: "", password: "" });
          return setLoading(false);
        }
        toast.add({ type: "error", description: "Erro ao criar conta" });
        return setLoading(false);
      }
      setLoading(false);
      setMode("login");
      setData({ email: "", name: "", password: "" });
    } else {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onRequest: (ctx) => {
            setLoading(true);
          },
          onSuccess: (ctx) => {
            setLoading(false);
            router.push("/customer");
          },
          onError: (ctx) => {
            if (ctx.error.code === "INVALID_EMAIL_OR_PASSWORD") {
              toast.add({
                type: "error",
                description: "E-mail ou senha inválidos",
              });
              return setLoading(false);
            }
            toast.add({ type: "error", description: "Erro ao fazer login" });
            setLoading(false);
          },
        },
      );
      setData({ email: "", name: "", password: "" });
    }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-sm space-y-5">
      <div>
        <h1 className="text-3xl font-semibold">
          {mode === "login" ? "Entrar" : "Criar acesso"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "login"
            ? "Acesse o painel da equipe."
            : "Crie sua conta para acessar o painel."}
        </p>
      </div>

      {mode === "signup" && (
        <Field>
          <Label htmlFor="name">Nome</Label>
          <Input
            required
            id="name"
            autoComplete="off"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
        </Field>
      )}

      <Field className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          required
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
      </Field>
      <Field className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          required
          id="password"
          type="password"
          minLength={8}
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
      </Field>

      <Button
        type="submit"
        className="w-full h-10 bg-blue-500 hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? <Spinner /> : mode === "login" ? "Entrar" : "Criar conta"}
      </Button>
      <button
        type="button"
        className="w-full text-sm text-muted-foreground hover:text-foreground"
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
      >
        {mode === "login"
          ? "Não tem acesso? Criar conta"
          : "Já tem conta? Entrar"}
      </button>
    </form>
  );
}
