# Medical VLM Evaluation Framework

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Turbopack](https://img.shields.io/badge/Turbopack-Ready-blueviolet?style=for-the-badge)](https://turbo.build/pack)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

A specialized benchmarking dashboard for evaluating state-of-the-art Vision-Language Models (VLMs) in medical imaging diagnostics. This project is specifically tailored for resource-constrained clinical environments, with a focus on the healthcare landscape in Pakistan.

## Overview

This framework provides a comprehensive interface to analyze how top-tier medical AI models perform across various imaging modalities. It evaluates accuracy, reasoning, and practical clinical utility to identify the most suitable models for deployment in local diagnostic labs and hospitals.

### Key Objectives
- Resource Optimization: Identifying models that run efficiently on consumer-grade hardware (Mid-range GPUs).
- Clinical Relevance: Focusing on diseases prevalent in South Asia (TB, Pneumonia, etc.).
- Benchmarking: Providing side-by-side comparisons of SOTA architectures.

---

## Featured Models

The dashboard evaluates five cutting-edge models:

| Model | Role | Key Strength |
| :--- | :--- | :--- |
| **MedGemma 1.5** | The All-Rounder | Strong medical reasoning & dermatology expertise. |
| **CheXagent** | CXR Expert | Foundation model for radiologist-level report generation. |
| **UniMed CLIP** | Unified Generalist | Handles 6+ modalities with low data requirements. |
| **LLaVA-Med** | Interactive Assistant | Best-in-class Visual Question Answering (VQA). |
| **BioMedCLIP** | Reliable Benchmark | Industry-standard baseline for zero-shot tasks. |

---

## Supported Modalities

We evaluate model performance through specialized datasets for:
- CXR (Chest X-Ray): Vital for respiratory disease screening.
- MRI (Magnetic Resonance Imaging): Focused on neurological and soft tissue analysis.
- CT Scan: Detailed cross-sectional diagnostic evaluation.

---

## Technical Stack

- Framework: Next.js 16 (App Router)
- Bundler: Turbopack
- Styling: Tailwind CSS 4.0
- Language: TypeScript
- State Management: React Hooks & Context API
- Icons & UI: Lucide React & Custom SVG Micro-animations

---

## Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm / yarn / pnpm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/BehzadHassan/Medical-VLM-Evaluation.git
   cd Medical-VLM-Evaluation
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the development server
   ```bash
   npm run dev
   ```

Open http://localhost:3000 to see the dashboard.

---

## Build for Production

To create a production build of the project:

```bash
npm run build
```

The optimized output will be generated in the .next folder.

---

## Academic Context

This project is part of a Final Year Research Project (FYP) focused on making advanced medical AI accessible in environments with limited computational resources, specifically targeting the clinical needs of Pakistan.

---

## License

This project is licensed under the MIT License.
