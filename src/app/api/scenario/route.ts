
import { getScenarioResponse } from '@/app/scenario-simulator/actions';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { completion, data } = await req.json();
  const financialData = data.financialData;
  const scenarioDescription = completion;
  
  const stream = await getScenarioResponse(scenarioDescription, financialData);
  
  return new Response(stream);
}
