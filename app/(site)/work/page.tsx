import type { Metadata } from "next";
import Hero from "../_components/Hero";

export const metadata: Metadata = {
  title: "Work",
  description: "Asher Sebban’s work in go-to-market engineering and UX research.",
};

export default function WorkPage() {
  return <Hero />;
}
