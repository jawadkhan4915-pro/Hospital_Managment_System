/**
 * Client-Side Clinical Decision Support System (CDSS) Engine
 * Evaluates drug interactions, allergy contraindications, and clinical safety
 * in real-time within the Doctor's prescription composer.
 */

export const DRUG_INTERACTIONS = [
  {
    drugs: ['warfarin', 'aspirin'],
    severity: 'CRITICAL',
    title: 'Severe Bleeding Risk (Anticoagulant + Antiplatelet)',
    mechanism: 'Concurrent use of Warfarin and Aspirin synergistically impairs platelet aggregation and coagulation cascade, substantially increasing risk of major gastrointestinal and intracranial hemorrhage.',
    recommendation: 'Avoid combination unless specifically indicated (e.g. mechanical heart valve). If required, monitor INR closely and consider gastroprotective agent (PPI).',
  },
  {
    drugs: ['warfarin', 'ibuprofen'],
    severity: 'CRITICAL',
    title: 'High Hemorrhage Risk (Anticoagulant + NSAID)',
    mechanism: 'NSAIDs inhibit platelet COX-1 and damage gastric mucosa, multiplying Warfarin bleeding liability.',
    recommendation: 'Use Acetaminophen (Paracetamol) as preferred analgesic. Avoid systemic NSAIDs.',
  },
  {
    drugs: ['lisinopril', 'spironolactone'],
    severity: 'MODERATE',
    title: 'Hyperkalemia Warning (ACE Inhibitor + Potassium-Sparing Diuretic)',
    mechanism: 'Both agents decrease aldosterone excretion of potassium, potentially inducing life-threatening cardiac arrhythmias.',
    recommendation: 'Monitor serum potassium and creatinine within 1-2 weeks of initiation.',
  },
  {
    drugs: ['metformin', 'contrast'],
    severity: 'CRITICAL',
    title: 'Lactic Acidosis / Contrast-Induced Nephropathy',
    mechanism: 'Iodinated radiocontrast agents can cause transient renal impairment, leading to systemic accumulation of Metformin and fatal lactic acidosis.',
    recommendation: 'Withhold Metformin at time of or prior to imaging procedure; withhold for 48 hours post-procedure until renal function confirmed normal.',
  },
  {
    drugs: ['ciprofloxacin', 'theophylline'],
    severity: 'HIGH',
    title: 'Theophylline Toxicity (CYP1A2 Inhibition)',
    mechanism: 'Ciprofloxacin inhibits hepatic CYP1A2 metabolism of theophylline, raising serum levels and triggering tachycardia, seizures, or arrhythmias.',
    recommendation: 'Reduce theophylline dosage by 30-50% and monitor serum levels, or choose alternative antibiotic.',
  },
  {
    drugs: ['simvastatin', 'amiodarone'],
    severity: 'HIGH',
    title: 'Rhabdomyolysis Risk (CYP3A4 Inhibition)',
    mechanism: 'Amiodarone inhibits CYP3A4-mediated clearance of Simvastatin, increasing systemic statin exposure and risk of myopathy and acute kidney injury.',
    recommendation: 'Do not exceed Simvastatin 20mg daily when co-administered with Amiodarone, or switch to Rosuvastatin / Pravastatin.',
  },
  {
    drugs: ['methotrexate', 'ibuprofen'],
    severity: 'CRITICAL',
    title: 'Methotrexate Toxicity (Decreased Renal Clearance)',
    mechanism: 'NSAIDs decrease renal blood flow and competitive tubular secretion of Methotrexate, causing severe bone marrow suppression and hepatotoxicity.',
    recommendation: 'Avoid NSAID co-administration with moderate/high-dose Methotrexate.',
  },
  {
    drugs: ['tramadol', 'fluoxetine'],
    severity: 'HIGH',
    title: 'Serotonin Syndrome Risk',
    mechanism: 'Fluoxetine inhibits CYP2D6 and increases serotonergic tone, combining with Tramadol to risk autonomic instability, hyperreflexia, and hyperthermia.',
    recommendation: 'Avoid combination. Monitor for agitation, tremor, clonus, and diaphoresis.',
  },
  {
    drugs: ['clopidogrel', 'omeprazole'],
    severity: 'MODERATE',
    title: 'Reduced Antiplatelet Efficacy (CYP2C19 Competition)',
    mechanism: 'Omeprazole competitively inhibits CYP2C19 bioactivation of Clopidogrel to its active metabolite, increasing ischemic event risk.',
    recommendation: 'Consider Pantoprazole or H2-receptor antagonist instead of Omeprazole.',
  },
  {
    drugs: ['metoprolol', 'albuterol'],
    severity: 'MODERATE',
    title: 'Antagonistic Bronchodilation / Bronchospasm',
    mechanism: 'Beta-blockers antagonize beta-2 receptor agonists, blunting bronchodilator therapy in asthmatic or COPD patients.',
    recommendation: 'Use cardio-selective beta-1 blockers with extreme caution or alternative anti-hypertensive agents in patients with reactive airway disease.',
  },
];

