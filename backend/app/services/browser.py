import playwright.async_api as playwright


class BrowserService:
    def __init__(self):
        self.playwright = None
        self.browser = None
        self.page = None

    async def init_browser(self, headless=False):
        self.playwright = await playwright.async_playwright().start()
        self.browser = await self.playwright.chromium.launch(headless=headless)

    async def open_url(self, url: str):
        if self.browser is None:
            await self.init_browser()
        self.page = await self.browser.new_page()
        await self.page.goto(url)
        return f"Strona {url} została otwarta"

    async def inspect_page(self) -> dict:
        title = await self.page.title()
        url = self.page.url
        # wyciagam z dom elementy interaktywne -> na tablice -> serializuje na json
        # W PRZYSZLOSCI MOZNA DODAC WIECEJ NA RAZIE TYLE MI PRZYCHODZI DO GLOWY
        js = r"""
        ()=>{
        let all_elements = document.querySelectorAll("button, [type='submit'], input, a")
        
        const visible_elements_only = Array.from(all_elements).filter(el=>{
            return el.checkVisibility() && el.offsetWidth > 0 && el.offsetHeight>0 
        })
        
        return visible_elements_only.map(el => ({
            tag: el.tagName.toLowerCase(),
            text: el.innerText.trim() || el.value || el.placeholder || "",
            id: el.id,
            role: el.getAttribute('role'),
            aria_label: el.getAttribute('aria-label'),
            selector: (() => {
             if (el.id) return `#${el.id}`;
    
            if (el.tagName === 'INPUT') {
            const name = el.getAttribute('name');
            const placeholder = el.getAttribute('placeholder');
            if (name) return `input[name="${name}"]`;
            if (placeholder) return `input[placeholder="${placeholder}"]`;
            return 'input'; // ostateczny ratunek
         }
    
    const rawText = el.innerText.trim();
    if (rawText) {
        // Czyścimy tekst z nowych linii i cudzysłowów, żeby nie psuł selektora
        const cleanText = rawText.replace(/\n/g, ' ').replace(/"/g, '\\"').slice(0, 30);
        return `${el.tagName.toLowerCase()}:has-text("${cleanText}")`;
    }
    
    // 4. Jeśli nic nie ma - zwracamy po prostu tag
    return el.tagName.toLowerCase();
})()
        }))
        }
        """
        # powinno dzialac (clueless)

        elements = await self.page.evaluate(
            js
        )  # pozwala uruchomic funkcje js https://playwright.dev/docs/evaluating

        return {"title": title, "url": url, "elements": elements}
