"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";

// ── Supabase ──────────────────────────────────────────────────────────────────
const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ── Fixed Plan Start Date ─────────────────────────────────────────────────────
const PLAN_START = "2026-04-06";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Task {
  id: string;
  cat: keyof typeof TASK_CATEGORIES;
  time: string;
  endTime?: string;
  label: string;
  detail?: string;
  resource?: { title: string; url: string; type: "video" | "article" | "tool" };
  phase: number[];
  weekend?: boolean;
}

interface DayCheck {
  task_id: string;
  completed: boolean;
}

interface HistoryEntry {
  total: number;
  done: number;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const PHASES = [
  { id: "p1", month: 1, label: "Build the base", color: "#C8A96E", weeks: "Weeks 1–4", focus: "Kill dandruff · Fix sleep · Start moving · Eat right" },
  { id: "p2", month: 2, label: "Stack habits",   color: "#7EB8C9", weeks: "Weeks 5–8",  focus: "Full workout · Skin locked · Cyber basics · Fiverr setup" },
  { id: "p3", month: 3, label: "See results",    color: "#A89EC9", weeks: "Weeks 9–12", focus: "Visible fat loss · Hair stable · English fluent · First ₹" },
  { id: "p4", month: 4, label: "Level up",       color: "#7EC99A", weeks: "Weeks 13–16",focus: "Body transformed · Cyber cert prep · Guitar song · Autopilot" },
] as const;

const TASK_CATEGORIES = {
  body:    { label: "Body",        color: "#C8A96E", icon: "◈" },
  skin:    { label: "Skin",        color: "#E8A598", icon: "◉" },
  hair:    { label: "Hair",        color: "#7EB8C9", icon: "◎" },
  diet:    { label: "Diet",        color: "#7EC99A", icon: "◆" },
  mind:    { label: "Mind/Sleep",  color: "#A89EC9", icon: "◐" },
  cyber:   { label: "Cyber",       color: "#E8C96E", icon: "◇" },
  english: { label: "English",     color: "#C97EB8", icon: "◑" },
  guitar:  { label: "Guitar",      color: "#C9907E", icon: "◒" },
} as const;

const LEARN_COLORS = {
  cp:    "#7EB8C9",
  cyber: "#E8C96E",
  uiux:  "#A89EC9",
  extra: "#7EC99A",
};

// ── Weekday Tasks (updated 6am schedule) ─────────────────────────────────────
const WEEKDAY_TASKS: Task[] = [
  {
    id: "wake", cat: "mind", time: "6:00", endTime: "6:05",
    label: "Wake up — NO phone for first 10 min",
    detail: "Put your phone across the room before sleeping. When alarm rings, walk to it — you're already up. 6am is non-negotiable.",
    phase: [1,2,3,4],
  },
  {
    id: "water_am", cat: "diet", time: "6:05", endTime: "6:08",
    label: "2 glasses water immediately",
    detail: "Your body is dehydrated after 7+ hours. This kickstarts metabolism and reduces hunger.",
    phase: [1,2,3,4],
  },
  {
    id: "scalp", cat: "hair", time: "6:08", endTime: "6:13",
    label: "5-min dry scalp massage",
    detail: "Fingertips only, circular motion. Cover whole scalp including temples. Increases blood flow — #1 free hair growth hack.",
    resource: { title: "How to do scalp massage correctly", url: "https://www.youtube.com/watch?v=vFHgS1m3UYk", type: "video" },
    phase: [1,2,3,4],
  },
  {
    id: "workout_p1", cat: "body", time: "6:13", endTime: "6:30",
    label: "15-min starter workout: push-ups + squats",
    detail: "10 push-ups → 15 squats → 10 push-ups → 15 squats → 30s plank. Knees on floor is fine. Just do it.",
    phase: [1],
  },
  {
    id: "workout_p2", cat: "body", time: "6:13", endTime: "6:50",
    label: "Full 35-min workout: 5 rounds",
    detail: "15 push-ups → 20 squats → 10 pike push-ups → 15 lunges → 20 crunches → 30s plank. Rest 45s between rounds.",
    resource: { title: "No-equipment workout (exact routine)", url: "https://www.youtube.com/watch?v=IODxDxX7oi4", type: "video" },
    phase: [2,3,4],
  },
  {
    id: "face_am", cat: "skin", time: "6:50", endTime: "6:53",
    label: "CeraVe face wash (post-workout)",
    detail: "Wet face → small amount CeraVe → gentle circular motion 60s → rinse with lukewarm water. NOT hot.",
    phase: [1,2,3,4],
  },
  {
    id: "sunscreen", cat: "skin", time: "6:53", endTime: "6:55",
    label: "Apply sunscreen — non-negotiable",
    detail: "SPF 30+ minimum. Face + neck + arms. This is the single most effective anti-tan, anti-pigmentation thing. EVERY DAY.",
    phase: [1,2,3,4],
  },
  {
    id: "breakfast", cat: "diet", time: "7:10", endTime: "7:25",
    label: "Breakfast: muesli + 2 tbsp peanut butter",
    detail: "~450 calories, ~20g protein. Add milk or water to muesli. Peanut butter straight or mixed in. Keeps you full till lunch.",
    phase: [1,2,3,4],
  },
  {
    id: "commute_eng", cat: "english", time: "8:00",
    label: "Commute: Read 1 English article (no reels)",
    detail: "Open BBC News or The Hindu app. Read one full article. Notice sentence structure — don't just skim headlines.",
    resource: { title: "BBC News (bookmark this)", url: "https://www.bbc.com/news", type: "article" },
    phase: [1,2,3,4],
  },
  {
    id: "water_clg", cat: "diet", time: "College",
    label: "Drink 2L water through the day",
    detail: "Carry a bottle. Dehydration = low energy, bad skin, increased hunger. Hit 2L before dinner.",
    phase: [1,2,3,4],
  },
  {
    id: "lunch", cat: "diet", time: "1:00", endTime: "1:20",
    label: "Lunch: 2 rotis + dal + sabzi + curd",
    detail: "~600 cal, ~25g protein. Curd adds probiotics — good for skin and digestion. Eat slowly.",
    phase: [1,2,3,4],
  },
  {
    id: "english_shadow", cat: "english", time: "7:00", endTime: "7:15",
    label: "English shadowing — 15 min, speak OUT LOUD",
    detail: "Open Rachel's English playlist. Play video. PAUSE after every sentence. Repeat exactly — same tone, rhythm, mouth position. Don't just listen.",
    resource: { title: "Rachel's English — American accent basics", url: "https://www.youtube.com/playlist?list=PL3oW2tjiIxvTHQhwvMHMGthcmRDj0z5dN", type: "video" },
    phase: [1,2,3,4],
  },
  {
    id: "study_block", cat: "cyber", time: "7:15", endTime: "10:00",
    label: "Main study block — 2h 45min (see Learning tab)",
    detail: "This is your primary skill time. Rotate: Mon=CP+UIX, Tue=Cyber+CP, Wed=UIX+Cyber, Thu=CP, Fri=Cyber+UIX. Check Learning tab for today's topics.",
    phase: [1,2,3,4],
  },
  {
    id: "guitar", cat: "guitar", time: "9:30", endTime: "9:50",
    label: "Guitar — 15 min JustinGuitar (last 30 min of study block)",
    detail: "Don't skip ahead. Beginner course in order. Month 1: D+A chords. Month 2: G chord. Month 3: chord changes. Month 4: full song.",
    resource: { title: "JustinGuitar Beginner Course (free)", url: "https://www.justinguitar.com/guitar-lessons/the-absolute-beginners-course", type: "article" },
    phase: [2,3,4],
  },
  {
    id: "walk", cat: "body", time: "6:00", endTime: "7:00",
    label: "Evening brisk walk 6–7pm (before study block)",
    detail: "Fast enough that talking would be slightly hard. Listen to English podcast. Burns 200–300 cal of fat. Critical habit.",
    phase: [1,2,3,4],
  },
  {
    id: "dinner", cat: "diet", time: "5:30", endTime: "5:50",
    label: "Dinner before walk: roti + soya chunks + salad",
    detail: "Soya chunks = 52g protein per 100g dry. Cook with spices. Keep dinner light — more protein and vegetables.",
    phase: [1,2,3,4],
  },
  {
    id: "english_write", cat: "english", time: "9:45", endTime: "9:55",
    label: "Write 5 sentences in English (end of study block)",
    detail: "Notes app, diary, anything. Write about your day. Don't correct while writing. Grammar improves by output.",
    phase: [1,2,3,4],
  },
  {
    id: "face_pm", cat: "skin", time: "9:55", endTime: "10:00",
    label: "Night routine: face wash + coconut oil + aloe",
    detail: "Wash face. While damp — 2-3 drops coconut oil. Pat gently. Then thin layer aloe vera on dark spots. Leave overnight.",
    phase: [1,2,3,4],
  },
  {
    id: "sleep", cat: "mind", time: "10:00",
    label: "In bed — phone in ANOTHER ROOM",
    detail: "Non-negotiable. Everything — energy, hair, skin, testosterone, motivation — improves with proper sleep. 10pm, every night.",
    phase: [1,2,3,4],
  },
];

// ── Weekend Tasks ────────────────────────────────────────────────────────────
const WEEKEND_TASKS: Task[] = [
  { id: "wk_wake", cat: "mind", time: "7:00", label: "Wake up by 7am — protect sleep schedule", detail: "Max 1 hour later than weekday. Sleeping till noon breaks your Monday rhythm.", phase: [1,2,3,4], weekend: true },
  { id: "wk_water", cat: "diet", time: "7:05", label: "2 glasses water", detail: "Same as weekdays.", phase: [1,2,3,4], weekend: true },
  { id: "wk_workout", cat: "body", time: "7:15", endTime: "8:00", label: "Full 45-min workout", detail: "More time = more rounds. 6 rounds: 15 push-ups → 20 squats → 10 diamond push-ups → 20 lunges → 15 dips (chair) → 30s plank.", resource: { title: "Full bodyweight workout at home", url: "https://www.youtube.com/watch?v=UItWltVZZmE", type: "video" }, phase: [1,2,3,4], weekend: true },
  { id: "wk_acv", cat: "hair", time: "8:05", endTime: "8:25", label: "ACV scalp treatment (weekends only)", detail: "Mix 1 part ACV + 3 parts water. Apply to scalp. Leave 15 min. Rinse. Kills dandruff fungus.", phase: [1,2,3,4], weekend: true },
  { id: "wk_besan", cat: "skin", time: "8:30", endTime: "8:45", label: "Besan + lemon scrub (de-tanning)", detail: "2 tbsp besan + few drops lemon + water. Apply to face/neck/arms. Leave 10 min. Scrub off gently.", phase: [1,2,3,4], weekend: true },
  { id: "wk_breakfast", cat: "diet", time: "9:00", label: "Breakfast: muesli + peanut butter", detail: "Same as weekdays.", phase: [1,2,3,4], weekend: true },
  { id: "wk_deep1", cat: "cyber", time: "9:30", endTime: "12:00", label: "Deep learning block 1 — 2.5h (see Learning tab)", detail: "Weekend = no time pressure. Use this for your hardest topics. CP contest practice or CTF or portfolio project.", phase: [1,2,3,4], weekend: true },
  { id: "wk_lunch", cat: "diet", time: "12:00", label: "Lunch break — 30 min", detail: "Eat, rest eyes, step outside briefly.", phase: [1,2,3,4], weekend: true },
  { id: "wk_deep2", cat: "cyber", time: "12:30", endTime: "3:30", label: "Deep learning block 2 — 3h (project / contest)", detail: "Weekend project time. UI/UX: build something. Cyber: full CTF. CP: virtual contest or hard problems.", phase: [1,2,3,4], weekend: true },
  { id: "wk_guitar", cat: "guitar", time: "4:00", endTime: "4:30", label: "30-min guitar practice", detail: "Review everything from this week. Practice chord transitions. Record yourself once a month to hear progress.", phase: [2,3,4], weekend: true },
  { id: "wk_english", cat: "english", time: "4:30", endTime: "5:00", label: "English — 1 full YouTube video, no subtitles", detail: "Pick a topic you like (cars, business, tech). Watch without subtitles. Note words you didn't catch.", phase: [2,3,4], weekend: true },
  { id: "wk_walk", cat: "body", time: "6:00", endTime: "7:00", label: "Long walk 60 min", detail: "Park if possible. No phone. Just walk and think. Mental clarity for the week ahead.", phase: [1,2,3,4], weekend: true },
  { id: "wk_review", cat: "mind", time: "8:00", endTime: "8:30", label: "Weekly review — check streak + plan ahead", detail: "Open this app. See what % you hit. What was hardest? What's the fix for next week? Write 3 goals.", phase: [1,2,3,4], weekend: true },
  { id: "wk_extras", cat: "guitar", time: "8:30", endTime: "9:30", label: "Extras: DJ / Spanish / Reading / YouTube learning", detail: "Use this hour for extra activities (see Learning > Extras tab). Spanish Duolingo + DJ practice + 10 pages reading.", phase: [1,2,3,4], weekend: true },
  { id: "wk_sleep", cat: "mind", time: "10:00", label: "In bed by 10pm", detail: "Same rule applies on weekends.", phase: [1,2,3,4], weekend: true },
];

// ── Weekly Resource Plan (existing 4-month body plan) ────────────────────────
const WEEKLY_RESOURCES = [
  { week: 1, phase: 1, theme: "Foundation — understand the basics of everything", cyber: { daily: "Professor Messer Network+ — 1 video/day Section 1 (Network Basics)", url: "https://www.youtube.com/playlist?list=PLG49S3nxzAnnXcPUJbwikr2xAcmKljbnQ", goal: "Understand what IP address, DNS, HTTP, firewall mean" }, english: { daily: "Rachel's English: 'Introduction to American English sounds' Episodes 1–5", url: "https://www.youtube.com/c/rachelsenglish", goal: "Learn where American R sound comes from. Practice daily." }, body: { daily: "Workout morning + 60 min walk evening", goal: "Build the habit. Not the muscle yet." }, achieve: ["Dandruff treatment started", "Morning workout habit locked", "Sleep before 10pm 3x", "Cyber: know what a network is"] },
  { week: 2, phase: 1, theme: "Routine locked — no more thinking, just doing", cyber: { daily: "Professor Messer Network+ — Section 2 (OSI Model, TCP/IP)", url: "https://www.youtube.com/playlist?list=PLG49S3nxzAnnXcPUJbwikr2xAcmKljbnQ", goal: "Understand how data travels across the internet" }, english: { daily: "Rachel's English: Vowel sounds series", url: "https://www.youtube.com/playlist?list=PL3oW2tjiIxvTHQhwvMHMGthcmRDj0z5dN", goal: "American vowel sounds. Shadow every video out loud." }, body: { daily: "Workout + extra set if you feel good + walk", goal: "Consistency. 7/7 days." }, achieve: ["Morning routine automatic", "Dandruff visibly less", "Spoke English out loud daily", "Can explain what OSI model is"] },
  { week: 3, phase: 1, theme: "Push harder — first visible changes", cyber: { daily: "Professor Messer: Section 3 (Network Security Basics)", url: "https://www.youtube.com/playlist?list=PLG49S3nxzAnnXcPUJbwikr2xAcmKljbnQ", goal: "Know what a VPN, firewall, IDS/IPS is" }, english: { daily: "TED Talk: pick any 10-min talk, watch once with subs, once without", url: "https://www.ted.com/talks?sort=popular&language=en", goal: "Train your ear for natural English speech rhythm" }, body: { daily: "Full routine + walk. First diet tracking week.", goal: "See first body change" }, achieve: ["1 kg weight loss", "Face dryness reducing", "Sleeping before 10pm 5x/week", "Know basics of network security"] },
  { week: 4, phase: 1, theme: "Prove it to yourself — 1 month review", cyber: { daily: "OverTheWire Bandit — Linux command line game, levels 0–10", url: "https://overthewire.org/wargames/bandit/", goal: "First hands-on cyber skill. Learn to use Linux terminal." }, english: { daily: "Write 5 sentences + read 1 article + shadow 15 min (all 3 daily)", url: "https://www.bbc.com/news", goal: "All 3 pillars running together" }, body: { daily: "Full workout begins — all rounds", goal: "Upgrade from starter to real routine" }, achieve: ["Month 1 complete", "Dandruff under control", "1.5–2 kg fat loss", "Can do 15 push-ups", "Linux basics started"] },
  { week: 5, phase: 2, theme: "TryHackMe begins — real hacking practice", cyber: { daily: "TryHackMe: Complete 'Pre-Security' path (free). 1 room per day.", url: "https://tryhackme.com/path/outline/presecurity", goal: "Finish Pre-Security path this month" }, english: { daily: "Rachel's English: Consonant sounds series. Practice R, TH, T sounds.", url: "https://www.youtube.com/playlist?list=PL3oW2tjiIxvTHQhwvMHMGthcmRDj0z5dN", goal: "Your R sound should start sounding American" }, body: { daily: "Full routine every morning. Add diamond push-ups for arms.", goal: "Arms starting to show definition" }, achieve: ["TryHackMe Pre-Security started", "Guitar D+A chords learned", "Fiverr profile created"] },
  { week: 6, phase: 2, theme: "Skin + hair showing results", cyber: { daily: "TryHackMe: Continue Pre-Security path. Linux fundamentals room.", url: "https://tryhackme.com/room/linuxfundamentals1", goal: "Comfortable with Linux commands" }, english: { daily: "BBC 6-Minute English podcast daily", url: "https://www.youtube.com/@BBCLearningEnglish", goal: "Natural listening comprehension." }, body: { daily: "Workout + walk. Track food — count protein not calories.", goal: "Eating 80g+ protein per day" }, achieve: ["2–3 kg fat loss total", "Tan visibly lighter", "TryHackMe: 20+ rooms", "Guitar transitions smoother"] },
  { week: 7, phase: 2, theme: "Compound — everything stacking", cyber: { daily: "TryHackMe: 'Jr Penetration Tester' path — Web fundamentals", url: "https://tryhackme.com/path/outline/jrpenetrationtester", goal: "Understand how websites get hacked" }, english: { daily: "Shadowing: pick 1 YouTube creator you like, shadow 15 min", url: "https://www.youtube.com/", goal: "Accent starts shifting toward target" }, body: { daily: "Add 5 reps to every exercise from week 1 baseline", goal: "Strength improving measurably" }, achieve: ["First Fiverr gig listed", "3 kg fat loss", "Guitar: 3 chords (D, A, G)", "Can hold English conversation 5 min"] },
  { week: 8, phase: 2, theme: "Month 2 review — visible person", cyber: { daily: "TryHackMe: OWASP Top 10 room (critical for any cyber job)", url: "https://tryhackme.com/room/owasptop102021", goal: "Know the 10 most common web vulnerabilities" }, english: { daily: "Write 1 paragraph (5+ sentences) daily. Read it out loud after.", url: "", goal: "Writing and speaking confidence up" }, body: { daily: "Rest day Wednesday. 6 days workout, 1 rest.", goal: "Body adapting — recovery matters now" }, achieve: ["Month 2 done", "Noticeable body change", "TryHackMe 40+ rooms", "Guitar: simple song"] },
  { week: 9, phase: 3, theme: "See it in the mirror", cyber: { daily: "TryHackMe: 'Advent of Cyber' rooms — practical daily challenges", url: "https://tryhackme.com/", goal: "50 rooms total by end of month" }, english: { daily: "Watch 1 American interview on YouTube without subtitles", url: "https://www.youtube.com/@LexFridmanPodcast", goal: "Understanding fast natural American speech" }, body: { daily: "Before photo check. 3–4 kg down. Arms visible.", goal: "External validation begins" }, achieve: ["People notice the difference", "Dark spots lighter", "Scalp itch gone completely", "English: no subtitles needed"] },
  { week: 10, phase: 3, theme: "Professional skill building", cyber: { daily: "Start CompTIA Security+ Professor Messer series", url: "https://www.youtube.com/playlist?list=PLG49S3nxzAnnXcPUJbwikr2xAcmKljbnQ", goal: "Understand what cert exams require" }, english: { daily: "English conversation: use ChatGPT to roleplay conversations", url: "https://chat.openai.com", goal: "Speaking without hesitation" }, body: { daily: "Push to 20 push-ups per set. Add jumping lunges.", goal: "Stamina doubled from month 1" }, achieve: ["Security+ path started", "60 TryHackMe rooms", "Freelancing: first inquiry or order"] },
  { week: 11, phase: 3, theme: "Hair and skin wins", cyber: { daily: "TryHackMe: Network Security path", url: "https://tryhackme.com/path/outline/networksecurity", goal: "Deep understanding of network attacks" }, english: { daily: "Read 1 chapter of any English book (simple fiction is fine)", url: "", goal: "Reading speed improving — vocab exploding" }, body: { daily: "4–5 kg down. Start v-cut abs: leg raises + hollow holds.", goal: "Core definition starting" }, achieve: ["Temple hair loss stabilized", "Skin even tone visible", "English: writing without thinking"] },
  { week: 12, phase: 3, theme: "Month 3 — 90-day transformation", cyber: { daily: "Hack The Box — try first easy machine", url: "https://www.hackthebox.com/", goal: "Real world hacking practice. Portfolio piece." }, english: { daily: "Record yourself speaking English for 2 min. Listen back.", url: "", goal: "Self-correction — fastest accent improvement method" }, body: { daily: "Photo + weight comparison from day 1. Celebrate the progress.", goal: "5 kg+ loss. Arms defined. Confidence transformed." }, achieve: ["3 months complete", "Body transformation real", "Cyber: job-ready basics", "Income: first ₹ earned"] },
  { week: 13, phase: 4, theme: "Polish and professionalize", cyber: { daily: "Google Cybersecurity Certificate — apply for financial aid on Coursera", url: "https://www.coursera.org/professional-certificates/google-cybersecurity", goal: "Industry recognized certificate — free with financial aid" }, english: { daily: "LinkedIn content: write 1 post per week about what you're learning", url: "https://www.linkedin.com/", goal: "Build professional online presence" }, body: { daily: "Maintain — don't gain back. Weigh every Monday.", goal: "Body is the new normal" }, achieve: ["Google Cyber cert started", "LinkedIn active", "Guitar: 2 full songs"] },
  { week: 14, phase: 4, theme: "Income focus", cyber: { daily: "Build a mini portfolio: document 3 TryHackMe writeups on Notion", url: "https://www.notion.so/", goal: "Proof of skill for jobs/clients" }, english: { daily: "Cold DM 3 businesses on Instagram offering your service", url: "", goal: "First client conversation" }, body: { daily: "Maintain + push: try 5 pull-ups on a bar at park", goal: "Functional strength up" }, achieve: ["Portfolio started", "First client DMs sent", "Fiverr: 2+ orders"] },
  { week: 15, phase: 4, theme: "Systems running themselves", cyber: { daily: "Prep Security+ — 1 practice question set daily", url: "https://www.examtopics.com/exams/comptia/sy0-701/", goal: "Cert exam in 2–3 months from now" }, english: { daily: "Hold a 10-min English conversation with someone", url: "", goal: "Real world English is different from shadowing." }, body: { daily: "Body: 5+ kg lighter, visibly different. Routine: 20 min, feels like nothing.", goal: "It's automatic" }, achieve: ["Cert prep started", "English conversational", "Routine takes zero willpower"] },
  { week: 16, phase: 4, theme: "Month 4 — New person", cyber: { daily: "Review everything. Make a plan for next 4 months (cert + job applications)", url: "", goal: "You're no longer a beginner. You're building a career." }, english: { daily: "Record a 5-min video of yourself speaking English. Compare to month 1.", url: "", goal: "Hear the transformation in your own voice" }, body: { daily: "Final comparison photo. Share with no one or everyone — your choice.", goal: "The proof is in your mirror" }, achieve: ["4 months complete", "Person you wanted to be", "Income started", "Path clear for next year"] },
];

// ── 8-Month Learning Plan ─────────────────────────────────────────────────────
const LEARNING_MONTHLY = [
  {
    month: 1,
    theme: "Foundation — start from absolute zero",
    daySchedule: {
      monWed: ["3:00–4:30: C++ basics (learncpp.com Chapters 1–5)", "4:30–6:00: HTML/CSS (Kevin Powell CSS basics)", "7:00–8:30: Cyber — HTTP + Linux OverTheWire Bandit", "8:30–10:00: English + Guitar"],
      thuFri: ["7:00–8:30: C++ + STL basics", "8:30–10:00: Cyber — PortSwigger intro + TryHackMe"],
      weekend: ["9:30–12:00: CP — CSES problems + C++ drills", "12:30–3:30: UI/UX — build HTML pages from scratch", "8:30–9:30: Extras (Spanish Duolingo + 10 pages reading)"],
    },
    cp: {
      focus: "C++ syntax + STL + Level 1 DSA",
      daily: "1h theory + 3 CF problems/day (Div 2, A-level)",
      resources: [
        { title: "learncpp.com — C++ from scratch (free, best)", url: "https://www.learncpp.com", type: "article" as const },
        { title: "Codeforces — start with 800-rated problems", url: "https://codeforces.com/problemset?tags=implementation&difficulty=800", type: "tool" as const },
        { title: "CSES Problem Set — best structured problems", url: "https://cses.fi/problemset/", type: "article" as const },
        { title: "cppreference.com — STL reference", url: "https://en.cppreference.com/w/", type: "article" as const },
      ],
      weeks: [
        { week: 1, topic: "C++ basics: variables, loops, functions, I/O", task: "learncpp.com Chapters 1–5. Write 10 small programs. Fast I/O: ios::sync_with_stdio(0); cin.tie(0);" },
        { week: 2, topic: "STL: vector, sort, map, set, pair, unordered_map", task: "cppreference: Read STL containers. Solve 5 CF problems using only STL (tag: implementation, 900-rated)." },
        { week: 3, topic: "Arrays + Strings + Prefix Sum", task: "CSES: Static Range Sum Queries + 4 string problems. Understand prefix sum formula: pre[i] = pre[i-1] + a[i]." },
        { week: 4, topic: "Sorting + Binary Search intro", task: "Implement merge sort by hand from memory. Solve 5 binary search problems on CSES. CF: 3 problems with binary search tag." },
      ],
      milestone: "Can solve CF Div 2 A problems independently. C++ feels natural.",
    },
    cyber: {
      focus: "HTTP basics + Linux CLI + Web security foundations",
      daily: "1 TryHackMe room OR 1 PortSwigger reading session",
      resources: [
        { title: "PortSwigger Web Security Academy — best free web security course ever", url: "https://portswigger.net/web-security", type: "article" as const },
        { title: "OverTheWire: Bandit — Linux wargame from level 0", url: "https://overthewire.org/wargames/bandit/", type: "tool" as const },
        { title: "TryHackMe — Pre-Security path (fully free)", url: "https://tryhackme.com/path/outline/presecurity", type: "tool" as const },
        { title: "CyberChef — encode/decode anything", url: "https://gchq.github.io/CyberChef/", type: "tool" as const },
        { title: "picoCTF — your first real CTF platform", url: "https://picoctf.org", type: "tool" as const },
      ],
      weeks: [
        { week: 1, topic: "HTTP: GET, POST, headers, cookies, status codes", task: "PortSwigger: Read 'Web Security Academy' learning paths intro. Complete 'HTTP' section. Use browser DevTools → Network tab to see real requests." },
        { week: 2, topic: "Linux CLI: cd, ls, cat, grep, find, nc, pipes, chmod", task: "OverTheWire Bandit: Complete levels 0–15. Every command you use — write it in a note with what it does." },
        { week: 3, topic: "Networks: IP, DNS, TCP/IP, OSI model layers", task: "TryHackMe Pre-Security: 'How the web works' (3 rooms) + 'Network fundamentals' (4 rooms). Take notes on each layer." },
        { week: 4, topic: "First CTF: picoCTF General Skills", task: "picoCTF.org: Register and solve 5 General Skills challenges. Read write-ups for any you can't solve in 30 min." },
      ],
      milestone: "Understand how the internet works at protocol level. Linux CLI comfortable.",
    },
    uiux: {
      focus: "HTML5 + CSS + Figma basics + design fundamentals",
      daily: "1h — build something in HTML/CSS OR 30min Figma practice",
      resources: [
        { title: "Kevin Powell CSS — best CSS YouTube channel (free)", url: "https://www.youtube.com/@KevinPowell", type: "video" as const },
        { title: "MDN Web Docs — HTML & CSS reference", url: "https://developer.mozilla.org/en-US/docs/Learn", type: "article" as const },
        { title: "Figma YouTube — official beginner tutorials", url: "https://www.youtube.com/@Figma", type: "video" as const },
        { title: "Refactoring UI — design book for developers (read online)", url: "https://www.refactoringui.com", type: "article" as const },
        { title: "Google Fonts — typography pairing", url: "https://fonts.google.com", type: "tool" as const },
      ],
      weeks: [
        { week: 1, topic: "HTML5: semantic tags, forms, structure", task: "Build a college homepage from scratch in HTML. Use: nav, main, section, article, footer. No CSS yet." },
        { week: 2, topic: "CSS: box model, flexbox, custom properties", task: "Kevin Powell: Watch flexbox playlist (8 videos). Style your week 1 HTML page. Use flexbox for every layout." },
        { week: 3, topic: "CSS Grid + responsive design + media queries", task: "Kevin Powell: Grid playlist. Make your site work on mobile and desktop. Use @media (max-width: 768px)." },
        { week: 4, topic: "Figma: frames, shapes, auto layout, components", task: "Figma tutorials: Complete 'Getting started' (4 videos). Recreate 1 real app screen (Instagram or Swiggy) pixel-perfect." },
      ],
      milestone: "Can build any static site from scratch. Figma: can design a single screen.",
    },
  },
  {
    month: 2,
    theme: "Core skills — go deeper, go faster",
    daySchedule: {
      monWed: ["3:00–4:30: Binary Search + Two Pointers problems", "4:30–6:00: React fundamentals (react.dev tutorial)", "7:00–8:30: Cyber — SQLi PortSwigger labs", "8:30–10:00: English + Guitar"],
      thuFri: ["7:00–8:30: CP — Hashing + Recursion", "8:30–10:00: UI/UX — Tailwind CSS"],
      weekend: ["9:30–12:00: CP — CF contest virtual + upsolve", "12:30–3:30: UI/UX — build React todo app", "8:30–9:30: Extras (DJ basics + Spanish Duolingo)"],
    },
    cp: {
      focus: "Binary Search + Two Pointers + Sliding Window + Hashing + Recursion",
      daily: "1.5h — 3-5 problems, focus Level 2 topics",
      resources: [
        { title: "NeetCode.io — video explanations + roadmap", url: "https://neetcode.io/roadmap", type: "article" as const },
        { title: "LeetCode — filter: two-pointers tag", url: "https://leetcode.com/tag/two-pointers/", type: "tool" as const },
        { title: "Codeforces Edu — binary search course", url: "https://codeforces.com/edu/course/2", type: "tool" as const },
        { title: "Aditya Verma — recursion playlist (YouTube)", url: "https://www.youtube.com/playlist?list=PL_z_8CaSLPWeT1ffjiImo0sYTcnLzo-wY", type: "video" as const },
      ],
      weeks: [
        { week: 1, topic: "Binary Search — on sorted arrays AND on answer", task: "CSES: All binary search problems (5 problems). Understand 'search on answer': when answer is monotonic, binary search on it." },
        { week: 2, topic: "Two pointers + Sliding window fixed + variable size", task: "LeetCode: Solve 10 two-pointer medium problems. Rule: two pointers when array is sorted OR when looking for pairs." },
        { week: 3, topic: "Hashing — unordered_map, frequency counting, subarray sum", task: "CF: Solve 8 problems using hashing. Count subarrays with target sum using prefix sum + hashmap." },
        { week: 4, topic: "Recursion + Stack + Queue — understand call stack", task: "Aditya Verma: First 10 recursion videos. Implement stack and queue from scratch. CF: 3 stack/queue problems." },
      ],
      milestone: "Solve CF Div 2 B problems. Participate in 1 live Codeforces contest.",
    },
    cyber: {
      focus: "SQL Injection + XSS + Burp Suite + Cryptography basics",
      daily: "1 PortSwigger lab + 1 TryHackMe room — every single day",
      resources: [
        { title: "PortSwigger SQLi labs — start here, complete all Apprentice", url: "https://portswigger.net/web-security/sql-injection", type: "article" as const },
        { title: "PortSwigger XSS labs — reflected, stored, DOM", url: "https://portswigger.net/web-security/cross-site-scripting", type: "article" as const },
        { title: "Burp Suite Community Edition — download free", url: "https://portswigger.net/burp/communitydownload", type: "tool" as const },
        { title: "CryptoHack — cryptography challenges (gamified, free)", url: "https://cryptohack.org", type: "tool" as const },
        { title: "TryHackMe Jr Penetration Tester path", url: "https://tryhackme.com/path/outline/jrpenetrationtester", type: "tool" as const },
      ],
      weeks: [
        { week: 1, topic: "SQL Injection — manual exploitation, ' OR 1=1-- logic", task: "PortSwigger: Complete all 8 Apprentice SQLi labs. For every lab: first try yourself, then read solution. Understand why it works." },
        { week: 2, topic: "XSS — reflected, stored, DOM-based. Set up Burp Suite.", task: "PortSwigger: Complete all Apprentice XSS labs. Install Burp Suite Community. Intercept your first HTTP request. See the raw data." },
        { week: 3, topic: "Burp Suite: Proxy, Repeater, Intruder in depth", task: "TryHackMe: 'Burp Suite Basics' + 'Burp Suite Repeater' rooms. Practice: modify a request parameter in Repeater and see the different response." },
        { week: 4, topic: "Cryptography: Base64, hex, XOR, Caesar cipher", task: "CryptoHack: Complete 'Introduction' section + first 5 'General' challenges. CyberChef: Decode 5 different encoded strings." },
      ],
      milestone: "PortSwigger Apprentice badge. Can find and exploit SQLi and XSS manually.",
    },
    uiux: {
      focus: "Tailwind CSS + React fundamentals + UX thinking",
      daily: "1.5h — code a React component OR redesign in Figma",
      resources: [
        { title: "Tailwind CSS docs — read all utility classes once", url: "https://tailwindcss.com/docs", type: "article" as const },
        { title: "react.dev official tutorial — the only React tutorial you need", url: "https://react.dev/learn", type: "article" as const },
        { title: "Nielsen Norman Group — free UX articles (bookmark)", url: "https://www.nngroup.com/articles/", type: "article" as const },
        { title: "Dribbble — design inspiration daily", url: "https://dribbble.com", type: "article" as const },
      ],
      weeks: [
        { week: 1, topic: "Tailwind CSS — utility-first, rebuild your HTML project", task: "Rebuild your month 1 HTML/CSS project using ONLY Tailwind classes. Delete all custom CSS. Fight the urge to write CSS." },
        { week: 2, topic: "React: components, JSX, props, useState", task: "react.dev: Complete 'Quick Start' + 'Tic-Tac-Toe' tutorial. Understand: why components, what is state, how props flow." },
        { week: 3, topic: "React: useEffect, forms, controlled inputs", task: "Build a todo app in React + Tailwind. Features: add task, mark done, delete, filter. Deploy on Vercel for free." },
        { week: 4, topic: "UX thinking: visual hierarchy, spacing system, user flow", task: "Pick 1 ugly real app (your college portal). Redesign 3 screens in Figma. Apply 8px spacing rule throughout." },
      ],
      milestone: "2 React projects built. 1 real-app Figma redesign done.",
    },
  },
  {
    month: 3,
    theme: "Dynamic Programming + Web attack mastery + Next.js",
    daySchedule: {
      monWed: ["3:00–4:30: DP problems (Aditya Verma videos + CSES)", "4:30–6:00: Next.js (nextjs.org/learn tutorial)", "7:00–8:30: Cyber — Auth bypass + File upload labs", "8:30–10:00: English + Guitar + DJ (reward)"],
      thuFri: ["7:00–8:30: DP practice — timed", "8:30–10:00: Cyber — first CTF event"],
      weekend: ["9:30–12:00: CP — CF Div 2 virtual contest", "12:30–3:30: UI/UX — build portfolio site in Next.js", "8:30–9:30: DJ practice + Spanish"],
    },
    cp: {
      focus: "Dynamic Programming — the most important topic in CP",
      daily: "2h — 2-3 DP problems. Re-solve yesterday's if needed.",
      resources: [
        { title: "Aditya Verma — DP playlist (best DP teaching in existence)", url: "https://www.youtube.com/playlist?list=PL_z_8CaSLPWekqhdCPmFohncHwz8TY2Go", type: "video" as const },
        { title: "CSES — DP section (15 must-solve problems)", url: "https://cses.fi/problemset/list/", type: "tool" as const },
        { title: "LeetCode DP tag — sort by frequency", url: "https://leetcode.com/tag/dynamic-programming/", type: "tool" as const },
        { title: "CP-algorithms.com — DP theory + proofs", url: "https://cp-algorithms.com/dynamic_programming/", type: "article" as const },
      ],
      weeks: [
        { week: 1, topic: "1D DP: Fibonacci, climbing stairs, house robber pattern", task: "Aditya Verma: First 8 videos. LeetCode: 70 (Climb Stairs), 198 (House Robber), 213, 91, 139. Understand memo vs tabulation." },
        { week: 2, topic: "2D DP: grid paths, coin change, subset sum", task: "CSES: Grid Paths + Coin Combinations I & II. LeetCode: 64 (Min Path Grid), 322 (Coin Change), 518." },
        { week: 3, topic: "LCS, LIS, 0-1 Knapsack — the classic trio", task: "Aditya Verma: LCS series + Knapsack series (8 videos). CSES: LCS + LIS. These 3 patterns cover 60% of DP problems." },
        { week: 4, topic: "DP on strings + DP in contests", task: "LeetCode: 5 (Longest Palindrome), 115, 44, 10. Then: 1 CF contest. Upsolve every DP problem you couldn't solve." },
      ],
      milestone: "Solve DP problems on sight. Know which pattern applies within 2 minutes.",
    },
    cyber: {
      focus: "Auth attacks + File upload + OWASP Top 10 + First real CTF",
      daily: "1 PortSwigger lab + join 1 real CTF this month",
      resources: [
        { title: "PortSwigger Authentication labs", url: "https://portswigger.net/web-security/authentication", type: "article" as const },
        { title: "PortSwigger File Upload labs", url: "https://portswigger.net/web-security/file-upload", type: "article" as const },
        { title: "CTFtime — find upcoming CTF events worldwide", url: "https://ctftime.org", type: "tool" as const },
        { title: "HackTricks — technique reference wiki", url: "https://book.hacktricks.xyz", type: "article" as const },
        { title: "picoCTF — ongoing, always available", url: "https://picoctf.org", type: "tool" as const },
      ],
      weeks: [
        { week: 1, topic: "Auth bypass: brute force, password reset flaws, username enum", task: "PortSwigger: All Apprentice auth labs (6 labs). Learn: how to enumerate usernames via timing differences." },
        { week: 2, topic: "File upload: bypass extension checks, upload webshell", task: "PortSwigger: File upload labs 1–4. Path traversal labs 1–3. Understand: why servers shouldn't trust filenames." },
        { week: 3, topic: "OWASP Top 10 — master all 10, not just skim", task: "TryHackMe: 'OWASP Top 10 2021' room. For each: write what it is, 1 example attack, 1 prevention. 10 notes." },
        { week: 4, topic: "First real CTF competition", task: "CTFtime.org: Join a beginner-friendly CTF (look for 'jeopardy' format). Solve min 3 challenges. Read all write-ups after." },
      ],
      milestone: "50+ TryHackMe rooms. PortSwigger Apprentice badge. First real CTF completed.",
    },
    uiux: {
      focus: "Next.js + portfolio + deploy on Vercel",
      daily: "1.5h — build features in Next.js OR work on portfolio",
      resources: [
        { title: "Next.js official learn course — complete tutorial", url: "https://nextjs.org/learn", type: "article" as const },
        { title: "Framer Motion — production animation library", url: "https://www.framer.com/motion/", type: "article" as const },
        { title: "shadcn/ui — best component library for React", url: "https://ui.shadcn.com", type: "article" as const },
        { title: "Awwwards — award-winning site inspiration", url: "https://www.awwwards.com", type: "article" as const },
        { title: "Vercel — free deployment, connect GitHub", url: "https://vercel.com", type: "tool" as const },
      ],
      weeks: [
        { week: 1, topic: "Next.js: App router, file-based routing, layouts, metadata", task: "nextjs.org/learn: Complete the full official tutorial (dashboard app). Understand SSR vs CSR and when to use each." },
        { week: 2, topic: "Next.js: API routes, dynamic pages, data fetching", task: "Build a blog with Next.js. Each post is markdown. Use dynamic routes /blog/[slug]. Deploy to Vercel." },
        { week: 3, topic: "shadcn/ui + Framer Motion animations", task: "Rebuild your todo app with shadcn components. Add smooth page transitions. Add a scroll-triggered animation on landing page." },
        { week: 4, topic: "Personal portfolio site — build and deploy", task: "Build your portfolio in Next.js + Tailwind. Sections: hero, about, skills, projects, contact. Deploy on Vercel. Share the link." },
      ],
      milestone: "Portfolio live on Vercel with your URL. Can explain every line of code.",
    },
  },
  {
    month: 4,
    theme: "Graph algorithms + Reverse Engineering + React mastery",
    daySchedule: {
      monWed: ["3:00–4:30: Graph problems (Striver series + CSES)", "4:30–6:00: Dashboard project in React + Tailwind", "7:00–8:30: Cyber — RE basics + Ghidra", "8:30–10:00: Guitar + extras"],
      thuFri: ["7:00–8:30: CP — Dijkstra + Union Find", "8:30–10:00: UI/UX — speed design"],
      weekend: ["9:30–12:00: CP — CSES graph section + contest", "12:30–3:30: HTB first machine attempt + CTF", "8:30–9:30: DJ + Spanish + reading"],
    },
    cp: {
      focus: "Graphs: BFS, DFS, Dijkstra, Union Find, Topological Sort",
      daily: "2h — graph problems only. These take longer, be patient.",
      resources: [
        { title: "Striver Graph Series A to Z — 55 videos (YouTube)", url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oE3gA41TKO2H5bHpPd7fzn", type: "video" as const },
        { title: "CSES Graph section — 36 problems, all must-solve", url: "https://cses.fi/problemset/list/", type: "tool" as const },
        { title: "Visualgo — visual algorithm explanations", url: "https://visualgo.net/en", type: "tool" as const },
        { title: "CP-algorithms: Graphs", url: "https://cp-algorithms.com/graph/", type: "article" as const },
      ],
      weeks: [
        { week: 1, topic: "BFS + DFS — traversal, connected components, flood fill", task: "CSES: BFS Shortest Path + Counting Rooms + Labyrinth. Striver: Episodes 1–8. Implement BFS and DFS from memory." },
        { week: 2, topic: "Dijkstra + Bellman-Ford shortest paths", task: "CSES: Shortest Routes I & II. Implement Dijkstra with priority_queue<pair<int,int>>. Understand why negative edges break it." },
        { week: 3, topic: "Union Find (DSU) + MST (Kruskal + Prim)", task: "CSES: Building Roads + Building Teams. Implement Union Find with path compression + union by rank. Kruskal from scratch." },
        { week: 4, topic: "Topological sort + cycle detection + contest", task: "CSES: Course Schedule + Longest Flight Route. 1 CF Div 2 contest (target: solve up to D level)." },
      ],
      milestone: "CF rating 1200+. CSES: 20+ graph problems solved. Can implement any graph algorithm.",
    },
    cyber: {
      focus: "Reverse Engineering + Ghidra + Wireshark + Hack The Box",
      daily: "1 RE challenge OR 1 Wireshark analysis OR 1 HTB attempt",
      resources: [
        { title: "Hack The Box — real world hacking platform", url: "https://www.hackthebox.com", type: "tool" as const },
        { title: "LiveOverflow — best RE/pwn YouTube channel", url: "https://www.youtube.com/@LiveOverflow", type: "video" as const },
        { title: "Ghidra — free NSA decompiler (install this)", url: "https://ghidra-sre.org", type: "tool" as const },
        { title: "CTFlearn — mixed challenges platform", url: "https://ctflearn.com", type: "tool" as const },
        { title: "Wireshark sample pcap files", url: "https://wiki.wireshark.org/SampleCaptures", type: "tool" as const },
        { title: "pwn.college — binary exploitation intro", url: "https://pwn.college", type: "tool" as const },
      ],
      weeks: [
        { week: 1, topic: "Reverse Engineering basics — read compiled code logic", task: "picoCTF RE section: Solve 5 RE challenges. Install Ghidra. Open 1 binary, find the main function, understand the flow." },
        { week: 2, topic: "Ghidra — decompile and understand real binaries", task: "LiveOverflow: 'How Ghidra works' (4 videos). CTFlearn: Solve 3 RE challenges using Ghidra decompiler." },
        { week: 3, topic: "Wireshark — filter + analyze pcap files", task: "Wireshark: Open 3 sample captures. Filter: http.request, dns, ftp. Find usernames, passwords, flags hidden in traffic." },
        { week: 4, topic: "Hack The Box — first Easy machine", task: "HTB: Register + complete 1 Easy rated Linux machine. Use: nmap scan → find service → search exploit → get shell → read flag." },
      ],
      milestone: "First HTB machine owned. Can read decompiled code and find logic flaws.",
    },
    uiux: {
      focus: "SaaS dashboard + E-commerce + speed design pipeline",
      daily: "2h — project building only. No tutorials this month.",
      resources: [
        { title: "Daily UI challenge — 100 UI design prompts", url: "https://www.dailyui.co", type: "tool" as const },
        { title: "Figma community — free UI kits for reference", url: "https://www.figma.com/community", type: "tool" as const },
        { title: "Recharts — charts for React (free)", url: "https://recharts.org", type: "article" as const },
        { title: "Lucide Icons — free icon library", url: "https://lucide.dev", type: "article" as const },
        { title: "Tailwind UI — design reference (even free preview is useful)", url: "https://tailwindui.com", type: "article" as const },
      ],
      weeks: [
        { week: 1, topic: "SaaS dashboard — design in Figma first (mandatory)", task: "Figma: Design a 3-screen SaaS dashboard (analytics, users table, settings). Apply: 8px grid, color system, typography scale." },
        { week: 2, topic: "Code the dashboard in React + Tailwind + Recharts", task: "Build your Figma dashboard in code. Use Recharts for the analytics graph. Use Lucide for icons. Deploy on Vercel." },
        { week: 3, topic: "E-commerce: product grid + filters + cart + checkout", task: "Build a full e-commerce UI. Products with filter sidebar, cart drawer with animation, checkout form with validation." },
        { week: 4, topic: "Speed pipeline: Figma to code in under 90 minutes", task: "Daily UI: Do challenges 1–7. Time yourself. Target: Figma design (30 min) + coded version (60 min) = 90 min total." },
      ],
      milestone: "3 projects live on Vercel. Speed: 90-min Figma-to-code pipeline.",
    },
  },
  {
    month: 5,
    theme: "Greedy + Backtracking + Advanced web attacks + Design systems",
    daySchedule: {
      monWed: ["3:00–4:30: Greedy + Backtracking problems", "4:30–6:00: Design system + accessibility", "7:00–8:30: Cyber — SSRF + XXE PortSwigger", "8:30–10:00: Extras + Guitar"],
      thuFri: ["7:00–8:30: CP — AtCoder + CF contests", "8:30–10:00: UI/UX — Frontend Mentor challenges"],
      weekend: ["9:30–12:00: Cyber — medium CTF event", "12:30–3:30: CP — contest simulation 2h timed", "8:30–9:30: DJ + Spanish + reading"],
    },
    cp: {
      focus: "Greedy algorithms + Backtracking + Contest strategy",
      daily: "2h — 1 greedy/backtracking problem + 1 contest analysis",
      resources: [
        { title: "Striver A2Z DSA Sheet — greedy section", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", type: "article" as const },
        { title: "AtCoder — great contest platform for greedy", url: "https://atcoder.jp", type: "tool" as const },
        { title: "LeetCode backtracking tag", url: "https://leetcode.com/tag/backtracking/", type: "tool" as const },
        { title: "USACO Guide — competitive programming roadmap", url: "https://usaco.guide", type: "article" as const },
      ],
      weeks: [
        { week: 1, topic: "Greedy: activity selection, interval scheduling, exchange argument", task: "LeetCode: 435 (Non-overlapping Intervals), 452, 55, 45. Key: greedy works when local optimal = global optimal. Prove it." },
        { week: 2, topic: "Greedy: more patterns — AtCoder practice", task: "AtCoder ABC: Solve 3 full contests greedy problems. Striver sheet: all greedy problems. Understand fractional knapsack." },
        { week: 3, topic: "Backtracking: N-Queens, Sudoku, permutations, subsets", task: "LeetCode: 46 (Permutations), 47, 51, 52 (N-Queens), 37 (Sudoku). Draw the state space tree for each." },
        { week: 4, topic: "Full 2-hour contest simulation — exam conditions", task: "CF Div 2 virtual contest: 2 hours. No hints. No editorial. Solve A+B+C. Analyze: where did you lose time?" },
      ],
      milestone: "CF rating 1300+. Solving Div 2 C problems in contests consistently.",
    },
    cyber: {
      focus: "SSRF + XXE + SSTI + Advanced web attacks + CTF specialist",
      daily: "1 PortSwigger Practitioner lab + CTF on weekends",
      resources: [
        { title: "PortSwigger SSRF labs — server-side request forgery", url: "https://portswigger.net/web-security/ssrf", type: "article" as const },
        { title: "PortSwigger XXE labs — XML external entity", url: "https://portswigger.net/web-security/xxe", type: "article" as const },
        { title: "PortSwigger SSTI labs — template injection", url: "https://portswigger.net/web-security/server-side-template-injection", type: "article" as const },
        { title: "PayloadsAllTheThings — cheat sheets for every attack", url: "https://github.com/swisskyrepo/PayloadsAllTheThings", type: "article" as const },
        { title: "HackTricks — comprehensive technique reference", url: "https://book.hacktricks.xyz", type: "article" as const },
      ],
      weeks: [
        { week: 1, topic: "SSRF — Server Side Request Forgery, cloud metadata attacks", task: "PortSwigger: All Apprentice SSRF labs + 2 Practitioner labs. Key: SSRF lets you make the server talk to internal systems." },
        { week: 2, topic: "XXE — XML External Entity, file disclosure", task: "PortSwigger: Complete XXE labs. Understand when to use each payload. PayloadsAllTheThings: XXE section bookmarked." },
        { week: 3, topic: "SSTI — Server Side Template Injection for Jinja2/Twig", task: "PortSwigger: SSTI labs. HackTricks: SSTI payloads for Flask/Jinja2. Understand: template engines execute code." },
        { week: 4, topic: "Medium CTF competition + write-up", task: "CTFtime.org: Join a medium-difficulty CTF. Target 5+ flags. Write a proper write-up for 1 challenge. Publish on GitHub." },
      ],
      milestone: "PortSwigger Practitioner badge. Know SSRF, XXE, SSTI in depth. Published write-ups.",
    },
    uiux: {
      focus: "Design systems + accessibility + TypeScript intro",
      daily: "1.5h — design system OR accessibility audit OR TS conversion",
      resources: [
        { title: "TypeScript handbook — official, free", url: "https://www.typescriptlang.org/docs/handbook/", type: "article" as const },
        { title: "Frontend Mentor — real-world design challenges", url: "https://www.frontendmentor.io", type: "tool" as const },
        { title: "WCAG accessibility guidelines — learn the rules", url: "https://www.w3.org/WAI/standards-guidelines/wcag/", type: "article" as const },
        { title: "Storybook — component documentation tool", url: "https://storybook.js.org", type: "article" as const },
      ],
      weeks: [
        { week: 1, topic: "Design systems: tokens, component library, documentation", task: "Figma: Build a design system with: 8 colors, 5 typography styles, 10 components (buttons, inputs, cards, badges)." },
        { week: 2, topic: "Accessibility: WCAG, semantic HTML, ARIA, keyboard nav", task: "Audit your portfolio with Lighthouse accessibility tab. Fix every issue. Target: 100% accessibility score." },
        { week: 3, topic: "TypeScript: types, interfaces, generics, utility types", task: "TypeScript handbook: Chapters 1–5. Convert your React todo app from JS to TypeScript. No 'any' types allowed." },
        { week: 4, topic: "Frontend Mentor advanced challenges + case studies", task: "Frontend Mentor: Complete 2 advanced challenges pixel-perfect. For each project: write 200-word case study." },
      ],
      milestone: "TypeScript-comfortable. Accessible, documented portfolio. 3 case studies written.",
    },
  },
  {
    month: 6,
    theme: "Advanced data structures + Security+ prep + Full-stack",
    daySchedule: {
      monWed: ["3:00–4:30: Segment tree + advanced DP", "4:30–6:00: React Query + full-stack features", "7:00–8:30: Cyber — Security+ study (Professor Messer)", "8:30–10:00: Extras"],
      thuFri: ["7:00–8:30: CP — string algorithms + mock", "8:30–10:00: UI/UX — performance optimization"],
      weekend: ["9:30–12:00: Cyber — Security+ practice exam", "12:30–3:30: CP — 3h mock contest", "8:30–9:30: DJ + Spanish + book"],
    },
    cp: {
      focus: "Segment trees + advanced DP + String algorithms",
      daily: "2h — 1 hard problem OR 1 full contest",
      resources: [
        { title: "CP-algorithms: Segment tree — complete guide", url: "https://cp-algorithms.com/data_structures/segment_tree.html", type: "article" as const },
        { title: "CP-algorithms: KMP + Z-function", url: "https://cp-algorithms.com/string/prefix-function.html", type: "article" as const },
        { title: "USACO Guide — Platinum level problems", url: "https://usaco.guide/plat/", type: "article" as const },
        { title: "Competitive Programmer's Handbook — free PDF", url: "https://cses.fi/book/book.pdf", type: "article" as const },
      ],
      weeks: [
        { week: 1, topic: "Segment tree: range query, point update", task: "CP-algorithms: Implement segment tree for range sum. CSES: Range Minimum Queries + Static Range Sum Queries." },
        { week: 2, topic: "Advanced DP: bitmask DP, DP on trees", task: "CSES: Counting Tilings (bitmask). Striver: DP on trees series (3 videos). This unlocks a whole new class of problems." },
        { week: 3, topic: "String algorithms: KMP + Z-function", task: "CP-algorithms: KMP theory + Z-function. CSES: String Matching + Minimal Rotation + Border Array. These appear in every hard round." },
        { week: 4, topic: "Mock contest week — 3 simulations", task: "3 CF virtual contests this week. Target: Div 2 C within 45 min. Analyze ALL mistakes. Keep an error log." },
      ],
      milestone: "CF rating 1400+. Can implement segment tree and KMP in a contest.",
    },
    cyber: {
      focus: "CompTIA Security+ prep + Bug bounty mindset",
      daily: "45 min Security+ study + 45 min practical (HTB or CTF)",
      resources: [
        { title: "Professor Messer Security+ SY0-701 — free YouTube", url: "https://www.youtube.com/playlist?list=PLG49S3nxzAnl4QDVqK-hOnoqcSKEIDDuv", type: "video" as const },
        { title: "ExamTopics — free Security+ practice questions", url: "https://www.examtopics.com/exams/comptia/sy0-701/", type: "tool" as const },
        { title: "HackerOne Hacktivity — read real bug reports", url: "https://hackerone.com/hacktivity", type: "article" as const },
        { title: "Bugcrowd — bug bounty programs list", url: "https://bugcrowd.com/programs", type: "tool" as const },
      ],
      weeks: [
        { week: 1, topic: "Security+ Domain 1: Threats, Attacks, Vulnerabilities", task: "Messer: Domain 1 (all videos). ExamTopics: 30 practice questions. Score target >80%. Learn: malware types, social engineering, cryptography." },
        { week: 2, topic: "Security+ Domain 2+3: Architecture + Implementation", task: "Messer: Domains 2–3. Focus on: encryption algorithms (AES, RSA, ECC), PKI, network protocols. ExamTopics: 40 more questions." },
        { week: 3, topic: "Bug bounty mindset — read real reports", task: "HackerOne Hacktivity: Read 10 disclosed reports. For each: What was the vulnerability? How was it found? What was the impact?" },
        { week: 4, topic: "Full Security+ mock exam — 90 questions timed", task: "ExamTopics: 90-question timed mock. Score target: 75%+. Identify your 2 weakest domains. Review those only." },
      ],
      milestone: "Security+ exam scheduled. Bug bounty methodology understood deeply.",
    },
    uiux: {
      focus: "React Query + performance + Supabase integration",
      daily: "2h — optimize, integrate, or build full-stack features",
      resources: [
        { title: "TanStack Query (React Query) — data fetching library", url: "https://tanstack.com/query/latest", type: "article" as const },
        { title: "Supabase — open source Firebase alternative (free tier)", url: "https://supabase.com/docs", type: "article" as const },
        { title: "web.dev performance learning", url: "https://web.dev/learn/performance/", type: "article" as const },
        { title: "Lighthouse — built into Chrome DevTools", url: "https://developer.chrome.com/docs/lighthouse/overview/", type: "tool" as const },
      ],
      weeks: [
        { week: 1, topic: "React Query: queries, mutations, caching, optimistic updates", task: "TanStack Query: Complete tutorial. Rebuild your blog app with React Query. Remove all useEffect data fetching." },
        { week: 2, topic: "Supabase: auth, database, real-time", task: "Supabase: Add authentication to your portfolio. Users can leave comments on projects. Data persists in Supabase DB." },
        { week: 3, topic: "Performance: lazy loading, code splitting, images", task: "Lighthouse: Audit all your projects. Target >90 on all. Fix: lazy load images, split code chunks, remove unused CSS." },
        { week: 4, topic: "Build a full-stack feature from scratch", task: "Build: a contact form that saves to Supabase + sends email via Resend.com API. Full-stack, no tutorials." },
      ],
      milestone: "Full-stack capable. Portfolio scores 90+ Lighthouse. Supabase-integrated projects.",
    },
  },
  {
    month: 7,
    theme: "Speed mastery — exam simulation mode",
    daySchedule: {
      monWed: ["3:00–4:30: CP — code tracing drills (10 per session)", "4:30–6:00: UI/UX — GSAP animations + interview prep", "7:00–8:30: Cyber — CTF speed drills (15 min per challenge)", "8:30–10:00: Write-ups + extras"],
      thuFri: ["7:00–8:30: CP — full timed contest", "8:30–10:00: Cyber — Security+ final review"],
      weekend: ["9:30–12:00: CP — 2h mock exam simulation", "12:30–3:30: CTF team event + write-ups", "8:30–9:30: DJ + Spanish + reading"],
    },
    cp: {
      focus: "Code tracing + Debug speed + Pattern recognition mastery",
      daily: "10 code traces + 1 timed contest",
      resources: [
        { title: "Codeforces — read AC solutions and trace them", url: "https://codeforces.com/problemset", type: "tool" as const },
        { title: "Competitive Programmer's Handbook — reread key sections", url: "https://cses.fi/book/book.pdf", type: "article" as const },
        { title: "AtCoder — ABC weekly contests", url: "https://atcoder.jp/contests/", type: "tool" as const },
        { title: "LeetCode Weekly Contest", url: "https://leetcode.com/contest/", type: "tool" as const },
      ],
      weeks: [
        { week: 1, topic: "Code tracing: read AC solutions, predict output before running", task: "Daily: Take 10 CF accepted solutions. Read WITHOUT running. Write expected output on paper. Then check. This trains your mental compiler." },
        { week: 2, topic: "Debug speed: find bug in wrong solution under 5 minutes", task: "CF hacking mode: Look at wrong answers from recent contests. Find the exact bug. Time yourself. Target: <5 min per bug." },
        { week: 3, topic: "Pattern recognition sprint — 50 problems in 1 week", task: "50 mixed LeetCode/CF problems. Don't look at tags. In <2 min: classify the algorithm. Then solve. Pattern ID = half the battle." },
        { week: 4, topic: "Full exam simulation — 2h, exact exam conditions", task: "CF virtual: 2 hours. Phone in another room. No hints. No editorials during. Solve as many as possible. Review after." },
      ],
      milestone: "Solve A+B+C in Div 2 within 60 minutes consistently. Debug in <5 min.",
    },
    cyber: {
      focus: "CTF speed + write-ups + Security+ final prep",
      daily: "45 min CTF + 45 min Security+ review",
      resources: [
        { title: "CTFtime write-ups archive — read others' solutions", url: "https://ctftime.org/writeups", type: "article" as const },
        { title: "Security+ exam cram — YouTube search", url: "https://www.youtube.com/results?search_query=comptia+security%2B+sy0-701+exam+cram", type: "video" as const },
        { title: "Professor Messer Security+ practice exams", url: "https://www.professormesser.com/sy0-701-success-bundle/", type: "tool" as const },
      ],
      weeks: [
        { week: 1, topic: "CTF speed: web + crypto flags in under 15 minutes each", task: "Old CTF archives: 3 web challenges/day. Time yourself. If >15 min, read write-up and understand the thought process." },
        { week: 2, topic: "Write-up quality: professional documentation", task: "Write 3 proper CTF write-ups. Publish on GitHub or Medium. Format: challenge description → approach → solution → flag → lessons." },
        { week: 3, topic: "Security+ final review — all 5 domains", task: "ExamTopics: 100-question mock. All 5 domains. Score target: 85%+. Review only wrong answers' domains." },
        { week: 4, topic: "Mock exam — full Security+ simulation", task: "Full 90-question timed Security+ simulation. Simulate real exam: no notes, no phone, 90 minutes. If >75%, book the real exam." },
      ],
      milestone: "Security+ exam booked or taken. CTF write-ups published. CTF team formed.",
    },
    uiux: {
      focus: "GSAP animations + interview prep + GreatFrontend practice",
      daily: "1.5h — animate, practice, or prep interview answers",
      resources: [
        { title: "GSAP — professional grade animations", url: "https://gsap.com/docs/v3/", type: "article" as const },
        { title: "GreatFrontend — UI coding interview platform", url: "https://www.greatfrontend.com", type: "tool" as const },
        { title: "Frontend interview questions — GitHub", url: "https://github.com/h5bp/Front-end-Developer-Interview-Questions", type: "article" as const },
        { title: "Internshala — internships in India", url: "https://internshala.com", type: "tool" as const },
      ],
      weeks: [
        { week: 1, topic: "Present your projects — record yourself, no notes", task: "For each portfolio project: Record yourself explaining it for 3 minutes. No notes. Problem → solution → result → tech used." },
        { week: 2, topic: "GSAP: ScrollTrigger + timeline animations", task: "GSAP: Complete ScrollTrigger tutorial. Add scroll-linked animations to your portfolio hero and project sections." },
        { week: 3, topic: "GreatFrontend: UI coding interview challenges", task: "GreatFrontend: Solve 10 UI challenges. Build: accordion, modal, tabs, infinite scroll, debounced search — from scratch." },
        { week: 4, topic: "Apply for internships + LinkedIn polish", task: "Internshala: Apply to 5 frontend internships. LinkedIn: 3 posts about projects, updated experience, featured portfolio." },
      ],
      milestone: "First internship application sent. Portfolio with GSAP animations. Interview-ready.",
    },
  },
  {
    month: 8,
    theme: "Peak performance — exam ready, career launched",
    daySchedule: {
      monWed: ["3:00–4:30: CP — weak topic review + drill", "4:30–6:00: UI/UX — client work or Upwork proposals", "7:00–8:30: Cyber — bug bounty hunting / cert", "8:30–10:00: Final extras"],
      thuFri: ["7:00–8:30: CP — 2h full mock exam", "8:30–10:00: Cyber — applications + profile"],
      weekend: ["9:30–12:00: CP — last contest sprint", "12:30–3:30: UI/UX client project / portfolio", "8:30–9:30: Celebrate + plan next 4 months"],
    },
    cp: {
      focus: "Contest mastery + final exam simulation",
      daily: "2 CF problems + 1 full contest per week",
      resources: [
        { title: "Codeforces — latest Div 2 contests", url: "https://codeforces.com/contests", type: "tool" as const },
        { title: "AtCoder ABC — weekly contests", url: "https://atcoder.jp/contests/", type: "tool" as const },
        { title: "LeetCode Weekly Contest", url: "https://leetcode.com/contest/", type: "tool" as const },
        { title: "ICPC problems archive", url: "https://icpc.global/worldfinals/problems", type: "article" as const },
      ],
      weeks: [
        { week: 1, topic: "Contest week — 2 full contests, upsolve everything", task: "CF Div 2 + AtCoder ABC. Upsolve every problem you couldn't solve. Re-read your CP handbook notes from months 1-7." },
        { week: 2, topic: "Weakest topic deep drill", task: "Identify your single weakest topic from 7 months. Spend this entire week on ONLY that topic. 10 problems minimum." },
        { week: 3, topic: "Exam simulation — exact real conditions", task: "3-hour mock contest. Same time as your real exam. Phone away. No hints. Log every decision you made." },
        { week: 4, topic: "Light review + rest", task: "Review your 'mistake log' from all 8 months. Light practice only. Sleep 8 hours. You are ready." },
      ],
      milestone: "CF rating 1500+. Competitive programming exam — you're more prepared than 90% of participants.",
    },
    cyber: {
      focus: "Portfolio + cert + bug bounty + first applications",
      daily: "45 min application prep + 45 min active bug hunting",
      resources: [
        { title: "HackerOne — bug bounty programs for beginners", url: "https://hackerone.com/bug-bounty-programs", type: "tool" as const },
        { title: "Naukri.com — cybersecurity jobs India", url: "https://www.naukri.com/cybersecurity-jobs", type: "tool" as const },
        { title: "LinkedIn — optimize for security roles", url: "https://linkedin.com", type: "tool" as const },
        { title: "Indeed — entry level security internships", url: "https://in.indeed.com/q-cyber-security-internship-jobs.html", type: "tool" as const },
      ],
      weeks: [
        { week: 1, topic: "Cyber resume + GitHub portfolio — make it impressive", task: "GitHub: Pin 3 repos (CTF write-ups, security tool, HTB notes). LinkedIn: Full cyber profile with all certs + TryHackMe badge." },
        { week: 2, topic: "Bug bounty — submit first report on HackerOne", task: "HackerOne: Choose a beginner-friendly program (look for those with high submission rates). Hunt for 1 week. Submit even if low-severity." },
        { week: 3, topic: "Apply for intern/entry security positions", task: "Apply to 5 security internships + 3 entry analyst roles. Attach: resume, GitHub, TryHackMe profile, PortSwigger badge screenshot." },
        { week: 4, topic: "Reflect — where you started vs now", task: "Month 1 you: knew nothing. Month 8 you: SQLi, XSS, SSRF, RE, Wireshark, HTB, Security+, CTFs. You are ahead of 95% of CS students." },
      ],
      milestone: "Security+ certified. Bug bounty submitted. First security applications sent.",
    },
    uiux: {
      focus: "Real clients + freelancing income + job applications",
      daily: "2h — client work or active applications",
      resources: [
        { title: "Fiverr — create UI/UX gig", url: "https://www.fiverr.com", type: "tool" as const },
        { title: "Upwork — freelance platform with better clients", url: "https://www.upwork.com", type: "tool" as const },
        { title: "Internshala — best for India internships", url: "https://internshala.com", type: "tool" as const },
        { title: "AngelList / Wellfound — startup jobs", url: "https://wellfound.com/jobs", type: "tool" as const },
      ],
      weeks: [
        { week: 1, topic: "Freelance profiles: Fiverr + Upwork", task: "Fiverr: Create 2 gigs (UI redesign service, landing page). Upwork: Complete profile with portfolio. First proposal submitted." },
        { week: 2, topic: "Cold outreach — DM 10 businesses with bad websites", task: "Instagram: Find 10 local businesses. DM offering a FREE redesign sample. Send the before/after mockup. Convert 1 into paid work." },
        { week: 3, topic: "Apply to frontend internships in India", task: "Internshala: Apply 5 internships. Wellfound: Apply 3 startups. AngelList: 2 more. Always include portfolio URL." },
        { week: 4, topic: "8-month celebration + plan months 9-12", task: "List everything you can now do that you couldn't 8 months ago. Then: write your next 4-month plan. The journey continues." },
      ],
      milestone: "First freelance client OR internship offer. Income started. Career launched.",
    },
  },
];

// ── Extra Activities ──────────────────────────────────────────────────────────
const EXTRA_ACTIVITIES = [
  {
    id: "dj",
    title: "DJ / Music Production",
    icon: "◒",
    color: "#C9907E",
    when: "Start month 3 — after core habits locked in",
    timeNeeded: "30–45 min, 3× per week",
    cost: "Free to start — gear comes later",
    summary: "Start on free software. Learn to beatmatch first. Buying gear before you know the basics is wasted money.",
    resources: [
      { title: "Mixxx — completely free DJ software", url: "https://mixxx.org", type: "tool" as const },
      { title: "VirtualDJ — free version for learning", url: "https://www.virtualdj.com", type: "tool" as const },
      { title: "DJ Techtools — beginner beatmatching guide", url: "https://djtechtools.com/2016/02/22/the-beginners-guide-to-beatmatching/", type: "article" as const },
      { title: "DJTT YouTube — technique tutorials", url: "https://www.youtube.com/@DJTechTools", type: "video" as const },
      { title: "Crossfader YouTube — DJ tutorials for beginners", url: "https://www.youtube.com/@crossfader", type: "video" as const },
    ],
    monthPlan: [
      "Month 3: Install Mixxx. Watch 'beatmatching' tutorial. Learn to match BPM between 2 songs manually.",
      "Month 4: Learn basic transitions — cut, fade, echo out. Master the crossfader. Build a 30-min mix.",
      "Month 5: Learn EQ mixing — bass swap technique. High/mid/low EQ use. Record your first mix.",
      "Month 6+: Explore Ableton Live Free if you want to produce. Or get a controller (Pioneer DDJ-200 is affordable).",
    ],
  },
  {
    id: "spanish",
    title: "Spanish",
    icon: "◑",
    color: "#C97EB8",
    when: "Start month 1 — runs in background daily",
    timeNeeded: "10–15 min daily — never break the streak",
    cost: "Free (Duolingo + Language Transfer)",
    summary: "10 min a day for 18 months = conversational Spanish. Just never break the Duolingo streak. It compounds invisibly.",
    resources: [
      { title: "Duolingo — free, gamified, builds daily habit", url: "https://www.duolingo.com", type: "tool" as const },
      { title: "Language Transfer — deep Spanish course (completely free)", url: "https://www.languagetransfer.org/free-courses-1#complete-spanish", type: "article" as const },
      { title: "SpanishPod101 YouTube — grammar explained clearly", url: "https://www.youtube.com/@SpanishPod101", type: "video" as const },
      { title: "HelloTalk — speak with native Spanish speakers", url: "https://www.hellotalk.com", type: "tool" as const },
    ],
    monthPlan: [
      "Month 1–2: Duolingo daily (10 min) + Language Transfer first 20 lessons. Learn 100 common words.",
      "Month 3–4: Duolingo streak continues + 1 Spanish YouTube video/week with Spanish captions.",
      "Month 5–6: HelloTalk: chat with 1 native speaker. Describe your daily routine in Spanish.",
      "Month 7–8: Watch 1 Spanish Netflix show (Spanish subtitles, NOT English). Real immersion.",
    ],
  },
  {
    id: "reading",
    title: "Read 10 Pages Daily",
    icon: "◎",
    color: "#7EB8C9",
    when: "Start month 1 — before sleep or morning",
    timeNeeded: "20–30 min daily",
    cost: "Free — library or Libgen PDFs",
    summary: "10 pages = 12 books a year. Your thinking upgrades compoundly. Non-fiction that excites you — not textbooks.",
    resources: [
      { title: "Libgen — free books PDF download (use responsibly)", url: "https://libgen.is", type: "tool" as const },
    ],
    bookList: [
      "Month 1: Atomic Habits — James Clear (build your habit systems right)",
      "Month 2: Deep Work — Cal Newport (train your focus like a weapon)",
      "Month 3: The Psychology of Money — Morgan Housel (think about money differently)",
      "Month 4: Thinking Fast and Slow — Daniel Kahneman (understand your own brain)",
      "Month 5: Zero to One — Peter Thiel (startup + opportunity mindset)",
      "Month 6: The Art of War — Sun Tzu (strategy + competition thinking)",
      "Month 7: Shoe Dog — Phil Knight (execution, persistence, the Nike story)",
      "Month 8: The Art of Invisibility — Kevin Mitnick (cybersecurity + privacy)",
    ],
  },
  {
    id: "youtube",
    title: "YouTube Learning (Replace Reels)",
    icon: "◇",
    color: "#E8C96E",
    when: "Always — whenever you have idle time",
    timeNeeded: "30 min, whenever you'd otherwise open Instagram",
    cost: "Free",
    summary: "Replace reels with these channels. Your brain absorbs passively. After 8 months you think differently — literally.",
    resources: [
      { title: "Kurzgesagt — ideas + science, mind-expanding", url: "https://www.youtube.com/@kurzgesagt", type: "video" as const },
      { title: "Veritasium — physics + math + counterintuitive facts", url: "https://www.youtube.com/@veritasium", type: "video" as const },
      { title: "3Blue1Brown — math made visually beautiful", url: "https://www.youtube.com/@3blue1brown", type: "video" as const },
      { title: "Fireship — 100-second tech explainers, fast learning", url: "https://www.youtube.com/@Fireship", type: "video" as const },
      { title: "Mark Rober — engineering + creative problem solving", url: "https://www.youtube.com/@MarkRober", type: "video" as const },
      { title: "TED — ideas from the best minds worldwide", url: "https://www.youtube.com/@TED", type: "video" as const },
      { title: "Y Combinator — startup + business thinking", url: "https://www.youtube.com/@ycombinator", type: "video" as const },
      { title: "Lex Fridman — deep conversations with world experts", url: "https://www.youtube.com/@LexFridman", type: "video" as const },
    ],
  },
];

// ── After Plan ────────────────────────────────────────────────────────────────
const AFTER_PLAN = {
  after4: {
    title: "After 4 months — August 2026",
    subtitle: "Body, skin, hair — all on autopilot. Skills foundation solid.",
    achievements: [
      "5–7 kg fat loss — visible transformation in mirror",
      "Dandruff completely eliminated, hair healthier and thicker",
      "Skin tan noticeably reduced, dark spots lightened",
      "Sleep, water, diet — completely automatic. Zero willpower needed.",
      "English: conversational, no hesitation, accent improving",
      "Cyber: 70+ TryHackMe rooms, SQLi/XSS hands-on, first CTF done",
      "CP: C++ solid, Level 1–2 DSA, solving CF Div 2 B in contests",
      "UI/UX: React portfolio live on Vercel, 2–3 projects deployed",
      "Spanish: 300+ words, 120-day Duolingo streak",
      "Guitar: 3–4 chord songs playable",
    ],
    nextFocus: [
      "Body maintenance becomes automatic (20 min/day max)",
      "Double down on learning tracks for months 5–8",
      "Start freelancing / first bug bounty hunt",
      "Apply for internships with your portfolio",
    ],
  },
  after8: {
    title: "After 8 months — December 2026",
    subtitle: "Skills that open doors. You are no longer a student — you're a professional in training.",
    achievements: [
      "CF rating 1400–1500+ — top tier for campus recruitment DSA rounds",
      "CompTIA Security+ certified (or ready for exam week of month 9)",
      "Frontend portfolio: 5+ projects, TypeScript-fluent, accessible",
      "Bug bounty: first report submitted on HackerOne",
      "Hack The Box: 5+ machines owned — real hacking skills",
      "PortSwigger: Practitioner badge — most students never get this",
      "Spanish: basic conversations, 240-day streak",
      "DJ: first recorded mix, understand beatmatching",
      "LinkedIn: professional presence, 3 featured projects",
      "Income: first freelance client or internship offer",
    ],
    doors: [
      "Campus placements DSA rounds — you're prepared for any company",
      "Cybersecurity internships — TryHackMe + cert puts you ahead of 90% applicants",
      "Frontend internships — portfolio + TypeScript + Next.js is exactly what startups want",
      "Bug bounty income — start hunting real programs on HackerOne/Bugcrowd",
    ],
    months912: [
      "Month 9–10: CEH or OSCP prep (advanced offensive security certification)",
      "Month 9–10: Open source contributions — build GitHub reputation",
      "Month 11–12: Apply for full-time security analyst or frontend developer roles",
      "Month 11–12: Continue bug bounty — even ₹5000 from bounty is validation",
      "The BMW is closer than it was. The girl notices. The parents are proud.",
    ],
  },
};

// ── Motivation Quotes ─────────────────────────────────────────────────────────
const MOTIVATION_QUOTES = [
  "The BMW doesn't buy itself. Get up.",
  "The version of you she falls in love with is built today.",
  "Your future kids will look up to who you become.",
  "Every push-up is a deposit in the account that buys the flight ticket.",
  "The streets you'll travel start with the discipline you build now.",
  "One day you'll look back at this exact moment and be grateful you didn't quit.",
  "Uncomfortable today. Unrecognizable in 8 months.",
  "The reels will still be there. Your hairline won't wait.",
  "Build the life first. The girl, the car, the travel — they follow.",
  "Security+ certified. Portfolio live. Codeforces rated. That's you in 8 months.",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const todayStr = () => new Date().toISOString().split("T")[0];
const isWeekend = () => [0, 6].includes(new Date().getDay());
const getDayLabel = () => new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
const getCurrentHour = () => new Date().getHours() + new Date().getMinutes() / 60;

function timeToHour(t: string): number {
  if (!t || t === "Commute" || t === "College") return -1;
  const [h, m] = t.split(":").map(Number);
  return h + (m || 0) / 60;
}

function getDaysElapsed(): number {
  return Math.max(0, Math.floor((Date.now() - new Date(PLAN_START).getTime()) / (24 * 60 * 60 * 1000)));
}

function getCurrentPhase(): number {
  const weeks = Math.floor(getDaysElapsed() / 7);
  return Math.min(Math.floor(weeks / 4) + 1, 4);
}

function getCurrentWeek(): number {
  const weeks = Math.floor(getDaysElapsed() / 7);
  return Math.min(weeks + 1, 16);
}

function getCurrentLearningMonth(): number {
  return Math.min(Math.max(1, Math.ceil(getDaysElapsed() / 30.44)), 8);
}

function getDayOfWeek(): number {
  return new Date().getDay(); // 0=Sun, 1=Mon ... 6=Sat
}

function getTodayStudyFocus(lMonth: number): string[] {
  const day = getDayOfWeek();
  const m = LEARNING_MONTHLY[lMonth - 1];
  if (!m) return [];
  if ([0, 6].includes(day)) return m.daySchedule.weekend;
  if ([1, 2, 3].includes(day)) return m.daySchedule.monWed;
  return m.daySchedule.thuFri;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PlanPage() {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [weekHistory, setWeekHistory] = useState<Record<string, HistoryEntry>>({});
  const [activeTab, setActiveTab] = useState<"today" | "week" | "plan" | "progress" | "resources" | "learning">("today");
  const [activePhaseIdx, setActivePhaseIdx] = useState(0);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);
  const [user, setUser] = useState<User | null>(null);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [quote] = useState(() => MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)]);

  // Learning tab state
  const [activeLearningMonth, setActiveLearningMonth] = useState(getCurrentLearningMonth());
  const [activeLearningTrack, setActiveLearningTrack] = useState<"cp" | "cyber" | "uiux">("cyber");
  const [learningView, setLearningView] = useState<"tracks" | "schedule" | "extras" | "after">("tracks");
  const [expandedExtra, setExpandedExtra] = useState<string | null>(null);

  const today = todayStr();
  const weekend = isWeekend();
  const todayTasks = weekend ? WEEKEND_TASKS : WEEKDAY_TASKS;
  const phase = getCurrentPhase();
  const currentWeek = getCurrentWeek();
  const currentHour = getCurrentHour();
  const daysElapsed = getDaysElapsed();
  const lMonth = getCurrentLearningMonth();

  // PWA install
  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e as BeforeInstallPromptEvent); };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setInstallPrompt(null);
  };

  // Supabase init
  useEffect(() => {
    (async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) return;
      setUser(u);

      // Load today's checks
      const { data: todayChecks } = await supabase
        .from("plan_daily_checks")
        .select("task_id, completed")
        .eq("user_id", u.id)
        .eq("date", today);

      if (todayChecks) {
        const map: Record<string, boolean> = {};
        (todayChecks as DayCheck[]).forEach(r => { map[r.task_id] = r.completed; });
        setChecks(map);
      }

      // Load last 60 days for attendance
      const since = new Date();
      since.setDate(since.getDate() - 60);
      const { data: hist } = await supabase
        .from("plan_daily_checks")
        .select("date, completed")
        .eq("user_id", u.id)
        .gte("date", since.toISOString().split("T")[0]);

      if (hist) {
        const byDay: Record<string, HistoryEntry> = {};
        hist.forEach((r: { date: string; completed: boolean }) => {
          if (!byDay[r.date]) byDay[r.date] = { total: 0, done: 0 };
          byDay[r.date].total++;
          if (r.completed) byDay[r.date].done++;
        });
        setWeekHistory(byDay);
      }
    })();
  }, [today]);

  const toggleTask = useCallback(async (taskId: string) => {
    if (!user) return;
    const newVal = !checks[taskId];
    setChecks(prev => ({ ...prev, [taskId]: newVal }));
    await supabase.from("plan_daily_checks").upsert(
      { user_id: user.id, task_id: taskId, date: today, completed: newVal },
      { onConflict: "user_id,task_id,date" }
    );
  }, [checks, user, today]);

  const phaseTasks = todayTasks.filter(t => t.phase.includes(phase));
  const completedCount = phaseTasks.filter(t => checks[t.id]).length;
  const pct = Math.round((completedCount / Math.max(phaseTasks.length, 1)) * 100);

  // Attendance tracking
  const planDaysElapsed = daysElapsed;
  const activeDays = Object.values(weekHistory).filter(e => e.done > 0).length;
  const missedDays = Math.max(0, planDaysElapsed - activeDays);
  const attendancePct = planDaysElapsed > 0 ? Math.round((activeDays / planDaysElapsed) * 100) : 100;
  // True score = average of daily completion × attendance penalty
  const avgDailyPct = Object.values(weekHistory).reduce((sum, e) => sum + Math.round(e.done / Math.max(e.total, 1) * 100), 0) / Math.max(activeDays, 1);
  const trueScore = Math.round((avgDailyPct * attendancePct) / 100);

  // Next task
  const nextTask = phaseTasks.find(t => {
    const h = timeToHour(t.time);
    return h > 0 && h <= currentHour + 1 && !checks[t.id];
  }) || phaseTasks.find(t => !checks[t.id]);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekRes = WEEKLY_RESOURCES.find(w => w.week === currentWeek) || WEEKLY_RESOURCES[0];
  const todayFocus = getTodayStudyFocus(activeLearningMonth);
  const currentLM = LEARNING_MONTHLY[activeLearningMonth - 1];

  return (
    <div style={S.root}>
      <div style={S.glow} />

      {installPrompt && !installed && (
        <div style={S.installBanner}>
          <span style={S.installText}>Add to Home Screen for daily use</span>
          <button style={S.installBtn} onClick={handleInstall}>Install</button>
        </div>
      )}

      {/* ── HEADER ── */}
      <header style={S.header}>
        <div style={S.headerTop}>
          <div>
            <div style={S.eyebrow}>ARIHANT · 8-MONTH BLUEPRINT</div>
            <h1 style={S.title}>Your Blueprint</h1>
            <div style={S.subtitle}>{getDayLabel()}</div>
          </div>
          <div style={S.phasePill}>
            <div style={{ ...S.phasePillDot, background: PHASES[phase - 1]?.color }} />
            <span style={{ color: PHASES[phase - 1]?.color, fontSize: 11, fontWeight: 600 }}>
              M{phase} · W{currentWeek} · L{lMonth}
            </span>
          </div>
        </div>
        <div style={S.quoteRow}>
          <span style={S.quoteGlyph}>"</span>
          <span style={S.quoteBody}>{quote}</span>
        </div>
        {nextTask && (
          <div style={S.nextTask}>
            <span style={S.nextTaskLabel}>DO THIS NOW</span>
            <span style={S.nextTaskName}>{nextTask.time} · {nextTask.label}</span>
          </div>
        )}
      </header>

      {/* ── PROGRESS BAR ── */}
      <div style={S.progressStrip}>
        <div style={S.progressMeta}>
          <span style={S.progressFrac}>{completedCount}/{phaseTasks.length} today</span>
          <span style={S.progressPct}>{pct}%</span>
        </div>
        <div style={S.progressTrack}>
          <div style={{ ...S.progressFill, width: `${pct}%`, background: PHASES[phase - 1]?.color }} />
        </div>
        {planDaysElapsed > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>
              Day {planDaysElapsed} · {missedDays} missed · Attendance {attendancePct}%
            </span>
            <span style={{ fontSize: 10, color: attendancePct >= 80 ? "#7EC99A" : "#E8A598" }}>
              True score: {trueScore}%
            </span>
          </div>
        )}
      </div>

      {/* ── NAV ── */}
      <nav style={S.nav}>
        {(["today", "week", "plan", "progress", "resources", "learning"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ ...S.navBtn, ...(activeTab === tab ? { ...S.navBtnActive, color: tab === "learning" ? LEARN_COLORS.cyber : PHASES[phase - 1]?.color, borderColor: tab === "learning" ? LEARN_COLORS.cyber : PHASES[phase - 1]?.color } : {}) }}>
            {tab === "today" ? "Today" : tab === "week" ? "Week" : tab === "plan" ? "Plan" : tab === "progress" ? "Stats" : tab === "resources" ? "Learn" : "🎯 Skills"}
          </button>
        ))}
      </nav>

      {/* ── MAIN ── */}
      <main style={S.main}>

        {/* ────── TODAY ────── */}
        {activeTab === "today" && (
          <div>
            <div style={S.dayBadge}>{weekend ? "Weekend — deeper work day" : getDayOfWeek() <= 3 ? "Weekday Mon–Wed · Home at 3pm · Extra study 3–6pm" : "Weekday Thu–Fri · Home at 5pm · Study 7–10pm"}</div>

            {/* Today's learning focus */}
            {todayFocus.length > 0 && (
              <div style={{ background: "rgba(232,201,110,0.06)", border: "0.5px solid rgba(232,201,110,0.2)", borderRadius: 12, padding: "12px 14px", marginBottom: 18 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: LEARN_COLORS.cyber, marginBottom: 8 }}>TODAY'S STUDY BLOCK (check Learning tab for resources)</div>
                {todayFocus.map((f, i) => (
                  <div key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 4, lineHeight: 1.5 }}>· {f}</div>
                ))}
              </div>
            )}

            {Object.entries(TASK_CATEGORIES).map(([catKey, cat]) => {
              const catTasks = phaseTasks.filter(t => t.cat === catKey);
              if (!catTasks.length) return null;
              const catDone = catTasks.filter(t => checks[t.id]).length;
              return (
                <div key={catKey} style={S.taskGroup}>
                  <div style={S.taskGroupHead}>
                    <span style={{ ...S.catDot, background: cat.color }} />
                    <span style={S.catLabel}>{cat.label}</span>
                    <div style={S.catBar}>
                      <div style={{ ...S.catBarFill, width: `${(catDone / catTasks.length) * 100}%`, background: cat.color }} />
                    </div>
                    <span style={S.catCount}>{catDone}/{catTasks.length}</span>
                  </div>
                  {catTasks.map(task => {
                    const done = checks[task.id];
                    const isNext = task.id === nextTask?.id;
                    const isExpanded = expandedTask === task.id;
                    return (
                      <div key={task.id} style={{ ...S.taskCard, ...(done ? S.taskDone : {}), ...(isNext ? { borderColor: cat.color + "60" } : {}) }}>
                        {isNext && <div style={{ ...S.nowBadge, background: cat.color + "22", color: cat.color }}>NOW</div>}
                        <div style={S.taskRow} onClick={() => toggleTask(task.id)}>
                          <div style={{ ...S.checkbox, borderColor: cat.color, ...(done ? { background: cat.color + "30" } : {}) }}>
                            {done && <span style={{ color: cat.color, fontSize: 11, fontWeight: 700 }}>✓</span>}
                          </div>
                          <div style={S.taskContent}>
                            <div style={S.taskTime}>{task.time}{task.endTime ? ` – ${task.endTime}` : ""}</div>
                            <div style={{ ...S.taskLabel, ...(done ? S.taskLabelDone : {}) }}>{task.label}</div>
                          </div>
                          <button style={S.expandBtn} onClick={e => { e.stopPropagation(); setExpandedTask(isExpanded ? null : task.id); }}>
                            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 16 }}>{isExpanded ? "−" : "+"}</span>
                          </button>
                        </div>
                        {isExpanded && (
                          <div style={S.taskDetail}>
                            {task.detail && <p style={S.taskDetailText}>{task.detail}</p>}
                            {task.resource && (
                              <a href={task.resource.url} target="_blank" rel="noopener noreferrer" style={{ ...S.resourceLink, borderColor: cat.color + "40", color: cat.color }}>
                                <span style={S.resourceType}>{task.resource.type === "video" ? "▶ Video" : task.resource.type === "tool" ? "⚙ Tool" : "◎ Read"}</span>
                                {task.resource.title}
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* ────── WEEK ────── */}
        {activeTab === "week" && (
          <div>
            <div style={S.sectionLabel}>Week {currentWeek} of 16 · {weekRes.theme}</div>
            <div style={S.weekGrid}>
              {weekDays.map((day, i) => {
                const isWd = i < 5;
                const tasks = isWd ? WEEKDAY_TASKS.filter(t => t.phase.includes(phase)) : WEEKEND_TASKS.filter(t => t.phase.includes(phase));
                const todayIdx = new Date().getDay();
                const isToday = (i === 0 && todayIdx === 1) || (i === todayIdx - 1);
                const isEarlyHome = i < 3;
                return (
                  <div key={day} style={{ ...S.dayCard, ...(isToday ? { borderColor: PHASES[phase-1].color + "80" } : {}) }}>
                    <div style={{ ...S.dayName, color: isToday ? PHASES[phase-1].color : "rgba(255,255,255,0.5)" }}>{day}</div>
                    <div style={S.dayTaskCount}>{tasks.length} tasks</div>
                    <div style={{ ...S.dayType, color: isWd ? (isEarlyHome ? "#7EC99A" : "#7EB8C9") : "#A89EC9" }}>
                      {isWd ? (isEarlyHome ? "Home 3pm" : "Home 5pm") : "Free day"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Week learning focus */}
            <div style={{ ...S.weekFocusCard, marginBottom: 16, background: "rgba(232,201,110,0.04)", borderColor: "rgba(232,201,110,0.15)" }}>
              <div style={{ fontSize: 10, letterSpacing: "0.14em", color: LEARN_COLORS.cyber, marginBottom: 10, fontWeight: 600 }}>THIS WEEK'S SKILL FOCUS · Learning Month {lMonth}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                {(["cp", "cyber", "uiux"] as const).map(track => {
                  const lm = LEARNING_MONTHLY[lMonth - 1];
                  const data = lm[track];
                  const color = LEARN_COLORS[track];
                  return (
                    <div key={track} style={{ flex: 1, minWidth: 140, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 12px", border: `0.5px solid ${color}30` }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color, marginBottom: 4 }}>{track === "cp" ? "Comp. Programming" : track === "cyber" ? "Cybersecurity" : "UI/UX + Frontend"}</div>
                      <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{data.focus}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={S.sectionLabel}>Body + Lifestyle focus this week</div>
            <div style={S.weekFocusCard}>
              <div style={S.wfRow}>
                <span style={{ ...S.wfIcon, color: TASK_CATEGORIES.cyber.color }}>◇</span>
                <div><div style={S.wfTitle}>Cyber — {weekRes.cyber.goal}</div><div style={S.wfDetail}>{weekRes.cyber.daily}</div>{weekRes.cyber.url && <a href={weekRes.cyber.url} target="_blank" rel="noopener noreferrer" style={S.wfLink}>Open resource →</a>}</div>
              </div>
              <div style={S.wfDivider} />
              <div style={S.wfRow}>
                <span style={{ ...S.wfIcon, color: TASK_CATEGORIES.english.color }}>◑</span>
                <div><div style={S.wfTitle}>English — {weekRes.english.goal}</div><div style={S.wfDetail}>{weekRes.english.daily}</div>{weekRes.english.url && <a href={weekRes.english.url} target="_blank" rel="noopener noreferrer" style={S.wfLink}>Open resource →</a>}</div>
              </div>
              <div style={S.wfDivider} />
              <div style={S.wfRow}>
                <span style={{ ...S.wfIcon, color: TASK_CATEGORIES.body.color }}>◈</span>
                <div><div style={S.wfTitle}>Body — {weekRes.body.goal}</div><div style={S.wfDetail}>{weekRes.body.daily}</div></div>
              </div>
            </div>

            <div style={S.sectionLabel}>Achieve by end of this week</div>
            {weekRes.achieve.map((a, i) => (
              <div key={i} style={S.achieveRow}>
                <div style={{ ...S.achieveDot, background: PHASES[phase-1].color }} />
                <span style={S.achieveText}>{a}</span>
              </div>
            ))}
          </div>
        )}

        {/* ────── PLAN ────── */}
        {activeTab === "plan" && (
          <div>
            <div style={S.phaseGrid}>
              {PHASES.map((ph, i) => (
                <button key={ph.id} onClick={() => setActivePhaseIdx(i)}
                  style={{ ...S.phaseBtn, ...(activePhaseIdx === i ? { borderColor: ph.color, background: ph.color + "18" } : {}) }}>
                  <div style={{ ...S.phaseMonth, color: ph.color }}>{ph.month === phase ? "● " : ""}M{ph.month}</div>
                  <div style={S.phaseTitle}>{ph.label}</div>
                  {ph.month === phase && <div style={{ ...S.currentBadge, background: ph.color + "22", color: ph.color }}>current</div>}
                </button>
              ))}
            </div>

            <div style={{ ...S.phaseDetail, borderColor: PHASES[activePhaseIdx].color + "30" }}>
              <div style={{ ...S.phaseDetailAccent, background: PHASES[activePhaseIdx].color }} />
              <div style={S.phaseDetailInner}>
                <div style={{ ...S.phaseDetailTitle, color: PHASES[activePhaseIdx].color }}>Month {PHASES[activePhaseIdx].month} — {PHASES[activePhaseIdx].label}</div>
                <div style={S.phaseFocus}>{PHASES[activePhaseIdx].focus}</div>

                <div style={S.sectionLabel}>Daily schedule</div>
                {[
                  ["6:00", "Wake up — no phone. Water. Scalp massage."],
                  ["6:15", activePhaseIdx === 0 ? "15-min starter workout (push-ups + squats)" : "35-min full workout: 5 rounds"],
                  ["6:50", "Face wash (CeraVe) · Sunscreen"],
                  ["7:10", "Breakfast: muesli + peanut butter"],
                  ["8:00", "Leave for college"],
                  ["Mon–Wed", "Home at 3pm → rest → 3:30–6pm skill study block"],
                  ["Thu–Fri", "Home at 5pm → rest → 6pm walk"],
                  ["6:00", "Brisk walk 60 min (everyone)"],
                  ["7:00", "Main study block begins (CP + Cyber + UI/UX rotation)"],
                  ["9:45", "5 sentences in English + night skincare"],
                  ["10:00", "In bed — phone in another room"],
                ].map(([time, task], i) => (
                  <div key={i} style={S.schedRow}>
                    <span style={{ ...S.schedTime, color: PHASES[activePhaseIdx].color }}>{time}</span>
                    <span style={S.schedTask}>{task}</span>
                  </div>
                ))}

                <div style={S.sectionLabel}>Month milestones</div>
                {WEEKLY_RESOURCES.filter(w => w.phase === PHASES[activePhaseIdx].month).flatMap(w => w.achieve).map((a, i) => (
                  <div key={i} style={S.achieveRow}>
                    <div style={{ ...S.achieveDot, background: PHASES[activePhaseIdx].color }} />
                    <span style={S.achieveText}>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ────── PROGRESS ────── */}
        {activeTab === "progress" && (
          <div>
            <div style={S.statsGrid}>
              <div style={S.statCard}>
                <div style={S.statLabel}>Today</div>
                <div style={{ ...S.statVal, color: PHASES[phase-1].color }}>{pct}%</div>
                <div style={S.statSub}>{completedCount}/{phaseTasks.length} done</div>
              </div>
              <div style={S.statCard}>
                <div style={S.statLabel}>Attendance</div>
                <div style={{ ...S.statVal, color: attendancePct >= 80 ? "#7EC99A" : "#E8A598" }}>{attendancePct}%</div>
                <div style={S.statSub}>{missedDays} days missed</div>
              </div>
              <div style={S.statCard}>
                <div style={S.statLabel}>True Score</div>
                <div style={{ ...S.statVal, color: trueScore >= 70 ? "#7EC99A" : "#E8A598" }}>{trueScore}%</div>
                <div style={S.statSub}>completion × attend</div>
              </div>
            </div>

            <div style={{ ...S.statsGrid, marginBottom: 20 }}>
              <div style={S.statCard}>
                <div style={S.statLabel}>Day</div>
                <div style={{ ...S.statVal, color: "#7EB8C9" }}>{Math.max(1, daysElapsed)}</div>
                <div style={S.statSub}>of 240 total</div>
              </div>
              <div style={S.statCard}>
                <div style={S.statLabel}>Body Phase</div>
                <div style={{ ...S.statVal, color: PHASES[phase-1].color }}>M{phase}W{currentWeek}</div>
                <div style={S.statSub}>{PHASES[phase-1].label}</div>
              </div>
              <div style={S.statCard}>
                <div style={S.statLabel}>Skills</div>
                <div style={{ ...S.statVal, color: LEARN_COLORS.cyber }}>L{lMonth}</div>
                <div style={S.statSub}>of 8 months</div>
              </div>
            </div>

            <div style={S.sectionLabel}>Last 7 days completion</div>
            <div style={S.chart}>
              {Array.from({ length: 7 }).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                const key = d.toISOString().split("T")[0];
                const entry = weekHistory[key];
                const p = entry ? Math.round((entry.done / Math.max(entry.total, 1)) * 100) : 0;
                const isPast = d < new Date(new Date().setHours(0,0,0,0));
                const isMissed = isPast && !entry && new Date(key) >= new Date(PLAN_START);
                const lbl = d.toLocaleDateString("en-IN", { weekday: "short" });
                const isTd = key === today;
                return (
                  <div key={i} style={S.chartCol}>
                    <div style={S.chartPctLbl}>{p > 0 ? `${p}%` : isMissed ? "✗" : ""}</div>
                    <div style={S.chartTrack}>
                      <div style={{ ...S.chartFill, height: isMissed ? "100%" : `${p}%`, background: isMissed ? "rgba(232,165,152,0.25)" : isTd ? PHASES[phase-1].color : "#7EB8C9", minHeight: isMissed ? "100%" : 3 }} />
                    </div>
                    <div style={{ ...S.chartLbl, color: isTd ? PHASES[phase-1].color : isMissed ? "rgba(232,165,152,0.6)" : "rgba(255,255,255,0.35)" }}>{lbl}</div>
                  </div>
                );
              })}
            </div>

            <div style={S.sectionLabel}>Today by category</div>
            {Object.entries(TASK_CATEGORIES).map(([k, cat]) => {
              const ct = phaseTasks.filter(t => t.cat === k);
              if (!ct.length) return null;
              const done = ct.filter(t => checks[t.id]).length;
              const p = Math.round((done / ct.length) * 100);
              return (
                <div key={k} style={S.catRow}>
                  <div style={S.catRowHead}>
                    <span style={{ color: cat.color, fontSize: 13 }}>{cat.icon} {cat.label}</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{done}/{ct.length}</span>
                  </div>
                  <div style={S.catRowTrack}>
                    <div style={{ ...S.catRowFill, width: `${p}%`, background: cat.color }} />
                  </div>
                </div>
              );
            })}

            {missedDays > 0 && (
              <div style={{ background: "rgba(232,165,152,0.08)", border: "0.5px solid rgba(232,165,152,0.2)", borderRadius: 12, padding: "12px 14px", marginTop: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#E8A598", marginBottom: 6 }}>⚠ {missedDays} missed day{missedDays > 1 ? "s" : ""}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                  Each missed day costs you. Attendance is your most powerful metric. 80%+ attendance = transformation guaranteed. Below 60% = results won't come. Show up tomorrow.
                </div>
              </div>
            )}
          </div>
        )}

        {/* ────── RESOURCES ────── */}
        {activeTab === "resources" && (
          <div>
            <div style={S.sectionLabel}>Week-by-week body + lifestyle learning</div>
            {WEEKLY_RESOURCES.map(wr => {
              const ph = PHASES.find(p => p.month === wr.phase)!;
              const isExpanded = expandedWeek === wr.week;
              const isCurrent = wr.week === currentWeek;
              return (
                <div key={wr.week} style={{ ...S.weekAccordion, ...(isCurrent ? { borderColor: ph.color + "60" } : {}) }}>
                  <button style={S.weekAccordionHead} onClick={() => setExpandedWeek(isExpanded ? null : wr.week)}>
                    <div style={S.weekAccLeft}>
                      <div style={{ ...S.weekNumBadge, background: ph.color + "22", color: ph.color }}>{isCurrent ? "● " : ""}W{wr.week}</div>
                      <div>
                        <div style={S.weekAccTitle}>{wr.theme}</div>
                        <div style={{ ...S.weekAccSub, color: ph.color }}>{ph.label}</div>
                      </div>
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 18 }}>{isExpanded ? "−" : "+"}</span>
                  </button>
                  {isExpanded && (
                    <div style={S.weekAccBody}>
                      <div style={S.resBlock}>
                        <div style={{ ...S.resBlockTitle, color: TASK_CATEGORIES.cyber.color }}>◇ Cyber security</div>
                        <div style={S.resBlockDaily}><strong>Daily:</strong> {wr.cyber.daily}</div>
                        <div style={S.resBlockGoal}>Goal: {wr.cyber.goal}</div>
                        {wr.cyber.url && <a href={wr.cyber.url} target="_blank" rel="noopener noreferrer" style={{ ...S.resLink, borderColor: TASK_CATEGORIES.cyber.color + "40" }}>▶ Open resource</a>}
                      </div>
                      <div style={S.resBlock}>
                        <div style={{ ...S.resBlockTitle, color: TASK_CATEGORIES.english.color }}>◑ English</div>
                        <div style={S.resBlockDaily}><strong>Daily:</strong> {wr.english.daily}</div>
                        <div style={S.resBlockGoal}>Goal: {wr.english.goal}</div>
                        {wr.english.url && <a href={wr.english.url} target="_blank" rel="noopener noreferrer" style={{ ...S.resLink, borderColor: TASK_CATEGORIES.english.color + "40" }}>▶ Open resource</a>}
                      </div>
                      <div style={S.resBlock}>
                        <div style={{ ...S.resBlockTitle, color: TASK_CATEGORIES.body.color }}>◈ Body</div>
                        <div style={S.resBlockDaily}><strong>Daily:</strong> {wr.body.daily}</div>
                        <div style={S.resBlockGoal}>Goal: {wr.body.goal}</div>
                      </div>
                      <div style={S.resAchieveBlock}>
                        <div style={S.resAchieveTitle}>By end of week {wr.week}:</div>
                        {wr.achieve.map((a, i) => (
                          <div key={i} style={S.achieveRow}>
                            <div style={{ ...S.achieveDot, background: ph.color }} />
                            <span style={S.achieveText}>{a}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ────── LEARNING (8-MONTH SKILLS) ────── */}
        {activeTab === "learning" && (
          <div>
            {/* Sub-nav */}
            <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" as const }}>
              {(["tracks", "schedule", "extras", "after"] as const).map(v => (
                <button key={v} onClick={() => setLearningView(v)}
                  style={{ ...S.navBtn, ...(learningView === v ? { background: "rgba(232,201,110,0.12)", color: LEARN_COLORS.cyber, borderColor: LEARN_COLORS.cyber, fontWeight: 500 } : {}) }}>
                  {v === "tracks" ? "Skill Tracks" : v === "schedule" ? "Daily Schedule" : v === "extras" ? "Extras" : "After Plan"}
                </button>
              ))}
            </div>

            {/* ── SKILL TRACKS ── */}
            {learningView === "tracks" && (
              <div>
                {/* Month selector */}
                <div style={{ display: "flex", gap: 6, overflowX: "auto" as const, marginBottom: 16, paddingBottom: 4 }}>
                  {LEARNING_MONTHLY.map(lm => (
                    <button key={lm.month} onClick={() => setActiveLearningMonth(lm.month)}
                      style={{ ...S.navBtn, flexShrink: 0, ...(activeLearningMonth === lm.month ? { background: "rgba(232,201,110,0.12)", color: LEARN_COLORS.cyber, borderColor: LEARN_COLORS.cyber } : {}), ...(lm.month === lMonth ? { borderColor: LEARN_COLORS.cyber + "80" } : {}) }}>
                      M{lm.month}{lm.month === lMonth ? " ●" : ""}
                    </button>
                  ))}
                </div>

                {/* Month theme */}
                <div style={{ background: "rgba(232,201,110,0.06)", border: "0.5px solid rgba(232,201,110,0.15)", borderRadius: 12, padding: "10px 14px", marginBottom: 16 }}>
                  <div style={{ fontSize: 10, color: LEARN_COLORS.cyber, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 4 }}>MONTH {activeLearningMonth} OF 8</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>{currentLM.theme}</div>
                </div>

                {/* Track selector */}
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  {(["cp", "cyber", "uiux"] as const).map(track => (
                    <button key={track} onClick={() => setActiveLearningTrack(track)}
                      style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: `0.5px solid ${activeLearningTrack === track ? LEARN_COLORS[track] : "rgba(255,255,255,0.08)"}`, background: activeLearningTrack === track ? LEARN_COLORS[track] + "18" : "transparent", color: activeLearningTrack === track ? LEARN_COLORS[track] : "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                      {track === "cp" ? "CP" : track === "cyber" ? "Cyber" : "UI/UX"}
                    </button>
                  ))}
                </div>

                {/* Track detail */}
                {(() => {
                  const trackData = currentLM[activeLearningTrack];
                  const color = LEARN_COLORS[activeLearningTrack];
                  return (
                    <div>
                      <div style={{ background: "rgba(255,255,255,0.025)", border: `0.5px solid ${color}30`, borderRadius: 14, padding: "14px", marginBottom: 14 }}>
                        <div style={{ fontSize: 10, color, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 6 }}>THIS MONTH'S FOCUS</div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.85)", marginBottom: 6 }}>{trackData.focus}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>Daily: {trackData.daily}</div>
                      </div>

                      <div style={S.sectionLabel}>Week-by-week breakdown</div>
                      {trackData.weeks.map((w, i) => (
                        <div key={i} style={{ background: "rgba(255,255,255,0.025)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px", marginBottom: 8 }}>
                          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <div style={{ background: color + "22", color, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, flexShrink: 0, marginTop: 1 }}>W{i+1}</div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.85)", marginBottom: 5 }}>{w.topic}</div>
                              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>{w.task}</div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div style={{ ...S.resAchieveBlock, marginTop: 14, borderLeft: `3px solid ${color}` }}>
                        <div style={{ ...S.resAchieveTitle, color }}>Month {activeLearningMonth} milestone:</div>
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{trackData.milestone}</div>
                      </div>

                      <div style={S.sectionLabel}>Resources for this month</div>
                      {trackData.resources.map((r, i) => (
                        <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                          style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", background: "rgba(255,255,255,0.025)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 10, marginBottom: 7, textDecoration: "none" }}>
                          <span style={{ fontSize: 10, fontWeight: 600, color, background: color + "22", padding: "2px 7px", borderRadius: 5, flexShrink: 0, marginTop: 1 }}>
                            {r.type === "video" ? "▶ VIDEO" : r.type === "tool" ? "⚙ TOOL" : "◎ READ"}
                          </span>
                          <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{r.title}</span>
                        </a>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ── DAILY SCHEDULE ── */}
            {learningView === "schedule" && (
              <div>
                <div style={{ background: "rgba(232,201,110,0.06)", border: "0.5px solid rgba(232,201,110,0.15)", borderRadius: 12, padding: "10px 14px", marginBottom: 16 }}>
                  <div style={{ fontSize: 10, color: LEARN_COLORS.cyber, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 4 }}>TODAY'S STUDY FOCUS · Month {lMonth}</div>
                  {todayFocus.map((f, i) => (
                    <div key={i} style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", marginBottom: 5, lineHeight: 1.5, display: "flex", gap: 8 }}>
                      <span style={{ color: LEARN_COLORS.cyber, flexShrink: 0 }}>·</span>{f}
                    </div>
                  ))}
                </div>

                <div style={S.sectionLabel}>Mon–Wed (home at 3pm) — 6 study hours</div>
                {[
                  { time: "6:00–8:00", task: "Morning routine + workout + ready", color: "#C8A96E" },
                  { time: "8:00–3:00", task: "College", color: "rgba(255,255,255,0.2)" },
                  { time: "3:00–4:30", task: "Study Block 1: Mon=CP, Tue=Cyber, Wed=UI/UX (1.5h)", color: LEARN_COLORS.cp },
                  { time: "4:30–6:00", task: "Study Block 2: Mon=UI/UX, Tue=CP, Wed=Cyber (1.5h)", color: LEARN_COLORS.uiux },
                  { time: "6:00–7:00", task: "Brisk walk — non-negotiable", color: "#C8A96E" },
                  { time: "7:00–8:30", task: "Study Block 3: Cyber/CP/UI/UX main focus (1.5h)", color: LEARN_COLORS.cyber },
                  { time: "8:30–9:30", task: "English shadowing + writing + Guitar", color: "#C97EB8" },
                  { time: "9:30–10:00", task: "Night routine + sleep", color: "#A89EC9" },
                ].map((row, i) => (
                  <div key={i} style={{ ...S.schedRow, borderLeft: `3px solid ${row.color}`, paddingLeft: 12, marginLeft: 0 }}>
                    <span style={{ ...S.schedTime, color: row.color, minWidth: 80 }}>{row.time}</span>
                    <span style={S.schedTask}>{row.task}</span>
                  </div>
                ))}

                <div style={S.sectionLabel}>Thu–Fri (home at 5pm) — 3 study hours</div>
                {[
                  { time: "6:00–8:00", task: "Morning routine + workout + ready", color: "#C8A96E" },
                  { time: "8:00–5:00", task: "College", color: "rgba(255,255,255,0.2)" },
                  { time: "5:00–6:00", task: "Rest + dinner", color: "#7EC99A" },
                  { time: "6:00–7:00", task: "Brisk walk — non-negotiable", color: "#C8A96E" },
                  { time: "7:00–8:30", task: "Thu=CP, Fri=Cyber (main track for today)", color: LEARN_COLORS.cp },
                  { time: "8:30–9:30", task: "Thu=UI/UX, Fri=UI/UX + English", color: LEARN_COLORS.uiux },
                  { time: "9:30–10:00", task: "Night routine + sleep", color: "#A89EC9" },
                ].map((row, i) => (
                  <div key={i} style={{ ...S.schedRow, borderLeft: `3px solid ${row.color}`, paddingLeft: 12, marginLeft: 0 }}>
                    <span style={{ ...S.schedTime, color: row.color, minWidth: 80 }}>{row.time}</span>
                    <span style={S.schedTask}>{row.task}</span>
                  </div>
                ))}

                <div style={S.sectionLabel}>Sat–Sun (full free day) — 8+ study hours</div>
                {[
                  { time: "7:00–8:00", task: "Wake up + 45-min workout + skincare", color: "#C8A96E" },
                  { time: "9:30–12:00", task: "Deep Block 1: CP contest / CTF / UI project (2.5h)", color: LEARN_COLORS.cp },
                  { time: "12:00–12:30", task: "Lunch break — rest eyes", color: "#7EC99A" },
                  { time: "12:30–3:30", task: "Deep Block 2: UI/UX project build or Cyber deep dive (3h)", color: LEARN_COLORS.uiux },
                  { time: "4:00–4:30", task: "Guitar practice (30 min)", color: "#C9907E" },
                  { time: "4:30–5:00", task: "English — full YouTube video no subtitles", color: "#C97EB8" },
                  { time: "6:00–7:00", task: "Long walk 60 min", color: "#C8A96E" },
                  { time: "8:00–8:30", task: "Weekly review — streak + plan next week", color: "#A89EC9" },
                  { time: "8:30–9:30", task: "Extras: DJ + Spanish + 10 pages reading", color: LEARN_COLORS.extra },
                  { time: "10:00", task: "In bed", color: "#A89EC9" },
                ].map((row, i) => (
                  <div key={i} style={{ ...S.schedRow, borderLeft: `3px solid ${row.color}`, paddingLeft: 12, marginLeft: 0 }}>
                    <span style={{ ...S.schedTime, color: row.color, minWidth: 80 }}>{row.time}</span>
                    <span style={S.schedTask}>{row.task}</span>
                  </div>
                ))}

                <div style={S.sectionLabel}>Weekly track rotation</div>
                {[
                  { day: "Monday", focus: "CP (theory) + UI/UX (practice)", note: "3h extra", color: LEARN_COLORS.cp },
                  { day: "Tuesday", focus: "Cyber + CP (problems)", note: "3h extra", color: LEARN_COLORS.cyber },
                  { day: "Wednesday", focus: "UI/UX + Cyber", note: "3h extra", color: LEARN_COLORS.uiux },
                  { day: "Thursday", focus: "CP + UI/UX (evening)", note: "3h only", color: LEARN_COLORS.cp },
                  { day: "Friday", focus: "Cyber + UI/UX (evening)", note: "3h only", color: LEARN_COLORS.cyber },
                  { day: "Saturday", focus: "CP contest + Cyber CTF deep dive", note: "8h+", color: LEARN_COLORS.extra },
                  { day: "Sunday", focus: "UI/UX project + review + extras", note: "6h+", color: LEARN_COLORS.uiux },
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "0.5px solid rgba(255,255,255,0.04)", alignItems: "center" }}>
                    <div style={{ minWidth: 72, fontSize: 11, fontWeight: 600, color: row.color }}>{row.day}</div>
                    <div style={{ flex: 1, fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{row.focus}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.04)", padding: "2px 7px", borderRadius: 5 }}>{row.note}</div>
                  </div>
                ))}
              </div>
            )}

            {/* ── EXTRAS ── */}
            {learningView === "extras" && (
              <div>
                <div style={{ background: "rgba(126,201,154,0.06)", border: "0.5px solid rgba(126,201,154,0.2)", borderRadius: 12, padding: "10px 14px", marginBottom: 18 }}>
                  <div style={{ fontSize: 11, color: LEARN_COLORS.extra, fontWeight: 600, marginBottom: 5 }}>Extra activities — do these AFTER your core work is done</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>These are rewards, not obligations. DJ and Spanish run passively in background. Reading and YouTube replace mindless scrolling. Start Spanish from day 1, others from month 3.</div>
                </div>

                {EXTRA_ACTIVITIES.map(act => {
                  const isExp = expandedExtra === act.id;
                  return (
                    <div key={act.id} style={{ background: "rgba(255,255,255,0.025)", border: `0.5px solid ${act.color}25`, borderRadius: 14, marginBottom: 10, overflow: "hidden" }}>
                      <button style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" as const, gap: 12 }}
                        onClick={() => setExpandedExtra(isExp ? null : act.id)}>
                        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <span style={{ fontSize: 18, color: act.color }}>{act.icon}</span>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 500, color: "rgba(255,255,255,0.85)", marginBottom: 3 }}>{act.title}</div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{act.when} · {act.timeNeeded}</div>
                          </div>
                        </div>
                        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 18, flexShrink: 0 }}>{isExp ? "−" : "+"}</span>
                      </button>

                      {isExp && (
                        <div style={{ padding: "0 16px 16px", borderTop: "0.5px solid rgba(255,255,255,0.05)" }}>
                          <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: "12px 0" }}>{act.summary}</div>
                          <div style={{ fontSize: 10, color: act.color, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 8 }}>MONTH-BY-MONTH PLAN</div>
                          {(act.monthPlan || act.bookList || []).map((item: string, i: number) => (
                            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7 }}>
                              <div style={{ width: 6, height: 6, borderRadius: "50%", background: act.color, flexShrink: 0, marginTop: 5 }} />
                              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }}>{item}</div>
                            </div>
                          ))}
                          <div style={{ fontSize: 10, color: act.color, fontWeight: 600, letterSpacing: "0.1em", marginTop: 14, marginBottom: 8 }}>RESOURCES</div>
                          {act.resources.map((r, i) => (
                            <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                              style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "rgba(255,255,255,0.025)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 8, marginBottom: 6, textDecoration: "none" }}>
                              <span style={{ fontSize: 10, fontWeight: 600, color: act.color, background: act.color + "22", padding: "2px 6px", borderRadius: 4, flexShrink: 0 }}>
                                {r.type === "video" ? "▶" : r.type === "tool" ? "⚙" : "◎"}
                              </span>
                              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{r.title}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── AFTER PLAN ── */}
            {learningView === "after" && (
              <div>
                {/* After 4 months */}
                <div style={{ background: "rgba(200,169,110,0.06)", border: "0.5px solid rgba(200,169,110,0.2)", borderRadius: 14, padding: "16px", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 3, height: 40, background: "#C8A96E", borderRadius: 2 }} />
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#C8A96E" }}>{AFTER_PLAN.after4.title}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{AFTER_PLAN.after4.subtitle}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: "#C8A96E", fontWeight: 600, letterSpacing: "0.1em", marginBottom: 8 }}>YOU WILL HAVE</div>
                  {AFTER_PLAN.after4.achievements.map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#C8A96E", flexShrink: 0, marginTop: 6 }} />
                      <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{a}</div>
                    </div>
                  ))}
                  <div style={{ fontSize: 10, color: "#C8A96E", fontWeight: 600, letterSpacing: "0.1em", marginTop: 14, marginBottom: 8 }}>NEXT FOCUS</div>
                  {AFTER_PLAN.after4.nextFocus.map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                      <span style={{ color: "#C8A96E", fontSize: 12 }}>→</span>
                      <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{a}</div>
                    </div>
                  ))}
                </div>

                {/* After 8 months */}
                <div style={{ background: "rgba(126,201,154,0.06)", border: "0.5px solid rgba(126,201,154,0.2)", borderRadius: 14, padding: "16px", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 3, height: 40, background: "#7EC99A", borderRadius: 2 }} />
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#7EC99A" }}>{AFTER_PLAN.after8.title}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{AFTER_PLAN.after8.subtitle}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: "#7EC99A", fontWeight: 600, letterSpacing: "0.1em", marginBottom: 8 }}>YOU WILL HAVE</div>
                  {AFTER_PLAN.after8.achievements.map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#7EC99A", flexShrink: 0, marginTop: 6 }} />
                      <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{a}</div>
                    </div>
                  ))}
                  <div style={{ fontSize: 10, color: "#7EC99A", fontWeight: 600, letterSpacing: "0.1em", marginTop: 14, marginBottom: 8 }}>DOORS THAT OPEN</div>
                  {AFTER_PLAN.after8.doors.map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                      <span style={{ color: "#7EC99A", fontSize: 12 }}>→</span>
                      <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{a}</div>
                    </div>
                  ))}
                </div>

                {/* Months 9-12 */}
                <div style={{ background: "rgba(168,158,201,0.06)", border: "0.5px solid rgba(168,158,201,0.2)", borderRadius: 14, padding: "16px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#A89EC9", marginBottom: 10 }}>Months 9–12 · What comes next</div>
                  {AFTER_PLAN.after8.months912.map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#A89EC9", flexShrink: 0, marginTop: 6 }} />
                      <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.55 }}>{a}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* ── BOTTOM STRIP ── */}
      <div style={S.strip}>
        <span style={S.stripGlyph}>◈</span>
        BMW · Beautiful girl · Travel the world · Your kids proud
        <span style={S.stripGlyph}>◈</span>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh", background: "#0A0A0C", color: "#fff", fontFamily: "'DM Sans', sans-serif", paddingBottom: 72, position: "relative" },
  glow: { position: "fixed", inset: 0, background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(200,169,110,0.08) 0%, transparent 55%)", pointerEvents: "none", zIndex: 0 },

  installBanner: { position: "relative", zIndex: 10, background: "rgba(200,169,110,0.12)", borderBottom: "0.5px solid rgba(200,169,110,0.25)", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  installText: { fontSize: 13, color: "rgba(255,255,255,0.7)" },
  installBtn: { padding: "6px 16px", borderRadius: 20, border: "0.5px solid #C8A96E", background: "transparent", color: "#C8A96E", fontSize: 12, cursor: "pointer", fontFamily: "inherit" },

  header: { position: "relative", zIndex: 1, padding: "24px 20px 16px", borderBottom: "0.5px solid rgba(255,255,255,0.06)" },
  headerTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  eyebrow: { fontSize: 10, letterSpacing: "0.2em", color: "rgba(200,169,110,0.55)", marginBottom: 5, fontWeight: 500 },
  title: { fontSize: 30, fontWeight: 700, letterSpacing: "-0.025em", margin: 0, lineHeight: 1.1 },
  subtitle: { fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 5 },
  phasePill: { display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "5px 12px", flexShrink: 0 },
  phasePillDot: { width: 6, height: 6, borderRadius: "50%" },

  quoteRow: { display: "flex", alignItems: "flex-start", gap: 8, background: "rgba(200,169,110,0.06)", border: "0.5px solid rgba(200,169,110,0.15)", borderRadius: 10, padding: "10px 12px", marginBottom: 12 },
  quoteGlyph: { fontSize: 20, color: "rgba(200,169,110,0.4)", lineHeight: 1, flexShrink: 0 },
  quoteBody: { fontSize: 12.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, fontStyle: "italic" },

  nextTask: { background: "rgba(200,169,110,0.08)", border: "0.5px solid rgba(200,169,110,0.25)", borderRadius: 10, padding: "10px 14px" },
  nextTaskLabel: { fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", color: "#C8A96E", display: "block", marginBottom: 3 },
  nextTaskName: { fontSize: 13, color: "rgba(255,255,255,0.8)" },

  progressStrip: { position: "relative", zIndex: 1, padding: "10px 20px", borderBottom: "0.5px solid rgba(255,255,255,0.04)" },
  progressMeta: { display: "flex", justifyContent: "space-between", marginBottom: 6 },
  progressFrac: { fontSize: 12, color: "rgba(255,255,255,0.4)" },
  progressPct: { fontSize: 12, color: "rgba(255,255,255,0.4)" },
  progressTrack: { height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2, transition: "width 0.5s ease" },

  nav: { position: "sticky", top: 0, zIndex: 20, display: "flex", gap: 4, padding: "10px 20px", background: "rgba(10,10,12,0.92)", borderBottom: "0.5px solid rgba(255,255,255,0.05)", backdropFilter: "blur(16px)", overflowX: "auto" },
  navBtn: { padding: "7px 14px", borderRadius: 20, border: "0.5px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 400, whiteSpace: "nowrap", transition: "all 0.15s", flexShrink: 0 },
  navBtnActive: { background: "rgba(200,169,110,0.12)", fontWeight: 500 },

  main: { position: "relative", zIndex: 1, padding: "18px 16px 40px", maxWidth: 720, margin: "0 auto" },

  dayBadge: { fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", marginBottom: 16, paddingLeft: 2 },

  taskGroup: { marginBottom: 22 },
  taskGroupHead: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
  catDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  catLabel: { fontSize: 10.5, fontWeight: 600, letterSpacing: "0.14em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", flexShrink: 0 },
  catBar: { flex: 1, height: 2, background: "rgba(255,255,255,0.05)", borderRadius: 1, overflow: "hidden" },
  catBarFill: { height: "100%", borderRadius: 1, transition: "width 0.4s ease" },
  catCount: { fontSize: 10.5, color: "rgba(255,255,255,0.22)", flexShrink: 0 },

  taskCard: { background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 12, marginBottom: 6, overflow: "hidden", transition: "border-color 0.2s" },
  taskDone: { opacity: 0.45 },
  nowBadge: { fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", padding: "3px 10px", textAlign: "right" },
  taskRow: { display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", cursor: "pointer" },
  checkbox: { width: 20, height: 20, borderRadius: 6, border: "1.5px solid", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2, transition: "background 0.15s" },
  taskContent: { flex: 1, minWidth: 0 },
  taskTime: { fontSize: 10.5, color: "rgba(255,255,255,0.28)", marginBottom: 2, letterSpacing: "0.04em" },
  taskLabel: { fontSize: 13.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.45 },
    taskLabelDone: { textDecoration: "line-through", color: "rgba(255,255,255,0.3)" },
  expandBtn: { background: "transparent", border: "none", cursor: "pointer", padding: "0 0 0 8px", flexShrink: 0, alignSelf: "center" },
  taskDetail: { padding: "0 14px 14px 46px", borderTop: "0.5px solid rgba(255,255,255,0.04)" },
  taskDetailText: { fontSize: 12.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "10px 0 8px" },
  resourceLink: { display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, padding: "6px 12px", border: "0.5px solid", borderRadius: 8, textDecoration: "none", marginTop: 4 },
  resourceType: { fontSize: 10, fontWeight: 600, letterSpacing: "0.08em" },
 
  sectionLabel: { fontSize: 10, letterSpacing: "0.16em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase" as const, marginBottom: 12, marginTop: 4 },
 
  weekGrid: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginBottom: 24 },
  dayCard: { background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "8px 6px", textAlign: "center" as const, transition: "border-color 0.2s" },
  dayName: { fontSize: 11, fontWeight: 600, marginBottom: 3 },
  dayTaskCount: { fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 2 },
  dayType: { fontSize: 9, fontWeight: 500 },
 
  weekFocusCard: { background: "rgba(255,255,255,0.025)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px", marginBottom: 20 },
  wfRow: { display: "flex", gap: 12, alignItems: "flex-start" },
  wfIcon: { fontSize: 16, flexShrink: 0, marginTop: 1 },
  wfTitle: { fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.8)", marginBottom: 3 },
  wfDetail: { fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 },
  wfLink: { display: "inline-block", fontSize: 11.5, color: "#7EB8C9", marginTop: 6, textDecoration: "none" },
  wfDivider: { height: "0.5px", background: "rgba(255,255,255,0.06)", margin: "12px 0" },
 
  achieveRow: { display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 },
  achieveDot: { width: 6, height: 6, borderRadius: "50%", flexShrink: 0, marginTop: 5 },
  achieveText: { fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 },
 
  phaseGrid: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginBottom: 18 },
  phaseBtn: { background: "rgba(255,255,255,0.025)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 14px", cursor: "pointer", textAlign: "left" as const, fontFamily: "inherit", transition: "all 0.15s", position: "relative" as const },
  phaseMonth: { fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 },
  phaseTitle: { fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 4 },
  currentBadge: { fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", padding: "2px 7px", borderRadius: 8, display: "inline-block" },
  phaseDetail: { background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" },
  phaseDetailAccent: { height: 3 },
  phaseDetailInner: { padding: "18px" },
  phaseDetailTitle: { fontSize: 17, fontWeight: 600, marginBottom: 6 },
  phaseFocus: { fontSize: 12.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: 18 },
  schedRow: { display: "flex", gap: 14, padding: "7px 0", borderBottom: "0.5px solid rgba(255,255,255,0.04)", alignItems: "flex-start" },
  schedTime: { fontSize: 11, fontWeight: 600, minWidth: 56, flexShrink: 0, paddingTop: 1 },
  schedTask: { fontSize: 12.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 },
 
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 16 },
  statCard: { background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "14px 12px", textAlign: "center" as const },
  statLabel: { fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 6 },
  statVal: { fontSize: 22, fontWeight: 700, marginBottom: 3 },
  statSub: { fontSize: 10.5, color: "rgba(255,255,255,0.3)" },
 
  chart: { display: "flex", alignItems: "flex-end", gap: 8, height: 130, marginBottom: 28 },
  chartCol: { flex: 1, display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 5, height: "100%" },
  chartPctLbl: { fontSize: 9, color: "rgba(255,255,255,0.3)", minHeight: 12 },
  chartTrack: { flex: 1, width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden", display: "flex", alignItems: "flex-end" },
  chartFill: { width: "100%", borderRadius: 4, transition: "height 0.5s ease", minHeight: 3 },
  chartLbl: { fontSize: 10, fontWeight: 500 },
 
  catRow: { marginBottom: 12 },
  catRowHead: { display: "flex", justifyContent: "space-between", marginBottom: 5 },
  catRowTrack: { height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" },
  catRowFill: { height: "100%", borderRadius: 2, transition: "width 0.4s ease" },
 
  weekAccordion: { background: "rgba(255,255,255,0.025)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 12, marginBottom: 8, overflow: "hidden", transition: "border-color 0.2s" },
  weekAccordionHead: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" as const, gap: 12 },
  weekAccLeft: { display: "flex", alignItems: "flex-start", gap: 10 },
  weekNumBadge: { fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 8, flexShrink: 0, marginTop: 1 },
  weekAccTitle: { fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.8)", marginBottom: 2 },
  weekAccSub: { fontSize: 10.5 },
  weekAccBody: { padding: "0 16px 16px", borderTop: "0.5px solid rgba(255,255,255,0.05)" },
 
  resBlock: { marginTop: 14 },
  resBlockTitle: { fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 6 },
  resBlockDaily: { fontSize: 12.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 4 },
  resBlockGoal: { fontSize: 11.5, color: "rgba(255,255,255,0.35)", fontStyle: "italic" as const },
  resLink: { display: "inline-block", marginTop: 8, fontSize: 12, padding: "5px 12px", border: "0.5px solid", borderRadius: 8, color: "rgba(255,255,255,0.6)", textDecoration: "none" },
  resAchieveBlock: { marginTop: 14, background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 12px" },
  resAchieveTitle: { fontSize: 10, letterSpacing: "0.12em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase" as const, marginBottom: 8 },
 
  strip: { position: "fixed" as const, bottom: 0, left: 0, right: 0, background: "rgba(10,10,12,0.95)", borderTop: "0.5px solid rgba(200,169,110,0.12)", padding: "11px 20px", textAlign: "center" as const, fontSize: 10, color: "rgba(200,169,110,0.45)", letterSpacing: "0.16em", textTransform: "uppercase" as const, zIndex: 50, backdropFilter: "blur(12px)" },
  stripGlyph: { margin: "0 12px" },
};
