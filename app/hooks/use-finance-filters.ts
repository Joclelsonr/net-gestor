"use client";

import { useState } from "react";

import { monthRange, yearRange } from "@/lib/finance-rules";
import { FinanceTab } from "@/app/(dashboard)/finance/components/finance-tabs";

type PeriodPreset = "month" | "last" | "year";

export function useFinanceFilters() {
  const initial = monthRange();

  const [start, setStart] = useState(initial.start);
  const [end, setEnd] = useState(initial.end);

  const [tab, setTab] = useState<FinanceTab>("overview");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("todos");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  function changePeriod(preset: PeriodPreset) {
    const now = new Date();

    if (preset === "month") {
      const period = monthRange(now);
      setStart(period.start);
      setEnd(period.end);
    }

    if (preset === "last") {
      const previousMonth = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1),
      );

      const period = monthRange(previousMonth);
      setStart(period.start);
      setEnd(period.end);
    }

    if (preset === "year") {
      const period = yearRange(now);
      setStart(period.start);
      setEnd(period.end);
    }

    setPage(1);
  }

  function changeTab(value: FinanceTab) {
    setTab(value);
    setPage(1);
    setStatus("todos");
    setSearch("");
  }

  function changeStart(date: Date) {
    setStart(date);
    setPage(1);
  }

  function changeEnd(date: Date) {
    setEnd(date);
    setPage(1);
  }

  function changeSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function changeStatus(value: string) {
    setStatus(value);
    setPage(1);
  }

  return {
    start,
    end,
    tab,
    page,
    status,
    search,
    loading,

    setPage,
    setStart,
    setEnd,
    setLoading,

    changePeriod,
    changeTab,
    changeStart,
    changeEnd,
    changeSearch,
    changeStatus,
  };
}
