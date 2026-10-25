export const LINE_URLS = Object.freeze({
  paid: 'https://lin.ee/ytZkQYq',
  standard: 'https://lin.ee/zJ3C7o9'
})

export const DEFAULT_LINE_ATTRIBUTION = Object.freeze({
  trafficRoute: 'other_or_unknown',
  lineDestination: 'standard_line',
  lineUrl: LINE_URLS.standard,
  utmSource: '',
  utmMedium: ''
})

function normalizeCampaignValue(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : ''
}

export function resolveLineAttribution(search = '') {
  const params = new URLSearchParams(search)
  const utmSource = normalizeCampaignValue(params.get('utm_source'))
  const utmMedium = normalizeCampaignValue(params.get('utm_medium'))

  if (utmMedium === 'paid_social') {
    return {
      trafficRoute: 'paid_social',
      lineDestination: 'paid_line',
      lineUrl: LINE_URLS.paid,
      utmSource,
      utmMedium
    }
  }

  if (utmSource === 'instagram' && utmMedium === 'social') {
    return {
      trafficRoute: 'instagram_social',
      lineDestination: 'standard_line',
      lineUrl: LINE_URLS.standard,
      utmSource,
      utmMedium
    }
  }

  return {
    ...DEFAULT_LINE_ATTRIBUTION,
    utmSource,
    utmMedium
  }
}
