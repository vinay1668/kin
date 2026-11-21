'use client';

import type { ReactNode } from 'react';
import { AudioLines, PhoneOff } from 'lucide-react';
import styles from './kin.module.css';
import { AccountControl } from './AccountControl';

export function QuickstartConversationLayout({ statusPanel, pipelineMetrics, transcriptPanel, visualizer, controls, onEndConversation }: {
  statusPanel: ReactNode;
  pipelineMetrics: ReactNode;
  transcriptPanel: ReactNode;
  visualizer: ReactNode;
  controls: ReactNode;
  onEndConversation: () => void;
}) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <span className={styles.brand}><AudioLines size={22} /> Kin</span>
        <div className={styles.sessionActions}>
          {statusPanel}
          <AccountControl />
          <button onClick={onEndConversation}><PhoneOff size={16} /> End conversation</button>
        </div>
      </header>
      <main className={styles.room}>
        <section className={styles.call}>
          <h1>Voice conversation</h1>
          <div className={styles.visualizer}>{visualizer}</div>
          {controls}
        </section>
        <section className={styles.transcript} aria-label="Live transcript">{transcriptPanel}</section>
      </main>
      <details className={styles.diagnostics}>
        <summary>Connection details</summary>
        {pipelineMetrics}
      </details>
    </div>
  );
}
