export type TicketProvider = 'none' | 'ticketmaster' | 'tickster' | 'external'

export type Ticketing = {
  provider: TicketProvider
  ticketId?: string
  externalUrl?: string
  buttonText?: string
  soldOut?: boolean
}

const providerUrls: Record<string, (id: string) => string> = {
  ticketmaster: (id) => `https://www.ticketmaster.no/event/${id}`,
  tickster: (id) => `https://www.tickster.com/no/events/${id}`
}

export function getTicketUrl(ticketing?: Ticketing): string | null {
  if (!ticketing || ticketing.provider === 'none') {
    return null
  }

  if (ticketing.provider === 'external') {
    return ticketing.externalUrl ?? null
  }

  if (ticketing.ticketId && providerUrls[ticketing.provider]) {
    return providerUrls[ticketing.provider](ticketing.ticketId)
  }

  return null
}
