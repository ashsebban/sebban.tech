"use client";

import { useEffect, useRef, useState } from "react";

// ── Design tokens ─────────────────────────────────────────────────────────────
// Text hierarchy (dark bg: zinc-900 / zinc-950)
//   heading    → zinc-50   (titles, SectionTitle)
//   body       → zinc-200  (primary readable text)
//   secondary  → zinc-300  (asides, captions, credits)
//   muted      → zinc-400  (footnote body, decorative)
// Rule: minimum readable on zinc-900 bg = zinc-300. zinc-400 only for small/footnote text.
// Anaconda green (#44B78B) → bullets, aside borders, badges, nav dots, accents

const G = "#44B78B"; // Anaconda green

// ── Types ─────────────────────────────────────────────────────────────────────

type FontSize = "default" | "large" | "xl";

const FONT_SIZES: Record<FontSize, string> = {
  default: "15px",
  large:   "17px",
  xl:      "19px",
};

// ── Shared sub-components ────────────────────────────────────────────────────

function ComicImg({ src, alt, tall }: { src: string; alt: string; tall?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`my-6 mx-auto block max-w-full rounded-lg border border-zinc-700/50 object-contain ${
        tall ? "max-h-[520px]" : "max-h-80"
      }`}
    />
  );
}

// Aside: green left border, secondary text
function Aside({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="my-6 pl-4 py-1 text-zinc-300 leading-relaxed border-l-2"
      style={{ borderColor: G, fontSize: "0.9em" }}
    >
      {children}
    </div>
  );
}

// Section heading
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold text-zinc-50 mt-10 mb-5 first:mt-0 tracking-tight leading-snug">
      {children}
    </h2>
  );
}

// Footnote at bottom of a page
function FootnoteBlock({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="mt-8 pt-4 border-t border-zinc-100/30 leading-relaxed text-zinc-400" style={{ fontSize: "11px" }}>
      <sup className="font-semibold not-italic" style={{ color: G }}>{number}</sup> {children}
    </div>
  );
}

// Bullet dash — green marker
function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="mt-0.5 flex-shrink-0 font-bold" style={{ color: G }}>—</span>
      <span className="text-zinc-200">{children}</span>
    </li>
  );
}

