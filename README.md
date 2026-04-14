# NodeGhost Python (RPA + React)

This is an RPA project built with Python + React (kinda like Zapier). My main goal is to integrate MCP and AI into it, allowing agents to autonomously create automations down the road. 

I'm also planning to add an AI-powered site scanner feature. For example, if a website changes its CSS classes and breaks the scraping logic, instead of checking and fixing it manually, the AI could scan the DOM, figure out what changed, and tweak the selectors automatically. I'm currently working on it, so it's still a bit clunky for now, but it works!

Fun fact: The React frontend was actually stripped from my older attempt at building this project in Rust. Why? At the beginning, I wanted to build a native app, but I quickly realized I didn't want to learn Rust from scratch just yet, so I pivoted to Python for the backend.

## Examples

Here are some visual examples (with screenshots):

<img width="1471" height="631" alt="csvExample" src="https://github.com/user-attachments/assets/c41a4bae-3771-4162-ba71-b6c6dbf6defe" />

This image shows a simple flow: it goes to a URL -> scrapes data (we can choose the selectors and the variable it saves to) -> loops through that variable in memory -> saves each element into a CSV file.

<img width="640" height="356" alt="csvSS" src="https://github.com/user-attachments/assets/11f26886-960c-4803-ac0c-9a6764b7e54b" />

Here's another one:

<img width="1212" height="565" alt="openYtandSearchCrazyFrog" src="https://github.com/user-attachments/assets/df7f2f40-1a20-4ced-8133-7ba7d07dcbae" />

This flow goes to YouTube, writes "crazy frog" for us, and then clicks the search button.

15.04.2026:
finally the llm can use tools although for now not all of them are implemented, but it should be starighforward now since the system works.
 async def test():
        agent = Agent()
        try:
            answer = await agent.ask("Wejdz na youtube.com ")
            print(f"Odpowiedz: {answer}")
        except Exception as e:
            print(f"Error: {e}")

I struggled with this "Error: Function open_page is a coroutine function, which is not supported for automatic function calling. Please manually invoke open_page to get the function response."
for like few hours but it turns out the gemini can not use async function(which makes sense) so i needed to write tool loop myself
