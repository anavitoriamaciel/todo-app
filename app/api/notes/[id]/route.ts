import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

type Params = { params: { id: string } }

export async function PATCH(request: Request, { params }: Params) {
  const { title, content } = await request.json()
  const { data, error } = await supabase
    .from('notes')
    .update({ title, content })
    .eq('id', params.id)
    .select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data[0])
}

export async function DELETE(_: Request, { params }: Params) {
  const { error } = await supabase
    .from('notes').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}