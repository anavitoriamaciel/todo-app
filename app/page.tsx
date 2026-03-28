"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

type Task = { id: number; title: string; done: boolean };

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [filtro, setFiltro] = useState<"todas" | "pendentes" | "concluidas">(
    "todas",
  );

  async function loadTasks() {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at");
    setTasks(data ?? []);
  }

  async function addTask() {
    if (!input.trim()) return;
    await supabase.from("tasks").insert({ title: input });
    setInput("");
    loadTasks();
  }

  async function toggleDone(task: Task) {
    await supabase.from("tasks").update({ done: !task.done }).eq("id", task.id);
    loadTasks();
  }

  async function deleteTask(id: number) {
    await supabase.from("tasks").delete().eq("id", id);
    loadTasks();
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const tarefasFiltradas = tasks.filter((t) => {
    if (filtro === "pendentes") return !t.done;
    if (filtro === "concluidas") return t.done;
    return true;
  });

  return (
    <main style={{ maxWidth: 480, margin: "60px auto", padding: 20 }}>
      <h1>Minhas Tarefas</h1>
      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        {(["todas", "pendentes", "concluidas"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            style={{
              padding: "4px 12px",
              borderRadius: 99,
              border: "1px solid #ccc",
              cursor: "pointer",
              background: filtro === f ? "#534AB7" : "transparent",
              color: filtro === f ? "white" : "inherit",
              fontSize: 13,
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, margin: "20px 0" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Nova tarefa..."
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={addTask}>Adicionar</button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tarefasFiltradas.map((t) => (
          <li
            key={t.id}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggleDone(t)}
            />
            <span
              style={{
                flex: 1,
                textDecoration: t.done ? "line-through" : "none",
                color: t.done ? "#999" : "inherit",
              }}
            >
              {t.title}
            </span>
            <button onClick={() => deleteTask(t.id)}>✕</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
