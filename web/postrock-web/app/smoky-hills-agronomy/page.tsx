"use client";

import { brandImages } from "@/lib/brand-assets";

export default function SmokyHillsAgronomyPage() {
  return (
    <div className="min-h-screen bg-white text-[#3F403D] flex flex-col">

      {/* Header */}
      <header className="border-b border-[#3F403D]/10">
        <div className="mx-auto max-w-6xl px-8 py-6 flex justify-between items-center">
          <div className="text-sm uppercase tracking-widest text-[#234734]">
            Smoky Hills Agronomy
          </div>

          <a
            href="https://postrockag.com"
            className="text-sm text-[#3F403D]/70 hover:text-[#234734]"
          >
            A Post Rock Company
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center">
        <div className="mx-auto max-w-3xl px-8 py-20 text-center">

          {/* Logo */}
          <div className="mb-10">
            <img
              src={brandImages.smokyHillsAgronomyLogo}
              alt="Smoky Hills Agronomy"
              className="mx-auto h-20 w-auto"
            />
          </div>

          {/* Headline */}
          <h1
            className="text-5xl font-semibold text-[#3F403D]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Agronomy Solutions for Central Kansas Producers
          </h1>

          {/* Description */}
          <p
            className="mt-6 text-lg text-[#3F403D]/80 leading-8"
            style={{ fontFamily: "Inter, Open Sans, Arial, sans-serif" }}
          >
            Smoky Hills Agronomy provides crop inputs, agronomic guidance, and
            field-level support to help producers maximize yield potential and
            manage their operations with confidence.
          </p>

          {/* Coming Soon */}
          <div className="mt-12 border-t border-[#3F403D]/10 pt-10">
            <p className="text-sm uppercase tracking-widest text-[#C79A3B]">
              Website coming soon
            </p>

            <p className="mt-4 text-[#3F403D]/70">
              Smoky Hills Agronomy is part of the Post Rock family of
              agricultural service companies.
            </p>

            <a
              href="https://postrockag.com"
              className="inline-block mt-8 border border-[#234734] text-[#234734] px-6 py-3 text-sm uppercase tracking-widest hover:bg-[#234734] hover:text-white transition"
            >
              Visit Post Rock
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#3F403D]/10">
        <div className="mx-auto max-w-6xl px-8 py-6 text-sm text-[#3F403D]/60 flex justify-between">
          <span>Smoky Hills Agronomy</span>
          <span>Central Kansas</span>
        </div>
      </footer>

    </div>
  );
}
