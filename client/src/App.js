import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function App() {
  const [rounds, setRounds] = useState([]);
  const [agentAPoints, setAgentAPoints] = useState(0);
  const [agentBPoints, setAgentBPoints] = useState(0);
  const [agentAScores, setAgentAScores] = useState([0]); // Initial score 0
  const [agentBScores, setAgentBScores] = useState([0]); // Initial score 0
  const [loading, setLoading] = useState(false);
  const [agentAHistory, setAgentAHistory] = useState([]);
  const [agentBHistory, setAgentBHistory] = useState([]);

  const playRound = async () => {
    setLoading(true); // Show the loading indicator
    try {
      // Prepare the data to send
      const requestData = {
        agentAHistory,
        agentBHistory,
        agentAPoints,
        agentBPoints
      };

      // Make the POST request
      const response = await fetch('http://localhost:9988/api/decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      const agentAMove = result.agent_1;
      const agentBMove = result.agent_2;

      const roundResult = evaluateRound(agentAMove, agentBMove);
      setRounds([...rounds, roundResult]);

      const newAgentAPoints = agentAPoints + roundResult.agentAPoints;
      const newAgentBPoints = agentBPoints + roundResult.agentBPoints;

      setAgentAPoints(newAgentAPoints);
      setAgentBPoints(newAgentBPoints);

      setAgentAScores([...agentAScores, newAgentAPoints]); // Include new points
      setAgentBScores([...agentBScores, newAgentBPoints]); // Include new points

      setAgentAHistory([...agentAHistory, agentBMove]);
      setAgentBHistory([...agentBHistory, agentAMove]);
    } catch (error) {
      console.error('Error fetching agent moves:', error);
    } finally {
      setLoading(false); // Hide the loading indicator
    }
  };

  const evaluateRound = (moveA, moveB) => {
    let agentAPoints = 0;
    let agentBPoints = 0;

    if (moveA === 'C' && moveB === 'C') {
      agentAPoints = 3;
      agentBPoints = 3;
    } else if (moveA === 'D' && moveB === 'D') {
      agentAPoints = 1;
      agentBPoints = 1;
    } else if (moveA === 'C' && moveB === 'D') {
      agentAPoints = 0;
      agentBPoints = 5;
    } else if (moveA === 'D' && moveB === 'C') {
      agentAPoints = 5;
      agentBPoints = 0;
    }

    return { agentAMove: moveA, agentBMove: moveB, agentAPoints, agentBPoints };
  };

  const data = {
    labels: [`Round 0`, ...rounds.map((_, index) => `Round ${index + 1}`)], // Start with Round 0
    datasets: [
      {
        label: 'Agent A',
        data: agentAScores,
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1,
      },
      {
        label: 'Agent B',
        data: agentBScores,
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Iterated Prisoner’s Dilemma</h1>
      
      <div className="flex flex-col sm:flex-row justify-center items-center mb-8 space-y-6 sm:space-y-0 sm:space-x-12">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-blue-500">Agent A</h2>
          <p className="text-xl mt-2 text-gray-700">Points: {agentAPoints}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-blue-500">Agent B</h2>
          <p className="text-xl mt-2 text-gray-700">Points: {agentBPoints}</p>
        </div>
      </div>
  
      <button
        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
        onClick={playRound}
        disabled={loading} // Disable button while loading
      >
        {loading ? 'Loading...' : 'Play Round'}
      </button>
      {loading && (
        <div className="mt-4 flex items-center">
          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 100 8v4a8 8 0 01-8-8z"></path>
          </svg>
          <span className="ml-2 text-blue-500">Processing...</span>
        </div>
      )}
      <div className="mt-8 w-full max-w-3xl">
        <h2 className="text-xl font-semibold mb-4 text-center text-blue-600">Score Over Time</h2>
        <Line data={data} />
      </div>
      <div className="mt-8 w-full max-w-3xl">
        <h2 className="text-xl font-semibold mb-4 text-center text-blue-600">Round Results</h2>
        <ul className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          {rounds.map((round, index) => (
            <li key={index} className="text-lg text-gray-800">
              <div className="font-bold mb-2">Round {index + 1}:</div>
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <span className="font-semibold text-blue-500">Agent A:</span>
                <span>{round.agentAMove}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-4 mt-2">
                <span className="font-semibold text-blue-500">Agent B:</span>
                <span>{round.agentBMove}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
