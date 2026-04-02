import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        await page.goto("http://localhost:3000/login")

        await page.fill('input[type="email"]', "admin@example.com")
        await page.fill('input[type="password"]', "password123")
        await page.click('button:has-text("Đăng nhập")')

        await page.wait_for_url("http://localhost:3000/dashboard")

        await page.goto("http://localhost:3000/dashboard")

        # Wait a bit for page load
        await page.wait_for_timeout(2000)

        # Take screenshot of the dashboard, focusing on the Merit Book
        await page.screenshot(path="dashboard_merit_auth.png", full_page=True)

        await browser.close()

asyncio.run(main())
