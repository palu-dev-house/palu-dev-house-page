import { MapPin, GraduationCap, Target } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from './animations';

interface AboutProps {
  about: {
    title: string;
    subtitle: string;
    origin: { title: string; content: string };
    background: { title: string; content: string };
    mission: { title: string; content: string };
  };
}

export function AboutUs({ about }: AboutProps) {

  return (
    <section id="about" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {about.title}
            </h2>
            <p className="text-lg text-gray-600">
              {about.subtitle}
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid md:grid-cols-3 gap-8 items-stretch" staggerDelay={0.15}>
          <StaggerItem className="h-full">
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow h-full flex flex-col">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{about.origin.title}</h3>
              <p className="text-gray-600 flex-grow">
                {about.origin.content}
              </p>
            </div>
          </StaggerItem>

          <StaggerItem className="h-full">
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow h-full flex flex-col">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{about.background.title}</h3>
              <p className="text-gray-600 flex-grow">
                {about.background.content}
              </p>
            </div>
          </StaggerItem>

          <StaggerItem className="h-full">
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow h-full flex flex-col">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{about.mission.title}</h3>
              <p className="text-gray-600 flex-grow">
                {about.mission.content}
              </p>
            </div>
          </StaggerItem>
        </StaggerContainer>

        <FadeIn delay={0.4}>
          <div className="mt-16 bg-blue-600 rounded-2xl p-8 lg:p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                Mengapa Kami Mendirikan Palu Dev House
              </h3>
              <p className="text-blue-100 text-lg leading-relaxed">
                Kami percaya bahwa teknologi harus dapat diakses oleh semua orang di Indonesia. 
                Berawal dari Sulawesi, kami ingin membantu bisnis lokal dan komunitas 
                memanfaatkan kekuatan teknologi. Melalui pembuatan tools dan aplikasi SaaS, 
                kami tidak hanya membantu orang lain tetapi juga mendanai impian kami 
                untuk belajar di luar negeri dan membawa pengetahuan serta tools teknologi 
                terkini untuk memajukan tanah air.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
