"use client";

import { motion } from "framer-motion";
import { ABOUT_TEXT } from "@/lib/constants";

export default function About() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">About Me</h2>
          <div className="prose prose-lg dark:prose-invert mx-auto">
            {ABOUT_TEXT.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="text-gray-600 dark:text-gray-300 mb-4">
                  {paragraph.trim()}
                </p>
              )
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
