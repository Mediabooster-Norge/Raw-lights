import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { isHoneypotSubmission, stripHoneypot } from './honeypot'

describe('honeypot', () => {
  it('treats a filled hidden field as spam', () => {
    assert.equal(isHoneypotSubmission({ company_website: 'http://spam.test' }), true)
    assert.equal(isHoneypotSubmission({ company_website: '  ' }), false)
    assert.equal(isHoneypotSubmission({ email: 'a@b.c' }), false)
  })

  it('strips the honeypot before mail is sent', () => {
    assert.deepEqual(stripHoneypot({ company_website: 'x', name: 'Ada' }), { name: 'Ada' })
  })
})
