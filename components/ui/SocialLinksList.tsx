import { SOCIAL_LINKS } from "@/lib/constants";
import { ICON_MAP } from "@/components/icons/SocialIcons";

interface Props {
  iconSize?: string;
}

export default function SocialLinksList({ iconSize = "w-4 h-4" }: Props) {
  return (
    <>
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
            {Icon && <Icon className={iconSize} />}
            <span>{social.name}</span>
            <span className="ml-auto text-xs opacity-0 transition-opacity group-hover:opacity-100">&rarr;</span>
          </a>
        );
      })}
    </>
  );
}
