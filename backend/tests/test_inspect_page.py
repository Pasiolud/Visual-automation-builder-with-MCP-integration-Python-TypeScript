import asyncio
from backend.app.services.browser import BrowserService


async def main():
    browser = BrowserService()

    print("Turning on browser")
    await browser.open_url("https://playwright.dev/docs/evaluating")

    print("Scanning the page")
    data = await browser.inspect_page()

    print(f"Title: {data['title']} ")
    print(f"Number of elem: {len(data['elements'])} ")

    for e in data["elements"][:3]:
        print(f"{e['tag']}: {e['text']}")
    await browser.playwright.stop()


if __name__ == "__main__":
    asyncio.run(main())
