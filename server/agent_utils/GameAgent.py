from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent
from dotenv import load_dotenv
from langchain_community.tools.tavily_search import TavilySearchResults

class GameAgent:
    def __init__(self, system_message: str):
        self.model = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.5)
        self.memory = MemorySaver()
        self.tools = [TavilySearchResults(max_results=3)] # replace this with more relevant tool later if needed!
        self.agent_executor = create_react_agent(self.model, self.tools, checkpointer=self.memory)
        # Initialize chat history with system message
        self.chat_history = [SystemMessage(content=system_message)]        
        self.config = {"configurable": {"thread_id": "abc123"}}

    def add_prompt_message(self, content: str):
        self.chat_history.append(HumanMessage(content=content))

    def get_agent_response(self, prompt: str):
        self.add_prompt_message(prompt)
        final_message = ""
        print("prompt: ", prompt)
        for chunk in self.agent_executor.stream({"messages": self.chat_history}, self.config):
            final_message = chunk
        response = final_message['agent']['messages'][0].content.upper()
        # remove last message from chat history
        self.chat_history.pop()
        return response