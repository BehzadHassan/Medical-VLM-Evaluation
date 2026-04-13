# Med Gemma Evaluation Results

**This report outlines the overall metrics and class-wise performance for Med Gemma across all three modalities, following the standard evaluation template.**

## Summary

| Modality | Macro F1 |
|----------|----------|
| CXR | 0.60 |
| CT Scan | 0.52 |
| MRI | 0.56 |

---

## Modality 1 — Chest X-Ray (CXR)

**8 classes · 71 images**

| Class | N | Precision | Recall | F1 |
|-------|---|-----------|--------|-----|
| Normal | 17 | 0.76 | 0.76 | 0.76 |
| Tuberculosis | 12 | 0.73 | 0.67 | 0.70 |
| Pneumonia | 11 | 0.64 | 0.64 | 0.64 |
| COVID-19 | 10 | 0.55 | 0.60 | 0.57 |
| Lung Cancer | 6 | 0.50 | 0.50 | 0.50 |
| Pneumothorax | 5 | 0.60 | 0.60 | 0.60 |
| Edema | 6 | 0.50 | 0.50 | 0.50 |
| Consolidation | 4 | 0.50 | 0.50 | 0.50 |
| **Macro avg** | **71** | **0.60** | **0.60** | **0.60** |
| **Weighted avg** | **71** | **0.64** | **0.63** | **0.63** |

**Overall accuracy: 0.63**

---

## Modality 2 — CT Scan

**9 classes · 51 images**

| Class | N | Precision | Recall | F1 |
|-------|---|-----------|--------|-----|
| Pneumonia | 10 | 0.62 | 0.50 | 0.56 |
| Normal | 6 | 0.43 | 1.00 | 0.60 |
| Lung Cancer | 7 | 0.67 | 0.29 | 0.40 |
| COVID-19 | 5 | 0.50 | 0.40 | 0.44 |
| Consolidation | 5 | 0.40 | 0.40 | 0.40 |
| Pneumothorax | 5 | 0.50 | 0.40 | 0.44 |
| Edema | 5 | 0.50 | 0.40 | 0.44 |
| Atelectasis | 4 | 0.57 | 1.00 | 0.73 |
| Tuberculosis | 4 | 1.00 | 0.50 | 0.67 |
| **Macro avg** | **51** | **0.58** | **0.54** | **0.52** |
| **Weighted avg** | **51** | **0.57** | **0.53** | **0.51** |

**Overall accuracy: 0.53**

---

## Modality 3 — MRI (Brain)

**4 classes · 68 images**

| Class | N | Precision | Recall | F1 |
|-------|---|-----------|--------|-----|
| No Tumor | 17 | 0.71 | 0.71 | 0.71 |
| Pituitary | 17 | 0.62 | 0.59 | 0.61 |
| Glioma | 17 | 0.56 | 0.59 | 0.57 |
| Meningioma | 17 | 0.35 | 0.35 | 0.35 |
| **Macro avg** | **68** | **0.56** | **0.56** | **0.56** |
| **Weighted avg** | **68** | **0.56** | **0.56** | **0.56** |

**Overall accuracy: 0.56**

---
