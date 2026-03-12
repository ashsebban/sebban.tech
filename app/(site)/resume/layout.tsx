import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
  description: "View or download Asher Sebban's resume.",
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
