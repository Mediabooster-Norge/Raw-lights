import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { archivePageHref, paginate, parsePageParam } from './pagination'

describe('parsePageParam', () => {
  it('defaults invalid values to page 1', () => {
    assert.equal(parsePageParam(undefined), 1)
    assert.equal(parsePageParam('0'), 1)
    assert.equal(parsePageParam(['3']), 3)
  })
})

describe('paginate', () => {
  it('slices a list and clamps the page', () => {
    const result = paginate(['a', 'b', 'c', 'd'], 2, 2)
    assert.deepEqual(result.items, ['c', 'd'])
    assert.equal(result.page, 2)
    assert.equal(result.totalPages, 2)
  })

  it('clamps past the last page', () => {
    const result = paginate(['a'], 9, 12)
    assert.deepEqual(result.items, ['a'])
    assert.equal(result.page, 1)
  })
})

describe('archivePageHref', () => {
  it('omits page=1 from the URL', () => {
    assert.equal(archivePageHref('artister', 1), '/artister')
    assert.equal(archivePageHref('artister', 2), '/artister?page=2')
  })
})
