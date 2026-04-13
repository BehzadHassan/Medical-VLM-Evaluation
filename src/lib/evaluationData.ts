// ============================================================
// Real evaluation metrics extracted from public/Evaluation_reports/
// ============================================================

export interface ClassMetrics {
  className: string;
  n: number;
  precision: number;
  recall: number;
  f1: number;
  aucRoc?: number;
  top3Acc?: number;
}

export interface AggregateMetrics {
  precision: number;
  recall: number;
  f1: number;
  aucRoc?: number;
  top3Acc?: number;
}

export interface ModalityResult {
  modality: 'CXR' | 'CT' | 'MRI';
  numClasses: number;
  numImages: number;
  classes: ClassMetrics[];
  macroAvg: AggregateMetrics;
  weightedAvg: AggregateMetrics;
  overallAccuracy: number;
  top3Accuracy?: number;
}

export interface ModelEvaluation {
  modelName: string;
  modalities: ModalityResult[];
}

// --------------- BioMedCLIP ---------------
const biomedClip: ModelEvaluation = {
  modelName: 'BioMedCLIP',
  modalities: [
    {
      modality: 'CXR',
      numClasses: 8,
      numImages: 71,
      classes: [
        { className: 'Normal', n: 16, precision: 0.71, recall: 0.75, f1: 0.73, aucRoc: 0.86, top3Acc: 0.94 },
        { className: 'Tuberculosis', n: 14, precision: 0.67, recall: 0.71, f1: 0.69, aucRoc: 0.88, top3Acc: 0.93 },
        { className: 'Pneumonia', n: 11, precision: 0.55, recall: 0.55, f1: 0.55, aucRoc: 0.79, top3Acc: 0.82 },
        { className: 'COVID-19', n: 9, precision: 0.50, recall: 0.44, f1: 0.47, aucRoc: 0.75, top3Acc: 0.78 },
        { className: 'Lung Cancer', n: 6, precision: 0.43, recall: 0.50, f1: 0.46, aucRoc: 0.87, top3Acc: 0.83 },
        { className: 'Pneumothorax', n: 5, precision: 0.40, recall: 0.40, f1: 0.40, aucRoc: 0.73, top3Acc: 0.80 },
        { className: 'Edema', n: 6, precision: 0.40, recall: 0.33, f1: 0.36, aucRoc: 0.77, top3Acc: 0.67 },
        { className: 'Consolidation', n: 4, precision: 0.33, recall: 0.25, f1: 0.29, aucRoc: 0.63, top3Acc: 0.50 },
      ],
      macroAvg: { precision: 0.50, recall: 0.49, f1: 0.49, aucRoc: 0.78, top3Acc: 0.83 },
      weightedAvg: { precision: 0.56, recall: 0.56, f1: 0.56, aucRoc: 0.81, top3Acc: 0.83 },
      overallAccuracy: 0.56,
      top3Accuracy: 0.83,
    },
    {
      modality: 'CT',
      numClasses: 9,
      numImages: 51,
      classes: [
        { className: 'Pneumonia', n: 10, precision: 0.55, recall: 0.60, f1: 0.57, aucRoc: 0.76, top3Acc: 0.80 },
        { className: 'Normal', n: 6, precision: 0.60, recall: 0.50, f1: 0.55, aucRoc: 0.85, top3Acc: 0.83 },
        { className: 'Lung Cancer', n: 7, precision: 0.43, recall: 0.43, f1: 0.43, aucRoc: 0.72, top3Acc: 0.71 },
        { className: 'COVID-19', n: 5, precision: 0.40, recall: 0.40, f1: 0.40, aucRoc: 0.68, top3Acc: 0.80 },
        { className: 'Consolidation', n: 5, precision: 0.40, recall: 0.40, f1: 0.40, aucRoc: 0.74, top3Acc: 0.80 },
        { className: 'Pneumothorax', n: 5, precision: 0.33, recall: 0.40, f1: 0.36, aucRoc: 0.83, top3Acc: 0.80 },
        { className: 'Edema', n: 5, precision: 0.33, recall: 0.40, f1: 0.36, aucRoc: 0.63, top3Acc: 0.60 },
        { className: 'Atelectasis', n: 4, precision: 0.33, recall: 0.25, f1: 0.29, aucRoc: 0.68, top3Acc: 0.50 },
        { className: 'Tuberculosis', n: 4, precision: 0.33, recall: 0.25, f1: 0.29, aucRoc: 0.61, top3Acc: 0.50 },
      ],
      macroAvg: { precision: 0.41, recall: 0.40, f1: 0.40, aucRoc: 0.72, top3Acc: 0.73 },
      weightedAvg: { precision: 0.43, recall: 0.43, f1: 0.43, aucRoc: 0.73, top3Acc: 0.73 },
      overallAccuracy: 0.43,
      top3Accuracy: 0.73,
    },
    {
      modality: 'MRI',
      numClasses: 4,
      numImages: 68,
      classes: [
        { className: 'No Tumor', n: 17, precision: 0.59, recall: 0.59, f1: 0.59, aucRoc: 0.71, top3Acc: 0.88 },
        { className: 'Glioma', n: 17, precision: 0.47, recall: 0.47, f1: 0.47, aucRoc: 0.56, top3Acc: 0.76 },
        { className: 'Meningioma', n: 17, precision: 0.38, recall: 0.35, f1: 0.36, aucRoc: 0.49, top3Acc: 0.71 },
        { className: 'Pituitary', n: 17, precision: 0.39, recall: 0.41, f1: 0.40, aucRoc: 0.62, top3Acc: 0.76 },
      ],
      macroAvg: { precision: 0.46, recall: 0.46, f1: 0.46, aucRoc: 0.59, top3Acc: 0.78 },
      weightedAvg: { precision: 0.46, recall: 0.46, f1: 0.46, aucRoc: 0.59, top3Acc: 0.78 },
      overallAccuracy: 0.46,
      top3Accuracy: 0.78,
    },
  ],
};

