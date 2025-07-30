
"use client";
import React, { useState, useTransition } from 'react';
import { DraggableList, DraggableCard } from './DraggableCard';
import { createNewsletterAction } from '@/app/newsletters/actions';

export interface Article { id:number; title:string; url:string; content:string; publishedAt:string; }
export interface Newsletter { id:number; title:string; createdAt:string; }

export default function Builder({ availableArticles, newsletters }:{ availableArticles:Article[]; newsletters:Newsletter[] }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState('');

  const avail = availableArticles.filter(a=>!selected.includes(a.id));
  const chosen = availableArticles.filter(a=>selected.includes(a.id));

  function reorder(ids:string[]){ setSelected(ids.map(Number)); }

  function submit(e:React.FormEvent){
    e.preventDefault();
    if(!title||selected.length===0){ setMsg('Provide title and select articles'); return;}
    start(async()=>{
      setMsg('Generating...');
      await createNewsletterAction(title, selected);
      setMsg('Done!');
      setSelected([]); setTitle('');
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Newsletter title" className="p-2 border rounded w-full"/>
      <div className="grid grid-cols-2 gap-4">
        <div><h3 className="font-medium">Available</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {avail.map(a=>(
              <div key={a.id} className="border p-2 text-sm">
                {a.title}
                <button type="button" onClick={()=>setSelected([...selected,a.id])} className="ml-2 text-blue-600 text-xs">Add</button>
              </div>
            ))}
          </div>
        </div>
        <div><h3 className="font-medium">Selected</h3>
          {chosen.length===0? <p className="text-xs text-gray-500">None</p>:
            <DraggableList items={selected.map(String)} onReorder={reorder}>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {chosen.map(a=>(
                  <DraggableCard key={a.id.toString()} id={a.id.toString()}>
                    <div className="flex justify-between">
                      <span className="text-sm flex-1">{a.title}</span>
                      <button type="button" onClick={()=>setSelected(selected.filter(id=>id!==a.id))} className="text-red-600 text-xs">Remove</button>
                    </div>
                  </DraggableCard>
                ))}
              </div>
            </DraggableList>}
        </div>
      </div>
      <button className="bg-green-600 text-white px-4 py-2 rounded" disabled={pending}>Generate</button>
      {msg && <p className="text-sm">{msg}</p>}
    </form>
  );
}
