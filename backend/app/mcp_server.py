
from mcp.server.fastmcp import FastMCP
from backend.app.services.browser import BrowserService

mcp = FastMCP("NodeGhost")
browser = BrowserService()


# na przyszlosc te docstringi """""" to widzi agent takie opisy dzialania funkcji

#EMMMMM
@mcp.tool()
async def open_page(url: str) -> str:
    """Otwiera stronę w przeglądarce z podanego url"""
    return await browser.open_url(url)


@mcp.tool()
async def get_page_elements() -> str:
    """Pobiera z obecnej strony dane interaktywne, przyciski, typy input itp."""
    data = await browser.inspect_page()
    return str(data)


@mcp.tool()
async def click_element(selector: str, text: str) -> str:
    """Klika w element o danym selektorze CSS"""
    return await browser.click_element(selector)


@mcp.tool()
async def type_into_element(selector: str, text: str) -> str:
    """Wpisuje tekst w pole o danym selektorze CSS"""
    return await browser.type_text(selector, text)


if __name__ == "__main__":
    mcp.run()