// --------------- UniMedCLIP ---------------
const unimedClip: ModelEvaluation = {
  modelName: 'UniMedCLIP',
  modalities: [
    {
      modality: 'CXR',
      numClasses: 8,
      numImages: 71,
      classes: [
        { className: 'Normal', n: 16, precision: 0.75, recall: 0.75, f1: 0.75, aucRoc: 0.90, top3Acc: 0.88 },
        { className: 'Tuberculosis', n: 14, precision: 0.67, recall: 0.71, f1: 0.69, aucRoc: 0.87, top3Acc: 0.86 },
        { className: 'Pneumonia', n: 11, precision: 0.55, recall: 0.55, f1: 0.55, aucRoc: 0.82, top3Acc: 0.73 },
        { className: 'COVID-19', n: 9, precision: 0.50, recall: 0.44, f1: 0.47, aucRoc: 0.69, top3Acc: 0.67 },
        { className: 'Lung Cancer', n: 6, precision: 0.60, recall: 0.50, f1: 0.55, aucRoc: 0.73, top3Acc: 0.67 },
        { className: 'Pneumothorax', n: 5, precision: 0.50, recall: 0.40, f1: 0.44, aucRoc: 0.68, top3Acc: 0.60 },
        { className: 'Edema', n: 6, precision: 0.60, recall: 0.50, f1: 0.55, aucRoc: 0.75, top3Acc: 0.67 },
        { className: 'Consolidation', n: 4, precision: 0.43, recall: 0.75, f1: 0.55, aucRoc: 0.86, top3Acc: 0.75 },
      ],
      macroAvg: { precision: 0.57, recall: 0.58, f1: 0.57, aucRoc: 0.79, top3Acc: 0.76 },
      weightedAvg: { precision: 0.61, recall: 0.61, f1: 0.60, aucRoc: 0.81, top3Acc: 0.76 },
      overallAccuracy: 0.61,
      top3Accuracy: 0.76,
    },
    {
      modality: 'CT',
      numClasses: 9,
      numImages: 51,
      classes: [
        { className: 'Pneumonia', n: 10, precision: 0.60, recall: 0.60, f1: 0.60, aucRoc: 0.74, top3Acc: 0.80 },
        { className: 'Normal', n: 6, precision: 0.60, recall: 0.50, f1: 0.55, aucRoc: 0.73, top3Acc: 0.67 },
        { className: 'Lung Cancer', n: 7, precision: 0.43, recall: 0.43, f1: 0.43, aucRoc: 0.71, top3Acc: 0.71 },
        { className: 'COVID-19', n: 5, precision: 0.75, recall: 0.60, f1: 0.67, aucRoc: 0.86, top3Acc: 0.80 },
        { className: 'Consolidation', n: 5, precision: 0.50, recall: 0.60, f1: 0.55, aucRoc: 0.83, top3Acc: 0.80 },
        { className: 'Pneumothorax', n: 5, precision: 0.50, recall: 0.60, f1: 0.55, aucRoc: 0.87, top3Acc: 0.80 },
        { className: 'Edema', n: 5, precision: 0.75, recall: 0.60, f1: 0.67, aucRoc: 0.85, top3Acc: 0.80 },
        { className: 'Atelectasis', n: 4, precision: 0.50, recall: 0.50, f1: 0.50, aucRoc: 0.71, top3Acc: 0.75 },
        { className: 'Tuberculosis', n: 4, precision: 0.40, recall: 0.50, f1: 0.44, aucRoc: 0.85, top3Acc: 0.75 },
      ],
      macroAvg: { precision: 0.56, recall: 0.55, f1: 0.55, aucRoc: 0.79, top3Acc: 0.76 },
      weightedAvg: { precision: 0.56, recall: 0.55, f1: 0.55, aucRoc: 0.79, top3Acc: 0.76 },
      overallAccuracy: 0.55,
      top3Accuracy: 0.76,
    },
    {
      modality: 'MRI',
      numClasses: 4,
      numImages: 68,
      classes: [
        { className: 'No Tumor', n: 17, precision: 0.62, recall: 0.59, f1: 0.61, aucRoc: 0.75, top3Acc: 0.82 },
        { className: 'Glioma', n: 17, precision: 0.56, recall: 0.59, f1: 0.57, aucRoc: 0.68, top3Acc: 0.82 },
        { className: 'Meningioma', n: 17, precision: 0.41, recall: 0.41, f1: 0.41, aucRoc: 0.60, top3Acc: 0.71 },
        { className: 'Pituitary', n: 17, precision: 0.59, recall: 0.59, f1: 0.59, aucRoc: 0.71, top3Acc: 0.76 },
      ],
      macroAvg: { precision: 0.55, recall: 0.54, f1: 0.54, aucRoc: 0.68, top3Acc: 0.78 },
      weightedAvg: { precision: 0.55, recall: 0.54, f1: 0.54, aucRoc: 0.68, top3Acc: 0.78 },
      overallAccuracy: 0.54,
      top3Accuracy: 0.78,
    },
  ],
};

