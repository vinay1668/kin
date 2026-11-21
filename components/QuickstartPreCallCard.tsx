'use client';

import { ArrowUpRight, AudioLines, CalendarDays, ListChecks, Mic, MicOff, ShoppingBasket } from 'lucide-react';
import styles from './kin.module.css';
import { AccountControl } from './AccountControl';

const starters = [
  { icon: ShoppingBasket, label: 'Make a grocery list', prompt: 'What groceries should I get for tacos?', tone: styles.peach },
  { icon: CalendarDays, label: 'Plan a dinner', prompt: 'Help me plan dinner for four on Saturday.', tone: styles.lilac },
  { icon: ListChecks, label: 'Break down a task', prompt: 'Help me make a packing checklist.', tone: styles.mint },
];

export function QuickstartPreCallCard({ isLoading, error, onStartConversation }: {
  isLoading: boolean;
  error: string | null;
  onStartConversation: () => void;
}) {
  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <span className={styles.brand}><AudioLines size={22} /> Kin</span>
        <div className={styles.headerRight}>
          <span className={styles.status} role="status"><MicOff size={15} /> {isLoading ? 'Connecting' : 'Mic off'}</span>
          <AccountControl />
        </div>
      </header>
      <section className={styles.home}>
        <div className={styles.intro}>
          <h1>What’s <br />the plan?</h1>
          <p>Talk with Kin to plan a meal, make a list, or figure out what to do next.</p>
        </div>
        <div className={styles.stage}>
          <div className={styles.signal} aria-hidden="true">
            {[28, 50, 82, 116, 92, 60, 36].map((height, index) => (
              <span key={height} style={{ height, animationDelay: `${index * -130}ms` }} />
            ))}
          </div>
          <button className={styles.start} onClick={onStartConversation} disabled={isLoading}>
            <Mic size={21} /> {isLoading ? 'Connecting…' : 'Start talking'} <ArrowUpRight size={20} />
          </button>
          <p className={styles.hint}>Allow microphone access when asked.</p>
        </div>
      </section>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <section className={styles.examples} aria-labelledby="kin-examples">
        <h2 id="kin-examples">Try saying</h2>
        <div className={styles.cards}>
          {starters.map(({ icon: Icon, label, prompt, tone }) => (
            <article key={label} className={tone}>
              <Icon size={21} aria-hidden="true" />
              <h3>{label}</h3>
              <p>“{prompt}”</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
