import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { FloatingParticles } from "./FloatingParticles";
import { AnimatedCircuit } from "./AnimatedCircuit";
import { AnimatedGeometric } from "./AnimatedGeometric";
import type { CopywritingData } from "@/lib/copywriting-client";

type HeroData = CopywritingData["landingPage"]["hero"];

interface JumbotronProps {
  hero: HeroData;
}

export function Jumbotron({ hero }: JumbotronProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%236366f1%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40" />

      <FloatingParticles />
      <AnimatedCircuit />
      <AnimatedGeometric />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>{hero.subtitle}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            {hero.title}
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            {hero.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
<Link
              href="/projects"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
            >
              {hero.ctaPrimary}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-8 py-4 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              {hero.ctaSecondary}
            </a>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {hero.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
