"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Respondent = "Wren" | "Averie";
type Vibe = "sweet" | "messy" | "deep";

type Person = {
  name: Respondent;
  partner: Respondent;
  initial: string;
  quote: string;
};

const PEOPLE: Record<Respondent, Person> = {
  Wren: {
    name: "Wren",
    partner: "Averie",
    initial: "W",
    quote: "soft eyes, dangerous memory",
  },
  Averie: {
    name: "Averie",
    partner: "Wren",
    initial: "A",
    quote: "pretty smile, probably knows too much",
  },
};

const VIBES: { id: Vibe; title: string; text: string }[] = [
  {
    id: "sweet",
    title: "Sweet",
    text: "cute answers, soft teasing",
  },
  {
    id: "messy",
    title: "Messy",
    text: "jealousy, chaos, little drama",
  },
  {
    id: "deep",
    title: "Deep",
    text: "real feelings, no hiding",
  },
];

const QUESTIONS = [
  {
    id: "favorite_color",
    tag: "warm up",
    title: "The color thing",
    self: "What color feels most like you?",
    partner: "What color would your partner say is your favorite?",
    selfPlaceholder: "Your actual color, not the aesthetic answer...",
    partnerPlaceholder: "Their favorite color...",
  },
  {
    id: "favorite_animal",
    tag: "tiny detail",
    title: "Animal energy",
    self: "What animal do you love most?",
    partner: "What animal does your partner love most?",
    selfPlaceholder: "Cat, fox, bunny, wolf, shark...",
    partnerPlaceholder: "Their animal...",
  },
  {
    id: "comfort_food",
    tag: "memory check",
    title: "Comfort order",
    self: "What food or drink fixes your mood?",
    partner: "What food or drink fixes your partner's mood?",
    selfPlaceholder: "Your comfort order...",
    partnerPlaceholder: "Their comfort order...",
  },
  {
    id: "bad_day",
    tag: "soft spot",
    title: "Bad day protocol",
    self: "When you are upset, what do you secretly need?",
    partner: "When your partner is upset, what do they need from you?",
    selfPlaceholder: "Space, reassurance, call, hug, distraction...",
    partnerPlaceholder: "What actually helps them?",
  },
  {
    id: "love_language",
    tag: "important",
    title: "How love reaches you",
    self: "What makes you feel most loved?",
    partner: "What makes your partner feel most loved?",
    selfPlaceholder: "Words, time, touch, attention, gifts...",
    partnerPlaceholder: "How do they feel loved?",
  },
  {
    id: "perfect_date",
    tag: "romance",
    title: "Perfect date",
    self: "Describe your perfect date with her.",
    partner: "What would your partner describe as a perfect date?",
    selfPlaceholder: "Be specific. Not just ‘anything with her’...",
    partnerPlaceholder: "What would make her melt?",
  },
  {
    id: "favorite_memory",
    tag: "heart",
    title: "That one memory",
    self: "What is your favorite memory with her?",
    partner: "What memory do you think she replays in her head?",
    selfPlaceholder: "That moment you still remember...",
    partnerPlaceholder: "The one she probably keeps thinking about...",
  },
  {
    id: "tiny_habit",
    tag: "noticing",
    title: "Tiny habits",
    self: "What is a tiny habit you have?",
    partner: "What tiny habit does your partner have that you notice?",
    selfPlaceholder: "Something small but very you...",
    partnerPlaceholder: "Something she does without realizing...",
  },
  {
    id: "jealousy",
    tag: "danger",
    title: "Cute jealousy",
    self: "What small thing makes you jealous, even if it is silly?",
    partner: "What small thing makes your partner jealous?",
    selfPlaceholder: "Be honest. This is locked.",
    partnerPlaceholder: "Guess carefully...",
  },
  {
    id: "argument_fix",
    tag: "real love",
    title: "After a fight",
    self: "After an argument, what do you need to feel okay again?",
    partner: "After an argument, what does your partner need from you?",
    selfPlaceholder: "Apology, time, explanation, reassurance...",
    partnerPlaceholder: "What fixes her heart?",
  },
  {
    id: "future_place",
    tag: "future",
    title: "Somewhere together",
    self: "Where would you love to go with her one day?",
    partner: "Where would your partner love to go with you?",
    selfPlaceholder: "A city, country, beach, concert, tiny room...",
    partnerPlaceholder: "Her dream place with you...",
  },
  {
    id: "favorite_feature",
    tag: "flirt",
    title: "Favorite thing",
    self: "What do you think is your best thing?",
    partner: "What is your favorite thing about your partner?",
    selfPlaceholder: "Eyes, voice, humor, loyalty, chaos...",
    partnerPlaceholder: "Do not be dry here.",
  },
  {
    id: "secret_wish",
    tag: "diary page",
    title: "The quiet wish",
    self: "What do you wish your partner understood about you?",
    partner: "What do you think your partner wishes you understood about her?",
    selfPlaceholder: "Something honest...",
    partnerPlaceholder: "Something she may not always say...",
  },
  {
    id: "why_her",
    tag: "final",
    title: "Why her?",
    self: "Why do you love her?",
    partner: "Why do you think she loves you?",
    selfPlaceholder: "Say the real reason.",
    partnerPlaceholder: "What do you think she sees in you?",
  },
] as const;

