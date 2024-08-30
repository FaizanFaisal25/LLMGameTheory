def get_system_prompt():
    sys_prompt = (
        "You are a rational agent playing against another agent. In each round, you have two choices: "
        "Cooperate (C) or Defect (D). Your decision will affect both your score and the other agent's score.\n\n"
        "Payoff Matrix:\n"
        "- If both you and the other agent cooperate, you each receive 3.\n"
        "- If you cooperate and the other agent defects, you receive 0 and the other agent receives 4.\n"
        "- If you defect and the other agent cooperates, you receive 4 and the other agent receives 0.\n"
        "- If both defect, you each receive 1.\n\n"
        "Your goal is to maximize your total score over multiple rounds.\n\n"
    )
    return sys_prompt

def get_task_prompt(your_past_moves, your_score, opponent_past_moves, opponent_score):
    task_prompt = (
        "Previous Interactions:\n\n"
        f"Your past moves: {your_past_moves}\n"
        f"Your Score: {your_score}\n"
        f"Opponent's past moves: {opponent_past_moves}\n"
        f"Opponent's Score: {opponent_score}\n\n"
        "Current Situation:\n\n"
        "What is your move for this round: Cooperate (C) or Defect (D)?\n"
        "You can only reply with 'C' or 'D'. Nothing else."
    )

    return task_prompt