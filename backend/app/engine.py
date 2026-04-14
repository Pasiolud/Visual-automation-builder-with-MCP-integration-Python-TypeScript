from backend.app.context import MacroContext
from backend.app.models import GraphPayload
from backend.app.handlers import  NodeExecutor

class GraphEngine:
    def __init__(self, payload: GraphPayload):
        self.call_stack = []
        self.payload = payload
        self.adjacency_map = {}
        self.start_node_id = None
        self.context = MacroContext()
        self.node_dict = {
            node.id: node for node in self.payload.nodes
        }  # id -> obiekt node

    def build_map(self):
        for node in self.payload.nodes:
            if node.type == "startNode":
                self.start_node_id = node.id
                break
        if self.start_node_id is None:
            raise ValueError("Start node not found")

        for edge in self.payload.edges:
            # masakra to mi zajelo dluzej niz sie spodziewalem

            if edge.source_id not in self.adjacency_map:
                self.adjacency_map[edge.source_id] = []
            self.adjacency_map[edge.source_id].append(
                (edge.target_id, edge.source_handle)
            )  # na przyszlosc jakbys sie zastanawial po co ten edge.source_handle. To generalnie jakbyś miał więcej niż jeden wyjść z danego węzła to byś mógł rozróżniać które wyjście jest które
            ###
            # Teraz oba kable wychodzą z tego samego klocka (Pętla)! Gdyby nie source_handle, silnik by zgłupiał: "Stoję na Pętli, widzę dwa kable, oba prowadzą dalej którym mam iść?".
            # Wtedy source_handle:
            # Kabel A ma source_handle="next_item".
            # Kabel B ma source_handle="completed".
            # Silnik sprawdza swój licznik pętli i mówi: "Jeszcze mam elementy, więc szukam kabla, który w source_handle ma napisane next_item".

    async def run(self):
        current_id = self.start_node_id
        while current_id:
            next_node_id = None
            current_node = self.node_dict.get(current_id)
            if not current_node:
                print(f"Error: Cannot find node with id: {current_id}")
                break

            print(f"Processing node current_id:{current_id} - {current_node.type}")
            
            #wykonuje odpowiedniego node. Jesli ktorys node by byl typem petlowym
            #to dodaje go na call stack i przypadku dojscia na slepy zaulek jakiegos noda upewniam sprawdzam czy call_stack jest pusty -> if not neighbors -> if self.call_stack
            executor = NodeExecutor(self.context)
            handle_to_use = await executor.execute_node(current_node)

            if handle_to_use == "next_item":
                self.call_stack.append(current_id)

            neighbors = self.adjacency_map.get(
                current_id, []
            )  # [] bo co jakby nigdzie nie wychodził? Bez tego by sie system wywalil

            if not neighbors:
                # jesli koniec grafu sprawdz czy cos jest na call stacku jesli jest to powrot do petli
                if self.call_stack:
                    current_id = self.call_stack.pop()
                    continue
                else:
                    print(f"No next nodes for {current_id} - ending the graph jounrey")
                    break

            for target_id,handle in neighbors:  # sprawdzam sasiadow i decyduje czy ma wiecej niz jednego sasaida(aka node z wiecej niz jednym wyjsciem)
                if handle == handle_to_use:  
                    next_node_id = target_id
                    break

            current_id = next_node_id
        