// --------------- ChexAgent (CXR only) ---------------
const chexAgent: ModelEvaluation = {
  modelName: 'Chex Agent',
  modalities: [
    {
      modality: 'CXR',
      numClasses: 8,
      numImages: 71,
      classes: [
        { className: 'Normal', n: 16, precision: 0.82, recall: 0.88, f1: 0.85 },
        { className: 'Tuberculosis', n: 14, precision: 1.00, recall: 0.79, f1: 0.88 },
        { className: 'Pneumonia', n: 11, precision: 0.73, recall: 0.73, f1: 0.73 },
        { className: 'COVID-19', n: 9, precision: 0.60, recall: 0.67, f1: 0.63 },
        { className: 'Lung Cancer', n: 6, precision: 0.57, recall: 0.67, f1: 0.62 },
        { className: 'Pneumothorax', n: 5, precision: 0.60, recall: 0.60, f1: 0.60 },
        { className: 'Edema', n: 6, precision: 0.60, recall: 0.50, f1: 0.55 },
        { className: 'Consolidation', n: 4, precision: 0.40, recall: 0.50, f1: 0.44 },
      ],
      macroAvg: { precision: 0.67, recall: 0.67, f1: 0.66 },
      weightedAvg: { precision: 0.74, recall: 0.72, f1: 0.72 },
      overallAccuracy: 0.72,
    },
  ],
};

