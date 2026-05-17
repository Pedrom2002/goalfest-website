import { test, expect } from '@playwright/test'

test.describe('Smoke', () => {
  test('PT home loads with correct title', async ({ page }) => {
    await page.goto('/pt/')
    await expect(page).toHaveTitle(/Goalfest/i)
    await expect(page.locator('#main-content')).toBeVisible()
  })

  test('EN home loads with correct title', async ({ page }) => {
    await page.goto('/en/')
    await expect(page).toHaveTitle(/Goalfest/i)
  })

  test('/pt/jogos renders schedule', async ({ page }) => {
    await page.goto('/pt/jogos')
    await expect(page).toHaveTitle(/Jogos/i)
    await expect(page.locator('#main-content')).toBeVisible()
  })

  test('/pt/faq renders accordion', async ({ page }) => {
    await page.goto('/pt/faq')
    await expect(page).toHaveTitle(/FAQ/i)
    await expect(page.locator('#main-content')).toBeVisible()
  })

  test('security headers present on home', async ({ page }) => {
    const response = await page.goto('/pt/')
    expect(response).not.toBeNull()
    const headers = response!.headers()
    expect(headers['x-frame-options']).toBe('DENY')
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['strict-transport-security']).toContain('max-age=')
  })

  test('skip link is focusable and points to main', async ({ page }) => {
    await page.goto('/pt/')
    await page.keyboard.press('Tab')
    const skipLink = page.locator('a[href="#main-content"]')
    await expect(skipLink).toBeFocused()
    const href = await skipLink.getAttribute('href')
    expect(href).toBe('#main-content')
    await expect(page.locator('#main-content')).toBeAttached()
  })
})
