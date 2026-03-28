'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

type Task = { id: number; title: string; done: boolean }

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [input, setInput] = useState('')

  async function loadTasks() {
    const { data } = await supabase
      .from('tasks').select('*').order('created_at')
    setTasks(data ?? [])
  }

  async function addTask() {
    if (!input.trim()) return
    await supabase.from('tasks').insert({ title: input })
    setInput('')
    loadTasks()
  }

  async function toggleDone(task: Task) {
    await supabase.from('tasks')
      .update({ done: !task.done }).eq('id', task.id)
    loadTasks()
  }

  async function deleteTask(id: number) {
    await supabase.from('tasks').delete().eq('id', id)
    loadTasks()
  }

  useEffect(() => { loadTasks() }, [])

  return (
    <main style={{ maxWidth: 480, margin: '60px auto', padding: 20 }}>
      <h1>Minhas Tarefas</h1>
      <div style={{ display:'flex', gap: 8, margin: '20px 0' }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="Nova tarefa..." style={{ flex: 1, padding: 8 }} />
        <button onClick={addTask}>Adicionar</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(t => (
          <li key={t.id} style={{ display:'flex', gap:8,
            alignItems:'center', padding:'8px 0',
            borderBottom:'1px solid #eee' }}>
            <input type="checkbox" checked={t.done}
              onChange={() => toggleDone(t)} />
            <span style={{ flex:1,
              textDecoration: t.done ? 'line-through' : 'none',
              color: t.done ? '#999' : 'inherit' }}>{t.title}</span>
            <button onClick={() => deleteTask(t.id)}>✕</button>
          </li>
        ))}
      </ul>
    </main>
  )
}