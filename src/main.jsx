import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import { applyLineAttributionToLinks, installLineClickTracking } from './line-click-tracking.js'
import { resolveLineAttribution } from './line-routing.js'

const lineAttribution = window.__aiWorkBasicLineAttribution || resolveLineAttribution(window.location.search)
window.__aiWorkBasicLineAttribution = lineAttribution
applyLineAttributionToLinks(document, lineAttribution)

if (typeof window.__aiWorkBasicLineClickCleanup === 'function') {
  window.__aiWorkBasicLineClickCleanup()
}
window.__aiWorkBasicLineClickCleanup = installLineClickTracking({ attribution: lineAttribution })

hydrateRoot(document.getElementById('root'), <App lineAttribution={lineAttribution} />)
