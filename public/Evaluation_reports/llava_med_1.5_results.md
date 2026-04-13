
## Modality 1 — Chest X-Ray (CXR)
**8 classes · 71 images**
| Class | N | Precision | Recall | F1 |
|-------|---|-----------|--------|-----|
| Normal | 16 | 0.81 | 0.81 | 0.81 |
| Tuberculosis | 14 | 0.91 | 0.71 | 0.80 |
| Pneumonia | 11 | 0.64 | 0.64 | 0.64 |
| COVID-19 | 9 | 0.42 | 0.56 | 0.48 |
| Lung Cancer | 6 | 0.60 | 0.50 | 0.55 |
| Pneumothorax | 5 | 0.60 | 0.60 | 0.60 |
| Edema | 6 | 0.50 | 0.50 | 0.50 |
| Consolidation | 4 | 0.40 | 0.50 | 0.44 |
| **Macro avg** | **71** | **0.61** | **0.60** | **0.60** |
| **Weighted avg** | **71** | **0.67** | **0.65** | **0.66** |

**Overall accuracy: 0.65**
---

## Modality 2 — CT Scan
**9 classes · 51 images**
| Class | N | Precision | Recall | F1 |
|-------|---|-----------|--------|-----|
| Pneumonia | 10 | 0.60 | 0.60 | 0.60 |
| Normal | 6 | 0.60 | 0.50 | 0.55 |
| Lung Cancer | 7 | 0.50 | 0.57 | 0.53 |
| COVID-19 | 5 | 0.50 | 0.40 | 0.44 |
| Consolidation | 5 | 0.40 | 0.40 | 0.40 |
| Pneumothorax | 5 | 0.40 | 0.40 | 0.40 |
| Edema | 5 | 0.40 | 0.40 | 0.40 |
| Atelectasis | 4 | 0.29 | 0.50 | 0.36 |
| Tuberculosis | 4 | 1.00 | 0.50 | 0.67 |
| **Macro avg** | **51** | **0.52** | **0.47** | **0.48** |
| **Weighted avg** | **51** | **0.52** | **0.49** | **0.50** |

**Overall accuracy: 0.49**
---

## Modality 3 — MRI (Brain)
**4 classes · 68 images**
| Class | N | Precision | Recall | F1 |
|-------|---|-----------|--------|-----|
| No Tumor | 17 | 0.67 | 0.71 | 0.69 |
| Glioma | 17 | 0.44 | 0.47 | 0.46 |
| Meningioma | 17 | 0.35 | 0.35 | 0.35 |
| Pituitary | 17 | 0.67 | 0.59 | 0.62 |
| **Macro avg** | **68** | **0.53** | **0.53** | **0.53** |
| **Weighted avg** | **68** | **0.53** | **0.53** | **0.53** |

**Overall accuracy: 0.53**
---


## Summary

| Modality | Macro F1 |
|----------|----------|
| CXR | 0.60 |
| CT Scan | 0.48 |
| MRI | 0.53 |
