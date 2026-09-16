import React from 'react';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CdssWarningCard({
  analysis,
  overrideConfirmed,
  setOverrideConfirmed,
  overrideReason,
  setOverrideReason,
}) {
  const [expanded, setExpanded] = React.useState(true);

  if (!analysis || !analysis.hasWarnings) {
    return (
      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 mb-4">
        <CheckCircle2 size={16} className="flex-shrink-0" />
        <span className="font-semibold">CDSS Safety Check Passed:</span>
        <span className="text-[var(--text-secondary)]">No documented drug-drug interactions or allergy contraindications detected for this regimen.</span>
      </div>
    );
  }

  const { warnings, hasCritical, hasHigh } = analysis;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border mb-5 overflow-hidden shadow-lg ${
        hasCritical
          ? 'bg-rose-500/5 border-rose-500/40 text-rose-700 dark:text-rose-300'
          : hasHigh
          ? 'bg-amber-500/5 border-amber-500/40 text-amber-700 dark:text-amber-300'
          : 'bg-indigo-500/5 border-indigo-500/30 text-indigo-700 dark:text-indigo-300'
      }`}
    >
      {/* Header Bar */}
      <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 border-b border-inherit bg-black/5 dark:bg-white/5">
        <div className="flex items-center gap-2.5">
          {hasCritical ? (
            <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center animate-pulse flex-shrink-0">
              <ShieldAlert size={18} />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={18} />
            </div>
          )}
          <div>
            <div className="text-xs sm:text-sm font-extrabold flex items-center gap-2">
              <span>Clinical Decision Support System (CDSS) Alert</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide bg-rose-500 text-white">
                {warnings.length} {warnings.length === 1 ? 'Contraindication' : 'Contraindications'} Detected
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              Review flagged clinical warnings below before submitting digital prescription.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-[var(--text-secondary)]"
          aria-label="Toggle Warning Details"
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Warning Cards List */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-3.5 sm:p-4 space-y-3"
          >
            {warnings.map((w) => (
              <div
                key={w.id}
                className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] shadow-sm text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <span className="font-bold text-sm text-[var(--text-primary)]">{w.title}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      w.severity === 'CRITICAL'
                        ? 'bg-rose-500 text-white'
                        : w.severity === 'HIGH'
                        ? 'bg-amber-500 text-white'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {w.severity} SEVERITY
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="text-[11px] text-[var(--text-tertiary)] font-semibold">Flagged:</span>
                  {w.drugsInvolved.map((d, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono font-bold text-[11px]"
                    >
                      {d}
                    </span>
                  ))}
                </div>

                <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
                  <strong className="text-[var(--text-primary)]">Mechanism:</strong> {w.mechanism}
                </p>

                <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[11px] text-[var(--text-primary)]">
                  <strong className="text-indigo-500 dark:text-indigo-400">Clinical Recommendation:</strong> {w.recommendation}
                </div>
              </div>
            ))}

            {/* Override Confirmation */}
            {(hasCritical || hasHigh) && (
              <div className="pt-3 border-t border-[var(--border-color)]">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={overrideConfirmed}
                    onChange={(e) => setOverrideConfirmed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-[var(--text-primary)]">
                      Physician Clinical Override Acknowledgement
                    </span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                      I certify that the therapeutic benefit outweighs the potential adverse risks. Close monitoring for adverse reactions will be maintained.
                    </p>
                  </div>
                </label>

                {overrideConfirmed && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      className="form-control w-full text-xs"
                      placeholder="Enter clinical override rationale (e.g. Inpatient ICU with continuous cardiac telemetry)..."
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
