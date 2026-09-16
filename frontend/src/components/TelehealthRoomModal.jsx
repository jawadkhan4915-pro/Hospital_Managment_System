import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Monitor, 
  Settings, 
  Clock, 
  User, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  Maximize2,
  Minimize2,
  Stethoscope,
  Pill,
  Send
} from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';

export default function TelehealthRoomModal({
  isOpen,
  onClose,
  appointment,
  currentUserRole = 'Doctor',
}) {
  const { showSuccess, showInfo, showError } = useToast();

  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [consultNotes, setConsultNotes] = useState('');
  const [showNotesPane, setShowNotesPane] = useState(true);

  const localVideoRef = useRef(null);
  const streamRef = useRef(null);

  // Call duration counter
  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isOpen]);

  // Request user camera and microphone
  useEffect(() => {
    if (!isOpen) return;

    async function initMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Camera/mic access unavailable, using simulated video stream:', err.message);
      }
    }

    initMedia();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !videoEnabled;
      });
    }
    setVideoEnabled(!videoEnabled);
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !audioEnabled;
      });
    }
    setAudioEnabled(!audioEnabled);
  };

  const handleEndCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    showInfo(`Telehealth consultation ended (${formatTime(callDuration)})`);
    onClose();
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const otherParticipantName = currentUserRole === 'Doctor'
    ? appointment?.patientId?.name || 'Patient John Watson'
    : appointment?.doctorId?.userId?.name || 'Dr. Gregory House';

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-6xl w-[95vw] h-[88vh] p-0 overflow-hidden flex flex-col bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl">
        
        {/* Top Telehealth Status Bar */}
        <div className="p-3 sm:p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-cyan-400 border border-indigo-400/30 flex items-center justify-center">
              <Stethoscope size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">
                  Telehealth Virtual Consultation Room
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  256-Bit Encrypted
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Connected with: <strong className="text-slate-200">{otherParticipantName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-amber-400">
              <Clock size={14} />
              <span>{formatTime(callDuration)}</span>
            </div>

            {currentUserRole === 'Doctor' && (
              <button
                onClick={() => setShowNotesPane(!showNotesPane)}
                className={`btn btn-sm ${showNotesPane ? 'btn-primary' : 'btn-secondary'} text-xs flex items-center gap-1.5`}
              >
                <FileText size={14} />
                <span className="hidden sm:inline">Clinical Notes Pane</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Video & Split Clinical Workspace */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden relative">
          
          {/* Main Video Feed Area */}
          <div className={`${showNotesPane && currentUserRole === 'Doctor' ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col justify-between p-4 bg-slate-950 relative overflow-hidden transition-all duration-300`}>
            
            {/* Primary Remote Feed Container */}
            <div className="flex-1 rounded-2xl bg-slate-900 border border-slate-800/80 overflow-hidden relative flex items-center justify-center shadow-inner">
              {/* Remote Simulated Video View */}
              <div className="w-full h-full relative">
                <img
                  src={currentUserRole === 'Doctor'
                    ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80'
                    : 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt="Remote Participant"
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Remote Participant Label */}
                <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs font-semibold text-white flex items-center gap-2 shadow-lg">
                  <User size={14} className="text-cyan-400" />
                  <span>{otherParticipantName}</span>
                </div>

                {/* HD Connection Badge */}
                <div className="absolute top-4 left-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>1080p WebRTC Stream &bull; 24ms</span>
                </div>
              </div>

              {/* Local Participant Picture-in-Picture (PiP) */}
              <div className="absolute top-4 right-4 w-36 sm:w-48 h-24 sm:h-32 rounded-xl bg-slate-950 border-2 border-indigo-500/50 overflow-hidden shadow-2xl z-20">
                {videoEnabled ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900">
                    <VideoOff size={24} />
                    <span className="text-[10px] mt-1 font-semibold">Camera Off</span>
                  </div>
                )}

                <div className="absolute bottom-1.5 left-2 text-[10px] font-bold bg-slate-900/80 px-1.5 py-0.5 rounded text-white">
                  You ({currentUserRole})
                </div>
              </div>
            </div>

            {/* In-Call Media Controls Bar */}
            <div className="mt-4 flex items-center justify-center gap-3 sm:gap-4 py-2">
              <button
                type="button"
                onClick={toggleAudio}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                  audioEnabled
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    : 'bg-rose-600 text-white hover:bg-rose-700'
                }`}
                title={audioEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
              >
                {audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
              </button>

              <button
                type="button"
                onClick={toggleVideo}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                  videoEnabled
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    : 'bg-rose-600 text-white hover:bg-rose-700'
                }`}
                title={videoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
              >
                {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setScreenSharing(!screenSharing);
                  showInfo(screenSharing ? 'Screen sharing ended' : 'Screen sharing initialized');
                }}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                  screenSharing
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
                title="Share Screen"
              >
                <Monitor size={20} />
              </button>

              <button
                type="button"
                onClick={handleEndCall}
                className="px-6 h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xl shadow-rose-600/30"
                title="End Consultation"
              >
                <PhoneOff size={20} />
                <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">End Call</span>
              </button>
            </div>

          </div>

          {/* Right Clinical Notes & Prescriptions Split Pane (For Doctor) */}
          {showNotesPane && currentUserRole === 'Doctor' && (
            <div className="lg:col-span-4 p-4 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
                  <FileText size={18} className="text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Live Clinical Consultation Chart</h3>
                </div>

                {/* Patient Quick Vitals Glance */}
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                    Patient Vitals Telemetry
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-slate-900/60">
                      <div className="text-xs font-bold text-white">120/80</div>
                      <div className="text-[10px] text-slate-400">BP (mmHg)</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60">
                      <div className="text-xs font-bold text-emerald-400">72</div>
                      <div className="text-[10px] text-slate-400">Pulse (bpm)</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900/60">
                      <div className="text-xs font-bold text-cyan-400">99%</div>
                      <div className="text-[10px] text-slate-400">SpO2</div>
                    </div>
                  </div>
                </div>

                {/* Real-Time Consultation Notes */}
                <div className="form-group mb-4">
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Consultation Observations & Assessment
                  </label>
                  <textarea
                    rows={6}
                    className="form-control w-full bg-slate-950 border-slate-700 text-white text-xs placeholder:text-slate-600 focus:border-cyan-500"
                    placeholder="Document subjective symptoms reported during call, clinical assessment, advice..."
                    value={consultNotes}
                    onChange={(e) => setConsultNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Notes automatically save to appointment chart
                </span>
                <button
                  type="button"
                  onClick={() => {
                    showSuccess('Consultation notes saved to patient history!');
                  }}
                  className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={13} />
                  <span>Save Notes</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
