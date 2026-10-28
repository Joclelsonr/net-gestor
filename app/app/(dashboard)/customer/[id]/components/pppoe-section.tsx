"use client";

import { useState } from "react";
import { Eye, EyeOff, Save, Network } from "lucide-react";

import { toast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { createPppoe, revealPassword } from "../actions";

import type { Pppoe } from "@/generated/prisma/client";

type PppoeProps = { pppoe: Pppoe; customerId: string };

export function PppoeSection({ pppoe, customerId }: PppoeProps) {
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [savedPassword, setSavedPassword] = useState<string | null>(null);

  async function toggleSavedPassword() {
    if (savedPassword !== null) {
      setSavedPassword(null);
      return;
    }
    setRevealing(true);

    const result = await revealPassword(customerId);
    if (result) {
      setSavedPassword(result);
      setRevealing(false);
      return;
    }
    toast.add({
      type: "error",
      description: "Não foi possível visualizar a senha PPPoE",
    });
    setRevealing(false);
  }

  async function save(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const result = await createPppoe(customerId, username!, password);

    if (result.success) {
      toast.add({
        type: "success",
        description: result.message,
      });
      setPassword("");
    } else {
      toast.add({
        type: "error",
        description: result.message,
      });
    }
    setLoading(false);
  }

  return (
    <section className="mt-8 border-t pt-6">
      <h2 className="flex items-center gap-2 text-xl font-semibold">
        <Network className="h-5 w-5 text-primary" /> Acesso PPPoE
      </h2>
      <form
        onSubmit={save}
        className="mt-4 grid items-end gap-4 sm:grid-cols-2"
      >
        <div className="space-y-2">
          <Label htmlFor="pppoe-username">Usuário PPPoE</Label>
          <Input
            required
            id="pppoe-username"
            className="bg-white"
            autoComplete="off"
            maxLength={128}
            value={username ?? pppoe.username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pppoe-password">
            {false ? "Nova senha PPPoE" : "Senha PPPoE"}
          </Label>
          <div className="flex gap-2">
            <Input
              required
              id="pppoe-password"
              type={visible ? "text" : "password"}
              autoComplete="new-password"
              className="bg-white"
              maxLength={256}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
              title={visible ? "Ocultar senha" : "Mostrar senha"}
              onClick={() => setVisible(!visible)}
            >
              {visible ? <EyeOff /> : <Eye />}
            </Button>
          </div>
        </div>
        {!pppoe && (
          <p className="text-sm text-muted-foreground">
            Nenhum usuário e senha cadastrado
          </p>
        )}
        {pppoe && (
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="saved-pppoe-password">Senha PPPoE salva</Label>
            <div className="flex gap-2">
              <Input
                id="saved-pppoe-password"
                readOnly
                type={savedPassword !== null ? "text" : "password"}
                value={savedPassword ?? "••••••••"}
                autoComplete="off"
                className="bg-white"
              />
              <Button
                type="button"
                variant="outline"
                disabled={revealing}
                aria-label={
                  savedPassword !== null
                    ? "Ocultar senha salva"
                    : "Ver senha salva"
                }
                title={
                  savedPassword !== null
                    ? "Ocultar senha salva"
                    : "Ver senha salva"
                }
                onClick={toggleSavedPassword}
              >
                {savedPassword !== null ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {revealing
                  ? "Aguarde..."
                  : savedPassword !== null
                    ? "Ocultar"
                    : "Ver senha"}
              </Button>
            </div>
          </div>
        )}
        <Button
          size="lg"
          type="submit"
          className="sm:col-start-2 sm:justify-self-end bg-blue-500 hover:bg-blue-600"
          disabled={loading || !password}
        >
          {loading ? <Spinner /> : <Save />}
          {loading ? "Salvando..." : "Salvar PPPoE"}
        </Button>
      </form>
    </section>
  );
}