export const ALLERGY_RULES = [
  {
    allergy: 'penicillin',
    contraindicatedDrugs: ['penicillin', 'amoxicillin', 'ampicillin', 'augmentin', 'piperacillin', 'methicillin'],
    severity: 'CRITICAL',
    title: 'Penicillin Hypersensitivity Cross-Reactivity',
    mechanism: 'Beta-lactam ring cross-reactivity risks immediate IgE-mediated anaphylaxis, angioedema, or severe cutaneous adverse reactions.',
    recommendation: 'Prescribe non-beta-lactam alternative (e.g. Macrolide, Fluoroquinolone, or Clindamycin).',
  },
  {
    allergy: 'sulfa',
    contraindicatedDrugs: ['bactrim', 'septra', 'sulfamethoxazole', 'sulfasalazine', 'trimethoprim-sulfamethoxazole'],
    severity: 'CRITICAL',
    title: 'Sulfonamide Antibiotic Allergy',
    mechanism: 'Cross-reaction with arylamine sulfonamide structures can provoke Stevens-Johnson syndrome (SJS) or anaphylaxis.',
    recommendation: 'Select non-sulfonamide antimicrobial.',
  },
  {
    allergy: 'aspirin',
    contraindicatedDrugs: ['aspirin', 'ibuprofen', 'naproxen', 'diclofenac', 'ketorolac', 'meloxicam'],
    severity: 'HIGH',
    title: 'NSAID / Aspirin Exacerbated Respiratory / Cutaneous Sensitivity',
    mechanism: 'COX-1 inhibition in aspirin-sensitive patients leads to leukotriene overproduction, precipitating severe bronchospasm (AERD) or urticaria.',
    recommendation: 'Substitute with Acetaminophen (Paracetamol) or consult allergy specialist.',
  },
  {
    allergy: 'codeine',
    contraindicatedDrugs: ['codeine', 'morphine', 'oxycodone', 'hydrocodone', 'tramadol'],
    severity: 'HIGH',
    title: 'Opioid Hypersensitivity',
    mechanism: 'Opiate-induced histamine release or true IgE-mediated allergy.',
    recommendation: 'Consider non-opioid analgesics or synthetic opioids under close observation.',
  },
];

/**
 * Fast client-side evaluation of prescription items against DDI & allergies
 */
export function analyzePrescriptionSafety(prescriptionItems = [], patientAllergies = []) {
  const warnings = [];

  const drugNames = prescriptionItems
    .map((item) => (typeof item === 'string' ? item : item.medicineName || item.name || ''))
    .map((s) => s.toLowerCase().trim())
    .filter(Boolean);

  const allergies = (patientAllergies || []).map((a) => a.toLowerCase().trim()).filter(Boolean);

  // 1. DDI Check
  for (const rule of DRUG_INTERACTIONS) {
    const matching = rule.drugs.filter((d) => drugNames.some((dn) => dn.includes(d) || d.includes(dn)));
    if (matching.length >= 2) {
      warnings.push({
        id: `ddi-${rule.drugs.join('-')}`,
        type: 'DDI',
        severity: rule.severity,
        title: rule.title,
        drugsInvolved: matching,
        mechanism: rule.mechanism,
        recommendation: rule.recommendation,
      });
    }
  }

  // 2. Allergy Check
  for (const rule of ALLERGY_RULES) {
    const hasAllergy = allergies.some((a) => a.includes(rule.allergy) || rule.allergy.includes(a));
    if (hasAllergy) {
      const offendingDrugs = drugNames.filter((dn) =>
        rule.contraindicatedDrugs.some((cd) => dn.includes(cd) || cd.includes(dn))
      );
      if (offendingDrugs.length > 0) {
        warnings.push({
          id: `allergy-${rule.allergy}`,
          type: 'ALLERGY',
          severity: rule.severity,
          title: `Allergy Contraindication: ${rule.title}`,
          allergen: rule.allergy,
          drugsInvolved: offendingDrugs,
          mechanism: rule.mechanism,
          recommendation: rule.recommendation,
        });
      }
    }
  }

  const hasCritical = warnings.some((w) => w.severity === 'CRITICAL');
  const hasHigh = warnings.some((w) => w.severity === 'HIGH');
  const hasModerate = warnings.some((w) => w.severity === 'MODERATE');

  return {
    warnings,
    hasWarnings: warnings.length > 0,
    hasCritical,
    hasHigh,
    hasModerate,
    requiresOverride: hasCritical || hasHigh,
  };
}
