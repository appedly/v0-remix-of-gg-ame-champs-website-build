import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive btn",
  {
    variants: {
      variant: {
        default: 'btn-primary',
        destructive: 'btn-danger',
        outline: 'btn-secondary',
        secondary: 'btn-secondary',
        ghost: 'btn-tertiary',
        link: 'btn-tertiary underline-offset-4 hover:underline',
        primary: 'btn-primary',
        success: 'btn-primary bg-success hover:bg-success-hover border-success hover:border-success-hover shadow-success',
        warning: 'btn-primary bg-warning hover:bg-warning-hover border-warning hover:border-warning-hover shadow-warning',
      },
      size: {
        default: '',
        sm: 'btn-sm',
        lg: 'btn-lg',
        icon: 'size-9 min-w-0 p-0',
        'icon-sm': 'size-8 min-w-0 p-0',
        'icon-lg': 'size-10 min-w-0 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
