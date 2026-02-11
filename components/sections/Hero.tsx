"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Hi, I'm <span className="text-primary-600">{SITE_NAME}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
              {SITE_TAGLINE}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/projects"
                className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                View My Work
              </Link>
              <Link
                href="/video"
                className="px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                Watch My Intro
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 border-2 border-gray-400 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                Get In Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
