import { NextResponse } from 'next/server';
import { generateProceduralLevel } from '@/types/game';
import { supabaseAdmin } from '@/utils/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const secret = url.searchParams.get('secret');

        if (secret !== process.env.CRON_SECRET) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // Find the highest level generated so far
        const { data: maxLevelData, error: maxLevelError } = await supabaseAdmin
            .from('levels')
            .select('level_number')
            .order('level_number', { ascending: false })
            .limit(1)
            .single();

        const maxLevel = maxLevelData ? maxLevelData.level_number : 0;

        // Generate the next 5 levels per cron run to avoid timeout
        const levelsToGenerate = 5;
        const newLevelsCount = maxLevel + levelsToGenerate;

        console.log(`Cron job started: Generating levels from ${maxLevel + 1} to ${newLevelsCount}...`);

        const levelsToInsert = [];

        for (let lvl = maxLevel + 1; lvl <= newLevelsCount; lvl++) {
            // Using the guaranteed-solvable, bulletproof generator from game.ts
            const board = generateProceduralLevel(lvl);
            levelsToInsert.push({
                level_number: lvl,
                board_data: board
            });
        }

        // Save back to db
        const { error: insertError } = await supabaseAdmin
            .from('levels')
            .upsert(levelsToInsert);

        if (insertError) {
            throw insertError;
        }

        return NextResponse.json({
            success: true,
            message: `Successfully generated levels from ${maxLevel + 1} to ${newLevelsCount}`,
            generated: levelsToGenerate
        });
    } catch (error) {
        console.error("Error generating levels:", error);
        return NextResponse.json({ success: false, error: "Failed to generate levels" }, { status: 500 });
    }
}
