import { Metadata } from "next";
import Link from "next/link";
import SocialLinksList from "@/components/ui/SocialLinksList";
import ContactForm from "./_components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach out via email or LinkedIn. Usually responds within 24–48 hours.",
};

export default function ContactPage() {
  return (
    <div className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Get In Touch</h1>
          <p className="text-lg text-muted">Have a question or want to work together? I&apos;d love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-8">
            <h2 className="mb-6 text-xl font-semibold">Send a Message</h2>
            <ContactForm />
          </div>

          <div className="space-y-8">
            <div className="rounded-xl border border-border bg-card p-8">
              <h2 className="mb-6 text-xl font-semibold">Connect With Me</h2>
              <div className="flex flex-col gap-4">
                <SocialLinksList iconSize="h-5 w-5" />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-8">
              <h3 className="mb-3 text-lg font-semibold">Response Time</h3>
              <p className="text-sm leading-relaxed text-muted">
                I usually respond within 24–48 hours. LinkedIn and email both work.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-8 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold mb-1">References</h3>
                <p className="text-xs text-muted">Leaders, professors, and mentors available upon request.</p>
              </div>
              <Link href="/references" className="flex-shrink-0 text-sm text-accent hover:text-accent/80 transition-colors">
                View →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
