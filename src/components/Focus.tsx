import { Wrench, Cloud } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./animations";
import type { CopywritingData } from "@/lib/copywriting-client";

type FocusData = CopywritingData["landingPage"]["focus"];

interface FocusProps {
  focus: FocusData;
}

const ICONS = [Wrench, Cloud] as const;

export function Focus({ focus }: FocusProps) {
  const { title, subtitle, items } = focus;

  return (
    <section id="focus" className="py-20 lg:py-28 bg-white">
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
          className="grid md:grid-cols-2 gap-8 items-stretch"
          staggerDelay={0.2}
        >
          {items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <StaggerItem key={index} className="h-full">
                <div className="border-2 border-gray-100 rounded-2xl p-8 hover:border-blue-300 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-white h-full flex flex-col">
                  <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed flex-grow">
                    {item.description}
                  </p>
                  {(item as { examples?: string[] }).examples?.length ? (
                    <div className="flex flex-wrap gap-2 mt-6">
                      {(item as { examples?: string[] }).examples!.map(
                        (example, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                          >
                            {example}
                          </span>
                        ),
                      )}
                    </div>
                  ) : null}
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
