import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'   // ← adiciona essa linha

export const metadata: Metadata = {
  title: 'Meu App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <nav style={{
          padding: '12px 24px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          gap: 20,
          alignItems: 'center'
        }}>
          <Link href="/" style={{ fontWeight: 500, textDecoration: 'none', color: 'inherit' }}>
            Tarefas
          </Link>
          <Link href="/notes" style={{ fontWeight: 500, textDecoration: 'none', color: 'inherit' }}>
            Notas
          </Link>
        </nav>
        {children}
      </body>
    </html>
  )
}