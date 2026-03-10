"use client";

import { useEffect, useState } from "react";

// ── Shared sub-components ────────────────────────────────────────────────────

function ComicImg({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="my-5 w-full rounded-lg border border-zinc-200 object-contain"
    />
  );
}

function Callout({
  children,
  variant = "yellow",
}: {
  children: React.ReactNode;
  variant?: "yellow" | "blue" | "red" | "gray";
}) {
  const styles = {
    yellow: "bg-yellow-50 border-yellow-300 text-yellow-900",
    blue:   "bg-sky-50   border-sky-300   text-sky-900",
    red:    "bg-red-50   border-red-300   text-red-900",
    gray:   "bg-zinc-100 border-zinc-300  text-zinc-700",
  };
  return (
    <div className={`my-4 rounded-lg border px-4 py-3 text-sm leading-relaxed ${styles[variant]}`}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold text-zinc-900 mt-8 mb-3 first:mt-0">{children}</h2>
  );
}

function FootnoteBlock({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="mt-6 pt-4 border-t border-zinc-200 text-[11px] text-zinc-500 italic leading-relaxed">
      <sup className="not-italic font-semibold">{number}</sup> {children}
    </div>
  );
}

// ── Page definitions ─────────────────────────────────────────────────────────

const PAGES: React.ReactNode[] = [

  // ── Page 1: Cover + Intro ────────────────────────────────────────────────
  <div key="p1">
    <div className="text-center mb-6">
      <div className="inline-block bg-yellow-400 text-zinc-900 font-black text-xl tracking-widest uppercase px-4 py-1 rounded mb-3">
        ANACOMICS
      </div>
      <h1 className="text-2xl font-black text-zinc-900 leading-tight">
        Deployment Architecture
      </h1>
      <p className="mt-3 text-xs text-zinc-500 italic leading-relaxed">
        Written by Asher Sebban (UXR), with unofficial emotional support from Claude, Gemini, ChatGPT, and Sora.
        <br />
        Inspired by Cham &amp; Whiteson, Monty Python, and my very good friend Sammy (who helped me with this chapter!).
      </p>
    </div>

    <div className="border-t border-zinc-200 pt-6">
      <SectionTitle>So... What is Deployment Architecture?</SectionTitle>
      <p className="text-sm text-zinc-700 leading-relaxed mb-3">
        First of all... <strong>Scary words.</strong>
      </p>
      <p className="text-sm text-zinc-700 leading-relaxed mb-3">
        No need to clutch your emotional support coffee mug... it&apos;s pretty straight forward. In fact, you&apos;re
        probably an expert on Deployment Architecture already without even realizing.
      </p>
      <p className="text-sm text-zinc-700 leading-relaxed mb-3">
        In this module we will discover <strong>4 types of &ldquo;deployment&rdquo;</strong>: local, cloud, hybrid, and on-prem.
      </p>
      <p className="text-sm font-semibold text-zinc-800">Ready to see how much you already know?</p>
      <ComicImg src="/images/anacomics/mirror-girl.png" alt="Little girl in mirror: I am smart, I am kind, I am emotionally stable, I am a natural cloud vs local expert" />
    </div>
  </div>,

  // ── Page 2: Local Deployment ─────────────────────────────────────────────
  <div key="p2">
    <SectionTitle>1. Local Deployment</SectionTitle>
    <p className="text-sm text-zinc-700 leading-relaxed mb-3">
      Local applications are applications that live and run on your computer. Every calculation, every
      save, every crash, all the cool stuff the application does... all happens inside that warm,
      increasingly loudly humming rectangle on your desk. But if that rectangle catches fire? So does
      everything inside it.
    </p>
    <ComicImg src="/images/anacomics/house-fire.png" alt="Local deployment: house on fire, someone says 'Wait...we forgot to back it up to the cloud'" />
    <p className="text-sm text-zinc-700 leading-relaxed mb-3">
      One hint that you&apos;re dealing with a local application is when you have to download it and/or go
      through one of those cool installation wizards. 🙂
    </p>
    <p className="text-sm text-zinc-700 leading-relaxed mb-3">
      Behind the scenes, those installation wizards (where you click <em>Next</em> a bunch of times, scroll
      down the terms and conditions for 92 seconds, and click <em>Finish</em>), help tell the computer where to
      store all the outside files you&apos;re bringing in.
    </p>
    <ComicImg src="/images/anacomics/terms-conditions.png" alt="Terms and conditions: 'Can you put your files on my computer?' 'Okay, but only on one condition. It's a very long condition.'" />
    <p className="text-sm text-zinc-700 leading-relaxed">
      So the next time you go through an Installer or download something, know that you&apos;re basically
      inserting someone else&apos;s stuff into your file system (which is why you should never, ever, under
      any circumstances,{" "}
      <a
        href="https://tenor.com/view/you-failed-wednesday-addams-wednesday-you-disappoint-me-you-did-not-succeed-gif-9721171787213100737"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800"
      >
        click random links ← like this one
      </a>
      ) (seriously, don&apos;t do it).
    </p>
  </div>,

  // ── Page 3: Cloud Deployment ─────────────────────────────────────────────
  <div key="p3">
    <SectionTitle>2. Cloud Deployment: Someone Else&apos;s Computer (Usually Jeff&apos;s)</SectionTitle>
    <p className="text-sm text-zinc-700 leading-relaxed mb-3">
      Cloud apps mostly do the same things local apps do. The difference? The app doesn&apos;t live on
      your computer... it lives on someone else&apos;s. Very often, that someone is Jeff Bezos.
    </p>
    <p className="text-sm text-zinc-700 leading-relaxed mb-3">
      Let me explain...
    </p>
    <p className="text-sm text-zinc-700 leading-relaxed mb-2">
      <strong>Story Time:</strong> A long, long time ago, a company called Amazon started building massive
      warehouses full of powerful computers. Cue the 3:00am infomercial (not really, but you&apos;ll get the idea):
    </p>
    <Callout variant="yellow">
      <em>&ldquo;Running out of storage? Computer overheating? Need more speed? You don&apos;t need to buy
      a new computer. Just use one of ours!&rdquo;</em>
    </Callout>
    <p className="text-sm text-zinc-700 leading-relaxed mb-3">
      They called it <strong>&ldquo;the Cloud&rdquo;</strong>.
    </p>
    <p className="text-sm text-zinc-700 leading-relaxed mb-2">
      With just an internet connection, you could use the fastest, largest computers in the world for only a few cents!
    </p>
    <ul className="text-sm text-zinc-700 leading-relaxed space-y-2 mb-4 list-none pl-0">
      <li className="flex gap-2"><span>●</span><span>People stopped using thumb drives and started saving family photos on Jeff&apos;s computers (<strong>&ldquo;Cloud Storage&rdquo;</strong>).</span></li>
      <li className="flex gap-2"><span>●</span><span>Developers stopped buying expensive hardware and instead ran their intense workloads using Jeff&apos;s computers (<strong>&ldquo;Cloud Computing&rdquo;</strong><sup>1</sup>).</span></li>
      <li className="flex gap-2"><span>●</span><span>Companies sold their onsite servers and migrated to Jeff&apos;s computers (a process called <strong>&ldquo;Cloud Migration&rdquo;</strong>).</span></li>
      <li className="flex gap-2"><span>●</span><span>Startups built apps that lived entirely on Jeff&apos;s computers and never had to be downloaded onto yours (a <strong>&ldquo;Cloud Application&rdquo;</strong>).</span></li>
    </ul>
    <p className="text-sm text-zinc-700 leading-relaxed mb-4">
      Amazon exploded into one of the most successful companies ever. Pretty soon, Google,
      Microsoft, IBM, Alibaba, and every start-up in the galaxy was building data centers to get
      in on the Cloud action.
    </p>
    <ComicImg src="/images/anacomics/star-wars.png" alt="Darth Vader: 'Behold... the Data Star.' Engineer: 'Sir, where should we put the server cooling vent?' Vader: 'NO VENTS!'" />
    <FootnoteBlock number={1}>
      <strong>Cloud Computing in 3 minutes:</strong> Cloud computing is the computer version of outsourcing math homework to a super-genius who lives in a warehouse. The genius
      solves the math problem and sends us back the results. Cloud Servers are usually faster than our laptops because they have newer and faster CPUs (the &ldquo;computer&apos;s brain&rdquo;).
      GPUs are basically a team of CPUs that downed a case of Red Bull — &ldquo;spinning up&rdquo; a GPU-server unleashes 500 hyper-caffeinated mathematicians working in parallel.{" "}
      <a href="https://www.youtube.com/watch?v=Ge-g3xZ5bb8" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
        Mythbusters Demo GPU vs CPU →
      </a>
    </FootnoteBlock>
  </div>,

  // ── Page 4: The Need for Internet Speed ──────────────────────────────────
  <div key="p4">
    <SectionTitle>The Need for Internet Speed</SectionTitle>
    <p className="text-sm text-zinc-700 leading-relaxed mb-3">
      Computers speak to each other over the internet, which if you didn&apos;t know, is mostly just a
      bunch of cables underground... surprise!
    </p>
    <p className="text-sm text-zinc-700 leading-relaxed mb-3">
      That&apos;s right! On the ocean floor and underneath the roads we drive on there are a series of fiber
      optic cables. Those cables physically connect WiFi boxes and cell-towers to big buildings
      owned by Internet Service Providers (ISP). From there, the ISP routes the traffic. When you
      send an email, your email gets compressed into tiny numbers, those numbers travel across the
      cables to the internet service provider building who sends it to another computer. So basically,
      that fancy thing we call the Cloud? <strong>It&apos;s all mostly underground!</strong>
    </p>
    <ComicImg src="/images/anacomics/cloud-cables.png" alt="The cloud: not actually in the sky. Just cables underground going to Jeff's 'Property of Jeff' server room." />
    <p className="text-sm text-zinc-700 leading-relaxed mb-3">
      The process of offloading tasks to Jeff&apos;s computer makes your own laptop faster and hum
      quieter. PLUS your files live-on even if your physical laptop takes a swan dive off some cliff
      (because they mostly don&apos;t live on your computer in the first place).
    </p>
    <Callout variant="blue">
      <strong>TL;DR:</strong> Cloud = the tech giants built massive computer hotels; our devices rent rooms!
    </Callout>
    <ComicImg src="/images/anacomics/cloud-hotel.png" alt="THE CLOUD - Now Hosting Your Files! Jeff as hotel manager: 'Relax, we've stored millions of files here. Just don't forget your WiFi password'" />
    <p className="text-sm text-zinc-700 leading-relaxed mb-3">
      <strong>PS.</strong> It&apos;s a lucrative hotel: AWS generated net sales of <strong>$28.8 billion for Q4 2024</strong>, accounted for 15.3% of total net sales, and 50% of Amazon&apos;s entire operating income.
    </p>
    <p className="text-sm text-zinc-700 leading-relaxed mb-3">
      But... no internet? Then, the connection between the two computers is severed, and you lose
      access to your own files.<sup>2</sup>
      {" "}With Cloud Applications, your data has to travel across the web to
      reach you. Which is usually no problem, unless you think of traffic on the web as a bunch of
      glitter-covered vans labeled &ldquo;Definitely Not Sensitive Info.&rdquo; 😃 <em>[*The Cyber-security team has entered the chat.*]</em>
    </p>
    <Callout variant="red">
      <strong>Scary Key-Terms:</strong>
      <ul className="mt-2 space-y-1">
        <li><strong>Remote Server</strong> = a &ldquo;computer&rdquo; (aka &ldquo;server&rdquo;) that is &ldquo;far away&rdquo; (aka &ldquo;remote&rdquo;)</li>
        <li><strong>Cloud storage</strong> = when your files are stored on a remote server.</li>
        <li><strong>Cloud computing</strong> = when a remote server does your computer&apos;s homework. Usually for money. Which goes to Jeff.</li>
      </ul>
    </Callout>
    <FootnoteBlock number={2}>
      This is why Google Docs doesn&apos;t work in Airplane mode, but Microsoft Word does!
    </FootnoteBlock>
  </div>,

  // ── Page 5: Hybrid Applications ──────────────────────────────────────────
  <div key="p5">
    <SectionTitle>3. Hybrid Applications: A Bit of Both Worlds</SectionTitle>
    <p className="text-sm text-zinc-700 leading-relaxed mb-3">
      Hybrid apps are like tech&apos;s version of <strong>shared custody</strong>. You install them like local apps, but part of
      their brain lives in the cloud. Your computer does some heavy lifting, while the cloud quietly
      keeps everything backed up or synced online.
    </p>
    <p className="text-sm text-zinc-700 leading-relaxed mb-3">
      Think <strong>Dropbox</strong> (files), <strong>Spotify</strong> (music), or <strong>Steam</strong> (game launcher/store). They feel like native
      apps because they are — installed on your machine, using lots of local power. But they&apos;re
      constantly chatting with the cloud, pulling updates, syncing data, and backing up your stuff.
    </p>
    <p className="text-sm text-zinc-700 leading-relaxed mb-4">
      It&apos;s the best of both worlds: the snappy feel of local software with cloud storage convenience.
    </p>
    <ComicImg src="/images/anacomics/hybrid-mediation.png" alt="HYBRID MEDIATION Est. 1999: Cloud and computer in shared custody, 'You each get 50% custody... unless the Wi-Fi goes out'" />
  </div>,

  // ── Page 6: On-Prem, Air Gaps, and Sneakernet ────────────────────────────
  <div key="p6">
    <SectionTitle>4. On-Prem, Air Gaps, and the Sneakernet</SectionTitle>
    <p className="text-sm text-zinc-700 leading-relaxed mb-3">
      Some organizations don&apos;t trust &ldquo;the cloud.&rdquo; So instead, they build their own private data centers.
      Because these data centers are on company property, we call this <strong>&ldquo;on-premise&rdquo;</strong> (aka <strong>&ldquo;right here&rdquo;</strong>).
      Software runs on servers the client owns, inside buildings they can walk into. Not in some distant data center run by Jeff. (Sorry, Jeff.)
    </p>
    <p className="text-sm text-zinc-700 leading-relaxed mb-3">
      This setup is popular with governments, banks, and hospitals... basically anyone whose worst-case scenario involves a data breach making headlines before breakfast.
    </p>
    <ComicImg src="/images/anacomics/on-prem-pt1.png" alt="On-Prem: Deployment Strategy — Control, Security, Independence. 'Oh yeah? Well this is OUR data center!' WHRRRR" />
    <p className="text-sm text-zinc-700 leading-relaxed mb-3">
      Still, I don&apos;t think Jeff is very worried about the competition.
    </p>
    <ComicImg src="/images/anacomics/on-prem-pt2.png" alt="Man pointing at small data center next to a massive AWS building: 'Oh yeah? Well this is OUR data center!'" />
    <p className="text-sm text-zinc-700 leading-relaxed mb-3">
      The downside of On-Prem? Your security is entirely independent. The biggest breaches often occur from on-prem setups that aren&apos;t built or maintained properly.
    </p>
    <p className="text-sm text-zinc-700 leading-relaxed mb-3">
      That&apos;s why some On-Prem deployments go even further and use... the <strong>Air Gap</strong>.
    </p>
    <Callout variant="gray">
      <strong>Air-Gapped Systems</strong> are physically isolated. No Wi-Fi. No Ethernet. No sneaky Bluetooth handshake. Just cold, lonely data, locked in a bunker, listening to its own hard drive spin. It&apos;s the security equivalent of digging a moat, raising the drawbridge, and swallowing the key.
    </Callout>
    <ComicImg src="/images/anacomics/air-gap.png" alt="Air Gap: isolated server 'Still spinning...still secure...', drawbridge castle rejecting cloud with donuts, knight 'WHAT ARE YOU DOING?!'" />
    <p className="text-sm text-zinc-700 leading-relaxed mb-3">
      And if you still need to move data between two air-gapped Fort Knox-style boxes? Well, you can&apos;t use the internet. So... you use what&apos;s called the <strong>Sneakernet</strong>.
    </p>
    <p className="text-sm text-zinc-700 leading-relaxed mb-3">
      Nope. It&apos;s not a top secret protocol. It&apos;s <em>a person. In sneakers. With a USB stick.</em>
    </p>
    <p className="text-sm text-zinc-700 leading-relaxed mb-4">
      Seriously! Someone puts the file on the drive, and they walk it across the building. Because sometimes, the most secure data transfer method on Earth... is Karen from accounting
      power-walking between servers with <code className="text-xs bg-zinc-100 px-1 rounded">top_secret_FINAL_v4.pptx</code> in her tote bag.<sup>3</sup>
    </p>
    <ComicImg src="/images/anacomics/sneakernet.png" alt="THE SNEAKERNET PROTOCOL: woman running with tote bag labeled 'tap.secret.FINAL.v4.ppix', speech bubble: 'ETA to server room: 3 minutes. if I don't stop for coffee.'" />
    <FootnoteBlock number={3}>
      Note (from Claude): &ldquo;While entertaining and essentially accurate, the &lsquo;Karen from accounting&rsquo; example might trivialize that sneakernet is actually a legitimate security protocol used in high-security environments, not just a casual workaround.&rdquo; ← I don&apos;t know why I found this so funny.
    </FootnoteBlock>
  </div>,

  // ── Page 7: The Short Version + Closing ──────────────────────────────────
  <div key="p7">
    <SectionTitle>Deployment — The Short Version</SectionTitle>
    <div className="space-y-4 mb-6">
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
        <p className="text-sm font-semibold text-zinc-800 mb-1">🖥️ Local</p>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Your computer sweats through all the work. Sharing files requires a PhD in file conversion and a prayer circle.
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
        <p className="text-sm font-semibold text-zinc-800 mb-1">🏢 On-Prem</p>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Information can still fly around between servers, but it&apos;s a closed system. With the airgap, no internet is allowed in — which means sharing also requires Karen jogging between buildings with a thumb drive.
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
        <p className="text-sm font-semibold text-zinc-800 mb-1">☁️ Cloud</p>
        <p className="text-sm text-zinc-600 leading-relaxed">
          You&apos;re not looking at your file — you&apos;re watching a live stream of it from Jeff&apos;s data center.<sup>4</sup> Click a button. Send a link. Done.
        </p>
      </div>
    </div>
    <ComicImg src="/images/anacomics/jeff-traffic.png" alt="Jeff Bezos as traffic controller routing files: 'When your files live in the cloud, sharing is simple. Jeff just reroutes the traffic.'" />
    <Callout variant="yellow">
      <strong>Congratulations!</strong> You now know why &ldquo;deployment architecture&rdquo; isn&apos;t scary. It&apos;s just a fancy way
      of asking: <em>&ldquo;Where does the software live, and who&apos;s paying the electric bill?&rdquo;</em>
      <br /><br />
      Plus, next time someone mentions &ldquo;air gap&rdquo; or &ldquo;on-prem&rdquo; in a meeting, you won&apos;t just nod along.
      You&apos;ll picture Karen, sprinting through hallways with humanity&apos;s last thumb drive.
    </Callout>
    <p className="text-sm text-zinc-600 italic mt-6 text-center">
      Thanks for reading!<br />
      Have a new ANACOMIC request? Questions? Corrections?<br />
      <span className="font-medium text-zinc-700">Message me on Slack! — Asher Sebban</span>
    </p>
    <FootnoteBlock number={4}>
      Even though you&apos;re looking at this document on your computer, your computer does not actually have the file saved on it. This document is a projection of a file that exists on a cloud computer somewhere else. That&apos;s why if you disconnect the internet and reload the page, you can&apos;t see the file (you&apos;ve severed the connection). You <em>may</em> notice that if you only disconnect and don&apos;t reload, you still have the document — that&apos;s because Chrome caches the page temporarily. 🤓
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Comic book container */}
      <div className="relative z-10 flex flex-col w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl border border-zinc-700">

        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-zinc-900 border-b border-zinc-700 flex-shrink-0">
          <span className="text-xs font-bold tracking-widest uppercase text-yellow-400">
            ANACOMICS
          </span>
          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-400">
              {page + 1} / {total}
            </span>
            <button
              onClick={onClose}
              className="text-xl leading-none text-zinc-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto bg-[#fffcf0] text-zinc-900">
          <div className="p-8">{PAGES[page]}</div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-5 py-3 bg-zinc-900 border-t border-zinc-700 flex-shrink-0">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="px-4 py-1.5 text-xs font-medium rounded-lg border border-zinc-600 text-zinc-300 hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>

          {/* Dot indicators */}
          <div className="flex gap-1.5">
            {PAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === page ? "bg-yellow-400" : "bg-zinc-600 hover:bg-zinc-400"
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, total - 1))}
            disabled={page === total - 1}
            className="px-4 py-1.5 text-xs font-medium rounded-lg border border-zinc-600 text-zinc-300 hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
