import { getPersonName, getWeddingParty } from './weddingDetailUtils';

export default function CoupleInformation({ wedding }) {
  const bride = getWeddingParty(wedding, 'bride');
  const groom = getWeddingParty(wedding, 'groom');
  const brideName = getPersonName(bride);
  const groomName = getPersonName(groom);
  const brideParents = [bride?.fathers_name, bride?.mothers_name].filter(Boolean).join(' & ');
  const groomParents = [groom?.fathers_name, groom?.mothers_name].filter(Boolean).join(' & ');

  if (!brideName && !groomName) return null;

  return (
    <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-xs text-ink-soft">
      {brideName && (
        <div>
          <dt className="font-semibold text-wine-700">Bride: {brideName}</dt>
          {brideParents && <dd>Daughter of {brideParents}</dd>}
        </div>
      )}
      {groomName && (
        <div>
          <dt className="font-semibold text-wine-700">Groom: {groomName}</dt>
          {groomParents && <dd>Son of {groomParents}</dd>}
        </div>
      )}
    </dl>
  );
}