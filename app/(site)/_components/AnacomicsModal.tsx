"use client";

import { useEffect, useState } from "react";

// ── Shared sub-components ────────────────────────────────────────────────────

function ComicImg({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="my-6 w-full rounded-lg border border-zinc-200 object-contain"
    />
  );
}

// Uniform aside style — left border, subtle background. Used for quotes, definitions, summaries.
function Aside({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-5 border-l-2 border-zinc-300 pl-4 py-1 text-sm text-zinc-600 leading-relaxed">
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold text-zinc-900 mt-8 mb-3 first:mt-0 tracking-tight">{children}</h2>
  );
}

function FootnoteBlock({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="mt-8 pt-4 border-t border-zinc-200 text-[11px] text-zinc-400 leading-relaxed">
      <sup className="font-semibold not-italic">{number}</sup> {children}
    </div>
  );
}

// ── Page definitions ─────────────────────────────────────────────────────────

const PAGES: React.ReactNode[] = [

  // ── Page 1: Cover + Intro ────────────────────────────────────────────────
  <div key="p1">
    <div className="text-center mb-8">
      <div className="inline-block bg-yellow-400 text-zinc-900 font-black text-base tracking-widest uppercase px-3 py-0.5 rounded mb-4">
        ANACOMICS
      </div>
      <h1 className="text-2xl font-black text-zinc-900 leading-tight">
        Deployment Architecture
      </h1>
      <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
        Written by Asher Sebban (UXR), with unofficial emotional support from Claude, Gemini, ChatGPT, and Sora.
        <br />
        Inspired by Cham &amp; Whiteson, Monty Python, and Sammy (who helped with this chapter).
      </p>
    </div>

    <div className="border-t border-zinc-200 pt-6">
      <SectionTitle>So... What is Deployment Architecture?</SectionTitle>
      <p className="text-sm text-zinc-700 leading-relaxed mb-4">
        First of all — <em>scary words</em>. No need to clutch your emotional support coffee mug.
        It&apos;s pretty straightforward. In fact, you&apos;re probably an expert on Deployment Architecture
        already without realizing it.
      </p>
      <p className="text-sm text-zinc-700 leading-relaxed mb-3">
        In this module we&apos;ll cover four types of deployment: <strong>local</strong>, <strong>cloud</strong>, <strong>hybrid</strong>, and <strong>on-prem</strong>.
      </p>
      <p className="text-sm text-zinc-500 italic">Ready to see how much you already know?</p>
      <ComicImg src="/images/anacomics/mirror-girl.png" alt="Little girl in mirror: I am smart, I am kind, I am emotionally stable, I am a natural cloud vs local expert" />
    </div>
  </div>,

  // ── Page 2: Local Deployment ─────────────────────────────────────────────
  <div key="p2">
    <SectionTitle>1. Local Deployment</SectionTitle>
    <p className="text-sm text-zinc-700 leading-relaxed mb-4">
      Local applications live and run entirely on your computer. Every calculation, every save,
      every crash — all of it happens inside that warm, increasingly loudly humming rectangle on
      your desk. But if that rectangle catches fire? So does everything inside it.
    </p>
    <ComicImg src="/images/anacomics/house-fire.png" alt="Local deployment: house on fire, someone says 'Wait...we forgot to back it up to the cloud'" />
    <p className="text-sm text-zinc-700 leading-relaxed mb-4">
      One sign that you&apos;re dealing with a local application is when you have to download it and
      go through an installation wizard — where you click <em>Next</em> a bunch of times, scroll past
      92 seconds of terms and conditions, and click <em>Finish</em>. What those wizards actually do is
      tell the computer where to store all the outside files you&apos;re bringing in.
    </p>
    <ComicImg src="/images/anacomics/terms-conditions.png" alt="Terms and conditions: 'Can you put your files on my computer?' 'Okay, but only on one condition. It's a very long condition.'" />
    <p className="text-sm text-zinc-700 leading-relaxed">
      So the next time you run an installer, know that you&apos;re basically inserting someone else&apos;s
      stuff into your file system — which is why you should never, ever, under any circumstances,{" "}
      <a
        href="https://tenor.com/view/you-failed-wednesday-addams-wednesday-you-disappoint-me-you-did-not-succeed-gif-9721171787213100737"
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-zinc-500 hover:text-zinc-800 transition-colors"
      >
        click random links ← like this one
      </a>
      . (Seriously. Don&apos;t.)
    </p>
  </div>,

  // ── Page 3: Cloud Deployment ─────────────────────────────────────────────
  <div key="p3">
    <SectionTitle>2. Cloud Deployment: Someone Else&apos;s Computer (Usually Jeff&apos;s)</SectionTitle>
    <p className="text-sm text-zinc-700 leading-relaxed mb-4">
      Cloud apps do the same things local apps do. The difference? The app doesn&apos;t live on
      your computer — it lives on someone else&apos;s. A long time ago, Amazon started building
      massive warehouses full of powerful computers and basically ran a 3am infomercial:
    </p>
    <Aside>
      <em>&ldquo;Running out of storage? Computer overheating? Need more speed? You don&apos;t need to
      buy a new computer. Just use one of ours!&rdquo;</em>
    </Aside>
    <p className="text-sm text-zinc-700 leading-relaxed mb-3">
      They called it <strong>the Cloud</strong>. With just an internet connection, you could use the fastest,
      largest computers in the world for only a few cents:
    </p>
    <ul className="text-sm text-zinc-700 leading-relaxed space-y-2 mb-5 pl-1">
      <li className="flex gap-2"><span className="text-zinc-400 mt-0.5">—</span><span>People stopped using thumb drives: <strong>Cloud Storage</strong>.</span></li>
      <li className="flex gap-2"><span className="text-zinc-400 mt-0.5">—</span><span>Developers stopped buying hardware and rented Jeff&apos;s instead: <strong>Cloud Computing</strong>.<sup>1</sup></span></li>
      <li className="flex gap-2"><span className="text-zinc-400 mt-0.5">—</span><span>Companies sold their servers and moved everything over: <strong>Cloud Migration</strong>.</span></li>
      <li className="flex gap-2"><span className="text-zinc-400 mt-0.5">—</span><span>Startups built apps that never had to be downloaded at all: <strong>Cloud Applications</strong>.</span></li>
    </ul>
    <p className="text-sm text-zinc-700 leading-relaxed mb-4">
      Amazon became one of the most successful companies ever. Pretty soon, Google, Microsoft,
      IBM, Alibaba, and every startup in the galaxy was building data centers to get in on it.
    </p>
    <ComicImg src="/images/anacomics/star-wars.png" alt="Darth Vader: 'Behold... the Data Star.' Engineer: 'Sir, where should we put the server cooling vent?' Vader: 'NO VENTS!'" />
    <FootnoteBlock number={1}>
      <strong>Cloud Computing:</strong> your computer sends a hard problem to a server in Jeff&apos;s warehouse, the server solves it, and sends back the result.
      CPUs are the &ldquo;brain&rdquo; — servers have faster ones. GPUs are like 500 CPUs on Red Bull working in parallel.{" "}
      <a href="https://www.youtube.com/watch?v=Ge-g3xZ5bb8" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-600">
        Mythbusters: GPU vs CPU →
      </a>
    </FootnoteBlock>
  </div>,

  // ── Page 4: The Need for Internet Speed ──────────────────────────────────
  <div key="p4">
    <SectionTitle>The Need for Internet Speed</SectionTitle>
    <p className="text-sm text-zinc-700 leading-relaxed mb-4">
      Computers speak to each other over the internet — which, if you didn&apos;t know, is mostly just
      a bunch of cables underground. On the ocean floor and underneath the roads we drive on,
      fiber optic cables physically connect WiFi boxes and cell towers to buildings owned by
      Internet Service Providers (ISPs). When you send an email, it gets compressed into numbers,
      travels across those cables to the ISP, and routes to another computer. That fancy thing we
      call the Cloud? <strong>It&apos;s all mostly underground.</strong>
    </p>
    <ComicImg src="/images/anacomics/cloud-cables.png" alt="The cloud: not actually in the sky. Just cables underground going to Jeff's 'Property of Jeff' server room." />
    <p className="text-sm text-zinc-700 leading-relaxed mb-4">
      Offloading work to Jeff&apos;s computer makes your own laptop faster and quieter — and your files
      survive even if your laptop takes a swan dive off a cliff, because they mostly don&apos;t live on
      your machine in the first place.
    </p>
    <Aside>
      <strong>TL;DR:</strong> The tech giants built massive computer hotels. Our devices just rent rooms.
    </Aside>
    <ComicImg src="/images/anacomics/cloud-hotel.png" alt="THE CLOUD - Now Hosting Your Files! Jeff as hotel manager: 'Relax, we've stored millions of files here. Just don't forget your WiFi password'" />
    <p className="text-sm text-zinc-700 leading-relaxed mb-4">
      It&apos;s a lucrative hotel: AWS generated <strong>$28.8 billion in net sales for Q4 2024</strong> — 15.3% of Amazon&apos;s
      total revenue, and 50% of its entire operating income.
    </p>
    <p className="text-sm text-zinc-700 leading-relaxed mb-5">
      The catch: no internet means no access to your own files. (This is why Google Docs goes blank
      in Airplane mode, but Microsoft Word keeps working.) Your data also has to travel across the
      web to reach you — which is usually fine, unless you think of web traffic as a fleet of
      glitter-covered vans labeled &ldquo;Definitely Not Sensitive Info.&rdquo; <em>[*The security team has entered the chat.*]</em>
    </p>
    <Aside>
      <strong>Key terms:</strong>
      <ul className="mt-2 space-y-1.5">
        <li><strong>Remote server</strong> — a computer that is physically far away from you</li>
        <li><strong>Cloud storage</strong> — your files live on a remote server</li>
        <li><strong>Cloud computing</strong> — a remote server does the hard work; you get the result</li>
      </ul>
    </Aside>
  </div>,

  // ── Page 5: Hybrid Applications ──────────────────────────────────────────
  <div key="p5">
    <SectionTitle>3. Hybrid Applications: A Bit of Both Worlds</SectionTitle>
    <p className="text-sm text-zinc-700 leading-relaxed mb-4">
      Hybrid apps are tech&apos;s version of shared custody. You install them like local apps, but part
      of their brain lives in the cloud. Your computer does some of the heavy lifting; the cloud
      quietly keeps everything backed up and synced.
    </p>
    <p className="text-sm text-zinc-700 leading-relaxed mb-5">
      Think <strong>Dropbox</strong>, <strong>Spotify</strong>, or <strong>Steam</strong>. They feel native because they are — installed on your
      machine, using local resources. But they&apos;re constantly talking to the cloud, pulling updates,
      syncing data, and backing things up. The snappy feel of local software with the convenience
      of cloud storage.
    </p>
    <ComicImg src="/images/anacomics/hybrid-mediation.png" alt="HYBRID MEDIATION Est. 1999: Cloud and computer in shared custody, 'You each get 50% custody... unless the Wi-Fi goes out'" />
  </div>,

  // ── Page 6: On-Prem, Air Gaps, and Sneakernet ────────────────────────────
  <div key="p6">
    <SectionTitle>4. On-Prem, Air Gaps, and the Sneakernet</SectionTitle>
    <p className="text-sm text-zinc-700 leading-relaxed mb-4">
      Some organizations don&apos;t trust the cloud. So instead, they build their own private data
      centers — on company property, inside buildings they can walk into. Because the infrastructure
      is <em>on the premises</em>, this is called <strong>on-prem</strong>. Popular with governments, banks, and
      hospitals: basically anyone whose worst-case scenario involves a breach making headlines
      before breakfast.
    </p>
    <ComicImg src="/images/anacomics/on-prem-pt1.png" alt="On-Prem: Deployment Strategy — Control, Security, Independence. 'Oh yeah? Well this is OUR data center!' WHRRRR" />
    <p className="text-sm text-zinc-700 leading-relaxed mb-4">
      Jeff is not very worried about the competition.
    </p>
    <ComicImg src="/images/anacomics/on-prem-pt2.png" alt="Man pointing at small data center next to a massive AWS building: 'Oh yeah? Well this is OUR data center!'" />
    <p className="text-sm text-zinc-700 leading-relaxed mb-4">
      The downside: security is entirely on you. The biggest breaches often come from on-prem
      setups that weren&apos;t built or maintained properly. That&apos;s why some go even further — and use
      the <strong>Air Gap</strong>.
    </p>
    <Aside>
      <strong>Air-gapped systems</strong> are physically isolated. No Wi-Fi, no Ethernet, no Bluetooth. Just cold,
      lonely data locked in a bunker, listening to its own hard drive spin — the security equivalent of
      digging a moat, raising the drawbridge, and swallowing the key.
    </Aside>
    <ComicImg src="/images/anacomics/air-gap.png" alt="Air Gap: isolated server 'Still spinning...still secure...', drawbridge castle rejecting cloud with donuts, knight 'WHAT ARE YOU DOING?!'" />
    <p className="text-sm text-zinc-700 leading-relaxed mb-4">
      And if you need to move data between two air-gapped systems? You can&apos;t use the internet.
      So you use the <strong>Sneakernet</strong> — which is not a protocol. It&apos;s a person, in sneakers, with a
      USB stick. Someone puts the file on the drive and walks it across the building. Because
      sometimes, the most secure data transfer method on Earth is Karen from accounting
      power-walking between servers with{" "}
      <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded font-mono">top_secret_FINAL_v4.pptx</code>{" "}
      in her tote bag. <em>(Note from Claude: &ldquo;sneakernet is actually a legitimate security protocol, not just a casual workaround.&rdquo; — I don&apos;t know why I found this so funny.)</em>
    </p>
    <ComicImg src="/images/anacomics/sneakernet.png" alt="THE SNEAKERNET PROTOCOL: woman running with tote bag, 'ETA to server room: 3 minutes. if I don't stop for coffee.'" />
  </div>,

  // ── Page 7: The Short Version + Closing ──────────────────────────────────
  <div key="p7">
    <SectionTitle>Deployment — The Short Version</SectionTitle>
    <div className="space-y-3 mb-6">
      <div className="border-l-2 border-zinc-300 pl-4 py-1">
        <p className="text-sm font-semibold text-zinc-800 mb-0.5">🖥️ Local</p>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Your computer does everything. Sharing files requires a PhD in format conversion and a prayer circle.
        </p>
      </div>
      <div className="border-l-2 border-zinc-300 pl-4 py-1">
        <p className="text-sm font-semibold text-zinc-800 mb-0.5">🏢 On-Prem</p>
        <p className="text-sm text-zinc-600 leading-relaxed">
          A closed system with more locks. With the air gap, no internet allowed in — sharing requires Karen jogging between buildings with a thumb drive.
        </p>
      </div>
      <div className="border-l-2 border-zinc-300 pl-4 py-1">
        <p className="text-sm font-semibold text-zinc-800 mb-0.5">☁️ Cloud</p>
        <p className="text-sm text-zinc-600 leading-relaxed">
          You&apos;re not looking at your file — you&apos;re watching a live stream of it from Jeff&apos;s data center.<sup>4</sup> Click a button. Send a link. Done.
        </p>
      </div>
    </div>
    <ComicImg src="/images/anacomics/jeff-traffic.png" alt="Jeff Bezos as traffic controller routing files: sharing is simple when files live in the cloud" />
    <Aside>
      <strong>Congratulations.</strong> &ldquo;Deployment architecture&rdquo; is just a fancy way of asking:{" "}
      <em>where does the software live, and who&apos;s paying the electric bill?</em>
      <br /><br />
      Next time someone mentions &ldquo;air gap&rdquo; or &ldquo;on-prem&rdquo; in a meeting, you won&apos;t just nod along.
      You&apos;ll picture Karen, sprinting through hallways with humanity&apos;s last thumb drive.
    </Aside>
    <p className="text-xs text-zinc-400 mt-6 text-center leading-relaxed">
      Thanks for reading. Questions, corrections, or new ANACOMIC requests?{" "}
      <span className="text-zinc-500 font-medium">Message Asher Sebban on Slack.</span>
    </p>
    <FootnoteBlock number={4}>
      Even though you&apos;re viewing this on your computer, the file doesn&apos;t actually live here — it&apos;s
      a live projection from a cloud server. Disconnect the internet and reload: it&apos;s gone. Only
      disconnect without reloading and it stays — because Chrome cached a temporary local copy. 🤓
    </FootnoteBlock>
  </div>,

];

