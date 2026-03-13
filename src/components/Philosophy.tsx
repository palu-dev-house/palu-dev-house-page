import { CheckCircle, Zap, Settings } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./animations";
import type { CopywritingData } from "@/lib/copywriting-client";

type PhilosophyData = CopywritingData["landingPage"]["philosophy"];

interface PhilosophyProps {
  philosophy: PhilosophyData;
}

const ICONS = [CheckCircle, Zap, Settings] as const;
const COLORS = [
  "bg-green-100 text-green-600",
  "bg-amber-100 text-amber-600",
  "bg-blue-100 text-blue-600",
];

export function Philosophy({ philosophy }: PhilosophyProps) {
  const { title, subtitle, items } = philosophy;

  return (
    <section id="philosophy" className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-600">{subtitle}</p>
          </FadeIn>
        </div>

        <StaggerContainer
          className="grid md:grid-cols-3 gap-8 items-stretch"
          staggerDelay={0.15}
        >
          {items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            const color = COLORS[index % COLORS.length];
            return (
              <StaggerItem key={index} className="h-full">
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${color}`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed flex-grow">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
