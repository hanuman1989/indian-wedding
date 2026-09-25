import SocialCallbackClient from './SocialCallbackClient'

function getSearchParam(value) {
  if (Array.isArray(value)) return value[0] || ''
  return value || ''
}

export default async function SocialCallbackPage({ searchParams }) {
  const params = await searchParams

  return (
    <SocialCallbackClient
      code={getSearchParam(params.code)}
      errorMessage={getSearchParam(params.error_description) || getSearchParam(params.error)}
    />
  )
}