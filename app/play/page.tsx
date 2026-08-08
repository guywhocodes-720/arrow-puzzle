import { Board } from "@/components/Board";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function PlayPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  let initialLevel = 1;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('highest_level')
      .eq('id', user.id)
      .single();

    if (profile && profile.highest_level) {
      initialLevel = profile.highest_level;
    }

  }
  return (
    <main className="flex-1 flex flex-col items-center p-6 sm:p-12 w-full mx-auto">
      <Board initialLevel={initialLevel} />
    </main>
  );
}
