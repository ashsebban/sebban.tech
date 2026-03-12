import { Metadata } from "next";

export const metadata: Metadata = {
  title: "References",
  description: "Leaders, professors, and mentors who can speak to Asher Sebban's work.",
};

export default function ReferencesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
