import functools

import playwright.async_api as playwright


class BrowserService:
    def __init__(self):
        self.playwright = None
        self.browser = None
        self.page = None

    async def init_browser(self, headless=False):
        self.playwright = await playwright.async_playwright().start()
        self.browser = await self.playwright.chromium.launch(headless=headless)

    # nwm czy to nie lekki overkill, mze lepiej byloby to po prostu zrobic jedna funkcje co sprawdza czy jest browser+page i tyle
    def ensure_page_browser_decorator(func):
        @functools.wraps(func)
        async def wrapper(self, *args):
            try:
                if self.browser is None:
                    await self.init_browser()
                if self.page is None:
                    self.page = await self.browser.new_page()
                return await func(self, *args)
            except Exception as e:
                return f"Errror in {func.__name__}:{str(e)}"

        return wrapper

    @ensure_page_browser_decorator
    async def open_url(self, url: str):
        await self.page.goto(url)
        return f"Successfully opened {url}"

    # samo klik to wgl bedzie za malo imo. Bo dla niego funkcja click, check albo option to inne rzeczy sam click wszystkie nie rozwiaze musialbym zrobic jakas funckje ktora na podstawie selektora dobierze odpowiednia akcje. Ale for now starczy
    @ensure_page_browser_decorator
    async def click_element(self, selector: str):
        await self.page.click(selector)
        return f"successfully clicked: {selector}"

    @ensure_page_browser_decorator
    async def type_text(self, selector: str, text: str):
        await self.page.fill(selector, text)
        return f"success {text} has been written to:{selector} "

    @ensure_page_browser_decorator
    async def inspect_page(self) -> dict:
        title = await self.page.title()
        url = self.page.url

        # wyciagam z dom elementy interaktywne -> na tablice -> serializuje na json
        # W PRZYSZLOSCI MOZNA DODAC WIECEJ NA RAZIE TYLE MI PRZYCHODZI DO GLOWY
        # Skrypt JS do serializacji interaktywnej części strony
        # co do selectora to w skrocie sprawdza czy jest id -> nie ma to sprawdza czy jest nazwa -> nie ma to zwraca tag name proste -> w przeciwnych warunkach to bezposrednio zwraca id, nazwe...
        js_code = """
        (() => {
            const allElements = document.querySelectorAll("button, [type='submit'], input, a, [role='button']");
            
            return Array.from(allElements)
                .filter(el => el.checkVisibility() && el.offsetWidth > 0 && el.offsetHeight > 0)
                .map(el => {
                    const selector = (() => {
                        if (el.id) return `#${el.id}`;
                        
                        if (el.tagName === 'INPUT') {
                            const name = el.getAttribute('name');
                            const placeholder = el.getAttribute('placeholder');
                            if (name) return `input[name="${name}"]`;
                            if (placeholder) return `input[placeholder="${placeholder}"]`;
                            return 'input';
                        }
                        
                        const text = el.innerText.trim();
                        if (text) {
                            const cleanText = text.replace(/\\n/g, ' ').replace(/"/g, '\\"').slice(0, 30);
                            return `${el.tagName.toLowerCase()}:has-text("${cleanText}")`;
                        }
                        
                        return el.tagName.toLowerCase();
                    })();
                    
                    
                    
                    return {
                        tag: el.tagName.toLowerCase(),
                        text: el.innerText.trim() || el.value || el.placeholder || "",
                        id: el.id || null,
                        role: el.getAttribute('role') || null,
                        aria_label: el.getAttribute('aria-label') || null,
                        selector: selector
                    };
                });
        })()
        """
        # powinno dzialac (clueless)

        elements = await self.page.evaluate(
            js_code
        )  # pozwala uruchomic funkcje js https://playwright.dev/docs/evaluating

        return {"title": title, "url": url, "elements": elements}
