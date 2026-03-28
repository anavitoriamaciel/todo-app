import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  const { data, error } = await supabase
    .from('tasks').select('*').order('created_at')
  if (error) return NextResponse.json(
    { error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const { title } = await request.json()
  const { data, error } = await supabase
    .from('tasks').insert({ title }).select()
  if (error) return NextResponse.json(
    { error: error.message }, { status: 500 })
  return NextResponse.json(data[0], { status: 201 })
}