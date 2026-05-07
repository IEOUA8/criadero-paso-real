import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import React from 'react';

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold ring-offset-background transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none',
	{
		variants: {
			variant: {
				default:
          'bg-[#b8941b] text-white border border-[#9f7d1f] hover:bg-[#936f2d]',
				destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md',
				outline:
          'border border-[#b6974c] bg-transparent text-[#18140e] hover:bg-[#f4efe4] hover:text-[#18140e]',
				secondary:
          'bg-[#18140e] text-white hover:bg-[#2b2117]',
				ghost: 'hover:bg-[#f4efe4] hover:text-[#18140e]',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-11 px-5 py-2.5',
				sm: 'h-9 rounded-lg px-3',
				lg: 'h-12 rounded-md px-8',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	const Comp = asChild ? Slot : 'button';
	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }))}
			ref={ref}
			{...props}
		/>
	);
});
Button.displayName = 'Button';

export { Button, buttonVariants };
