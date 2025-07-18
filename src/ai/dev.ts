import { config } from 'dotenv';
config();

import '@/ai/flows/financial-insights.ts';
import '@/ai/flows/insight-generation.ts';
import '@/ai/flows/scenario-simulation.ts';
import '@/ai/flows/tts.ts';
import '@/ai/flows/data-extraction.ts';
import '@/ai/flows/recommendations.ts';
import '@/ai/tools/tax-calculator.ts';
