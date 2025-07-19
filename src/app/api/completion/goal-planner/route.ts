
// This API route is no longer used. The page now uses a direct server action.
// This file can be deleted, but is kept to avoid breaking changes if referenced elsewhere.
import {NextResponse} from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
    return NextResponse.json({error: 'This endpoint is deprecated.'}, {status: 410});
}
