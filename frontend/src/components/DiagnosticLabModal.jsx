import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Printer, 
  X, 
  Plus, 
  Trash2, 
  Clock, 
  Search,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';
import { getApiUrl } from '../config/api.js';
import { useToast } from '../context/ToastContext.jsx';

// Pre-defined test templates with standard biological reference intervals
export const TEST_TEMPLATES = [
  {
    category: 'Hematology',
    name: 'Complete Blood Count (CBC)',
    specimen: 'Whole Blood (EDTA)',
    parameters: [
      { name: 'Hemoglobin (Hb)', unit: 'g/dL', referenceRange: '13.5 - 17.5', min: 13.5, max: 17.5, critMin: 7.0, critMax: 20.0 },
      { name: 'White Blood Cell (WBC)', unit: 'x10^3/uL', referenceRange: '4.5 - 11.0', min: 4.5, max: 11.0, critMin: 2.0, critMax: 30.0 },
      { name: 'Platelets', unit: 'x10^3/uL', referenceRange: '150 - 450', min: 150, max: 450, critMin: 50, critMax: 1000 },
      { name: 'Red Blood Cell (RBC)', unit: 'x10^6/uL', referenceRange: '4.3 - 5.9', min: 4.3, max: 5.9, critMin: 2.0, critMax: 7.0 },
      { name: 'Hematocrit (Hct)', unit: '%', referenceRange: '41 - 50', min: 41, max: 50, critMin: 20, critMax: 60 },
    ],
  },
  {
    category: 'Biochemistry',
    name: 'Comprehensive Metabolic Panel (CMP)',
    specimen: 'Serum (SST)',
    parameters: [
      { name: 'Fasting Blood Glucose', unit: 'mg/dL', referenceRange: '70 - 99', min: 70, max: 99, critMin: 50, critMax: 400 },
      { name: 'Blood Urea Nitrogen (BUN)', unit: 'mg/dL', referenceRange: '7 - 20', min: 7, max: 20, critMin: 2, critMax: 80 },
      { name: 'Serum Creatinine', unit: 'mg/dL', referenceRange: '0.7 - 1.3', min: 0.7, max: 1.3, critMin: 0.3, critMax: 5.0 },
      { name: 'Serum Sodium (Na+)', unit: 'mEq/L', referenceRange: '135 - 145', min: 135, max: 145, critMin: 120, critMax: 160 },
      { name: 'Serum Potassium (K+)', unit: 'mEq/L', referenceRange: '3.5 - 5.0', min: 3.5, max: 5.0, critMin: 2.8, critMax: 6.2 },
    ],
  },
  {
    category: 'Cardiology',
    name: 'Cardiac Troponin I (STAT)',
    specimen: 'Serum',
    parameters: [
      { name: 'Troponin I High-Sensitivity', unit: 'ng/mL', referenceRange: '< 0.04', min: 0, max: 0.04, critMin: 0, critMax: 0.4 },
      { name: 'CK-MB', unit: 'ng/mL', referenceRange: '0.0 - 5.0', min: 0, max: 5.0, critMin: 0, critMax: 25 },
    ],
  },
  {
    category: 'Biochemistry',
    name: 'Lipid Profile',
    specimen: 'Fasting Serum',
    parameters: [
      { name: 'Total Cholesterol', unit: 'mg/dL', referenceRange: '< 200', min: 0, max: 200, critMin: 0, critMax: 400 },
      { name: 'HDL (Good Cholesterol)', unit: 'mg/dL', referenceRange: '> 40', min: 40, max: 100, critMin: 20, critMax: 150 },
      { name: 'LDL (Bad Cholesterol)', unit: 'mg/dL', referenceRange: '< 100', min: 0, max: 100, critMin: 0, critMax: 250 },
      { name: 'Triglycerides', unit: 'mg/dL', referenceRange: '< 150', min: 0, max: 150, critMin: 0, critMax: 500 },
    ],
  },
  {
    category: 'Radiology',
    name: 'Chest X-Ray PA & Lateral View',
    specimen: 'None (Digital Radiography)',
    parameters: [
      { name: 'Cardiothoracic Ratio (CTR)', unit: '%', referenceRange: '< 50%', min: 0, max: 50, critMin: 0, critMax: 65 },
      { name: 'Lung Field Clarification', unit: 'Status', referenceRange: 'Clear bilateral lung fields', min: 0, max: 0, critMin: 0, critMax: 0 },
    ],
  },
];

