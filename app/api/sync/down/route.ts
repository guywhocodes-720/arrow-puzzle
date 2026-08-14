import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const after = parseInt(searchParams.get('after') || '0', 10);

        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);

        const { data: levels, error: levelsError } = await supabase
            .from('levels')
            .select('level_number, board_data')
            .gt('level_number', after)
            .order('level_number', { ascending: true })
            .limit(100);

        if (levelsError) throw levelsError;

        const { data: { user } } = await supabase.auth.getUser();

        let profile = null;
        let stats = null;

        if (user) {
            const [profileRes, statsRes] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', user.id).single(),
                supabase.from('game_stats').select('*').eq('user_id', user.id).single()
            ]);

            profile = profileRes.data;
            stats = statsRes.data;
        }

        return NextResponse.json({
            success: true,
            levels: levels?.map(l => ({
                levelNumber: l.level_number,
                boardData: l.board_data
            })) || [],
            profile,
            stats
        });

    } catch (error) {
        console.error("Error in sync down:", error);
        return NextResponse.json({ success: false, error: "Failed to sync data" }, { status: 500 });
    }
}
