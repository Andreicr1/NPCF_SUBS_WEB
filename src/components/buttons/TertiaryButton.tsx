import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { iconLeft?: React.ReactNode; iconRight?: React.ReactNode }

export default function TertiaryButton({ className = '', iconLeft, iconRight, children, ...props }: Props) {
  return (
    <button {...props} className={`btn btn-tertiary px-3 py-2 focus-ring ${className}`}>
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </button>
  )
}

