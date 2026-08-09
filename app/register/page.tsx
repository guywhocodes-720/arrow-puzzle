import { signup } from '@/app/login/action'
import Link from 'next/link'
import { SubmitButton } from '@/components/SubmitButton'

export default async function RegisterPage({
    searchParams,
}: {
    searchParams: Promise<{ message: string }>
}) {
    const params = await searchParams;
    return (
        <div className="flex-1 flex flex-col w-full px-6 sm:px-12 max-w-md justify-center mx-auto pb-24 mt-12 sm:mt-24">
            <div className="flex flex-col gap-3 text-center mb-12">
                <h1 className="text-3xl font-medium tracking-tight text-foreground uppercase">Create Account</h1>
                <p className="text-sm text-muted-foreground">Join to save your game progress.</p>
            </div>

            <form className="flex-1 flex flex-col w-full justify-center text-foreground">
                <div className="flex flex-col gap-2 mb-6">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest ml-1" htmlFor="displayName">
                        Display Name
                    </label>
                    <input
                        className="rounded-xl px-4 py-3 bg-input border-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background outline-none transition-all text-base"
                        name="displayName"
                        placeholder="e.g. PuzzleMaster"
                        required
                        minLength={3}
                        maxLength={20}
                    />
                </div>

                <div className="flex flex-col gap-2 mb-6">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest ml-1" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="rounded-xl px-4 py-3 bg-input border-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background outline-none transition-all text-base"
                        name="email"
                        placeholder="you@example.com"
                        required
                    />
                </div>
                
                <div className="flex flex-col gap-2 mb-10">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest ml-1" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="rounded-xl px-4 py-3 bg-input border-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background outline-none transition-all text-base"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <SubmitButton
                    formAction={signup}
                    pendingText="Creating Account..."
                    className="w-full py-4 bg-primary text-primary-foreground font-semibold text-sm tracking-widest uppercase rounded-xl border-b-[4px] border-primary/50 hover:brightness-110 active:translate-y-[2px] active:border-b-[2px] duration-75 disabled:opacity-50"
                >
                    Create Account
                </SubmitButton>

                {params?.message && (
                    <p className="mt-8 text-sm text-destructive text-center font-medium">
                        {params.message}
                    </p>
                )}
            </form>

            <div className="mt-12 text-center">
                <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Already have an account? Sign in
                </Link>
            </div>
        </div>
    )
}
