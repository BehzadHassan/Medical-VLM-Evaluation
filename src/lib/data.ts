export interface ModelDetail {
    id: string;
    name: string;
    role: string;
    params: string;
    description: string;
    whyInList: string;
    relevance: string;
    link: string;
    tags: string[];
}

export const MODEL_METADATA: Record<string, ModelDetail> = {
    "MedGemma": {
        id: "medgemma",
        name: "MedGemma 1.5",
        role: "The All-Rounder",
        params: "8B",
        description: "MedGemma 1.5 uses the SigLIP encoder, specifically pre-trained on dermatology and radiology. It excels at reasoning.",
        whyInList: "Newest model in the group. Optimized for medical image interpretation with strong reasoning capabilities.",
        relevance: "Lightweight enough for single-GPU setups, making it perfect for Pakistani labs with limited compute resources.",
        link: "https://huggingface.co/collections/google/medgemma-release-66dfe4528d9d592476f7724a",
        tags: ["Radiology", "Dermatology", "Reasoning"]
    },
    "Chex Agent": {
        id: "chexagent",
        name: "CheXagent",
        role: "The Chest X-ray Expert",
        params: "8B",
        description: "A Foundation Model for Chest X-rays trained on massive datasets like MIMIC-CXR and CheXpert.",
        whyInList: "Specialized foundation model for CXR that generates radiologist-level reports.",
        relevance: "Critical for TB and Pneumonia diagnosis, which are major health focuses in Pakistani hospitals.",
        link: "https://stanford-aimi.github.io/chexagent.html",
        tags: ["Chest X-Ray", "Report Generation", "Foundation Model"]
    },
    "UniMedCLIP": {
        id: "unimedclip",
        name: "UniMed CLIP",
        role: "The Unified Generalist",
        params: "Custom ViT",
        description: "A recent model (late 2024) covering 6 modalities including Ultrasound and Fundus, efficient with data usage.",
        whyInList: "Beats BioMedCLIP using 3x less data. Handles diverse modalities.",
        relevance: "Robust to 'noisy' data from older or non-digital imaging systems common in Pakistan.",
        link: "https://arxiv.org/abs/2412.10372",
        tags: ["Multi-Modal", "Ultrasound", "Fundus"]
    },
    "LLaVA-Med v1.5": {
        id: "llava-med",
        name: "LLaVA-Med v1.5",
        role: "The Interactive Assistant",
        params: "7B",
        description: "The gold standard for Visual Question Answering (VQA). Capable of conversational interaction about medical images.",
        whyInList: "Best-in-class conversational abilities for complex query answering.",
        relevance: "Excellent for medical education and training junior doctors via interactive Q&A.",
        link: "https://github.com/microsoft/LLaVA-Med",
        tags: ["VQA", "Conversational", "Education"]
    },
    "BioMedCLIP": {
        id: "biomedclip",
        name: "BioMedCLIP",
        role: "The Reliable Benchmark",
        params: "ViT-B/16",
        description: "Developed by Microsoft trained on 15 million image-text pairs (PMC-15M).",
        whyInList: "One of the most cited medical VLMs, serving as a robust baseline.",
        relevance: "Acts as the control group to validate findings against dataset specificities.",
        link: "https://huggingface.co/microsoft/BiomedCLIP-PubMedBERT_256-vit_base_patch16_224",
        tags: ["Benchmark", "Zero-Shot", "PMC-15M"]
    }
};
