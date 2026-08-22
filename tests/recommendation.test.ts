import { describe, it, expect } from 'vitest';
import { recommend, questions, type QuizAnswers } from '../lib/recommendation';

const q1Opts = ['A', 'B', 'C', 'D', 'E'] as const;
const q2Opts = ['A', 'B', 'C'] as const;
const q3Opts = ['A', 'B', 'C'] as const;
const q4Opts = ['A', 'B', 'C', 'D'] as const;

/** Every one of the 180 reachable answer combinations. */
function allAnswers(): QuizAnswers[] {
  const combos: QuizAnswers[] = [];
  for (const q1 of q1Opts)
    for (const q2 of q2Opts)
      for (const q3 of q3Opts)
        for (const q4 of q4Opts) combos.push({ q1, q2, q3, q4 });
  return combos;
}

describe('recommendation engine', () => {
  it('exposes 4 questions with defined options', () => {
    expect(questions).toHaveLength(4);
    questions.forEach((q) => {
      expect(q.options.length).toBeGreaterThan(0);
      expect(q.id).toBeTruthy();
      expect(q.label).toBeTruthy();
    });
  });

  it('covers exactly 180 answer combinations', () => {
    expect(allAnswers()).toHaveLength(180);
  });

  it('recommends Landing Page Starter for new business needing presence', () => {
    const answers: QuizAnswers = { q1: 'E', q2: 'A', q3: 'A', q4: 'D' };
    const result = recommend(answers);
    expect(result.packageId).toBe('landing-starter');
    expect(result.reason).toContain('profesional');
  });

  it('recommends Landing Page Pro for new biz wanting reach', () => {
    const answers: QuizAnswers = { q1: 'B', q2: 'A', q3: 'A', q4: 'A' };
    const result = recommend(answers);
    expect(result.packageId).toBe('landing-pro');
  });

  it('recommends Standard POS for small cafe with operational focus', () => {
    const answers: QuizAnswers = { q1: 'A', q2: 'A', q3: 'A', q4: 'B' };
    const result = recommend(answers);
    expect(result.packageId).toBe('webapp-pos');
  });

  it('recommends Pro ERP for multi-outlet retail', () => {
    const answers: QuizAnswers = { q1: 'B', q2: 'C', q3: 'C', q4: 'B' };
    const result = recommend(answers);
    expect(result.packageId).toBe('webapp-erp');
  });

  it('recommends Booking/Tuition for service and education businesses', () => {
    const serviceAnswers: QuizAnswers = { q1: 'C', q2: 'A', q3: 'B', q4: 'B' };
    expect(recommend(serviceAnswers).packageId).toBe('webapp-booking');

    const eduAnswers: QuizAnswers = { q1: 'D', q2: 'B', q3: 'B', q4: 'B' };
    expect(recommend(eduAnswers).packageId).toBe('webapp-booking');
  });

  it('recommends Landing Page Max when existing site wants more reach', () => {
    const answers: QuizAnswers = { q1: 'B', q2: 'B', q3: 'B', q4: 'A' };
    const result = recommend(answers);
    expect(result.packageId).toBe('landing-max');
  });

  it('recommends Enterprise for high-transaction biz wanting new regions', () => {
    const answers: QuizAnswers = { q1: 'B', q2: 'C', q3: 'C', q4: 'C' };
    const result = recommend(answers);
    expect(['webapp-enterprise', 'webapp-erp']).toContain(result.packageId);
  });

  it('never returns a legacy SEO package id', () => {
    for (const answers of allAnswers()) {
      const result = recommend(answers);
      expect(result.packageId).not.toMatch(/^seo-/);
      expect(result.scrollTo).toBe('paket');
    }
  });

  it('returns a valid package for every combination of answers', () => {
    for (const answers of allAnswers()) {
      const result = recommend(answers);
      expect(result.packageId).toBeTruthy();
      expect(result.reason).toBeTruthy();
      expect(result.headline).toBeTruthy();
      expect(result.nextStep).toBeTruthy();
    }
  });

  /**
   * Pricing came off the site entirely — the result used to carry a `priceLabel`,
   * and one branch quoted "Rp 225.000" for a package that cost Rp 400.000. This
   * asserts the class of bug cannot come back through the quiz.
   */
  it('never quotes a price in any result', () => {
    const priceish = /\bRp\b|\brupiah\b|\bjuta\b|\brb\b|\bribu\b|\d{3}\.\d{3}/i;
    for (const answers of allAnswers()) {
      const result = recommend(answers);
      const text = `${result.headline} ${result.reason} ${result.nextStep}`;
      expect(text).not.toMatch(priceish);
      expect(result).not.toHaveProperty('priceLabel');
    }
  });

  /** Every result ends by pointing at a real conversation, not a number. */
  it('always tells the visitor what to do next', () => {
    for (const answers of allAnswers()) {
      const result = recommend(answers);
      expect(result.nextStep.toLowerCase()).toContain('whatsapp');
    }
  });
});
