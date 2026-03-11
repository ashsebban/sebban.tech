import { Metadata } from "next";
import { ICON_MAP } from "@/components/icons/SocialIcons";
import { SOCIAL_LINKS } from "@/lib/constants";
import ContactForm from "./_components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with me",
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
                {SOCIAL_LINKS.map((social) => {
                  const Icon = ICON_MAP[social.icon];
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 text-muted transition-colors hover:text-accent"
                    >
                      {Icon && <Icon className="h-5 w-5" />}
                      <span>{social.name}</span>
                      <span className="ml-auto text-xs opacity-0 transition-opacity group-hover:opacity-100">&rarr;</span>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-8">
              <h3 className="mb-3 text-lg font-semibold">Response Time</h3>
              <p className="text-sm leading-relaxed text-muted">
                I typically respond within 24-48 hours. For urgent matters, feel free to reach out via email or LinkedIn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
