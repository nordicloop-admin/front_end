"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2, BadgeCheck, Clock, ShieldCheck, Wallet } from 'lucide-react';
import { UserDashboardStatistics } from '@/services/statistics';

/**
 * Map payment_state to banner UI metadata
 */
const stateConfig: Record<string, {
  title: string;
  description: string;
  action?: { label: string; href: string };
  tone: 'info' | 'warn' | 'success' | 'progress';
  icon: React.ComponentType<any>;
  steps?: string[];
}> = {
  not_started: {
    title: 'Start receiving payouts',
    description: 'Set up your payout account to receive funds from winning bids and auctions.',
  action: { label: 'Start setup', href: '/dashboard/payments?tab=account' },
    tone: 'warn',
    icon: Wallet,
    steps: [
      'Create a payout account',
      'Provide business / representative info',
      'Submit verification documents'
    ]
  },
  in_progress: {
    title: 'Continue payout setup',
    description: 'You started onboarding but still have required steps to finish.',
  action: { label: 'Continue', href: '/dashboard/payments?tab=account' },
    tone: 'progress',
    icon: Clock,
    steps: [
      'Finish required business / identity questions',
      'Submit any pending documents'
    ]
  },
  capabilities_pending: {
    title: 'Verification under review',
    description: 'Your documents were submitted. We are waiting for Stripe to approve required capabilities.',
    tone: 'info',
    icon: ShieldCheck,
    steps: [
      'Stripe is reviewing your submission',
      'We will notify you if additional info is needed'
    ]
  },
  finalizing: {
    title: 'Almost ready to receive payouts',
    description: 'Final checks are running. This normally completes shortly.',
    tone: 'info',
    icon: Loader2,
    steps: [
      'Finishing Stripe capability checks',
      'Preparing payout activation'
    ]
  },
  ready: {
    title: 'Payouts enabled',
    description: 'Your account can receive payouts from successful transactions.',
    tone: 'success',
    icon: BadgeCheck
  }
};

interface Props {
  stats: UserDashboardStatistics | null;
}

const PayoutSetupBanner: React.FC<Props> = ({ stats }) => {
  const [dismissed, setDismissed] = useState<boolean>(false);
  const paymentState = stats?.payment_state || 'not_started';
  const cfg = stateConfig[paymentState];

  // Persist dismissal per state so user sees new info when state advances
  useEffect(() => {
    const key = `payout_banner_${paymentState}`;
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
    setDismissed(stored === 'dismissed');
  }, [paymentState]);

  const dismiss = () => {
    const key = `payout_banner_${paymentState}`;
    try {
      window.localStorage.setItem(key, 'dismissed');
    } catch (_) {}
    setDismissed(true);
  };

  // Only show if we have a company and not fully ready, OR show success state briefly
  if (!stats?.company_id) return null;
  const show = paymentState !== 'ready' || (paymentState === 'ready' && !dismissed);
  if (!show || dismissed) return null;

  const toneStyles: Record<string, string> = {
    warn: 'border-amber-300 bg-amber-50 text-amber-900',
    info: 'border-sky-300 bg-sky-50 text-sky-900',
    success: 'border-emerald-300 bg-emerald-50 text-emerald-900',
    progress: 'border-indigo-300 bg-indigo-50 text-indigo-900'
  };

  const Icon = cfg.icon;
  const baseClass = `relative rounded-md border p-4 mb-6 ${toneStyles[cfg.tone]}`;

  return (
    <div className={baseClass} data-payment-state={paymentState}>
      <button
        onClick={dismiss}
        className="absolute top-2 right-2 text-sm opacity-60 hover:opacity-100"
        aria-label="Dismiss payout banner"
      >
        ×
      </button>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold tracking-tight mb-1">{cfg.title}</h3>
          <p className="text-xs leading-relaxed mb-2 max-w-prose">{cfg.description}</p>
          {cfg.steps && cfg.steps.length > 0 && (
            <ul className="list-disc pl-5 space-y-1 text-xs mb-3">
              {cfg.steps.map(step => <li key={step}>{step}</li>)}
            </ul>
          )}
          {cfg.action && paymentState !== 'ready' && (
            <Link
              href={cfg.action.href}
              className="inline-flex items-center px-3 py-1.5 rounded-md bg-[#FF8A00] text-white text-xs font-medium hover:bg-[#e67e00] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#FF8A00]"
            >
              {cfg.action.label}
            </Link>
          )}
          {paymentState === 'ready' && (
            <div className="text-xs font-medium text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Payout account is active
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayoutSetupBanner;
