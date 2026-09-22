import assert from 'node:assert/strict'
import test from 'node:test'
import { isAppearance, nextAppearance } from './appearance'

test('only supported appearance values are accepted', () => {
  assert.equal(isAppearance('dark'), true)
  assert.equal(isAppearance('light'), true)
  assert.equal(isAppearance('system'), false)
  assert.equal(isAppearance(null), false)
})

test('the appearance toggle alternates between dark and light', () => {
  assert.equal(nextAppearance('dark'), 'light')
  assert.equal(nextAppearance('light'), 'dark')
})
