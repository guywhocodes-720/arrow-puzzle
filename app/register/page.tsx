import { signup } from '@/app/login/action'
import Link from 'next/link'

export default async function RegisterPage({
    searchParams,
}: {
    searchParams: Promise<{ message: string }>
}) {
    const params = await searchParams;
    return (
        <div className="flex-1 flex flex-col w-full px-6 sm:px-12 max-w-md justify-center mx-auto pb-24 mt-12 sm:mt-24">
            <div className="flex flex-col gap-3 text-center mb-12">
                <h1 className="text-3xl font-medium tracking-tight text-black dark:text-white uppercase">Create Account</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Join to save your game progress.</p>
            </div>

            <form className="flex-1 flex flex-col w-full justify-center text-black dark:text-white">
                <div className="flex flex-col gap-2 mb-6">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="rounded-none px-1 py-3 bg-transparent border-b border-zinc-200 dark:border-zinc-800 focus:border-black dark:focus:border-white focus:outline-none transition-colors text-base"
                        name="email"
                        placeholder="you@example.com"
                        required
                    />
                </div>
                
                <div className="flex flex-col gap-2 mb-10">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest ml-1" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="rounded-none px-1 py-3 bg-transparent border-b border-zinc-200 dark:border-zinc-800 focus:border-black dark:focus:border-white focus:outline-none transition-colors text-base"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button
                    formAction={signup}
                    className="w-full py-4 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold text-sm tracking-widest uppercase transition-colors"
                >
                    Create Account
                </button>

                {params?.message && (
                    <p className="mt-8 text-sm text-red-600 dark:text-red-400 text-center font-medium">
                        {params.message}
                    </p>
                )}
            </form>

            <div className="mt-12 text-center">
                <Link href="/login" className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                    Already have an account? Sign in
                </Link>
            </div>
        </div>
    )
}