// ── Modal ─────────────────────────────────────────────────────────────────────

interface Props {
  onClose: () => void;
}

export default function AnacomicsModal({ onClose }: Props) {
  const [page, setPage] = useState(0);
  const total = PAGES.length;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === "ArrowDown") setPage((p) => Math.min(p + 1, total - 1));
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   setPage((p) => Math.max(p - 1, 0));
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, total]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 flex flex-col w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl border border-border bg-card">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border flex-shrink-0">
          <span className="text-xs font-bold tracking-widest uppercase text-yellow-500">
            ANACOMICS
          </span>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted">
              {page + 1} / {total}
            </span>
            <button
              onClick={onClose}
              className="text-xl leading-none text-muted hover:text-foreground transition-colors"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Page content — cream paper feel */}
        <div className="flex-1 overflow-y-auto bg-[#fefcf7]">
          <div className="px-8 py-7">{PAGES[page]}</div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border flex-shrink-0">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="px-4 py-1.5 text-xs font-medium rounded-lg border border-border text-muted hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>

          <div className="flex gap-1.5">
            {PAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === page ? "bg-accent" : "bg-border hover:bg-muted"
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, total - 1))}
            disabled={page === total - 1}
            className="px-4 py-1.5 text-xs font-medium rounded-lg border border-border text-muted hover:border-accent hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
