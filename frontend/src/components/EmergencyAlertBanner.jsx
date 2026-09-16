import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertOctagon, 
  Volume2, 
  VolumeX, 
  Users, 
  CheckCircle2, 
  X, 
  PlusCircle, 
  Clock, 
  MapPin, 
  Flame, 
  HeartCrack, 
  Activity, 
  Stethoscope, 
  Zap,
  Radio
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getApiUrl } from '../config/api.js';

// Synthesizes a high-urgency medical alert chime using Web Audio API
function playEmergencyChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    // Audio context may be blocked before first user gesture
  }
}

export default function EmergencyAlertBanner() {
  const { user } = useContext(AuthContext);
  const { showSuccess, showError, showInfo } = useToast();

  const [activeAlerts, setActiveAlerts] = useState([]);
  const [muted, setMuted] = useState(false);
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Trigger form state
  const [codeType, setCodeType] = useState('Code Blue');
  const [floor, setFloor] = useState('3rd Floor');
  const [wing, setWing] = useState('ICU Wing');
  const [room, setRoom] = useState('Room 304');
  const [patientName, setPatientName] = useState('');
  const [details, setDetails] = useState('');

  const fetchActiveAlerts = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(getApiUrl('/api/v1/emergency/active'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        if (data.data.length > activeAlerts.length && !muted) {
          playEmergencyChime();
        }
        setActiveAlerts(data.data || []);
      }
    } catch (err) {
      // Background poll silently ignore
    }
  };

  useEffect(() => {
    fetchActiveAlerts();
    const interval = setInterval(fetchActiveAlerts, 10000); // 10s poll
    return () => clearInterval(interval);
  }, [user]);

  const handleRespond = async (alertId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(getApiUrl(`/api/v1/emergency/${alertId}/respond`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes: 'Clinical staff responding immediately' }),
      });
      const data = await res.json();
      if (data.success) {
        showSuccess('Your response has been dispatched to the emergency team!');
        fetchActiveAlerts();
      } else {
        showError(data.message || 'Failed to respond');
      }
    } catch (err) {
      showError(err.message);
    }
  };

  const handleResolve = async (alertId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(getApiUrl(`/api/v1/emergency/${alertId}/resolve`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resolutionNotes: 'Patient stabilized. Emergency code stands down.' }),
      });
      const data = await res.json();
      if (data.success) {
        showSuccess('Emergency code resolved and logged.');
        fetchActiveAlerts();
      } else {
        showError(data.message || 'Failed to resolve code');
      }
    } catch (err) {
      showError(err.message);
    }
  };

  const handleTriggerCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(getApiUrl('/api/v1/emergency/trigger'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          codeType,
          location: { floor, wing, room },
          details,
          patientName,
          severity: codeType === 'Code Blue' || codeType === 'Code Trauma' ? 'Immediate Life Threat' : 'High Priority',
        }),
      });
      const data = await res.json();
      if (data.success) {
        showSuccess(`${codeType} Broadcast Active Across Hospital!`);
        setShowTriggerModal(false);
        setDetails('');
        setPatientName('');
        playEmergencyChime();
        fetchActiveAlerts();
      } else {
        showError(data.message || 'Failed to trigger code');
      }
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isStaffRole = user && ['Doctor', 'Nurse', 'Receptionist', 'Admin'].includes(user.role);

  return (
    <>
      {/* Top Banner for Active Emergency Codes */}
      <AnimatePresence>
        {activeAlerts.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sticky top-0 z-50 bg-rose-600 text-white shadow-2xl border-b-2 border-rose-700"
          >
            {activeAlerts.map((alert) => {
              const alreadyResponded = alert.responders?.some((r) => r.userId === user?.id);

              return (
                <div
                  key={alert._id}
                  className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-semibold"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-3.5 h-3.5 rounded-full bg-white animate-ping flex-shrink-0" />
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-black/30 text-white font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider text-xs">
                        {alert.codeType}
                      </span>
                      <span className="flex items-center gap-1 font-bold">
                        <MapPin size={15} />
                        {alert.location.floor} &bull; {alert.location.wing} &bull; {alert.location.room}
                      </span>
                      {alert.patientName && alert.patientName !== 'Unassigned / Room Event' && (
                        <span className="text-rose-100 hidden md:inline">
                          (Patient: {alert.patientName})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/20 text-xs">
                      <Users size={14} />
                      <span>{alert.responders?.length || 0} Responding</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setMuted(!muted)}
                      className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white transition-colors"
                      title={muted ? 'Unmute siren chime' : 'Mute siren chime'}
                    >
                      {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                    </button>

                    {isStaffRole && !alreadyResponded && (
                      <button
                        type="button"
                        onClick={() => handleRespond(alert._id)}
                        className="px-3 py-1 rounded-lg bg-white text-rose-700 font-bold hover:bg-rose-50 shadow text-xs transition-colors cursor-pointer"
                      >
                        I'm Responding
                      </button>
                    )}

                    {isStaffRole && alreadyResponded && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 size={13} /> Responding
                      </span>
                    )}

                    {['Doctor', 'Admin', 'Nurse'].includes(user?.role) && (
                      <button
                        type="button"
                        onClick={() => handleResolve(alert._id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-900 text-white font-semibold text-xs border border-rose-400/40 transition-colors cursor-pointer"
                      >
                        Stand Down
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Emergency Code Trigger Trigger Button for authorized staff */}
      {isStaffRole && (
        <div className="fixed bottom-5 right-5 z-40">
          <button
            type="button"
            onClick={() => setShowTriggerModal(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-2xl shadow-rose-600/50 hover:scale-105 transition-all cursor-pointer border border-rose-400/40"
            title="Declare Emergency Code"
          >
            <Radio size={16} className="animate-pulse" />
            <span className="hidden sm:inline">Declare Hospital Code</span>
            <span className="sm:hidden">Emergency</span>
          </button>
        </div>
      )}

      {/* Declare Emergency Code Modal */}
      {showTriggerModal && (
        <div className="modal-overlay">
          <div className="modal-content max-w-lg p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)] mb-4">
              <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
                <AlertOctagon size={22} />
                <h3 className="text-lg font-bold">Broadcast Hospital Emergency Code</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTriggerModal(false)}
                className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleTriggerCode} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Emergency Protocol Type</label>
                <select
                  className="form-control w-full font-bold"
                  value={codeType}
                  onChange={(e) => setCodeType(e.target.value)}
                >
                  <option value="Code Blue">Code Blue — Cardiac / Respiratory Arrest</option>
                  <option value="Code Red">Code Red — Fire / Smoke Hazard</option>
                  <option value="Code Trauma">Code Trauma — Mass Casualty / Major Trauma</option>
                  <option value="Code Stroke">Code Stroke — Acute Neurological Deficit</option>
                  <option value="Code Sepsis">Code Sepsis — Severe Sepsis Alert</option>
                  <option value="Code Pink">Code Pink — Infant / Pediatric Emergency</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="form-group">
                  <label className="form-label">Floor</label>
                  <input
                    type="text"
                    className="form-control w-full"
                    placeholder="e.g. 3rd Floor"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Wing</label>
                  <input
                    type="text"
                    className="form-control w-full"
                    placeholder="e.g. ICU Wing"
                    value={wing}
                    onChange={(e) => setWing(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Room / Bed</label>
                  <input
                    type="text"
                    className="form-control w-full"
                    placeholder="e.g. Room 304"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Patient Name (Optional)</label>
                <input
                  type="text"
                  className="form-control w-full"
                  placeholder="e.g. John Doe (or leave blank for facility alert)"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Clinical Situation & Instructions</label>
                <textarea
                  className="form-control w-full"
                  rows={3}
                  placeholder="Brief instructions for responding crash cart team..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setShowTriggerModal(false)}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-2"
                  disabled={loading}
                >
                  <Radio size={16} />
                  <span>{loading ? 'Transmitting Broadcast...' : 'Broadcast Emergency Code'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
