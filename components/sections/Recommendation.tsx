import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { MotionSection } from '../ui/MotionSection';
import { Button, ButtonLink } from '../ui/Button';
import { questions, recommend, type QuizAnswers } from '@/lib/recommendation';

const WHATSAPP_NUMBER = '628000000000';

type Answers = Partial<QuizAnswers>;

export function Recommendation() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const isComplete = step >= questions.length;
  const recommendation = isComplete ? recommend(answers as QuizAnswers) : null;
  const progress = (step / questions.length) * 100;

  const handleSelect = (value: string) => {
    const current = questions[step];
    const nextAnswers = { ...answers, [current.id]: value };
    setAnswers(nextAnswers);
    setStep(step + 1);
  };

  const handleReset = () => {
    setAnswers({});
    setStep(0);
  };

  const whatsappMessage = recommendation
    ? encodeURIComponent(
        `Halo Palu Dev House! Saya baru coba quiz rekomendasi dan dapat saran paket ${recommendation.headline.replace(/^Paket yang cocok: /, '')}. Boleh konsultasi lebih lanjut?`,
      )
    : '';

  return (
    <MotionSection id="rekomendasi" className="py-section-sm md:py-section">
      <Container>
        <div className="max-w-prose mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
            Paket Mana yang Cocok Untuk Saya?
          </h2>
          <p className="mt-4 text-ink-muted">
            4 pertanyaan singkat — langsung dapat rekomendasi paket yang pas.
          </p>
        </div>

        <div className="mt-12 max-w-2xl mx-auto">
          <Card hoverable={false} className="p-8">
            {!isComplete && (
              <div className="mb-6 h-1 w-full bg-surface-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-brand"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            <AnimatePresence mode="wait">
              {!isComplete ? (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-xs font-semibold text-brand uppercase tracking-wide">
                    Pertanyaan {step + 1} dari {questions.length}
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-ink">{questions[step].label}</h3>
                  <div className="mt-6 grid gap-3">
                    {questions[step].options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleSelect(opt.value)}
                        className="text-left rounded-lg border border-line bg-surface p-4 hover:border-brand hover:bg-brand-light transition-colors"
                      >
                        <span className="text-sm font-medium text-ink">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : recommendation ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-xs font-semibold text-brand uppercase tracking-wide">
                    Rekomendasi Kami
                  </div>
                  <h3 className="mt-2 text-2xl md:text-3xl font-semibold text-ink">
                    {recommendation.headline}
                  </h3>
                  <p className="mt-4 text-ink-muted leading-relaxed">{recommendation.reason}</p>
                  <div className="mt-6 inline-flex items-center rounded-lg bg-brand-light px-4 py-2">
                    <span className="text-sm font-semibold text-brand">{recommendation.priceLabel}</span>
                  </div>
                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <ButtonLink
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="lg"
                    >
                      Chat WhatsApp Sekarang
                    </ButtonLink>
                    <ButtonLink
                      href={recommendation.scrollTo === 'seo' ? '/seo' : '#harga'}
                      variant="secondary"
                      size="lg"
                    >
                      Lihat paket lengkap
                    </ButtonLink>
                  </div>
                  <Button variant="ghost" size="sm" className="mt-4" onClick={handleReset}>
                    ↺ Ulangi quiz
                  </Button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </Card>
        </div>
      </Container>
    </MotionSection>
  );
}
