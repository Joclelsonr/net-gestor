"use client";

import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function FormLogin() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    console.log("submit", data);
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
        {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
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
