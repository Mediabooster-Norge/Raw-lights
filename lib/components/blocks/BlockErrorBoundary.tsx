'use client'

import { Component, ReactNode } from 'react'

type Props = {
  children: ReactNode
  blockType: string
  blockKey: string
}

type State = {
  hasError: boolean
  error?: Error
}

export class BlockErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[BlockError] ${this.props.blockType}:`, error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (process.env.NODE_ENV === 'development') {
        return (
          <section className="bg-red-100 border-2 border-red-400 p-6 my-4 rounded">
            <p className="font-bold text-red-800">
              ❌ Block Error: {this.props.blockType}
            </p>
            <pre className="text-xs mt-2 text-red-600">
              {this.state.error?.message}
            </pre>
          </section>
        )
      }
      return null
    }

    return this.props.children
  }
}
