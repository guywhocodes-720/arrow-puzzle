'use client'

import { useFormStatus } from 'react-dom'

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pendingText?: string
}

export function SubmitButton({ children, pendingText, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending} aria-disabled={pending} {...props}>
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {pendingText}
        </span>
      ) : (
        children
      )}
    </button>
  )
}
