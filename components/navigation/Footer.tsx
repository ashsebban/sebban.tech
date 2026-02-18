// Site footer: tagline, nav links, social links, and copyright
import Link from "next/link";
import { SOCIAL_LINKS, NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { ICON_MAP } from "@/components/icons/SocialIcons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand and short description */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">{SITE_NAME}</h3>
            <p className="text-sm text-muted leading-relaxed">
              Product-minded builder using AI to research, prototype, and ship.
            </p>
          </div>

          {/* Repeat main nav links for footer */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Pages</h3>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* External social / contact links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Connect</h3>
            <div className="flex flex-col gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = ICON_MAP[social.icon];
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{social.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright line */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-xs text-muted">
            &copy; {currentYear} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