export default function DiagnosticLabModal({
  isOpen,
  onClose,
  patient,
  currentUserRole = 'Doctor',
  initialOrder = null,
}) {
  const { showSuccess, showError } = useToast();
  const [activeTab, setActiveTab] = useState(initialOrder ? 'report' : 'order'); // 'order', 'results', 'report'

  // Order state
  const [selectedTemplate, setSelectedTemplate] = useState(TEST_TEMPLATES[0].name);
  const [priority, setPriority] = useState('Routine');
  const [clinicalImpression, setClinicalImpression] = useState('');
  const [loading, setLoading] = useState(false);

  // Result entry state
  const [selectedOrder, setSelectedOrder] = useState(initialOrder);
  const [editableParams, setEditableParams] = useState([]);
  const [resultImpression, setResultImpression] = useState('');
  const [patientOrders, setPatientOrders] = useState([]);

  useEffect(() => {
    if (patient && isOpen) {
      fetchPatientDiagnostics();
    }
    if (initialOrder) {
      setSelectedOrder(initialOrder);
      setEditableParams(initialOrder.parameters || []);
      setResultImpression(initialOrder.clinicalImpression || '');
      setActiveTab('report');
    }
  }, [patient, isOpen, initialOrder]);

  const fetchPatientDiagnostics = async () => {
    if (!patient?._id) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(getApiUrl(`/api/v1/diagnostics/patient/${patient._id}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setPatientOrders(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const template = TEST_TEMPLATES.find((t) => t.name === selectedTemplate) || TEST_TEMPLATES[0];
      const token = localStorage.getItem('token');

      const res = await fetch(getApiUrl('/api/v1/diagnostics/order'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patientId: patient._id,
          testCategory: template.category,
          testName: template.name,
          specimen: template.specimen,
          priority,
          clinicalImpression,
          parameters: template.parameters.map((p) => ({
            name: p.name,
            value: '',
            unit: p.unit,
            referenceRange: p.referenceRange,
            flag: 'NORMAL',
          })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        showSuccess(`Diagnostic order for ${template.name} created!`);
        fetchPatientDiagnostics();
        setSelectedOrder(data.data);
        setEditableParams(data.data.parameters || []);
        setActiveTab(currentUserRole === 'Doctor' ? 'history' : 'results');
      } else {
        showError(data.message || 'Failed to order test');
      }
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleParamValueChange = (index, val) => {
    const next = [...editableParams];
    next[index].value = val;

    // Automatic flag calculation based on numeric bounds
    const numVal = parseFloat(val);
    const template = TEST_TEMPLATES.flatMap((t) => t.parameters).find(
      (p) => p.name.toLowerCase() === next[index].name.toLowerCase()
    );

    if (!isNaN(numVal) && template) {
      if (template.critMax && numVal >= template.critMax) next[index].flag = 'CRITICAL_HIGH';
      else if (template.critMin && numVal <= template.critMin) next[index].flag = 'CRITICAL_LOW';
      else if (template.max && numVal > template.max) next[index].flag = 'HIGH';
      else if (template.min && numVal < template.min) next[index].flag = 'LOW';
      else next[index].flag = 'NORMAL';
    } else {
      next[index].flag = 'NORMAL';
    }

    setEditableParams(next);
  };

  const handleSaveResults = async () => {
    if (!selectedOrder) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(getApiUrl(`/api/v1/diagnostics/${selectedOrder._id}/results`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          parameters: editableParams,
          clinicalImpression: resultImpression,
          status: 'Completed',
        }),
      });

      const data = await res.json();
      if (data.success) {
        showSuccess('Diagnostic test results saved & published!');
        setSelectedOrder(data.data);
        fetchPatientDiagnostics();
        setActiveTab('report');
      } else {
        showError(data.message || 'Failed to save results');
      }
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-3xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FlaskConical size={22} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                Diagnostic Pathology & Imaging Hub
              </h2>
              <p className="text-xs text-[var(--text-tertiary)]">
                Patient: <span className="font-bold text-[var(--text-primary)]">{patient?.name}</span> ({patient?.patientId})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'report' && (
              <button
                onClick={() => window.print()}
                className="btn btn-secondary btn-sm flex items-center gap-1.5 cursor-pointer"
                title="Print Lab Report"
              >
                <Printer size={15} />
                <span className="hidden sm:inline">Print Report</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-[var(--border-color)] bg-[var(--bg-primary)] no-print text-xs font-semibold overflow-x-auto">
          {currentUserRole !== 'Patient' && (
            <button
              onClick={() => setActiveTab('order')}
              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'order'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Order New Test
            </button>
          )}

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Test History ({patientOrders.length})
          </button>

          {selectedOrder && currentUserRole !== 'Patient' && (
            <button
              onClick={() => setActiveTab('results')}
              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'results'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Enter / Edit Results
            </button>
          )}

          {selectedOrder && (
            <button
              onClick={() => setActiveTab('report')}
              className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'report'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Diagnostic Report Slip
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: Order New Diagnostic Test */}
          {activeTab === 'order' && (
            <form onSubmit={handleCreateOrder} className="space-y-4 max-w-xl mx-auto">
              <div className="form-group">
                <label className="form-label">Select Standard Clinical Panel</label>
                <select
                  className="form-control w-full font-bold"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                  {TEST_TEMPLATES.map((t) => (
                    <option key={t.name} value={t.name}>
                      [{t.category}] {t.name} &bull; {t.specimen}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Clinical Urgency Priority</label>
                  <select
                    className="form-control w-full font-semibold"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="Routine">Routine (Standard Turnaround)</option>
                    <option value="Urgent">Urgent (Within 4 Hours)</option>
                    <option value="STAT (Emergency)">STAT / Emergency (Immediate Processing)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Target Specimen</label>
                  <input
                    type="text"
                    className="form-control w-full bg-[var(--bg-tertiary)]"
                    value={TEST_TEMPLATES.find((t) => t.name === selectedTemplate)?.specimen || ''}
                    disabled
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Clinical Indication / Reason for Order</label>
                <textarea
                  className="form-control w-full"
                  rows={3}
                  placeholder="e.g. Suspected microcytic anemia, routine pre-op workup..."
                  value={clinicalImpression}
                  onChange={(e) => setClinicalImpression(e.target.value)}
                />
              </div>

              <div className="pt-3 border-t border-[var(--border-color)] flex justify-end gap-3">
                <button type="button" onClick={onClose} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex items-center gap-2" disabled={loading}>
                  <FlaskConical size={16} />
                  <span>{loading ? 'Submitting Order...' : 'Submit Diagnostic Order'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Test History List */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {patientOrders.length === 0 ? (
                <div className="text-center py-12 text-[var(--text-tertiary)]">
                  <FlaskConical size={36} className="mx-auto mb-2 opacity-40" />
                  <p>No diagnostic lab or radiology orders on file for this patient.</p>
                </div>
              ) : (
                patientOrders.map((order) => (
                  <div
                    key={order._id}
                    className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-indigo-500/40 flex items-center justify-between gap-3 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[var(--text-primary)]">{order.testName}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            order.status === 'Completed'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : 'bg-amber-500/10 text-amber-600'
                          }`}
                        >
                          {order.status}
                        </span>
                        {order.priority.includes('STAT') && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white text-[10px] font-bold">
                            STAT
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[var(--text-tertiary)] mt-1">
                        Order #{order.orderNumber} &bull; Ordered by {order.doctorName} &bull;{' '}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.status !== 'Completed' && currentUserRole !== 'Patient' && (
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setEditableParams(order.parameters || []);
                            setResultImpression(order.clinicalImpression || '');
                            setActiveTab('results');
                          }}
                          className="btn btn-secondary btn-sm text-xs"
                        >
                          Enter Results
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setActiveTab('report');
                        }}
                        className="btn btn-primary btn-sm text-xs flex items-center gap-1"
                      >
                        <FileText size={14} />
                        <span>View Slip</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: Enter / Validate Results */}
          {activeTab === 'results' && selectedOrder && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold">{selectedOrder.testName}</span> &bull; Order #{selectedOrder.orderNumber}
                </div>
                <span className="text-[var(--text-secondary)]">{selectedOrder.specimen}</span>
              </div>

              <div className="border border-[var(--border-color)] rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] text-[var(--text-secondary)] font-bold">
                    <tr>
                      <th className="p-2.5">Parameter Test</th>
                      <th className="p-2.5 w-32">Observed Value</th>
                      <th className="p-2.5">Unit</th>
                      <th className="p-2.5">Biological Reference Range</th>
                      <th className="p-2.5 text-center">Status Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {editableParams.map((param, i) => (
                      <tr key={i} className="hover:bg-[var(--bg-tertiary)]/50">
                        <td className="p-2.5 font-bold text-[var(--text-primary)]">{param.name}</td>
                        <td className="p-2.5">
                          <input
                            type="text"
                            className="form-control w-full text-xs font-mono font-bold"
                            placeholder="Value"
                            value={param.value}
                            onChange={(e) => handleParamValueChange(i, e.target.value)}
                          />
                        </td>
                        <td className="p-2.5 text-[var(--text-tertiary)]">{param.unit}</td>
                        <td className="p-2.5 text-[var(--text-secondary)] font-mono">{param.referenceRange}</td>
                        <td className="p-2.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              param.flag === 'NORMAL'
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : param.flag.includes('CRITICAL')
                                ? 'bg-rose-500 text-white animate-pulse'
                                : 'bg-amber-500/10 text-amber-600'
                            }`}
                          >
                            {param.flag.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="form-group">
                <label className="form-label">Pathologist / Radiologist Diagnostic Impression</label>
                <textarea
                  className="form-control w-full text-xs"
                  rows={3}
                  placeholder="Final impression, morphological findings, or imaging interpretation..."
                  value={resultImpression}
                  onChange={(e) => setResultImpression(e.target.value)}
                />
              </div>

              <div className="pt-3 border-t border-[var(--border-color)] flex justify-end gap-3">
                <button type="button" onClick={() => setActiveTab('history')} className="btn btn-secondary">
                  Back to List
                </button>
                <button
                  type="button"
                  onClick={handleSaveResults}
                  className="btn btn-primary flex items-center gap-2"
                  disabled={loading}
                >
                  <CheckCircle size={16} />
                  <span>{loading ? 'Saving Results...' : 'Verify & Publish Report'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Formatted Diagnostic Report Slip (Print-Ready) */}
          {activeTab === 'report' && selectedOrder && (
            <div className="p-6 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-sm print:p-0 print:border-none">
              
              {/* Slip Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4 mb-4">
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight text-slate-950">
                    ST. JUDE INTERNATIONAL MEDICAL CENTER
                  </h1>
                  <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold mt-0.5">
                    Department of Pathology & Clinical Diagnostics
                  </p>
                  <p className="text-[11px] text-slate-500">ISO 15189 Certified Clinical Laboratory</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-indigo-700 font-mono">
                    {selectedOrder.orderNumber}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Patient & Doctor Demographics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs mb-5">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Patient Name</span>
                  <span className="font-bold text-slate-900">{selectedOrder.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Gender / Blood</span>
                  <span className="font-bold text-slate-900">
                    {patient?.gender || 'N/A'} ({patient?.bloodGroup || 'O+'})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Attending Doctor</span>
                  <span className="font-bold text-slate-900">{selectedOrder.doctorName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Specimen</span>
                  <span className="font-bold text-slate-900">{selectedOrder.specimen}</span>
                </div>
              </div>

              {/* Investigation Title Banner */}
              <div className="mb-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase border-b border-slate-300 pb-1">
                  Investigation: {selectedOrder.testName}
                </h3>
              </div>

              {/* Results Table */}
              <table className="w-full text-xs text-left mb-6 border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-700 font-bold bg-slate-100">
                    <th className="py-2 px-2">Investigation Parameter</th>
                    <th className="py-2 px-2">Observed Value</th>
                    <th className="py-2 px-2">Unit</th>
                    <th className="py-2 px-2">Biological Reference Interval</th>
                    <th className="py-2 px-2 text-center">Status Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedOrder.parameters?.map((p, i) => (
                    <tr key={i} className={p.flag !== 'NORMAL' ? 'bg-amber-50/50' : ''}>
                      <td className="py-2 px-2 font-medium">{p.name}</td>
                      <td className="py-2 px-2 font-bold font-mono text-slate-950">
                        {p.value || 'Pending'}
                      </td>
                      <td className="py-2 px-2 text-slate-500">{p.unit}</td>
                      <td className="py-2 px-2 font-mono text-slate-600">{p.referenceRange}</td>
                      <td className="py-2 px-2 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.flag === 'NORMAL'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.flag.includes('CRITICAL')
                              ? 'bg-rose-600 text-white font-black'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.flag}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Diagnostic Interpretation Notes */}
              {selectedOrder.clinicalImpression && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs mb-8">
                  <span className="font-bold text-slate-900 block mb-1">Clinical Diagnostic Impression:</span>
                  <p className="text-slate-700 leading-relaxed">{selectedOrder.clinicalImpression}</p>
                </div>
              )}

              {/* Signatures & Accreditation Footer */}
              <div className="pt-6 border-t border-slate-300 flex items-center justify-between text-xs text-slate-600">
                <div>
                  <p className="font-semibold">Report Generated: {new Date().toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400">Electronic Verification &bull; Hospital Information System</p>
                </div>

                <div className="text-center">
                  <div className="h-8 font-serif italic text-slate-700 font-bold border-b border-slate-400 px-6">
                    {selectedOrder.technicianName || 'Dr. H. Vance, FRCPath'}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 mt-1 block">
                    Chief Consultant Pathologist
                  </span>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
