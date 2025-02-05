"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const cardVariants = {
  offscreen: {
    x: -100,
    opacity: 0,
  },
  onscreen: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-5 text-center">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to My Portfolio</h1>
        <p className="text-lg text-gray-300">
          Hi, I'm [Your Name], a passionate programmer specializing in web and mobile development.
        </p>
      </header>

      <motion.div
        className="flex flex-col items-center gap-6"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.8 }}
      >
        <motion.div
          className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg border border-white/10"
          variants={cardVariants}
        >
          <h2 className="text-2xl font-semibold mb-3">Collaborative Whiteboard with AI Assistance</h2>
          <p className="text-gray-300 mb-4">
            A modern web application built with React and Node.js.
          </p>
          <Link
            href="/web-app"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Project
          </Link>
        </motion.div>

        <motion.div
          className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg border border-white/10"
          variants={cardVariants}
        >
          <h2 className="text-2xl font-semibold mb-3">Mobile App Project 1</h2>
          <p className="text-gray-300 mb-4">
            An innovative mobile app for iOS and Android.
          </p>
          <Link
            href="/mobile-app-1"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Project
          </Link>
        </motion.div>

        <motion.div
          className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg border border-white/10"
          variants={cardVariants}
        >
          <h2 className="text-2xl font-semibold mb-3">Mobile App Project 2</h2>
          <p className="text-gray-300 mb-4">
            Another cutting-edge mobile app with a focus on user experience.
          </p>
          <Link
            href="/mobile-app-2"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Project
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}