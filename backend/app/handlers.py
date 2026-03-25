import playwright.async_api as playwright
import re
import csv
import os
class NodeExecutor():
    def __init__(self, context):
        self.context = context


    async def execute_node(self, node):
        method_to_use = f"_handle_{node.type}"

        handler = getattr(self,method_to_use,None)

        if handler: # dla pewnosci czy taki istnieje
            return await handler(node)
        else:
            print(f"unkown node type {node.type}")
            return None

            
    async def _handle_logNode(self, node):
        pattern = r"\{\{(.*?)\}\}" 
        message = node.data['message']

        matches = re.findall(pattern,message)
        if matches:
            for i,match in enumerate(matches):
                if match not in self.context.variables:
                    print(f"Error - there is no variable named {match}")
                    raise Exception(f"Error - there is no variable named {match}")
                else:
                    message = re.sub(pattern,self.context.variables[match],message,count=1)
                
        print(f"log node message:{message}")
        return None

    async def _handle_startNode(self,node):
        return None
    
    async def _handle_openUrlNode(self,node):
        url = node.data.get('url')
        if self.context.browser is None:
            self.context.playwright = await playwright.async_playwright().start()
            self.context.browser = await self.context.playwright.chromium.launch(headless=False)
            self.context.page = await self.context.browser.new_page()

        await self.context.page.goto(url)
        return None

    async def _handle_extractMultipleNode(self,node):
        if self.context.page is None:
            print("error - tried to select date without any page open")
            return None
        
        selector = node.data.get('selector')
        extract_type = node.data.get('extractType','text')

        user_variable_name = node.data.get("listVariableName")
        
        if extract_type == 'text':
            result_list = await self.context.page.locator(selector).all_inner_texts()
        elif extract_type == 'href':
            result_list = await self.context.page.locator(selector).evaluate_all("elements => elements.map(e => e.getAttribute('href'))")
        
        self.context.variables[user_variable_name] = result_list
        return None
        
    async def _handle_loopNode(self,node):
        # nazwa listy przez ktora chcemy iterowac
        list_loop_through_name = node.data.get("listVariableName")
        # nazwa dla pojedynczego elementu np. for i in (to tak jakby te i)
        element_name = node.data.get("itemVariableName")

        # sprawdzam czy wgl taka lista jest w pamieci
        list_data = self.context.variables.get(list_loop_through_name)
        if list_data == None:
            print(f"There is no such a list {list_data}")
            raise Exception(f"ERROR - variable {list_data} does not exist in memory!")
        
        # sprawdzam czy lista nie jest pusta
        if list_data:
            self.context.variables[element_name] = list_data.pop()
            return "next_item"
        else:
            return "completed"
        
    async def _handle_clickNode(self,node):
        btn_to_click = node.data.get('selector')
        if self.context.page is None:
            print("Err - there is no open page to click on")
            raise Exception("Err - there is no open page to click on")
        
        await self.context.page.locator(btn_to_click).click()
        return None    

    async def _handle_typeNode(self,node):
        input_to_type_in= node.data.get('selector')
        if self.context.page is None:
            print("Err - there is no open page to write in")
            raise Exception("Err - there is no open page to write in")
        
        user_text_input = node.data.get('text')

        await self.context.page.locator(input_to_type_in).fill(user_text_input)
        return None    
    
    async def _handle_extract_node(self,node):
        pass 
        # trzeba sie zastanowic czy to wgl potrzebne skoro jest extractMultipleNode

    async def _handle_exportCsvNode(self,node):
        file_path = node.data.get('filePath')
        variables_to_export = node.data.get('variables', '')
        
        if not file_path or not variables_to_export:
            print("csv ignored - no file path or variables to export")
            return None
            
        columns = [var.strip() for var in variables_to_export.split(',')]
        row_data = []
        for col in columns:
            if col not in self.context.variables:
                print(f"error - variable {col} not found in memory")
                raise Exception(f"error - variable {col} not found in memory")
            
            val = self.context.variables[col]
            row_data.append(str(val))
            
        file_exists = os.path.isfile(file_path)
        
        with open(file_path, mode='a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            if not file_exists:
                writer.writerow(columns)
                
            writer.writerow(row_data)
            
        return None
