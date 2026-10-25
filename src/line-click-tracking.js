import { resolveLineAttribution } from './line-routing.js'

function findLineLink(target) {
  const element = target?.nodeType === 1 ? target : target?.parentElement
  return element?.closest?.('a[data-line-cta]') || null
}

export function buildLineClickPayload(attribution, sectionId = 'unknown') {
  // traffic_route describes how the visitor entered this LP, not a completed LINE friend-add.
  const ga4 = {
    traffic_route: attribution.trafficRoute,
    line_destination: attribution.lineDestination,
    cta_section: sectionId,
    link_url: attribution.lineUrl
  }

  if (attribution.utmSource) ga4.utm_source = attribution.utmSource
  if (attribution.utmMedium) ga4.utm_medium = attribution.utmMedium

  return {
    ga4,
    meta: {
      content_name: 'AI WORK BASIC LINE CTA',
      content_category: 'LINE',
      content_ids: [sectionId],
      traffic_route: attribution.trafficRoute,
      line_destination: attribution.lineDestination
    }
  }
}

export function applyLineAttributionToLinks(documentRef, attribution) {
  const links = documentRef.querySelectorAll('a[data-line-cta]')
  for (const link of links) {
    link.href = attribution.lineUrl
    link.dataset.trafficRoute = attribution.trafficRoute
    link.dataset.lineDestination = attribution.lineDestination
  }
  return links.length
}

export function installLineClickTracking({ attribution, documentRef = document, windowRef = window } = {}) {
  const landingAttribution = attribution || resolveLineAttribution(windowRef.location.search)

  function handleLineClick(event) {
    const lineLink = findLineLink(event.target)
    if (!lineLink) return

    const sectionId = lineLink.closest('section')?.id || 'unknown'
    const payload = buildLineClickPayload(landingAttribution, sectionId)

    lineLink.href = landingAttribution.lineUrl
    lineLink.dataset.trafficRoute = landingAttribution.trafficRoute
    lineLink.dataset.lineDestination = landingAttribution.lineDestination

    if (typeof windowRef.gtag === 'function') {
      windowRef.gtag('event', 'line_click', payload.ga4)
    }

    if (typeof windowRef.fbq === 'function') {
      windowRef.fbq('track', 'Lead', payload.meta)
      windowRef.fbq('trackCustom', 'LineClick', payload.meta)
    }
  }

  documentRef.addEventListener('click', handleLineClick, true)
  return () => documentRef.removeEventListener('click', handleLineClick, true)
}
