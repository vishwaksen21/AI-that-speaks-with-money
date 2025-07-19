
import { getGoalResponse } from '@/app/goal-planner/actions';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { completion, data } = await req.json();
  const financialData = data.financialData;
  const goalDescription = completion;
  
  const stream = await getGoalResponse(goalDescription, financialData);
  
  return new Response(stream);
}
