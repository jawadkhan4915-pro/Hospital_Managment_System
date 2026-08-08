import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Stethoscope, Activity, Pill, ShieldCheck, HeartPulse, Camera, ChevronRight } from 'lucide-react';

const FACILITIES = [
  {
    id: 1,
    category: 'surgical',
    title: 'Modern Operating & Surgical Suite',
    subtitle: 'Ultra-sterile surgical theater equipped with real-time vitals monitoring and patient telemetry.',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80',
    tag: 'Surgical Unit',
    stats: '12 Active Suites',
  },
  {
    id: 2,
    category: 'doctors',
    title: 'Outpatient & Specialist Consultation Suite',
    subtitle: 'Private consultation rooms with direct EHR synchronization and e-prescription slip printing.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
    tag: 'Doctor Desk',
    stats: '45 Doctors On-Duty',
  },
  {
    id: 3,
    category: 'pharmacy',
    title: 'Automated Hospital Pharmacy',
    subtitle: 'QR code barcode scanners for instant prescription verification, stock alerts, and medicine fulfillment.',
    image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=800&q=80',
    tag: 'E-Pharmacy Wing',
    stats: '1,200+ Medicines',
  },
  {
    id: 4,
    category: 'diagnostics',
    title: 'Advanced Diagnostic & Radiology Center',
    subtitle: 'Digital X-Ray, MRI imaging, and laboratory specimen processing integrated with patient history.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    tag: 'Radiology Lab',
    stats: 'Instant Lab Sync',
  },
  {
    id: 5,
    category: 'reception',
    title: 'Emergency Check-In & Patient Desk',
    subtitle: 'Streamlined patient registration counter with token queue displays and rapid doctor assignment.',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    tag: 'Reception Desk',
    stats: '24/7 Service',
  },
  {
    id: 6,
    category: 'surgical',
    title: 'Intensive Care Unit (ICU) & Telemetry',
    subtitle: 'Continuous cardiac and respiratory patient monitoring with nurse triage alerts.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    tag: 'ICU Wing',
    stats: 'Zero-Downtime Monitoring',
  },
];

export default function HospitalGallerySection() {
  const [filter, setFilter] = useState('all');

  const filteredFacilities = filter === 'all'
    ? FACILITIES
    : FACILITIES.filter((item) => item.category === filter);

  return (
    <section id="gallery" className="py-20 bg-[var(--bg-secondary)] border-y border-[var(--border-color)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-light)] border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider mb-3">
            <Camera size={14} />
            <span>Virtual Hospital Facilities</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Designed for Real Clinical Infrastructure
          </h2>
          
          <p className="mt-3 text-base text-[var(--text-secondary)]">
            Explore authentic hospital environments and virtual clinical workflows powered by our system.
          </p>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { label: 'All Departments', value: 'all' },
            { label: 'Surgical & ICU', value: 'surgical' },
            { label: 'Doctor Suites', value: 'doctors' },
            { label: 'Smart Pharmacy', value: 'pharmacy' },
            { label: 'Diagnostics & Labs', value: 'diagnostics' },
            { label: 'Reception & Admissions', value: 'reception' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                filter === tab.value
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:bg-[var(--border-color)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Facility Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFacilities.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="group rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Visual Image Banner */}
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 bg-slate-900/85 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg border border-slate-700/60 shadow">
                    {item.tag}
                  </span>

                  {/* Stats Pill */}
                  <span className="absolute bottom-3 right-3 bg-[var(--color-primary)] text-white font-semibold text-[11px] px-2.5 py-1 rounded-lg shadow">
                    {item.stats}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-normal">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="px-6 pb-5 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold text-[var(--color-primary)]">
                <span>Integrated Control Unit</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
