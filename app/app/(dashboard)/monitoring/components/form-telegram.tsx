"use client";

import { useState } from "react";
import { Send } from "lucide-react";

import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { createChatTelegram, sendTestTelegram } from "../actions";

export function FormTelegram() {
  const [chatId, setChatId] = useState("");
  const [loading, setLoading] = useState(false);

  async function saveChat() {
    if (!chatId) return;

    setLoading(true);

    const result = await createChatTelegram(chatId);
    if (result.success) {
      toast.add({
        type: "success",
        description: result.message,
      });
      setChatId("");
    } else {
      toast.add({
        type: "error",
        description: result.message,
      });
    }
    setLoading(false);
  }

  async function test() {
    setLoading(true);

    const result = await sendTestTelegram();
    if (result.success) {
      toast.add({
        type: "success",
        description: result.message,
      });
    } else {
      toast.add({
        type: "error",
        description: result.message,
      });
    }
    setLoading(false);
  }

  return (
    <div className="w-full rounded-lg border bg-card p-6">
      <h2 className="font-display font-semibold">Alertas no Telegram</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Informe o ID do chat ou grupo que vai receber os avisos (envie uma
        mensagem ao bot e use o @userinfobot para descobrir o ID).
      </p>
      <div className="flex flex-wrap justify-between mt-4 gap-2">
        <div className="w-full md:w-auto flex flex-col gap-2">
          <Input
            // className="w-full md:max-w-lg"
            placeholder="-1001234567890"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
          />
        </div>
        <div className="w-full md:w-auto flex justify-between gap-2">
          <Button variant="outline" onClick={saveChat}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
          <Button variant="outline" onClick={test}>
            {loading ? <Spinner /> : <Send />}
            {loading ? "Enviando..." : "Enviar teste"}
          </Button>
        </div>
      </div>
    </div>
  );
}
