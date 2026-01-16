import { getTicketUrl, type Ticketing } from '@/lib/utils/ticketUrl'

type TicketButtonProps = {
  ticketing?: Ticketing
  className?: string
}

export function TicketButton({ ticketing, className }: TicketButtonProps) {
  if (!ticketing || ticketing.provider === 'none') {
    return null
  }

  const url = getTicketUrl(ticketing)
  const text = ticketing.buttonText ?? 'Kjøp billetter'

  if (ticketing.soldOut) {
    return (
      <button 
        disabled 
        className={`${className} opacity-50 cursor-not-allowed`}
      >
        Utsolgt
      </button>
    )
  }

  if (!url) {
    return null
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {text}
    </a>
  )
}
