import { FadeIn } from "./animations";
import type { CopywritingData } from "@/lib/copywriting-client";

type StoryData = CopywritingData["landingPage"]["story"];

interface StoryProps {
  story: StoryData;
}

export function Story({ story }: StoryProps) {
  return (
    <section id="story" className="py-20 lg:py-28 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
            {story.title}
          </h2>
        </FadeIn>

        <div className="prose prose-lg prose-invert max-w-none">
          {story.content.map((paragraph, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <p className="text-blue-100 mb-4 leading-relaxed">{paragraph}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
