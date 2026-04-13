import { ModelResponse } from "@/types";

export const MOCK_MODELS = [
    "MedGemma",
    "LLaVA-Med v1.5",
    "Chex Agent",
    "BioMedCLIP",
    "UniMedCLIP"
];

function generateRandomMetrics() {
    return {
        accuracy: 0.75 + Math.random() * 0.2,
        precision: 0.70 + Math.random() * 0.25,
        recall: 0.70 + Math.random() * 0.25,
        f1_score: 0.72 + Math.random() * 0.23,
    };
}

export async function fetchModelResults(text: string, image: File | null): Promise<ModelResponse[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock responses based on input
    return MOCK_MODELS.map(model => ({
        model_name: model,
        output: `[${model}] Analysis Report:\nBased on the visual features extracted ${image ? `from "${image.name}"` : 'from the input'}, the model identifies clinical markers consistent with the query "${text}".\n\nKey Findings:\n- Feature alignment: High\n- Clinical Relevance: Significant\n\n(Simulated medical VLM output for demonstration)`,
        confidence_score: 0.7 + (Math.random() * 0.25),
        metrics: generateRandomMetrics()
    }));
}
