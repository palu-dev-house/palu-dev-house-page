import { describe, it, expect } from 'vitest';
import { recommend, questions, type QuizAnswers } from '../lib/recommendation';

describe('recommendation engine', () => {
  it('exposes 4 questions with defined options', () => {
    expect(questions).toHaveLength(4);
    questions.forEach((q) => {
      expect(q.options.length).toBeGreaterThan(0);
      expect(q.id).toBeTruthy();
      expect(q.label).toBeTruthy();
    });
  });

  it('recommends Landing Page Starter for new business needing presence', () => {
    const answers: QuizAnswers = { q1: 'E', q2: 'A', q3: 'A', q4: 'D' };
    const result = recommend(answers);
    expect(result.packageId).toBe('landing-starter');
    expect(result.reason).toContain('profesional');
  });

  it('recommends Landing Page Pro bundle for new biz wanting reach', () => {
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

  it('recommends SEO Growth when business already has site and wants reach', () => {
    const answers: QuizAnswers = { q1: 'B', q2: 'B', q3: 'B', q4: 'A' };
    const result = recommend(answers);
    expect(result.packageId).toBe('seo-growth');
  });

  it('recommends SEO Dominate for high-transaction biz wanting nationwide reach', () => {
    const answers: QuizAnswers = { q1: 'B', q2: 'C', q3: 'C', q4: 'C' };
    const result = recommend(answers);
    expect(['seo-dominate', 'webapp-erp']).toContain(result.packageId);
  });

  it('returns a valid package for every combination of answers', () => {
    const q1Opts = ['A', 'B', 'C', 'D', 'E'] as const;
    const q2Opts = ['A', 'B', 'C'] as const;
    const q3Opts = ['A', 'B', 'C'] as const;
    const q4Opts = ['A', 'B', 'C', 'D'] as const;
    for (const q1 of q1Opts)
      for (const q2 of q2Opts)
        for (const q3 of q3Opts)
          for (const q4 of q4Opts) {
            const result = recommend({ q1, q2, q3, q4 });
            expect(result.packageId).toBeTruthy();
            expect(result.reason).toBeTruthy();
            expect(result.headline).toBeTruthy();
          }
  });
});
