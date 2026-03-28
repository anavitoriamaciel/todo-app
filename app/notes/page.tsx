'use client'
import { useState, useEffect } from 'react'
import { Note } from '../../lib/types'

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selected, setSelected] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isNew, setIsNew] = useState(false)

  async function loadNotes() {
    const res = await fetch('/api/notes')
    const data = await res.json()
    setNotes(data)
  }

  function openNew() {
    setSelected(null)
    setTitle('')
    setContent('')
    setIsNew(true)
  }

  function openNote(note: Note) {
    setSelected(note)
    setTitle(note.title)
    setContent(note.content)
    setIsNew(false)
  }

  async function saveNote() {
    if (!title.trim()) return
    if (isNew) {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      })
    } else if (selected) {
      await fetch(`/api/notes/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      })
    }
    setIsNew(false)
    setSelected(null)
    loadNotes()
  }

  async function deleteNote(id: number) {
    if (!confirm('Excluir esta nota?')) return
    await fetch(`/api/notes/${id}`, { method: 'DELETE' })
    setSelected(null)
    setIsNew(false)
    loadNotes()
  }

  useEffect(() => { loadNotes() }, [])

  const editing = isNew || selected !== null

  return (
    <main style={{ display:'flex', height:'100vh', fontFamily:'sans-serif' }}>

      {/* Sidebar */}
      <aside style={{ width:260, borderRight:'1px solid #eee',
        display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'16px', borderBottom:'1px solid #eee',
          display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <strong>Notas</strong>
          <button onClick={openNew} style={{ cursor:'pointer' }}>+ Nova</button>
        </div>
        <ul style={{ listStyle:'none', padding:0, margin:0, overflowY:'auto', flex:1 }}>
          {notes.map(n => (
            <li key={n.id} onClick={() => openNote(n)}
              style={{ padding:'12px 16px', cursor:'pointer', borderBottom:'1px solid #f5f5f5',
                background: selected?.id === n.id ? '#f0f0ff' : 'transparent' }}>
              <p style={{ fontWeight:500, margin:0, fontSize:14 }}>{n.title}</p>
              <p style={{ margin:0, fontSize:12, color:'#999', marginTop:2 }}>
                {new Date(n.updated_at).toLocaleDateString('pt-BR')}
              </p>
            </li>
          ))}
          {notes.length === 0 && (
            <li style={{ padding:16, color:'#999', fontSize:14 }}>
              Nenhuma nota ainda.
            </li>
          )}
        </ul>
      </aside>

      {/* Editor */}
      <section style={{ flex:1, display:'flex', flexDirection:'column', padding:24 }}>
        {editing ? (
          <>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Título da nota"
              style={{ fontSize:22, fontWeight:'bold', border:'none',
                outline:'none', marginBottom:12, width:'100%' }} />
            <textarea value={content} onChange={e => setContent(e.target.value)}
              placeholder="Escreva sua nota aqui..."
              style={{ flex:1, border:'none', outline:'none', resize:'none',
                fontSize:15, lineHeight:1.7, width:'100%' }} />
            <div style={{ display:'flex', gap:8, marginTop:12 }}>
              <button onClick={saveNote}
                style={{ padding:'8px 20px', background:'#534AB7',
                  color:'white', border:'none', borderRadius:6, cursor:'pointer' }}>
                Salvar
              </button>
              {selected && (
                <button onClick={() => deleteNote(selected.id)}
                  style={{ padding:'8px 20px', background:'#fee', color:'#c00',
                    border:'1px solid #fcc', borderRadius:6, cursor:'pointer' }}>
                  Excluir
                </button>
              )}
              <button onClick={() => { setSelected(null); setIsNew(false) }}
                style={{ padding:'8px 20px', border:'1px solid #ddd',
                  borderRadius:6, cursor:'pointer', background:'transparent' }}>
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <div style={{ color:'#aaa', margin:'auto', textAlign:'center' }}>
            <p style={{ fontSize:16 }}>Selecione uma nota ou crie uma nova</p>
          </div>
        )}
      </section>
    </main>
  )
}