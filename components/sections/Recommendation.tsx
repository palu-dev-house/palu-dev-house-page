import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { MotionSection } from '../ui/MotionSection';
import { Button, ButtonLink } from '../ui/Button';
import { questions, recommend, type QuizAnswers } from '@/lib/recommendation';
import { WHATSAPP_NUMBER } from '@/lib/contact';


type Answers = Partial<QuizAnswers>;

/**
 * The hero's primary CTA points here, so this is a landing target and has to
 * look like a destination rather than another centred block. It runs as an
 * asymmetric split: the framing copy and a step tracker hold the left column
 * while the quiz itself sits in a raised card on the right, on a plain
 * `surface` band between the two `surface-muted` bands either side of it.
 */
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
    <MotionSection id="rekomendasi" className="relative py-section-sm md:py-section">
      {/* Quiet engineering grid behind the split — enough to stop the plain
          `surface` band reading as empty next to the muted bands around it. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid opacity-60" />

      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-14">
          <div className="min-w-0 lg:col-span-5 lg:sticky lg:top-28">
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-ink">
              Paket Mana yang Cocok Untuk Saya?
            </h2>
            <p className="mt-4 text-ink-muted">
              4 pertanyaan singkat — langsung dapat rekomendasi paket yang pas.
            </p>

            {/* Desktop-only step tracker. The card announces the current step in
                words for everyone, so this is decorative and hidden from AT. */}
            <ol aria-hidden="true" className="mt-10 hidden space-y-3.5 lg:block">
              {questions.map((q, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <li key={q.id} className="flex items-start gap-3">
                    <span
                      className={
                        'mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold tabular-nums transition-colors duration-200 ' +
                        (done
                          ? 'border-brand bg-brand text-white'
                          : active
                            ? 'border-brand text-brand'
                            : 'border-line text-ink-subtle')
                      }
                    >
                      {done ? '✓' : i + 1}
                    </span>
                    <span
                      className={
                        'text-sm transition-colors duration-200 ' +
                        (active ? 'font-medium text-ink' : done ? 'text-ink-muted' : 'text-ink-subtle')
                      }
                    >
                      {q.label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <Card tone="raised" hoverable={false} className="p-6 sm:p-8">
              {!isComplete && (
                // The desktop tracker replaces this bar; below lg it is the
                // only progress signal.
                <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-surface-sunken lg:hidden">
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
                    <div className="text-xs font-semibold uppercase tracking-wide text-brand">
                      Pertanyaan {step + 1} dari {questions.length}
                    </div>
                    <h3 className="mt-2 font-display text-xl font-semibold text-ink sm:text-2xl">
                      {questions[step].label}
                    </h3>
                    <div className="mt-6 grid gap-3">
                      {questions[step].options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleSelect(opt.value)}
                          className="group flex w-full items-center justify-between gap-4 rounded-lg border border-line bg-surface p-4 text-left transition-colors duration-150 hover:border-brand hover:bg-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                        >
                          <span className="min-w-0 text-sm font-medium text-ink">{opt.label}</span>
                          <span
                            aria-hidden="true"
                            className="shrink-0 text-ink-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand"
                          >
                            →
                          </span>
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
                    <div className="text-xs font-semibold uppercase tracking-wide text-brand">
                      Rekomendasi Kami
                    </div>
                    <h3 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">
                      {recommendation.headline}
                    </h3>
                    <p className="mt-5 leading-relaxed text-ink-muted">{recommendation.reason}</p>
                    <p className="mt-5 rounded-lg bg-brand-light px-4 py-3 text-sm leading-relaxed text-ink">
                      {recommendation.nextStep}
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      {/* End of the funnel — the one place below the hero that
                          earns the amber. */}
                      <ButtonLink
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="accent"
                        size="lg"
                      >
                        Chat WhatsApp Sekarang
                      </ButtonLink>
                      <ButtonLink href="#paket" variant="secondary" size="lg">
                        Lihat isi paket
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
        </div>
      </Container>
    </MotionSection>
  );
}
