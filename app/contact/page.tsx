// Contact page: form (ContactForm) + social links + response-time info
import { Metadata } from "next";
import ContactForm from "@/components/forms/ContactForm";
import { SOCIAL_LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with me",
};

export default function ContactPage() {
  return (
    <div className="px-6 py-24">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-lg text-muted">
            Have a question or want to work together? I&apos;d love to hear from
            you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="p-8 rounded-xl border border-border bg-card">
            <h2 className="text-xl font-semibold mb-6">Send a Message</h2>
            <ContactForm />
          </div>

          {/* Social links + response time note */}
          <div className="space-y-8">
            <div className="p-8 rounded-xl border border-border bg-card">
              <h2 className="text-xl font-semibold mb-6">Connect With Me</h2>
              <div className="flex flex-col gap-4">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-accent transition-colors"
                  >
                    {social.name} &rarr;
                  </a>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-xl border border-border bg-card">
              <h3 className="text-lg font-semibold mb-3">Response Time</h3>
              <p className="text-sm text-muted leading-relaxed">
                I typically respond within 24-48 hours. For urgent matters, feel
                free to reach out via email or LinkedIn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
