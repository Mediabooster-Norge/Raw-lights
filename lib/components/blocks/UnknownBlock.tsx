type UnknownBlockProps = {
  type: string
  data: unknown
}

export function UnknownBlock({ type, data }: UnknownBlockProps) {
  return (
    <section className="bg-yellow-100 border-2 border-yellow-400 p-6 my-4 rounded">
      <p className="font-bold text-yellow-800">⚠️ Unknown block: {type}</p>
      <pre className="text-xs mt-2 overflow-auto max-h-40">
        {JSON.stringify(data, null, 2)}
      </pre>
    </section>
  )
}
