import test from 'node:test'
import assert from 'node:assert/strict'
import { applyLineAttributionToLinks, buildLineClickPayload, installLineClickTracking } from '../src/line-click-tracking.js'
import { LINE_URLS, resolveLineAttribution } from '../src/line-routing.js'

test('paid_social wins for Instagram traffic and uses the advertising LINE destination', () => {
  const result = resolveLineAttribution('?utm_source=instagram&utm_medium=paid_social&fbclid=test')

  assert.equal(result.trafficRoute, 'paid_social')
  assert.equal(result.lineDestination, 'paid_line')
  assert.equal(result.lineUrl, LINE_URLS.paid)
})

test('Instagram social traffic uses the standard LINE destination', () => {
  const result = resolveLineAttribution('?utm_source=instagram&utm_medium=social')

  assert.equal(result.trafficRoute, 'instagram_social')
  assert.equal(result.lineDestination, 'standard_line')
  assert.equal(result.lineUrl, LINE_URLS.standard)
})

test('fbclid alone is not treated as advertising traffic', () => {
  const result = resolveLineAttribution('?fbclid=test')

  assert.equal(result.trafficRoute, 'other_or_unknown')
  assert.equal(result.lineDestination, 'standard_line')
  assert.equal(result.lineUrl, LINE_URLS.standard)
})

test('an untagged visit remains other_or_unknown', () => {
  const result = resolveLineAttribution('')

  assert.equal(result.trafficRoute, 'other_or_unknown')
  assert.equal(result.lineUrl, LINE_URLS.standard)
})

test('other known UTM values still use the standard LINE destination without being called organic', () => {
  const result = resolveLineAttribution('?utm_source=newsletter&utm_medium=email')

  assert.equal(result.trafficRoute, 'other_or_unknown')
  assert.equal(result.utmSource, 'newsletter')
  assert.equal(result.utmMedium, 'email')
  assert.equal(result.lineUrl, LINE_URLS.standard)
})

test('campaign values are matched case-insensitively after trimming', () => {
  const result = resolveLineAttribution('?utm_source=%20Instagram%20&utm_medium=%20PAID_SOCIAL%20')

  assert.equal(result.trafficRoute, 'paid_social')
  assert.equal(result.lineUrl, LINE_URLS.paid)
})

test('the GA4 payload describes the LP entry route, destination and CTA section', () => {
  const attribution = resolveLineAttribution('?utm_source=instagram&utm_medium=social')
  const payload = buildLineClickPayload(attribution, 'section-03')

  assert.deepEqual(payload.ga4, {
    traffic_route: 'instagram_social',
    line_destination: 'standard_line',
    cta_section: 'section-03',
    link_url: LINE_URLS.standard,
    utm_source: 'instagram',
    utm_medium: 'social'
  })
  assert.equal(payload.meta.traffic_route, 'instagram_social')
  assert.deepEqual(payload.meta.content_ids, ['section-03'])
})

function createClickHarness(search, analytics = {}) {
  let clickHandler
  let removedHandler
  const link = {
    href: '',
    dataset: {},
    nodeType: 1,
    closest(selector) {
      if (selector === 'a[data-line-cta]') return this
      if (selector === 'section') return { id: 'section-06' }
      return null
    }
  }
  const documentRef = {
    addEventListener(type, handler, capture) {
      assert.equal(type, 'click')
      assert.equal(capture, true)
      clickHandler = handler
    },
    removeEventListener(type, handler, capture) {
      assert.equal(type, 'click')
      assert.equal(capture, true)
      removedHandler = handler
    }
  }
  const windowRef = { location: { search }, ...analytics }
  const cleanup = installLineClickTracking({ documentRef, windowRef })

  return {
    click: () => clickHandler({ target: link }),
    cleanup: () => {
      cleanup()
      assert.equal(removedHandler, clickHandler)
    },
    link,
    windowRef
  }
}

test('GA4 still receives one line_click when Meta Pixel is unavailable', () => {
  const calls = []
  const harness = createClickHarness('?utm_medium=paid_social', {
    gtag: (...args) => calls.push(args)
  })

  harness.click()

  assert.equal(calls.length, 1)
  assert.equal(calls[0][1], 'line_click')
  assert.equal(calls[0][2].traffic_route, 'paid_social')
  assert.equal(harness.link.href, LINE_URLS.paid)
  harness.cleanup()
})

test('Meta events remain intact when GA4 is unavailable', () => {
  const calls = []
  const harness = createClickHarness('?fbclid=test', {
    fbq: (...args) => calls.push(args)
  })

  harness.click()

  assert.deepEqual(calls.map(call => call.slice(0, 2)), [
    ['track', 'Lead'],
    ['trackCustom', 'LineClick']
  ])
  assert.equal(calls[0][2].traffic_route, 'other_or_unknown')
  assert.equal(harness.link.href, LINE_URLS.standard)
  harness.cleanup()
})

test('click attribution stays tied to the LP entry route', () => {
  const calls = []
  const harness = createClickHarness('?utm_medium=paid_social', {
    gtag: (...args) => calls.push(args)
  })
  harness.windowRef.location.search = '?utm_source=instagram&utm_medium=social'

  harness.click()

  assert.equal(calls[0][2].traffic_route, 'paid_social')
  assert.equal(harness.link.href, LINE_URLS.paid)
  harness.cleanup()
})

test('all prerendered LINE links receive the landing attribution before hydration', () => {
  const links = Array.from({ length: 7 }, () => ({ href: LINE_URLS.standard, dataset: {} }))
  const documentRef = {
    querySelectorAll(selector) {
      assert.equal(selector, 'a[data-line-cta]')
      return links
    }
  }
  const attribution = resolveLineAttribution('?utm_medium=paid_social')

  const count = applyLineAttributionToLinks(documentRef, attribution)

  assert.equal(count, 7)
  assert.ok(links.every(link => link.href === LINE_URLS.paid))
  assert.ok(links.every(link => link.dataset.trafficRoute === 'paid_social'))
  assert.ok(links.every(link => link.dataset.lineDestination === 'paid_line'))
})
