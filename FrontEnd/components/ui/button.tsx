import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-smooth disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:scale-105 hover:shadow-lg hover-lift btn-shine',
        destructive:
          'bg-destructive text-white hover:scale-105 hover:shadow-lg hover-lift btn-shine focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border-2 bg-background shadow-xs hover:scale-105 hover:bg-accent hover:text-accent-foreground hover:shadow-md hover-lift dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:scale-105 hover:bg-secondary/80 hover:shadow-md hover-lift',
        ghost:
          'hover:scale-105 hover:bg-accent hover:text-accent-foreground hover:shadow-md dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline hover:text-primary/80',
        gradient: 'gradient-primary text-primary-foreground hover:scale-105 hover:shadow-lg hover-lift btn-shine',
        glass: 'glass-effect hover:scale-105 hover:bg-background/90 hover:shadow-lg hover-lift',
        neon: 'bg-primary text-primary-foreground hover:scale-105 hover:shadow-lg hover-lift glow-primary btn-shine',
      },
      size: {
        default: 'h-10 px-6 py-2 has-[>svg]:px-4',
        sm: 'h-9 rounded-lg gap-1.5 px-4 has-[>svg]:px-3',
        lg: 'h-12 rounded-lg px-8 has-[>svg]:px-5 text-base',
        icon: 'size-10',
        'icon-sm': 'size-9',
        'icon-lg': 'size-12',
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
