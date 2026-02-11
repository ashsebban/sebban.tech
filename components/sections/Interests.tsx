"use client";

import { motion } from "framer-motion";
import { INTERESTS } from "@/lib/constants";

export default function Interests() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Interests & Hobbies</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {INTERESTS.map((interest, index) => (
              <motion.span
                key={interest}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="px-6 py-3 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 rounded-full font-medium text-lg"
              >
                {interest}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