type QuestionId = (typeof QUESTIONS)[number]["id"];
type AnswerMap = Partial<Record<QuestionId, string>>;
type AnswerType = "self" | "partner";

export default function WrenAveriePage() {
  const [respondent, setRespondent] = useState<Respondent | null>(null);
  const [vibe, setVibe] = useState<Vibe>("sweet");
  const [started, setStarted] = useState(false);
  const [active, setActive] = useState(0);
  const [selfAnswers, setSelfAnswers] = useState<AnswerMap>({});
  const [partnerAnswers, setPartnerAnswers] = useState<AnswerMap>({});
  const [finalNote, setFinalNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const selectedPerson = respondent ? PEOPLE[respondent] : null;
  const partner = selectedPerson?.partner ?? null;
  const current = QUESTIONS[active] ?? QUESTIONS[0];

  const answeredCount = QUESTIONS.reduce((total, question) => {
    const selfDone = selfAnswers[question.id]?.trim() ? 1 : 0;
    const partnerDone = partnerAnswers[question.id]?.trim() ? 1 : 0;
    return total + selfDone + partnerDone;
  }, 0);

  const totalCount = QUESTIONS.length * 2;
  const progress = Math.round((answeredCount / totalCount) * 100);

  const canMoveNext =
    Boolean(selfAnswers[current.id]?.trim()) &&
    Boolean(partnerAnswers[current.id]?.trim());

  function updateAnswer(type: AnswerType, id: QuestionId, value: string) {
    if (type === "self") {
      setSelfAnswers((prev) => ({ ...prev, [id]: value }));
    } else {
      setPartnerAnswers((prev) => ({ ...prev, [id]: value }));
    }
  }

  function startGame() {
    setError("");

    if (!respondent) {
      setError("Pick who is answering first.");
      return;
    }

    setStarted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setError("");

    if (active > 0) {
      setActive((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goNext() {
    setError("");

    if (!canMoveNext) {
      setError("Answer both sides first. No skipping the emotional evidence.");
      return;
    }

    if (active < QUESTIONS.length - 1) {
      setActive((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleSubmit() {
    setError("");

    if (!respondent || !partner) {
      setError("Pick who is answering first.");
      return;
    }

    const hasEmpty = QUESTIONS.some(
      (question) =>
        !selfAnswers[question.id]?.trim() ||
        !partnerAnswers[question.id]?.trim()
    );

    if (hasEmpty) {
      setError("Some answers are still empty.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("wren_averie_answers").insert({
      respondent,
      partner,
      self_answers: {
        vibe,
        answers: selfAnswers,
      },
      partner_answers: {
        vibe,
        answers: partnerAnswers,
      },
      final_note: finalNote,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done && respondent && partner) {
    return (
      <main className="relative min-h-[100svh] overflow-hidden bg-[#f8dfb6] px-4 py-5 text-[#3d1f12]">
        <RetroBackground />

        <section className="mx-auto flex min-h-[calc(100svh-40px)] max-w-md items-center">
          <div className="relative w-full overflow-hidden rounded-[3rem] border-[3px] border-[#3d1f12] bg-[#fff3d7] p-6 shadow-[10px_10px_0_#3d1f12]">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#f28c61]" />
            <div className="absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-[#d95d78]" />

            <div className="relative">
              <div className="mb-7 inline-flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-[#3d1f12] bg-[#f7c948] text-4xl font-black shadow-[5px_5px_0_#3d1f12]">
                {PEOPLE[respondent].initial}
              </div>

              <p className="font-serif text-lg italic text-[#8f3f2b]">
                the answers are sealed
              </p>

              <h1 className="mt-2 text-5xl font-black leading-[0.88] tracking-[-0.08em]">
                {respondent} is locked in.
              </h1>

              <p className="mt-5 text-base leading-7 text-[#6c3a27]">
                Now pass the phone to {partner}. No peeking, no editing, no
                suddenly remembering a new favorite color.
              </p>

              <button
                onClick={() => window.location.reload()}
                className="mt-8 w-full rounded-full border-[3px] border-[#3d1f12] bg-[#3d1f12] px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-[#fff3d7] shadow-[5px_5px_0_#d95d78] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                Let {partner} answer
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!started) {
    return (
      <main className="relative min-h-[100svh] overflow-hidden bg-[#f8dfb6] px-4 py-5 text-[#3d1f12]">
        <RetroBackground />

        <section className="mx-auto flex min-h-[calc(100svh-40px)] max-w-5xl flex-col justify-between">
          <div>
            <nav className="flex items-center justify-between gap-3">
              <div className="rounded-full border-2 border-[#3d1f12] bg-[#fff3d7] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] shadow-[4px_4px_0_#3d1f12]">
                /wrenaverie
              </div>

              <div className="rounded-full border-2 border-[#3d1f12] bg-[#d95d78] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#fff3d7] shadow-[4px_4px_0_#3d1f12]">
                love test
              </div>
            </nav>

            <header className="pt-12 sm:pt-20">
              <p className="font-serif text-xl italic text-[#8f3f2b]">
                Wren × Averie
              </p>

              <h1 className="mt-3 max-w-4xl text-[4.2rem] font-black leading-[0.78] tracking-[-0.12em] sm:text-8xl md:text-9xl">
                who knows who better?
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-[#6c3a27] sm:text-lg">
                One answers about herself, then guesses her partner. The answers
                get locked. Later you compare the truth against the guess.
              </p>
            </header>

            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {(Object.keys(PEOPLE) as Respondent[]).map((name) => {
                const person = PEOPLE[name];
                const selected = respondent === name;

                return (
                  <button
                    key={name}
                    onClick={() => setRespondent(name)}
                    className={`relative overflow-hidden rounded-[3rem] border-[3px] p-5 text-left transition active:scale-[0.98] ${
                      selected
                        ? "border-[#3d1f12] bg-[#f7c948] shadow-[8px_8px_0_#3d1f12]"
                        : "border-[#3d1f12] bg-[#fff3d7] shadow-[6px_6px_0_#3d1f12]"
                    }`}
                  >
                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#f28c61]/70" />
                    <div className="absolute -bottom-12 left-8 h-24 w-24 rounded-full bg-[#d95d78]/50" />

                    <div className="relative">
                      <div
                        className={`mb-7 flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#3d1f12] text-3xl font-black shadow-[4px_4px_0_#3d1f12] ${
                          selected
                            ? "bg-[#3d1f12] text-[#fff3d7]"
                            : "bg-[#fff3d7] text-[#3d1f12]"
                        }`}
                      >
                        {person.initial}
                      </div>

                      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#8f3f2b]">
                        answering as
                      </p>

                      <h2 className="mt-1 text-4xl font-black tracking-[-0.07em]">
                        {person.name}
                      </h2>

                      <p className="mt-3 font-serif text-lg italic text-[#6c3a27]">
                        {person.quote}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <section className="mt-6 rounded-[2.5rem] border-[3px] border-[#3d1f12] bg-[#fff3d7] p-4 shadow-[6px_6px_0_#3d1f12]">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#8f3f2b]">
                choose the mood
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                {VIBES.map((item) => {
                  const selected = vibe === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setVibe(item.id)}
                      className={`rounded-[2rem] border-[3px] border-[#3d1f12] p-4 text-left transition active:scale-[0.98] ${
                        selected
                          ? "bg-[#3d1f12] text-[#fff3d7]"
                          : "bg-[#f8dfb6] text-[#3d1f12]"
                      }`}
                    >
                      <h3 className="text-lg font-black capitalize">
                        {item.title}
                      </h3>
                      <p
                        className={`mt-1 text-sm leading-5 ${
                          selected ? "text-[#fff3d7]/75" : "text-[#6c3a27]"
                        }`}
                      >
                        {item.text}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            {error && <ErrorBubble message={error} />}
          </div>

          <div className="sticky bottom-4 mt-8">
            <button
              onClick={startGame}
              className="w-full rounded-full border-[3px] border-[#3d1f12] bg-[#d95d78] px-6 py-5 text-sm font-black uppercase tracking-[0.22em] text-[#fff3d7] shadow-[6px_6px_0_#3d1f12] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Start the little love audit
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#f8dfb6] px-4 py-5 text-[#3d1f12]">
      <RetroBackground />

      <section className="mx-auto max-w-2xl">
        <div className="sticky top-0 z-20 -mx-4 border-b-[3px] border-[#3d1f12] bg-[#f8dfb6]/90 px-4 pb-4 pt-2 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setStarted(false)}
              className="rounded-full border-2 border-[#3d1f12] bg-[#fff3d7] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] shadow-[3px_3px_0_#3d1f12]"
            >
              switch
            </button>

            <div className="text-right">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8f3f2b]">
                answering
              </p>
              <p className="text-sm font-black">
                {respondent} → {partner}
              </p>
            </div>
          </div>

          <div className="mt-4 h-4 overflow-hidden rounded-full border-2 border-[#3d1f12] bg-[#fff3d7]">
            <div
              className="h-full rounded-full bg-[#d95d78] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.16em] text-[#8f3f2b]">
            <span>
              {active + 1}/{QUESTIONS.length}
            </span>
            <span>{progress}% sealed</span>
          </div>
        </div>

        <article className="pt-7">
          <div className="relative overflow-hidden rounded-[3rem] border-[3px] border-[#3d1f12] bg-[#fff3d7] p-5 shadow-[8px_8px_0_#3d1f12] sm:p-7">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#f28c61]/70" />
            <div className="absolute -bottom-20 -left-14 h-56 w-56 rounded-full bg-[#f7c948]/80" />

            <div className="relative">
              <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                  <p className="font-serif text-lg italic text-[#8f3f2b]">
                    {current.tag}
                  </p>

                  <h1 className="mt-2 text-5xl font-black leading-[0.84] tracking-[-0.09em] sm:text-7xl">
                    {current.title}
                  </h1>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[3px] border-[#3d1f12] bg-[#f7c948] text-lg font-black shadow-[4px_4px_0_#3d1f12]">
                  {active + 1}
                </div>
              </div>

              <div className="space-y-4">
                <AnswerPanel
                  eyebrow="truth side"
                  label={`For ${respondent ?? "you"}`}
                  question={current.self}
                  placeholder={current.selfPlaceholder}
                  value={selfAnswers[current.id] ?? ""}
                  onChange={(value) => updateAnswer("self", current.id, value)}
                  tone="yellow"
                />

                <AnswerPanel
                  eyebrow="guess side"
                  label={`Guessing ${partner ?? "partner"}`}
                  question={current.partner}
                  placeholder={current.partnerPlaceholder}
                  value={partnerAnswers[current.id] ?? ""}
                  onChange={(value) =>
                    updateAnswer("partner", current.id, value)
                  }
                  tone="pink"
                />
              </div>
            </div>
          </div>

          {active === QUESTIONS.length - 1 && (
            <section className="mt-5 rounded-[3rem] border-[3px] border-[#3d1f12] bg-[#fff3d7] p-5 shadow-[7px_7px_0_#3d1f12]">
              <p className="font-serif text-lg italic text-[#8f3f2b]">
                last page
              </p>

              <h2 className="mt-1 text-4xl font-black leading-[0.9] tracking-[-0.08em]">
                write her one line she keeps.
              </h2>

              <textarea
                value={finalNote}
                onChange={(e) => setFinalNote(e.target.value)}
                placeholder="Something cute, honest, dramatic, or very gay..."
                className="mt-5 min-h-36 w-full resize-none rounded-[2rem] border-[3px] border-[#3d1f12] bg-[#f8dfb6] p-4 text-base leading-7 text-[#3d1f12] outline-none placeholder:text-[#8f3f2b]/60 focus:bg-[#fff3d7]"
              />
            </section>
          )}

          {error && <ErrorBubble message={error} />}

          <div className="sticky bottom-4 mt-5 grid grid-cols-[0.75fr_1.25fr] gap-3">
            <button
              onClick={goBack}
              disabled={active === 0}
              className="rounded-full border-[3px] border-[#3d1f12] bg-[#fff3d7] px-5 py-4 text-sm font-black uppercase tracking-[0.18em] shadow-[4px_4px_0_#3d1f12] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-40"
            >
              Back
            </button>

            {active < QUESTIONS.length - 1 ? (
              <button
                onClick={goNext}
                className="rounded-full border-[3px] border-[#3d1f12] bg-[#3d1f12] px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#fff3d7] shadow-[4px_4px_0_#d95d78] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                Seal & next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-full border-[3px] border-[#3d1f12] bg-[#d95d78] px-5 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#fff3d7] shadow-[4px_4px_0_#3d1f12] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}

type AnswerPanelProps = {
  eyebrow: string;
  label: string;
  question: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  tone: "yellow" | "pink";
};

function AnswerPanel({
  eyebrow,
  label,
  question,
  placeholder,
  value,
  onChange,
  tone,
}: AnswerPanelProps) {
  const toneClass = tone === "yellow" ? "bg-[#f7c948]" : "bg-[#d95d78]";
  const textClass = tone === "yellow" ? "text-[#3d1f12]" : "text-[#fff3d7]";

  return (
    <label className="block rounded-[2.5rem] border-[3px] border-[#3d1f12] bg-[#f8dfb6] p-4 shadow-[5px_5px_0_#3d1f12]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="font-serif text-base italic text-[#8f3f2b]">
            {eyebrow}
          </p>
          <h3 className="text-2xl font-black tracking-[-0.05em]">{label}</h3>
        </div>

        <span
          className={`rounded-full border-2 border-[#3d1f12] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${toneClass} ${textClass}`}
        >
          {tone === "yellow" ? "real" : "guess"}
        </span>
      </div>

      <p className="text-base leading-7 text-[#6c3a27]">{question}</p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-4 min-h-32 w-full resize-none rounded-[2rem] border-[3px] border-[#3d1f12] bg-[#fff3d7] p-4 text-base leading-7 text-[#3d1f12] outline-none placeholder:text-[#8f3f2b]/55 focus:bg-white"
      />
    </label>
  );
}

type ErrorBubbleProps = {
  message: string;
};

function ErrorBubble({ message }: ErrorBubbleProps) {
  return (
    <div className="mt-4 rounded-[2rem] border-[3px] border-[#3d1f12] bg-[#d95d78] p-4 text-sm font-black leading-6 text-[#fff3d7] shadow-[4px_4px_0_#3d1f12]">
      {message}
    </div>
  );
}

function RetroBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#f8dfb6]" />

      <div className="absolute left-[-80px] top-[90px] h-56 w-56 rounded-full bg-[#d95d78]/35 blur-sm" />
      <div className="absolute right-[-100px] top-[170px] h-72 w-72 rounded-full bg-[#f28c61]/45 blur-sm" />
      <div className="absolute bottom-[-130px] left-[20%] h-80 w-80 rounded-full bg-[#f7c948]/60 blur-sm" />

      <div className="absolute left-8 top-36 h-24 w-24 rounded-full border-[3px] border-[#3d1f12]/15" />
      <div className="absolute bottom-28 right-8 h-32 w-32 rounded-full border-[3px] border-[#3d1f12]/15" />

      <div className="absolute inset-0 opacity-[0.13] [background-image:radial-gradient(#3d1f12_1px,transparent_1px)] [background-size:18px_18px]" />
    </div>
  );
}