// Summary card — green left border
function SummaryItem({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
  return (
    <div className="border-l-2 pl-4 py-1" style={{ borderColor: G }}>
      <p className="font-semibold text-zinc-50 mb-0.5">{emoji} {title}</p>
      <p className="text-zinc-300 leading-relaxed">{children}</p>
    </div>
  );
}

// Horizontal rule divider
function HR() {
  return <hr className="my-8" style={{ borderColor: G, borderTopWidth: "2px" }} />;
}

// ── Page definitions ─────────────────────────────────────────────────────────

const PAGES: React.ReactNode[] = [

  // ── Page 1: Cover + Intro ────────────────────────────────────────────────
  <div key="p1">
    <div className="text-center mb-8">
      <div
        className="inline-block font-black tracking-widest uppercase px-3 py-0.5 rounded mb-5 border"
        style={{ color: G, borderColor: `${G}55`, backgroundColor: `${G}15`, fontSize: "12px" }}
      >
        ANACOMICS
      </div>
      <h1 className="text-2xl font-black text-zinc-50 leading-tight">
        Deployment Architecture
      </h1>
      <p className="mt-4 text-zinc-400 leading-relaxed" style={{ fontSize: "11px" }}>
        Written by Asher Sebban (UXR), with unofficial emotional support from Claude, Gemini, ChatGPT, and Sora.
        <br />
        Inspired by Cham &amp; Whiteson, Monty Python, and my very good friend Sammy (who helped me with this chapter!).
      </p>
    </div>

    <HR />

    <SectionTitle>So&hellip; What is Deployment Architecture?</SectionTitle>
    <p className="text-zinc-200 leading-relaxed mb-4">
      First of all&hellip; <em>Scary words.</em>
    </p>
    <p className="text-zinc-200 leading-relaxed mb-4">
      No need to clutch your emotional support coffee mug&hellip; it&apos;s pretty straight forward. In fact, you&apos;re probably an expert on Deployment Architecture already without even realizing.
    </p>
    <p className="text-zinc-200 leading-relaxed mb-3">
      In this module we will discover 4 types of &ldquo;deployment&rdquo;: <strong className="text-zinc-50">local</strong>, <strong className="text-zinc-50">cloud</strong>, <strong className="text-zinc-50">hybrid</strong>, and <strong className="text-zinc-50">on-prem</strong>. Ready to see how much you already know?
    </p>
  </div>,

  // ── Page 2: Warm-up Exercise ──────────────────────────────────────────────
  <div key="p2">
    <SectionTitle>A Quick Warm-Up</SectionTitle>
    <p className="text-zinc-200 leading-relaxed mb-6">Let&apos;s go through a low-stress, warm up exercise together:</p>

    <p className="text-zinc-300 leading-relaxed mb-4">
      Imagine someone asked us to explain the difference between <strong className="text-zinc-50">Microsoft Word in 2011</strong> and <strong className="text-zinc-50">Google Docs today</strong>. We&apos;d probably say something like:
    </p>

    <table className="w-full mb-6 border-collapse text-sm">
      <thead>
        <tr>
          <th className="w-[22%]" />
          <th className="w-[39%] text-left font-bold text-zinc-50 pb-3 pr-3">🖥️ Microsoft Word (circa 2011)</th>
          <th className="w-[39%] text-left font-bold text-zinc-50 pb-3 pl-3" style={{ color: G }}>☁️ Google Docs (Modern Era)</th>
        </tr>
      </thead>
      <tbody>
        {[
          ["Installing", "Click download/install → Installation Wizard", "Our Docs live in the same app we use for web-search?"],
          ["Launching", "Word opens as a window application thingy", "Docs opens as a browser tab thingy"],
          ["Internet", "No internet needed (great for airplanes) ✈️", "Without internet, Google Docs are practically useless"],
          ["Back Up", "Broken laptop? I hope you used a flash-drive!", "Broken Laptop? Don't worry! Our files live on (in the Clouds)?"],
          ["Sharing", "Sharing a doc requires an entire IKEA manual (save file, write email, attach file, send, recipient can't open because they have an old version of Word).", "Sharing a doc? Send a link. Recipient clicks on the link. Multiple people can even edit the same document at the same time and somehow our doc doesn't explode. You can't do that in Word!"],
          ["Continuing On Another Device", "Do the steps above, except send yourself the file.", "Our docs follow us everywhere. Start writing on our laptop and finish on our phone… just by logging in!"],
        ].map(([label, word, docs]) => (
          <tr key={label} className="border-t border-zinc-800">
            <td className="py-2.5 pr-3 font-medium align-top" style={{ color: G, fontSize: "0.85em" }}>{label}:</td>
            <td className="py-2.5 pr-3 text-zinc-300 align-top leading-snug">{word}</td>
            <td className="py-2.5 pl-3 text-zinc-300 align-top leading-snug border-l border-zinc-800">{docs}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <p className="text-zinc-200 leading-relaxed mb-4">
      Okay you get the point. Congrats! We just described some of the main differences between the user experience of two types of deployment: <strong className="text-zinc-50">local</strong> (Microsoft Word) and <strong className="text-zinc-50">cloud</strong> (Google Docs).
    </p>
    <p className="text-zinc-200 leading-relaxed mb-4">
      The truth: Most people already speak Deployment Architecture fluently. We just speak it from the user&apos;s side of the stage. There&apos;s a reason we intuitively expect different things from Word and Docs.
    </p>
    <p className="text-zinc-300 leading-relaxed italic mb-6">
      Today, we&apos;re walking around to see what&apos;s behind the curtain.
    </p>
    <ComicImg tall src="/images/anacomics/mirror-girl.png" alt="Little girl in mirror: I am smart, I am kind, I am emotionally stable, I am a natural cloud vs local expert" />
  </div>,

  // ── Page 3: Local Deployment ─────────────────────────────────────────────
  <div key="p3">
    <SectionTitle>1. Local Deployment</SectionTitle>
    <p className="text-zinc-200 leading-relaxed mb-5">
      Local applications are applications that live and run on your computer. Every calculation, every save, every crash, all the cool stuff the application does&hellip; all happens inside that warm, increasingly loudly humming rectangle on your desk. But if that rectangle catches fire? So does everything inside it.
    </p>
    <ComicImg src="/images/anacomics/house-fire.png" alt="Local deployment: house on fire, someone says 'Wait...we forgot to back it up to the cloud'" />
    <p className="text-zinc-200 leading-relaxed mb-5">
      One hint that you&apos;re dealing with a local application is when you have to download it and/or go through one of those cool installation wizards. 🧙
    </p>
    <p className="text-zinc-200 leading-relaxed mb-5">
      Behind the scenes, those installation wizards (where you click <em>Next</em> a bunch of times, scroll down the terms and conditions for 92 seconds, and click <em>Finish</em>), help tell the computer where to store all the outside files you&apos;re bringing in.
    </p>
    <ComicImg src="/images/anacomics/terms-conditions.png" alt="Terms and conditions: 'Can you put your files on my computer?' 'Okay, but only on one condition. It's a very long condition.'" />
    <p className="text-zinc-200 leading-relaxed">
      So the next time you go through an Installer or download something, know that you&apos;re basically inserting someone else&apos;s stuff into your file system — which is why you should never, ever, under any circumstances,{" "}
      <a
        href="https://tenor.com/view/you-failed-wednesday-addams-wednesday-you-disappoint-me-you-did-not-succeed-gif-9721171787213100737"
        target="_blank"
        rel="noopener noreferrer"
        className="underline transition-colors"
        style={{ color: "#60a5fa" }}
      >
        click random links
      </a>
      {" "}← like this one (seriously, don&apos;t do it).
    </p>
  </div>,

  // ── Page 3: Cloud Deployment ─────────────────────────────────────────────
  <div key="p4">
    <SectionTitle>2. Cloud Deployment: Someone Else&apos;s Computer (Usually Jeff&apos;s)</SectionTitle>
    <p className="text-zinc-200 leading-relaxed mb-3">
      Cloud apps mostly do the same things local apps do. The difference? The app doesn&apos;t live on your computer&hellip; it lives on someone else&apos;s. Very often, that someone is Jeff Bezos.
    </p>
    <p className="text-zinc-200 leading-relaxed mb-5">
      Let me explain&hellip;
    </p>
    <p className="text-zinc-200 leading-relaxed mb-3">
      <strong className="text-zinc-50">Story Time:</strong> A long, long time ago, a company called Amazon started building massive warehouses full of powerful computers. Cue the 3:00am infomercial (not really, but you&apos;ll get the idea):
    </p>
    <Aside>
      <em>&ldquo;Running out of storage? Computer overheating? Need more speed? You don&apos;t need to buy a new computer. Just use one of ours!&rdquo;</em>
    </Aside>
    <p className="text-zinc-200 leading-relaxed mb-3">
      They called it <strong className="text-zinc-50">&ldquo;the Cloud&rdquo;</strong>. With just an internet connection, you could use the fastest, largest computers in the world for only a few cents!
    </p>
    <ul className="leading-relaxed space-y-2 mb-5 pl-1">
      <Bullet>People stopped using thumb drives and started saving family photos on Jeff&apos;s computers (<strong className="text-zinc-50">Cloud Storage</strong>).</Bullet>
      <Bullet>Developers stopped buying expensive hardware and instead ran their intense workloads using Jeff&apos;s computers (<strong className="text-zinc-50">Cloud Computing</strong>).<sup style={{ color: G }}>1</sup></Bullet>
      <Bullet>Companies sold their onsite servers and migrated to Jeff&apos;s computers (a process called <strong className="text-zinc-50">Cloud Migration</strong>).</Bullet>
      <Bullet>Startups built apps that lived entirely on Jeff&apos;s computers and never had to be downloaded onto yours (a <strong className="text-zinc-50">Cloud Application</strong>).</Bullet>
    </ul>
    <p className="text-zinc-200 leading-relaxed mb-5">
      Amazon exploded into one of the most successful companies ever. Pretty soon, Google, Microsoft, IBM, Alibaba, and every start-up in the galaxy was building data centers to get in on the Cloud action.
    </p>
    <ComicImg src="/images/anacomics/star-wars.png" alt="Darth Vader: 'Behold... the Data Star.' Engineer: 'Sir, where should we put the server cooling vent?' Vader: 'NO VENTS!'" />
    <FootnoteBlock number={1}>
      <strong>Cloud Computing in 3 minutes:</strong> Cloud computing is the computer version of outsourcing math homework to a super-genius who lives in a warehouse. The genius solves the math problem and sends back the results. CPUs (Central Processing Units) are known as the &ldquo;computer&apos;s brain.&rdquo; Like our brains, CPUs typically process tasks one at a time (&ldquo;linear processing&rdquo;). Cloud servers are usually faster than our laptops because they have newer, faster CPUs. GPUs are basically a team of CPUs that downed a case of Red Bull, cloned themselves, and formed a conga line — &ldquo;spinning up&rdquo; a GPU-server is less like hiring one genius and more like unleashing 500 hyper-caffeinated mathematicians working in parallel (&ldquo;parallel processing&rdquo;). NVIDIA supplies high-powered GPUs to Cloud Service Providers.{" "}
      <a href="https://www.youtube.com/watch?v=Ge-g3xZ5bb8" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-300 transition-colors" style={{ color: "#60a5fa" }}>
        Mythbusters: GPU vs CPU →
      </a>
    </FootnoteBlock>
  </div>,

  // ── Page 4: The Need for Internet Speed ──────────────────────────────────
  <div key="p5">
    <SectionTitle>The Need for Internet Speed</SectionTitle>
    <p className="text-zinc-200 leading-relaxed mb-5">
      Computers speak to each other over the internet, which if you didn&apos;t know, is mostly just a bunch of cables underground&hellip; <em>surprise!</em>
    </p>
    <p className="text-zinc-200 leading-relaxed mb-5">
      That&apos;s right! On the ocean floor and underneath the roads we drive on there are a series of fiber optic cables. Those cables physically connect WiFi boxes and cell-towers to big buildings owned by Internet Service Providers (ISP). From there, the ISP routes the traffic. When you send an email, your email gets compressed into tiny numbers, those numbers travel across the cables to the internet service provider building who sends it to another computer. So basically, that fancy thing we call the Cloud? <strong className="text-zinc-50">It&apos;s all mostly underground!</strong>
    </p>
    <ComicImg tall src="/images/anacomics/cloud-cables.png" alt="The cloud: not actually in the sky. Just cables underground going to Jeff's 'Property of Jeff' server room." />
    <p className="text-zinc-200 leading-relaxed mb-5">
      The process of offloading tasks to Jeff&apos;s computer makes your own laptop faster and hum quieter. PLUS your files live-on even if your physical laptop takes a swan dive off some cliff (because they mostly don&apos;t live on your computer in the first place).
    </p>
    <Aside>
      <strong>TL;DR:</strong> Cloud = the tech giants built massive computer hotels; our devices rent rooms!
    </Aside>
    <ComicImg tall src="/images/anacomics/cloud-hotel.png" alt="THE CLOUD - Now Hosting Your Files! Jeff as hotel manager: 'Relax, we've stored millions of files here. Just don't forget your WiFi password'" />

    <HR />

    <p className="text-zinc-200 leading-relaxed mb-5">
      <strong className="text-zinc-50">PS.</strong> It&apos;s a lucrative hotel: AWS generated net sales of <strong className="text-zinc-50">$28.8 billion for Q4 2024</strong>, accounted for 15.3% of total net sales, operating income for the segment was <strong className="text-zinc-50">$10.6 billion</strong>&hellip; and the segment accounted for 50% of Amazon&apos;s entire operating income in Q4 2024.
    </p>
    <p className="text-zinc-200 leading-relaxed mb-5">
      But&hellip; no internet? Then, the connection between the two computers is severed, and you lose access to your own files.<sup style={{ color: G }}>2</sup> With Cloud Applications, your data has to travel across the web to reach you. Which is usually no problem, unless you think of traffic on the web as a bunch of glitter-covered vans labeled &ldquo;Definitely Not Sensitive Info.&rdquo; 🚐 <em>[*The Cyber-security team has entered the chat.*]</em>
    </p>
    <Aside>
      <strong>Scary Key-Terms:</strong>
      <ul className="mt-2 space-y-1.5">
        <li><strong className="text-zinc-200">Remote Server</strong> = a &ldquo;computer&rdquo; (aka. &ldquo;server&rdquo;) that is &ldquo;far away&rdquo; (aka. &ldquo;remote&rdquo;)</li>
        <li><strong className="text-zinc-200">Cloud storage</strong> = when your files are stored on a remote server.</li>
        <li><strong className="text-zinc-200">Cloud computing</strong> = when a remote server does your computer&apos;s homework. Usually for money. Which goes to Jeff. Which he then uses to rent out Venice, Italy for his wedding.</li>
      </ul>
    </Aside>
    <FootnoteBlock number={2}>
      This is why Google Docs doesn&apos;t work in Airplane mode, but Microsoft Word does!
    </FootnoteBlock>
  </div>,

  // ── Page 5: Hybrid Applications ──────────────────────────────────────────
  <div key="p6">
    <SectionTitle>3. Hybrid Applications: A Bit of Both Worlds</SectionTitle>
    <p className="text-zinc-200 leading-relaxed mb-5">
      Hybrid apps are like tech&apos;s version of shared custody. You install them like local apps, but part of their brain lives in the cloud. Your computer does some heavy lifting, while the cloud quietly keeps everything backed up or synced online.
    </p>
    <p className="text-zinc-200 leading-relaxed mb-5">
      Think <strong className="text-zinc-50">Dropbox</strong> (files), <strong className="text-zinc-50">Spotify</strong> (music), or <strong className="text-zinc-50">Steam</strong> (game launcher/store). They feel like native apps because they are — installed on your machine, using lots of local power. But they&apos;re constantly chatting with the cloud, pulling updates, syncing data, and backing up your stuff. It&apos;s the best of both worlds: the snappy feel of local software with cloud storage convenience.
    </p>
    <ComicImg src="/images/anacomics/hybrid-mediation.png" alt="HYBRID MEDIATION Est. 1999: Cloud and computer in shared custody, 'You each get 50% custody... unless the Wi-Fi goes out'" />
  </div>,

  // ── Page 6: On-Prem, Air Gaps, and Sneakernet ────────────────────────────
  <div key="p7">
    <SectionTitle>4. On-Prem, Air Gaps, and the Sneakernet</SectionTitle>
    <p className="text-zinc-200 leading-relaxed mb-5">
      Some organizations don&apos;t trust &ldquo;the cloud&rdquo; and their fancy, global cables. So instead, they build their own private data centers. Because these data centers are not far-away, but are rather on company property, we call this deployment setup &ldquo;on-premise&rdquo; (aka &ldquo;right here&rdquo;). With on-premise set ups, software runs on servers the client owns, inside buildings they can walk into. Not in some distant data center run by Jeff. (Sorry, Jeff.)
    </p>
    <p className="text-zinc-200 leading-relaxed mb-5">
      This setup is often called <strong className="text-zinc-50">On-Prem</strong> (short for &ldquo;on-premise&rdquo;), and it&apos;s popular with governments, banks, and hospitals&hellip; basically anyone whose worst-case scenario involves a data breach making headlines before breakfast.
    </p>
    <p className="text-zinc-200 leading-relaxed mb-5">
      The good part about On-Prem? You get control over your infrastructure, you can apply higher security standards, and if one of the big cloud providers has a breach, you&apos;re usually still safe.
    </p>
    <ComicImg src="/images/anacomics/on-prem-pt1.png" alt="On-Prem: Deployment Strategy — Control, Security, Independence. 'Oh yeah? Well this is OUR data center!' WHRRRR" />
    <p className="text-zinc-200 leading-relaxed mb-5">
      Still, I don&apos;t think Jeff is very worried about the competition.
    </p>
    <ComicImg tall src="/images/anacomics/on-prem-pt2.png" alt="Man pointing at small data center next to a massive AWS building: 'Oh yeah? Well this is OUR data center!'" />
    <p className="text-zinc-200 leading-relaxed mb-5">
      The downside of On-Prem? Your security is entirely independent. You could make it safer than the Cloud, but the big players like AWS, Azure, and GCP usually have the best security in the world. Actually, the biggest breaches often occur from on-prem setups that aren&apos;t built or maintained properly.
    </p>
    <p className="text-zinc-200 leading-relaxed mb-5">
      That&apos;s why when it comes to security, some On-Prem deployments go even further than maintaining a private data center. Some on-prem deployments use&hellip; the <strong className="text-zinc-50">Air Gap</strong>.
    </p>
    <Aside>
      <strong>Air-Gapped Systems</strong> are a special kind of on-prem setup, one that doesn&apos;t just avoid the cloud&hellip; it avoids <em>everything</em>. No Wi-Fi. No Ethernet. No sneaky Bluetooth handshake. These machines are physically isolated. Just cold, lonely data, locked in a bunker, listening to its own hard drive spin. It&apos;s the security equivalent of digging a moat, raising the drawbridge, and swallowing the key.
    </Aside>
    <ComicImg src="/images/anacomics/air-gap.png" alt="Air Gap: isolated server 'Still spinning...still secure...', drawbridge castle rejecting cloud with donuts, knight 'WHAT ARE YOU DOING?!'" />

    <HR />

    <p className="text-zinc-200 leading-relaxed mb-5">
      And if you still need to move data between two air-gapped Fort Knox-style boxes? Well, you can&apos;t use the internet anymore. So&hellip; you use what&apos;s called the <strong className="text-zinc-50">Sneakernet</strong>.
    </p>
    <p className="text-zinc-200 leading-relaxed mb-5">
      Nope. It&apos;s not a top secret protocol. It&apos;s a person. In sneakers. With a USB stick.
    </p>
    <p className="text-zinc-200 leading-relaxed mb-0">
      Seriously! Someone puts the file on the drive, and they walk it across the building. Because sometimes, the most secure data transfer method on Earth&hellip; is Karen from accounting power-walking between servers with{" "}
      <code className="bg-zinc-800 text-zinc-300 px-1 py-0.5 rounded font-mono" style={{ fontSize: "0.85em" }}>top_secret_FINAL_v4.pptx</code>{" "}
      in her tote bag.<sup style={{ color: G }}>3</sup>
    </p>
    <FootnoteBlock number={3}>
      Note from Claude: &ldquo;While entertaining and essentially accurate, the &lsquo;Karen from accounting&rsquo; example might trivialize that sneakernet is actually a legitimate security protocol used in high-security environments, not just a casual workaround.&rdquo; &larr; I don&apos;t know why I found this so funny.
    </FootnoteBlock>
    <ComicImg src="/images/anacomics/sneakernet.png" alt="THE SNEAKERNET PROTOCOL: woman running with tote bag, 'ETA to server room: 3 minutes. if I don't stop for coffee.'" />
  </div>,

  // ── Page 8: The Short Version ────────────────────────────────────────────
  <div key="p8">
    <SectionTitle>Deployment &mdash; The Short Version</SectionTitle>
    <div className="space-y-3 mb-6">
      <SummaryItem emoji="🖥️" title="Local files">
        Your computer sweats through all the work. Your computer is basically just talking to itself, which makes certain actions faster, but sharing files requires a PhD in file conversion and a prayer circle.
      </SummaryItem>
      <SummaryItem emoji="🏢" title="On-prem files">
        Like cloud files, information can still fly around between servers, but it&apos;s a closed system with more locks and (hopefully) guards. With the air gap, no internet is allowed in to the on-prem infrastructure (which means sharing also requires a PhD in file conversion and a prayer circle. Or possibly Karen jogging between buildings with a thumb drive.)
      </SummaryItem>
      <SummaryItem emoji="☁️" title="Cloud files">
        You&apos;re not looking at your file — you&apos;re watching a live stream of it from Jeff&apos;s data center.<sup style={{ color: G }}>4</sup> The file basically lives on the internet highway making it much easier to share those files with others. Click a button. Send a link. Done. Let the cloud traffic controller figure out the rest. After some complicated tech wizardry, your friend&apos;s computer points to the file the same way yours does. Boom. Real-time collaboration.
      </SummaryItem>
    </div>
    <ComicImg src="/images/anacomics/jeff-traffic.png" alt="Jeff Bezos as traffic controller routing files" />
    <FootnoteBlock number={4}>
      Even though you&apos;re looking at this document on your computer, your computer does not actually have the file saved on it. This document is actually a projection of a file that actually exists on a cloud computer in some data center somewhere else. That&apos;s why if you disconnect the internet and reload the page&hellip; you can&apos;t see the file anymore (because you&apos;ve severed the connection between where the file actually lives and where you&apos;re displaying it).
      <br /><br />
      You may notice that if you only disconnect and don&apos;t reload the page, you will still have your document. That&apos;s because your Chrome browser caches (aka. &ldquo;saves&rdquo;) the page temporarily. Instead of your screen pointing directly to the cloud server, it points to a temporary location in your file system that syncs with the cloud server. 🤓
    </FootnoteBlock>
  </div>,

  // ── Page 9: The End ───────────────────────────────────────────────────────
  <div key="p9">
    <SectionTitle>The End</SectionTitle>
    <p className="text-zinc-200 leading-relaxed mb-5">
      Congratulations! You now know why &ldquo;deployment architecture&rdquo; isn&apos;t scary. It&apos;s just a fancy way of asking: <em>where does the software live, and who&apos;s paying the electric bill?</em>
    </p>
    <p className="text-zinc-200 leading-relaxed mb-8">
      Plus, next time someone mentions &ldquo;air gap&rdquo; or &ldquo;on-prem&rdquo; in a meeting, you won&apos;t just nod along. You&apos;ll picture Karen, sprinting through hallways with humanity&apos;s last thumb drive.
    </p>
    <HR />
    <p className="text-zinc-300 leading-relaxed mt-8">
      Thanks for reading! Questions, corrections, or new ANACOMIC requests?{" "}
      <strong className="text-zinc-100">Message Asher Sebban on Slack.</strong>
    </p>
  </div>,

];

// ── Modal ─────────────────────────────────────────────────────────────────────

interface Props {
  onClose: () => void;
}

export default function AnacomicsModal({ onClose }: Props) {
  const [page, setPage] = useState(0);
  const [fontSize, setFontSize] = useState<FontSize>("default");
  const [showFontMenu, setShowFontMenu] = useState(false);
  const fontMenuRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const total = PAGES.length;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === "ArrowDown") setPage((p) => Math.min(p + 1, total - 1));
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   setPage((p) => Math.max(p - 1, 0));
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (fontMenuRef.current && !fontMenuRef.current.contains(e.target as Node)) {
        setShowFontMenu(false);
      }
    };
    scrollRef.current?.scrollTo(0, 0);
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [onClose, total, page]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div className="relative z-10 flex flex-col w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl border border-zinc-700/60 bg-zinc-950">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 flex-shrink-0">
          <span className="font-black tracking-widest uppercase" style={{ fontSize: "11px", color: G }}>
            ANACOMICS
          </span>
          <div className="flex items-center gap-3">
            <div className="relative" ref={fontMenuRef}>
              <button
                onClick={() => setShowFontMenu((v) => !v)}
                className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors px-2 py-1 rounded border border-transparent hover:border-zinc-600"
                aria-label="Font size"
                title="Font size"
              >
                Aa
              </button>
              {showFontMenu && (
                <div className="absolute right-0 top-full mt-1 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg overflow-hidden z-10">
                  {(["default", "large", "xl"] as FontSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => { setFontSize(size); setShowFontMenu(false); }}
                      className={`block w-full text-left px-4 py-2 text-xs transition-colors hover:bg-zinc-800 ${
                        fontSize === size ? "text-zinc-100 font-semibold" : "text-zinc-400"
                      }`}
                    >
                      {size === "default" ? "Default" : size === "large" ? "Large" : "Extra Large"}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="text-xs text-zinc-400">{page + 1} / {total}</span>
            <button
              onClick={onClose}
              className="text-xl leading-none text-zinc-400 hover:text-zinc-100 transition-colors"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Page content */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto bg-zinc-900"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: FONT_SIZES[fontSize],
            lineHeight: "1.8",
          }}
        >
          <div className="px-8 py-8">
            <div className="max-w-[70ch] mx-auto">
              {PAGES[page]}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800 flex-shrink-0">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="px-4 py-1.5 text-xs font-medium rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = G)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
          >
            ← Prev
          </button>

          <div className="flex gap-1.5">
            {PAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ backgroundColor: i === page ? G : "#3f3f46" }}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, total - 1))}
            disabled={page === total - 1}
            className="px-4 py-1.5 text-xs font-medium rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = G)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
