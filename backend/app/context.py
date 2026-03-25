class MacroContext:
    def __init__(self):
        self.variables = {}
        self.playwright = None
        self.browser = None
        self.page = None
    def set(self, key:str,value):
        self.variables[key] = value
    def get(self, key:str):
        return self.variables.get(key)