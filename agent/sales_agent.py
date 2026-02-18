"""
sales_agent.py — Core AI Sales Agent powered by OpenAI with tool-calling.
Manages conversation state, tool dispatch, and multi-turn interactions.
"""

import json
from openai import OpenAI

from agent.tools import TOOL_DEFINITIONS, execute_tool
from agent.reasoning import ReasoningWorkflow
from utils.helpers import print_agent_response, log_step


class SalesAgent:
    """
    Interactive sales agent that uses OpenAI's chat completions with
    structured tool-calling to answer retail sales queries.
    """

    MODEL = "gpt-4o-mini"  # Cost-effective model with strong tool-calling support

    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)
        self.reasoning = ReasoningWorkflow()
        self.conversation: list[dict] = [
            {"role": "system", "content": self.reasoning.get_system_prompt()}
        ]

    def chat(self, user_message: str) -> str:
        """
        Process a user message through the full reasoning pipeline:
        Analyze → Plan → Execute (tool calls) → Synthesize → Respond.
        """
        # ── Step 1: ANALYZE ───────────────────────────────────────────────
        self.reasoning.reset()
        self.reasoning.analyze(user_message)

        # Add user message to conversation history
        self.conversation.append({"role": "user", "content": user_message})

        # ── Step 2-3: PLAN & EXECUTE (LLM decides tools, we execute) ─────
        response = self._call_llm()

        # Handle tool-calling loop (multi-step)
        max_iterations = 10  # Safety limit
        iteration = 0

        while response.choices[0].message.tool_calls and iteration < max_iterations:
            iteration += 1
            assistant_message = response.choices[0].message
            self.conversation.append(assistant_message)

            # Log planning phase
            self.reasoning.plan(assistant_message.tool_calls)

            # Execute each tool call
            for tool_call in assistant_message.tool_calls:
                func_name = tool_call.function.name
                func_args = json.loads(tool_call.function.arguments)

                # Execute the tool
                result = execute_tool(func_name, func_args)

                # Log execution
                self.reasoning.execute_logged(func_name, result[:100])

                # Add tool result to conversation
                self.conversation.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": result,
                })

            # Call LLM again with tool results
            response = self._call_llm()

        # ── Step 4: SYNTHESIZE ────────────────────────────────────────────
        final_content = response.choices[0].message.content or ""
        self.conversation.append({"role": "assistant", "content": final_content})
        self.reasoning.synthesize(final_content)

        # Display the response
        print_agent_response(final_content)

        return final_content

    def _call_llm(self):
        """Make a chat completion call with tools enabled."""
        return self.client.chat.completions.create(
            model=self.MODEL,
            messages=self.conversation,
            tools=TOOL_DEFINITIONS,
            tool_choice="auto",
            temperature=0.3,
        )

    def get_reasoning_trace(self) -> list[dict]:
        """Return the reasoning trace for the last query."""
        return self.reasoning.get_reasoning_trace()

    def reset_conversation(self):
        """Clear conversation history (keep system prompt)."""
        self.conversation = [
            {"role": "system", "content": self.reasoning.get_system_prompt()}
        ]
        log_step("RESET", "Conversation history cleared.")
