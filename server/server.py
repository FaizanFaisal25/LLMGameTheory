from flask import Flask, jsonify, request
from flask_cors import CORS
from agent_utils.GameAgent import GameAgent
from agent_utils.prompt_templates import get_system_prompt, get_task_prompt
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

agent_1 = GameAgent(system_message=get_system_prompt())
agent_2 = GameAgent(system_message=get_system_prompt())

@app.route('/api/decision', methods=['POST'])
def get_decision():
    data = request.get_json()
    
    # Extract data from the request
    agentAHistory = data.get('agentAHistory', [])
    agentBHistory = data.get('agentBHistory', [])
    agentAPoints = data.get('agentAPoints', 0)
    agentBPoints = data.get('agentBPoints', 0)
    
    # Generate prompts for both agents
    agent_1_prompt = get_task_prompt(agentAHistory, agentAPoints, agentBHistory, agentBPoints)
    agent_2_prompt = get_task_prompt(agentBHistory, agentBPoints, agentAHistory, agentAPoints)

    # Get decisions from both agents
    agent_1_decision = agent_1.get_agent_response(agent_1_prompt)
    agent_2_decision = agent_2.get_agent_response(agent_2_prompt)

    # Return the decisions in the response
    return jsonify({
        'agent_1': agent_1_decision,
        'agent_2': agent_2_decision
    })

if __name__ == '__main__':
    app.run(debug=True, port=9988)