import type { Metadata } from "next";
import { Bebas_Neue, Inter, Special_Elite } from "next/font/google";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  subsets: ["latin"],
});

const typewriter = Special_Elite({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://drixe.lol"),

  title: "Ari “Ghost” Voss | Survivor File",
  description:
    "Ari Ghost Voss — a realistic survival RP character built around digital stalking, criminal intelligence, quiet entry.",

  openGraph: {
    title: "Ari “Ghost” Voss | Survivor File",
    description:
      "A realistic collapse survivor. Hacker. Stalker. Criminal. Informant. His real weapon is knowing something before everyone else does.",
    url: "/arivoss",
    siteName: "Ari Voss",
    images: [
      {
        url: "/arivoss/face.png",
        width: 1200,
        height: 630,
        alt: "Ari Ghost Voss realistic face claim",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Ari “Ghost” Voss | Survivor File",
    description:
      "Hacker. Stalker. Criminal. Survivor. Full RP character file for Ari Ghost Voss.",
    images: ["/arivoss/face.png"],
  },
};

const coreFile = [
  {
    label: "Name",
    value: "Ari “Ghost” Voss",
    detail:
      "Most survivors only know the name Ghost. Ari is the name he rarely gives unless trust has been earned.",
  },
  {
    label: "Age",
    value: "21",
    detail:
      "Old enough to have lived through the early collapse, young enough to still take dangerous risks.",
  },
  {
    label: "Gender",
    value: "Male",
    detail:
      "Quiet, guarded, and hard to read. His expressions usually reveal less than his silence.",
  },
  {
    label: "Home",
    value: "Abandoned Telecom Monitoring Station",
    detail:
      "A half-dead building outside the city, hidden behind broken fences, radio towers, and rusted warning signs.",
  },
];

const appearance = [
  {
    label: "Height",
    value: "6'0 / 183 cm",
    detail:
      "Tall enough to appear intimidating, but not built like someone who wins every fight by force.",
  },
  {
    label: "Build",
    value: "Lean Athletic",
    detail:
      "Fast, sharp, and wiry. He looks like someone used to running rooftops, climbing fences, and going days without proper sleep.",
  },
  {
    label: "Hair Color",
    value: "Dark Brown",
    detail:
      "Usually messy, grown out, and half-covering his eyes. He cuts it himself when it becomes a problem.",
  },
  {
    label: "Eyes",
    value: "Hazel",
    detail:
      "Tired, watchful, and always scanning exits before looking at people directly.",
  },
  {
    label: "Face Claim",
    value: "AI Realistic Portrait",
    detail:
      "Sharp facial features, pale tired skin, dark under-eyes, and a permanent look of suspicion.",
  },
  {
    label: "Voice",
    value: "Low, Calm, Controlled",
    detail:
      "He speaks slowly, almost lazily, but every word feels chosen. He rarely raises his voice unless things are already bad.",
  },
];

const family = [
  {
    role: "Mom",
    name: "Emma Voss",
    status: "Missing",
    detail:
      "Last seen during an evacuation convoy. Ari still listens to old emergency channels hoping for a trace of her voice.",
  },
  {
    role: "Dad",
    name: "Marcus Voss",
    status: "Deceased",
    detail:
      "Died in the first month of the collapse while trying to get his family through a blocked highway route.",
  },
  {
    role: "Brother(s)",
    name: "None",
    status: "—",
    detail:
      "Ari grew up without brothers, which made him more protective of his younger sister.",
  },
  {
    role: "Sister",
    name: "Lena Voss",
    status: "Missing",
    detail:
      "The one person Ari refuses to accept as dead. Any rumor about a young woman matching her description can make him reckless.",
  },
];

const skills = [
  {
    title: "Cyber Recon",
    tag: "Information",
    detail:
      "Ari can work with abandoned devices, cached files, old security footage, radio chatter, broken terminals, and recovered storage drives. He is not magically hacking everything. He needs power, time, tools, and access.",
    limit:
      "Cannot instantly hack secured modern systems. Weak power, damaged equipment, and missing passwords slow him down.",
  },
  {
    title: "Digital Tracking",
    tag: "Ghost Work",
    detail:
      "Before the collapse, Ari made money by finding people who did not want to be found. In RP, this makes him good at connecting clues, old usernames, call signs, faction symbols, and repeated movement patterns.",
    limit:
      "He still needs evidence. He cannot know private information without finding realistic clues first.",
  },
  {
    title: "Lockpicking",
    tag: "Entry",
    detail:
      "He can open basic locks, old doors, lockers, storage cages, and some civilian vehicles. He prefers quiet entry over breaking things.",
    limit:
      "High-security locks, damaged locks, or rushed situations can fail and attract walkers.",
  },
  {
    title: "Radio Interception",
    tag: "Surveillance",
    detail:
      "Ari understands how to listen to open radio frequencies, identify repeated codes, and track faction activity through careless communication.",
    limit:
      "Encrypted or silent groups cannot be magically heard. Bad weather, distance, and damaged antennas matter.",
  },
  {
    title: "Scavenging",
    tag: "Survival",
    detail:
      "He knows what is actually useful: batteries, wires, fuel stabilizer, filters, medical tape, clean cloth, canned food, chargers, fuses, and ammunition.",
    limit:
      "He does not have unlimited supplies. Every run costs time, energy, fuel, and risk.",
  },
  {
    title: "Generator Repair",
    tag: "Utility",
    detail:
      "He can patch up small generators, replace loose wires, clean filters, and keep a dying power setup alive long enough to run lights, radios, or laptops.",
    limit:
      "He is not a master mechanic. Major engine or electrical failure needs parts and time.",
  },
  {
    title: "Boxing",
    tag: "Combat",
    detail:
      "Ari knows how to keep his guard up, throw clean punches, move his head, and survive close pressure. He uses boxing to create space, not to look cool.",
    limit:
      "A bigger, stronger, armored, or trained opponent can overpower him.",
  },
  {
    title: "Wrestling",
    tag: "Control",
    detail:
      "He can clinch, trip, drag, pin, and scramble out of bad positions. He uses it to escape, restrain, or buy time.",
    limit:
      "Multiple attackers, weapons, exhaustion, and injuries make wrestling extremely dangerous.",
  },
  {
    title: "Basic Firearms",
    tag: "Weapons",
    detail:
      "He can use a handgun or rifle safely enough to defend himself, but he is not a movie-level marksman.",
    limit:
      "Ammo is limited. Recoil, fear, darkness, blood loss, and moving targets affect him.",
  },
];

const weaknesses = [
  {
    title: "Not Built For Long Fights",
    detail:
      "Ari can fight, but he cannot brawl forever. If a fight drags on, his breathing gets heavier, his movements slow, and mistakes start happening.",
    consequence:
      "In RP, extended combat should make him weaker, not stronger.",
  },
  {
    title: "Insomnia",
    detail:
      "He sleeps lightly and badly. He often wakes up from small sounds, nightmares, or old radio static.",
    consequence:
      "Long episodes without proper rest can make him paranoid, shaky, and slower to react.",
  },
  {
    title: "Family Trigger",
    detail:
      "Mentioning his mother or sister can crack his calm persona. He may become aggressive, distracted, or desperate for information.",
    consequence:
      "Enemies can manipulate him with false leads about Lena or Emma.",
  },
  {
    title: "Limited Trust",
    detail:
      "Ari assumes every stranger wants something. He does not easily join groups, reveal his safehouse, or give real names.",
    consequence:
      "This protects him, but also makes alliances harder and can create unnecessary conflict.",
  },
  {
    title: "The Bike Is Loud",
    detail:
      "The BMW S1000RR is fast and terrifying, but its engine is not walker-friendly. It can announce his location from far away.",
    consequence:
      "Using the bike around hordes, factions, or quiet zones can become a serious mistake.",
  },
  {
    title: "Supplies Run Out",
    detail:
      "Fuel, bullets, batteries, medicine, food, and clean water are always limited. Ari survives by planning, not by having infinite gear.",
    consequence:
      "Bad planning can leave him stranded or forced to abandon equipment.",
  },
  {
    title: "Injuries Stay",
    detail:
      "A cut, stab, bite scare, gunshot graze, sprain, or broken rib changes how he moves for the rest of the episode.",
    consequence:
      "He cannot shake off serious damage like nothing happened.",
  },
  {
    title: "Morally Compromised",
    detail:
      "Ari has stolen, lied, stalked targets digitally, sold information, and hurt people indirectly before the collapse.",
    consequence:
      "His past can make people fear him, hate him, or refuse to trust him.",
  },
];

const vehicleFacts = [
  {
    label: "Vehicle",
    value: "BMW S1000RR “Wraith”",
  },
  {
    label: "Color",
    value: "Matte black with scratched fairings",
  },
  {
    label: "Strength",
    value: "Speed, intimidation, escape routes",
  },
  {
    label: "Weakness",
    value: "Noise, fuel, rough terrain, repairs",
  },
];

const rpRules = [
  "No god-modding",
  "No meta gaming",
  "No powerplaying",
  "Fear rule matters",
  "Injuries stay",
  "Realistic supplies",
  "Two martial arts max",
  "Walkers punish noise",
  "Reason needed to kill",
  "NPC limit respected",
];

export default function AriVossPage() {
  return (
    <main
      className={`${inter.className} relative min-h-screen overflow-hidden bg-[#030303] text-[#e8e1d5] selection:bg-red-900 selection:text-white`}
    >
      <div className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(circle_at_20%_0%,rgba(120,0,0,0.28),transparent_32%),radial-gradient(circle_at_90%_20%,rgba(255,255,255,0.08),transparent_28%),linear-gradient(180deg,#050505,#020202_45%,#090202)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.13] [background-image:linear-gradient(rgba(255,255,255,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,.85),transparent_35%,rgba(0,0,0,.75))]" />

      <Header />

      <section className="relative px-4 pb-16 pt-6 sm:px-7 lg:px-12 lg:pb-24">
        <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[1.08fr_.92fr] lg:items-end">
          <div className="relative z-10">
            <p
              className={`${typewriter.className} mb-4 max-w-fit rotate-[-1deg] border-y border-red-900/60 bg-red-950/20 px-3 py-2 text-xs uppercase tracking-[0.28em] text-red-200/80`}
            >
              survivor file
            </p>

            <h1
              className={`${bebas.className} text-[5.5rem] leading-[0.78] tracking-[-0.04em] text-[#f2eadb] sm:text-[8rem] md:text-[10rem] lg:text-[12rem]`}
            >
              ARI
              <span className="block translate-x-2 text-red-800 drop-shadow-[0_0_34px_rgba(127,29,29,0.35)] sm:translate-x-4">
                GHOST
              </span>
              <span className="block text-[#d9d0bf]">VOSS</span>
            </h1>

            <div className="mt-7 max-w-3xl border-l border-red-900/70 pl-5">
              <p className="text-lg leading-8 text-zinc-300 sm:text-xl sm:leading-9">
                A realistic collapse survivor built around digital stalking,
                criminal intelligence, quiet entry, and survival under pressure.
                Ari is not a superhuman. He bleeds, panics, runs out of ammo,
                loses fights, and makes mistakes. His real weapon is knowing
                something before everyone else does.
              </p>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              {["Hacker", "Stalker", "Criminal", "Survivor", "Informant"].map(
                (tag, index) => (
                  <span
                    key={tag}
                    className={`${
                      index % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"
                    } border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-zinc-300 shadow-[0_20px_80px_rgba(0,0,0,.35)]`}
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>

            <div className="mt-11 grid max-w-4xl gap-3 sm:grid-cols-2">
              {coreFile.map((item, index) => (
                <FileStrip key={item.label} item={item} index={index} />
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-10 z-10 hidden rotate-[-8deg] border border-red-950 bg-[#120202] px-5 py-3 text-sm font-black uppercase tracking-[0.22em] text-red-300 shadow-2xl lg:block">
              do not trust easily
            </div>

            <div className="relative mx-auto max-w-[520px] rotate-[1deg] border border-white/10 bg-[#0a0a0a] p-3 shadow-[0_40px_120px_rgba(0,0,0,.75)]">
              <div className="absolute -right-4 -top-4 h-24 w-24 border-r border-t border-red-900/60" />
              <div className="absolute -bottom-4 -left-4 h-24 w-24 border-b border-l border-red-900/60" />

              <div className="relative aspect-[4/5] overflow-hidden bg-zinc-950">
                <img
                  src="/arivoss/face.png"
                  alt="Ari Ghost Voss face claim"
                  className="h-full w-full object-cover grayscale-[30%] contrast-125 brightness-90"
                />

                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(0,0,0,.92)),linear-gradient(90deg,rgba(127,29,29,.26),transparent_40%)]" />
                <div className="absolute left-4 top-4 border border-white/10 bg-black/50 px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-zinc-300 backdrop-blur">
                  face claim
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                  <p className={`${typewriter.className} text-sm text-red-200`}>
                    “He shows up when the radios go quiet.”
                  </p>
                  <h2
                    className={`${bebas.className} mt-2 text-5xl leading-none text-white sm:text-6xl`}
                  >
                    THE MAN THEY CALL GHOST
                  </h2>
                </div>
              </div>
            </div>

           
          </div>
        </div>
      </section>

      <MusicPanel />

      <SectionShell
        id="vehicle"
        eyebrow="vehicle "
        title="BMW S1000RR “Wraith”"
        intro="Fast, violent, beautiful, and honestly a bad idea in a walker-filled world. That is exactly why Ari keeps it."
      >
        <div className="grid gap-7 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="relative border border-white/10 bg-[#070707] p-3 shadow-[0_30px_100px_rgba(0,0,0,.55)]">
            <div className="absolute -right-3 -top-3 z-10 rotate-3 bg-red-950 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-red-100">
              wraith
            </div>

            <div className="aspect-[16/10] overflow-hidden bg-zinc-950">
              <img
                src="/arivoss/bike.png"
                alt="BMW S1000RR Wraith"
                className="h-full w-full object-cover grayscale-[10%] contrast-125 brightness-90"
              />
            </div>

            <p className="mt-3 text-xs text-zinc-600">
              Bike image slot: public/arivoss/bike.png
            </p>
          </div>

          <div className="space-y-7">
            <p className="max-w-3xl text-lg leading-9 text-zinc-300">
              Ari rides a matte-black BMW S1000RR nicknamed{" "}
              <span className="font-black text-red-300">Wraith</span>. The
              fairings are scratched, the windscreen is tinted, and the exhaust
              has a rough growl that makes survivors look up before they know
              why. It has hidden storage for tools, a compact med kit, a spare
              radio battery, lockpicks, wire, and a small emergency fuel bottle.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {vehicleFacts.map((item, index) => (
                <div
                  key={item.label}
                  className={`border border-white/10 bg-white/[0.035] p-5 ${
                    index === 1 ? "sm:translate-y-4" : ""
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.26em] text-red-300/80">
                    {item.label}
                  </p>
                  <p className="mt-3 text-xl font-black text-zinc-100">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-l border-red-900/70 bg-red-950/[0.08] p-5">
              <p className={`${typewriter.className} text-sm text-red-100/90`}>
                RP realism note: The bike is not a cheat code. It is fast, but
                loud. It burns fuel, breaks down, struggles on ruined roads, and
                attracts walkers or factions if used carelessly.
              </p>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        id="appearance"
        eyebrow="visual record"
        title="Appearance / Voice / Presence"
        intro="Ari does not look like a clean hero. He looks tired, sharp, underfed, and dangerous in a quiet way."
      >
        <div className="columns-1 gap-5 md:columns-2 xl:columns-3">
          {appearance.map((item, index) => (
            <DossierNote key={item.label} item={item} index={index} />
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="family"
        eyebrow="family record"
        title="The Names He Does Not Say"
        intro="Ari acts cold because caring has already cost him too much."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {family.map((person, index) => (
            <div
              key={person.role}
              className={`relative border border-white/10 bg-[#080808] p-6 ${
                index % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                {person.role}
              </p>

              <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                <h3
                  className={`${bebas.className} text-5xl leading-none text-zinc-100`}
                >
                  {person.name}
                </h3>
                <span className="border border-red-900/70 bg-red-950/20 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-red-200">
                  {person.status}
                </span>
              </div>

              <p className="mt-5 text-sm leading-7 text-zinc-400">
                {person.detail}
              </p>
            </div>
          ))}
        </div>
      </SectionShell>

      <section id="backstory" className="px-4 py-16 sm:px-7 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8">
            <p
              className={`${typewriter.className} text-sm uppercase tracking-[0.3em] text-red-300/80`}
            >
              backstory / origin
            </p>
            <h2
              className={`${bebas.className} mt-3 max-w-5xl text-6xl leading-[0.85] text-zinc-100 sm:text-8xl lg:text-9xl`}
            >
              THE COLLAPSE SAVED HIM, THEN TOOK EVERYTHING
            </h2>
          </div>

          <div className="relative border-y border-white/10 py-8">
            <div className="absolute left-0 top-0 hidden h-full w-px bg-red-900/70 md:block" />

            <div className="grid gap-8 md:grid-cols-[240px_1fr]">
              <div className="hidden md:block">
                <div className="sticky top-8 space-y-3">
                  {["before", "outbreak", "after", "now"].map((item) => (
                    <p
                      key={item}
                      className="border-b border-white/10 pb-2 text-xs font-black uppercase tracking-[0.28em] text-zinc-600"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div className="space-y-7 text-lg leading-9 text-zinc-300">
                <p>
                  Before the collapse, Ari Voss was already living like a ghost.
                  He did not work in bright offices or wear a badge. He moved
                  through stolen logins, fake names, burner devices, black-market
                  contacts, and jobs that were never written down twice.
                </p>

                <p>
                  He was not a world-famous hacker. He was worse in a quieter
                  way: useful. He could find people, expose secrets, recover
                  deleted files, crack weak accounts, and sell information to
                  people who paid in cash, favors, weapons, or silence.
                </p>

                <p>
                  One job went wrong. A target he was paid to track turned out
                  to be connected to people with real guns, real reach, and no
                  interest in forgiveness. Ari started running before the world
                  ended. Then the outbreak arrived, and the collapse swallowed
                  the men chasing him.
                </p>

                <p>
                  The world falling apart should have felt like freedom. Instead,
                  it cost him his father, scattered his family, and turned every
                  road into a graveyard. His mother and sister vanished during an
                  evacuation convoy. His father died trying to get them through
                  a blocked highway route in the first month.
                </p>

                <p>
                  Now Ari survives out of an abandoned telecom monitoring
                  station outside the city. It is part safehouse, part workshop,
                  part listening post. Inside are scavenged batteries, cracked
                  laptops, old radios, maps with red thread, spare wires,
                  handwritten notes, and names of people who may know what
                  happened to Lena.
                </p>

                <p>
                  Most survivors only meet him once. He trades information,
                  fixes a radio, opens a locked room, warns someone about a
                  faction patrol, then disappears. People call him Ghost because
                  by the time they realize he was useful, he is already gone.
                </p>

                <p>
                  He tells himself he helps people because they might have
                  information. That is only half true. The other half is uglier:
                  Ari is trying to prove he can become something better than the
                  criminal he used to be.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionShell
        id="skills"
        eyebrow="field ability"
        title="Skills With Limits"
        intro="Every skill has a cost. Ari can be smart, useful, and dangerous without breaking realistic RP rules."
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {skills.map((skill, index) => (
            <SkillPanel key={skill.title} skill={skill} index={index} />
          ))}
        </div>
      </SectionShell>

      <SectionShell
        id="weaknesses"
        eyebrow="damage report"
        title="Weaknesses That Actually Matter"
        intro="This is what keeps him realistic. He is dangerous, but he is not unbeatable."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {weaknesses.map((weakness, index) => (
            <WeaknessPanel
              key={weakness.title}
              weakness={weakness}
              index={index}
            />
          ))}
        </div>
      </SectionShell>

      

      <section className="px-4 pb-20 pt-10 sm:px-7 lg:px-12">
        <div className="mx-auto max-w-[1500px] border border-red-950/70 bg-[linear-gradient(135deg,rgba(69,10,10,.22),rgba(255,255,255,.025),rgba(0,0,0,.75))] p-6 shadow-[0_40px_120px_rgba(0,0,0,.75)] sm:p-10">
          <p
            className={`${typewriter.className} text-sm uppercase tracking-[0.3em] text-red-300`}
          >
            rp compatibility
          </p>

          <h2
            className={`${bebas.className} mt-3 max-w-5xl text-6xl leading-[0.85] text-zinc-100 sm:text-8xl`}
          >
            BUILT FOR REALISTIC SURVIVAL ROLEPLAY
          </h2>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {rpRules.map((rule, index) => (
              <div
                key={rule}
                className={`border border-white/10 bg-black/35 p-4 text-sm font-black uppercase tracking-[0.16em] text-zinc-300 ${
                  index % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"
                }`}
              >
                {rule}
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-4xl text-base leading-8 text-zinc-400">
            Ari Voss follows fear, injury, supply, combat, and realism rules. He
            can lose. He can panic. He can be trapped. He can run out of fuel.
            He can make the wrong call. His strength is not being impossible to
            beat — it is being hard to predict.
          </p>
        </div>
      </section>
    </main>
  );
}

function Header() {
  return (
    <header className="px-4 pt-4 sm:px-7 lg:px-12">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between border-b border-white/10 pb-4">
        <a
          href="#"
          className={`${bebas.className} text-3xl tracking-wide text-zinc-100`}
        >
          ARI VOSS
        </a>

        <nav className="hidden items-center gap-6 text-xs font-black uppercase tracking-[0.24em] text-zinc-500 md:flex">
          <a href="#vehicle" className="transition hover:text-red-300">
            Vehicle
          </a>
          <a href="#backstory" className="transition hover:text-red-300">
            Backstory
          </a>
          <a href="#skills" className="transition hover:text-red-300">
            Skills
          </a>
          <a href="#weaknesses" className="transition hover:text-red-300">
            Weaknesses
          </a>
        </nav>

        <span className="border border-red-900/70 bg-red-950/20 px-3 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-red-200">
          Ghost File
        </span>
      </div>
    </header>
  );
}

function MusicPanel() {
  return (
    <section className="px-4 py-10 sm:px-7 lg:px-12">
      <div className="mx-auto max-w-[1500px] border-y border-white/10 py-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p
              className={`${typewriter.className} text-sm uppercase tracking-[0.3em] text-red-300/80`}
            >
              background music 
            </p>
            <h2
              className={`${bebas.className} mt-2 text-5xl leading-none text-zinc-100 sm:text-6xl`}
            >
              THEME OF GHOST
            </h2>
            
          </div>

          <audio controls loop className="w-full md:w-[420px]">
            <source src="/arivoss/bg.mp3" type="audio/mpeg" />
          </audio>
        </div>
      </div>
    </section>
  );
}

function SectionShell({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="px-4 py-16 sm:px-7 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-9 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p
              className={`${typewriter.className} text-sm uppercase tracking-[0.3em] text-red-300/80`}
            >
              {eyebrow}
            </p>
            <h2
              className={`${bebas.className} mt-3 text-6xl leading-[0.86] text-zinc-100 sm:text-8xl`}
            >
              {title}
            </h2>
          </div>

          <p className="max-w-3xl border-l border-white/10 pl-5 text-base leading-8 text-zinc-400">
            {intro}
          </p>
        </div>

        {children}
      </div>
    </section>
  );
}

function FileStrip({
  item,
  index,
}: {
  item: { label: string; value: string; detail: string };
  index: number;
}) {
  return (
    <div
      className={`border-l border-white/10 bg-white/[0.025] p-5 ${
        index % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"
      }`}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-300/70">
        {item.label}
      </p>
      <h3 className="mt-2 text-2xl font-black text-zinc-100">{item.value}</h3>
      <p className="mt-3 text-sm leading-7 text-zinc-500">{item.detail}</p>
    </div>
  );
}

function DossierNote({
  item,
  index,
}: {
  item: { label: string; value: string; detail: string };
  index: number;
}) {
  return (
    <div
      className={`mb-5 break-inside-avoid border border-white/10 bg-[#080808] p-6 shadow-[0_25px_80px_rgba(0,0,0,.35)] ${
        index % 3 === 0
          ? "rotate-[-0.7deg]"
          : index % 3 === 1
            ? "rotate-[0.8deg]"
            : ""
      }`}
    >
      <p className="text-xs font-black uppercase tracking-[0.28em] text-red-300/70">
        {item.label}
      </p>
      <h3
        className={`${bebas.className} mt-3 text-5xl leading-none text-zinc-100`}
      >
        {item.value}
      </h3>
      <p className="mt-4 text-sm leading-7 text-zinc-500">{item.detail}</p>
    </div>
  );
}

function SkillPanel({
  skill,
  index,
}: {
  skill: { title: string; tag: string; detail: string; limit: string };
  index: number;
}) {
  return (
    <article
      className={`group relative min-h-[310px] overflow-hidden border border-white/10 bg-[#080808] p-6 shadow-[0_30px_90px_rgba(0,0,0,.45)] ${
        index % 4 === 0
          ? "lg:translate-y-8"
          : index % 4 === 1
            ? "lg:rotate-[0.8deg]"
            : index % 4 === 2
              ? "lg:rotate-[-0.8deg]"
              : ""
      }`}
    >
      <div className="absolute right-0 top-0 h-20 w-20 border-r border-t border-red-900/40 opacity-0 transition group-hover:opacity-100" />

      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-300/70">
        {skill.tag}
      </p>

      <h3
        className={`${bebas.className} mt-3 text-5xl leading-none text-zinc-100`}
      >
        {skill.title}
      </h3>

      <p className="mt-5 text-sm leading-7 text-zinc-400">{skill.detail}</p>

      <div className="mt-5 border-l border-red-900/70 pl-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-200/80">
          Limit
        </p>
        <p className="mt-2 text-sm leading-7 text-zinc-500">{skill.limit}</p>
      </div>
    </article>
  );
}

function WeaknessPanel({
  weakness,
  index,
}: {
  weakness: { title: string; detail: string; consequence: string };
  index: number;
}) {
  return (
    <article
      className={`border border-red-950/60 bg-[linear-gradient(135deg,rgba(69,10,10,.18),rgba(255,255,255,.025))] p-6 ${
        index % 2 === 0 ? "md:rotate-[-0.5deg]" : "md:rotate-[0.5deg]"
      }`}
    >
      <div className="flex items-start gap-4">
        <span className="mt-2 h-3 w-3 shrink-0 bg-red-800 shadow-[0_0_25px_rgba(185,28,28,.8)]" />
        <div>
          <h3
            className={`${bebas.className} text-5xl leading-none text-zinc-100`}
          >
            {weakness.title}
          </h3>

          <p className="mt-4 text-sm leading-7 text-zinc-400">
            {weakness.detail}
          </p>

          <p
            className={`${typewriter.className} mt-5 border-t border-white/10 pt-4 text-sm leading-7 text-red-100/80`}
          >
            {weakness.consequence}
          </p>
        </div>
      </div>
    </article>
  );
}