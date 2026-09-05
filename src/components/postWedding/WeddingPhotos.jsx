import WeddingPhotoGrid from './WeddingPhotoGrid';
import WeddingPhotoUploader from './WeddingPhotoUploader';

export default function WeddingPhotos({ deletingPhotoId, errors, isUploading, onDelete, onFilesAccepted, onFilesRejected, onMove, onReorder, photos }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-wine-700">Step 5: Add Wedding Photos</h2>
      <p className="mt-1 text-sm text-ink-soft">Arrange your favorite moments in the order guests should see them.</p>

      <div className="mt-6">
        <WeddingPhotoUploader disabled={isUploading} onFilesAccepted={onFilesAccepted} onFilesRejected={onFilesRejected} />
        {errors.photos && <p role="alert" className="mt-2 text-xs text-red-700">{errors.photos}</p>}
        {isUploading && <p role="status" className="mt-2 text-xs font-medium text-wine-700">Uploading photos...</p>}
      </div>

      {photos.length > 0 && (
        <section className="mt-7" aria-labelledby="uploaded-photos-heading">
          <div className="mb-3 flex items-center gap-3">
            <h3 id="uploaded-photos-heading" className="font-display text-xl font-bold text-wine-700">Uploaded Photos ({photos.length})</h3>
            <span aria-hidden="true" className="h-px flex-1 bg-gold-300" />
          </div>
          <WeddingPhotoGrid photos={photos} deletingPhotoId={deletingPhotoId} onDelete={onDelete} onMove={onMove} onReorder={onReorder} />
        </section>
      )}
    </div>
  );
}