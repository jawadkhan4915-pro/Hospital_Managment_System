/**
 * Clinical Decision Support System (CDSS) Service
 * Provides automated Drug-Drug Interaction (DDI), Allergy Contraindication,
 * and Clinical Safety Rule evaluation for the Hospital Management System.
 */

// Common drug interactions catalog with severity, mechanism, and recommendations
const DRUG_INTERACTION_RULES = [
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

// Allergy cross-reactivity mapping
const ALLERGY_MAPPINGS = [
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

class CdssService {
  /**
   * Evaluates prescribed medications against drug-drug interactions and patient allergies
   * @param {Object} params
   * @param {Array<Object|string>} params.medications - List of prescribed medicine objects or names
   * @param {Array<string>} params.patientAllergies - List of documented patient allergies
   * @param {Array<string>} [params.chronicConditions] - Optional list of chronic illnesses
   * @returns {Object} Evaluation report containing warnings, count, and overall safety status
   */
  evaluatePrescriptionSafety({ medications = [], patientAllergies = [], chronicConditions = [] }) {
    const warnings = [];

    // Normalize drug names to lowercase strings
    const drugNames = medications.map((med) => {
      const name = typeof med === 'string' ? med : med.medicineName || med.name || '';
      return name.toLowerCase().trim();
    }).filter(Boolean);

    // Normalize allergies
    const normalizedAllergies = (patientAllergies || []).map((a) => a.toLowerCase().trim()).filter(Boolean);

    // 1. Check Drug-Drug Interactions (DDI)
    for (const rule of DRUG_INTERACTION_RULES) {
      const matchCount = rule.drugs.filter((ruleDrug) =>
        drugNames.some((d) => d.includes(ruleDrug) || ruleDrug.includes(d))
      ).length;

      if (matchCount >= 2) {
        warnings.push({
          type: 'DRUG_DRUG_INTERACTION',
          severity: rule.severity,
          title: rule.title,
          drugsInvolved: rule.drugs,
          mechanism: rule.mechanism,
          recommendation: rule.recommendation,
        });
      }
    }

    // 2. Check Patient Allergies
    for (const allergyRule of ALLERGY_MAPPINGS) {
      const patientHasAllergy = normalizedAllergies.some((a) =>
        a.includes(allergyRule.allergy) || allergyRule.allergy.includes(a)
      );

      if (patientHasAllergy) {
        const conflictingDrugs = drugNames.filter((d) =>
          allergyRule.contraindicatedDrugs.some((cd) => d.includes(cd) || cd.includes(d))
        );

        if (conflictingDrugs.length > 0) {
          warnings.push({
            type: 'ALLERGY_CONTRAINDICATION',
            severity: allergyRule.severity,
            title: `Allergy Alert: ${allergyRule.title}`,
            allergen: allergyRule.allergy,
            drugsInvolved: conflictingDrugs,
            mechanism: allergyRule.mechanism,
            recommendation: allergyRule.recommendation,
          });
        }
      }
    }

    // Determine overall safety level
    const hasCritical = warnings.some((w) => w.severity === 'CRITICAL');
    const hasHigh = warnings.some((w) => w.severity === 'HIGH');
    const hasModerate = warnings.some((w) => w.severity === 'MODERATE');

    let overallStatus = 'SAFE';
    if (hasCritical) overallStatus = 'CRITICAL_RISK';
    else if (hasHigh) overallStatus = 'HIGH_RISK';
    else if (hasModerate) overallStatus = 'CAUTION_REQUIRED';

    return {
      success: true,
      overallStatus,
      warningsCount: warnings.length,
      requiresOverrideAcknowledgement: hasCritical || hasHigh,
      warnings,
      evaluatedAt: new Date(),
    };
  }
}

export default new CdssService();