// --------------- LLaVA-Med v1.5 ---------------
const llavaMed: ModelEvaluation = {
  modelName: 'LLaVA-Med v1.5',
  modalities: [
    {
      modality: 'CXR',
      numClasses: 8,
      numImages: 71,
      classes: [
        { className: 'Normal', n: 16, precision: 0.81, recall: 0.81, f1: 0.81 },
        { className: 'Tuberculosis', n: 14, precision: 0.91, recall: 0.71, f1: 0.80 },
        { className: 'Pneumonia', n: 11, precision: 0.64, recall: 0.64, f1: 0.64 },
        { className: 'COVID-19', n: 9, precision: 0.42, recall: 0.56, f1: 0.48 },
        { className: 'Lung Cancer', n: 6, precision: 0.60, recall: 0.50, f1: 0.55 },
        { className: 'Pneumothorax', n: 5, precision: 0.60, recall: 0.60, f1: 0.60 },
        { className: 'Edema', n: 6, precision: 0.50, recall: 0.50, f1: 0.50 },
        { className: 'Consolidation', n: 4, precision: 0.40, recall: 0.50, f1: 0.44 },
      ],
      macroAvg: { precision: 0.61, recall: 0.60, f1: 0.60 },
      weightedAvg: { precision: 0.67, recall: 0.65, f1: 0.66 },
      overallAccuracy: 0.65,
    },
    {
      modality: 'CT',
      numClasses: 9,
      numImages: 51,
      classes: [
        { className: 'Pneumonia', n: 10, precision: 0.60, recall: 0.60, f1: 0.60 },
        { className: 'Normal', n: 6, precision: 0.60, recall: 0.50, f1: 0.55 },
        { className: 'Lung Cancer', n: 7, precision: 0.50, recall: 0.57, f1: 0.53 },
        { className: 'COVID-19', n: 5, precision: 0.50, recall: 0.40, f1: 0.44 },
        { className: 'Consolidation', n: 5, precision: 0.40, recall: 0.40, f1: 0.40 },
        { className: 'Pneumothorax', n: 5, precision: 0.40, recall: 0.40, f1: 0.40 },
        { className: 'Edema', n: 5, precision: 0.40, recall: 0.40, f1: 0.40 },
        { className: 'Atelectasis', n: 4, precision: 0.29, recall: 0.50, f1: 0.36 },
        { className: 'Tuberculosis', n: 4, precision: 1.00, recall: 0.50, f1: 0.67 },
      ],
      macroAvg: { precision: 0.52, recall: 0.47, f1: 0.48 },
      weightedAvg: { precision: 0.52, recall: 0.49, f1: 0.50 },
      overallAccuracy: 0.49,
    },
    {
      modality: 'MRI',
      numClasses: 4,
      numImages: 68,
      classes: [
        { className: 'No Tumor', n: 17, precision: 0.67, recall: 0.71, f1: 0.69 },
        { className: 'Glioma', n: 17, precision: 0.44, recall: 0.47, f1: 0.46 },
        { className: 'Meningioma', n: 17, precision: 0.35, recall: 0.35, f1: 0.35 },
        { className: 'Pituitary', n: 17, precision: 0.67, recall: 0.59, f1: 0.62 },
      ],
      macroAvg: { precision: 0.53, recall: 0.53, f1: 0.53 },
      weightedAvg: { precision: 0.53, recall: 0.53, f1: 0.53 },
      overallAccuracy: 0.53,
    },
  ],
};

