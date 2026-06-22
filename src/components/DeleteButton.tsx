'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  url: string
  label?: string
  confirm?: string
}

export default function DeleteButton({ url, label = 'Löschen', confirm: confirmMsg }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (confirmMsg && !window.confirm(confirmMsg)) return
    setDeleting(true)

    const res = await fetch(url, { method: 'DELETE' })
    setDeleting(false)

    if (res.ok) {
      router.refresh()
    } else {
      alert('Löschen fehlgeschlagen.')
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="btn-danger text-xs py-1"
    >
      {deleting ? '…' : label}
    </button>
  )
}
