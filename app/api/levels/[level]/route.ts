import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request: Request, { params }: { params: Promise<{ level: string }> }) {
    try {
        const { level } = await params;
        const levelNum = parseInt(level, 10);

        if (isNaN(levelNum) || levelNum < 1) {
            return NextResponse.json({ success: false, error: "Invalid level number" }, { status: 400 });
        }

        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);

        // Fetch level from Supabase
        const { data, error } = await supabase
            .from('levels')
            .select('board_data')
            .eq('level_number', levelNum)
            .single();

        if (error || !data) {
            return NextResponse.json({
                success: false,
                error: "Level not found in pack. Cron job needs to generate it."
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            source: 'cache',
            board: data.board_data
        });

    } catch (error) {
        console.error("Error fetching level:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch level" }, { status: 500 });
    }
}