// --------------- MedGemma ---------------
const medGemma: ModelEvaluation = {
  modelName: 'MedGemma',
  modalities: [
    {
      modality: 'CXR',
      numClasses: 8,
      numImages: 71,
      classes: [
        { className: 'Normal', n: 17, precision: 0.76, recall: 0.76, f1: 0.76 },
        { className: 'Tuberculosis', n: 12, precision: 0.73, recall: 0.67, f1: 0.70 },
        { className: 'Pneumonia', n: 11, precision: 0.64, recall: 0.64, f1: 0.64 },
        { className: 'COVID-19', n: 10, precision: 0.55, recall: 0.60, f1: 0.57 },
        { className: 'Lung Cancer', n: 6, precision: 0.50, recall: 0.50, f1: 0.50 },
        { className: 'Pneumothorax', n: 5, precision: 0.60, recall: 0.60, f1: 0.60 },
        { className: 'Edema', n: 6, precision: 0.50, recall: 0.50, f1: 0.50 },
        { className: 'Consolidation', n: 4, precision: 0.50, recall: 0.50, f1: 0.50 },
      ],
      macroAvg: { precision: 0.60, recall: 0.60, f1: 0.60 },
      weightedAvg: { precision: 0.64, recall: 0.63, f1: 0.63 },
      overallAccuracy: 0.63,
    },
    {
      modality: 'CT',
      numClasses: 9,
      numImages: 51,
      classes: [
        { className: 'Pneumonia', n: 10, precision: 0.62, recall: 0.50, f1: 0.56 },
        { className: 'Normal', n: 6, precision: 0.43, recall: 1.00, f1: 0.60 },
        { className: 'Lung Cancer', n: 7, precision: 0.67, recall: 0.29, f1: 0.40 },
        { className: 'COVID-19', n: 5, precision: 0.50, recall: 0.40, f1: 0.44 },
        { className: 'Consolidation', n: 5, precision: 0.40, recall: 0.40, f1: 0.40 },
        { className: 'Pneumothorax', n: 5, precision: 0.50, recall: 0.40, f1: 0.44 },
        { className: 'Edema', n: 5, precision: 0.50, recall: 0.40, f1: 0.44 },
        { className: 'Atelectasis', n: 4, precision: 0.57, recall: 1.00, f1: 0.73 },
        { className: 'Tuberculosis', n: 4, precision: 1.00, recall: 0.50, f1: 0.67 },
      ],
      macroAvg: { precision: 0.58, recall: 0.54, f1: 0.52 },
      weightedAvg: { precision: 0.57, recall: 0.53, f1: 0.51 },
      overallAccuracy: 0.53,
    },
    {
      modality: 'MRI',
      numClasses: 4,
      numImages: 68,
      classes: [
        { className: 'No Tumor', n: 17, precision: 0.71, recall: 0.71, f1: 0.71 },
        { className: 'Pituitary', n: 17, precision: 0.62, recall: 0.59, f1: 0.61 },
        { className: 'Glioma', n: 17, precision: 0.56, recall: 0.59, f1: 0.57 },
        { className: 'Meningioma', n: 17, precision: 0.35, recall: 0.35, f1: 0.35 },
      ],
      macroAvg: { precision: 0.56, recall: 0.56, f1: 0.56 },
      weightedAvg: { precision: 0.56, recall: 0.56, f1: 0.56 },
      overallAccuracy: 0.56,
    },
  ],
};

// --------------- All models ---------------
export const ALL_MODEL_EVALUATIONS: ModelEvaluation[] = [
  medGemma,
  llavaMed,
  chexAgent,
  biomedClip,
  unimedClip,
];

export type ModalityFilter = 'All Modalities' | 'CXR' | 'CT' | 'MRI';
export const MODALITY_FILTERS: ModalityFilter[] = ['All Modalities', 'CXR', 'CT', 'MRI'];

/** Get a model's result for a specific modality, or undefined if not available */
export function getModalityResult(model: ModelEvaluation, modality: 'CXR' | 'CT' | 'MRI'): ModalityResult | undefined {
  return model.modalities.find(m => m.modality === modality);
}

/** Get aggregate scores for a model across all its available modalities (simple average) */
export function getAggregateScores(model: ModelEvaluation) {
  const mods = model.modalities;
  const count = mods.length;
  return {
    accuracy: mods.reduce((s, m) => s + m.overallAccuracy, 0) / count,
    precision: mods.reduce((s, m) => s + m.weightedAvg.precision, 0) / count,
    recall: mods.reduce((s, m) => s + m.weightedAvg.recall, 0) / count,
    f1: mods.reduce((s, m) => s + m.weightedAvg.f1, 0) / count,
  };
}

/** Get scores for a model for a given filter (single modality or aggregate) */
export function getScoresForFilter(model: ModelEvaluation, filter: ModalityFilter) {
  if (filter === 'All Modalities') {
    return getAggregateScores(model);
  }
  const result = getModalityResult(model, filter);
  if (!result) return null; // model doesn't support this modality
  return {
    accuracy: result.overallAccuracy,
    precision: result.weightedAvg.precision,
    recall: result.weightedAvg.recall,
    f1: result.weightedAvg.f1,
  };
}
