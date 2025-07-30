
"use client";
import { CSS } from '@dnd-kit/utilities';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import React from 'react';

export function DraggableCard({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition };
  return <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="p-2 border rounded bg-white">{children}</div>;
}

export function DraggableList({ items, onReorder, children }:{ items: string[]; onReorder:(ids:string[])=>void; children: React.ReactNode }) {
  const handleEnd = (ev: DragEndEvent) => {
    const { active, over } = ev;
    if (active.id !== over?.id) {
      const oldIndex = items.indexOf(String(active.id));
      const newIndex = items.indexOf(String(over!.id));
      const newItems = Array.from(items);
      newItems.splice(oldIndex,1);
      newItems.splice(newIndex,0,String(active.id));
      onReorder(newItems);
    }
  };
  return (
    <DndContext onDragEnd={handleEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}
