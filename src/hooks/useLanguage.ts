// hooks/useLanguage.ts
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useLanguage() {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    // 1. Try Local Storage first (Fastest)
    const localLang = localStorage.getItem("drixe_language");
    if (localLang) setLanguage(localLang);

    // 2. Fetch from DB to ensure sync
    async function fetchLang() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("language")
          .eq("id", user.id)
          .single();
        
        if (data?.language) {
          setLanguage(data.language);
          localStorage.setItem("drixe_language", data.language);
        }
      }
    }
    fetchLang();
  }, []);

  return language;
}