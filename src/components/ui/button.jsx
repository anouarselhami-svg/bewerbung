export function Button({ className = '', variant = 'default', size = 'default', children, ...props }) {
  const variantClass = variant === 'outline' ? 'button-outline' : 'button-default'
  const sizeClass = size === 'lg' ? 'button-lg' : 'button-md'

  return (
    <button className={`ui-button ${variantClass} ${sizeClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}