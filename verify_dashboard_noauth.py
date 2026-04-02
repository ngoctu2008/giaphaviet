import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        await page.goto("http://localhost:3000/dashboard")
        await page.wait_for_timeout(2000)
        await page.screenshot(path="dashboard_merit_noauth.png", full_page=True)

        await browser.close()

asyncio.run(main())
