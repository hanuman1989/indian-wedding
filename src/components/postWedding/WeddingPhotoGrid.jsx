import { useState } from 'react';
import { Grip, Trash } from '@/components/Icons';

/* API image URLs and browser blob previews cannot use next/image without a dedicated loader. */
/* eslint-disable @next/next/no-img-element */
export default function WeddingPhotoGrid({ deletingPhotoId, onDelete, onMove, onReorder, photos }) {
  const [draggedPhotoId, setDraggedPhotoId] = useState(null);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo, index) => (
        <article
          key={photo.id}
          draggable
          onDragStart={(event) => {
            const photoId = String(photo.id);
            setDraggedPhotoId(photoId);
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', photoId);
          }}
          onDragEnd={() => setDraggedPhotoId(null)}
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
          }}
          onDrop={(event) => {
            event.preventDefault();
            const sourceId = event.dataTransfer.getData('text/plain') || draggedPhotoId;
            setDraggedPhotoId(null);
            if (sourceId && sourceId !== String(photo.id)) onReorder(sourceId, photo.id);
          }}
          className="group relative overflow-hidden border border-gold-200 bg-white shadow-sm"
        >
          <img src={photo.preview || photo.url} alt={`Wedding photo ${index + 1}`} className="aspect-[4/3] w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-black/60 px-2 py-2 text-white">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium"><Grip className="h-4 w-4" /> {index + 1}</span>
            <span className="flex items-center gap-1">
              <button type="button" onClick={() => onMove(index, -1)} disabled={index === 0} aria-label={`Move photo ${index + 1} earlier`} className="grid h-6 w-6 place-items-center rounded-sm bg-white/15 text-xs hover:bg-white/30 disabled:opacity-40">&lt;</button>
              <button type="button" onClick={() => onMove(index, 1)} disabled={index === photos.length - 1} aria-label={`Move photo ${index + 1} later`} className="grid h-6 w-6 place-items-center rounded-sm bg-white/15 text-xs hover:bg-white/30 disabled:opacity-40">&gt;</button>
              <button type="button" onClick={() => onDelete(photo)} disabled={deletingPhotoId === photo.id} aria-label={`Delete photo ${index + 1}`} className="grid h-6 w-6 place-items-center rounded-sm bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60">
                <Trash className="h-3.5 w-3.5" />
              </button>
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}