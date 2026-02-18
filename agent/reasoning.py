"""
reasoning.py — Multi-step reasoning workflow orchestrator.
Implements an Analyze → Plan → Execute → Synthesize pipeline
that is transparent and logged at each step.
"""

from utils.helpers import log_step


class ReasoningWorkflow:
    """
    Orchestrates a multi-step reasoning process for complex sales queries.

    Steps:
      1. ANALYZE  — Understand the user's intent and extract key entities
      2. PLAN     — Determine which tools/data sources are needed
      3. EXECUTE  — The agent calls tools (handled by the LLM loop)
      4. SYNTHESIZE — Combine results into a coherent answer

    This class manages the reasoning context and provides prompts that
    guide the LLM through each step.
    """

    SYSTEM_PROMPT = """You are an expert Retail Sales AI Assistant. You help sales teams, 
distributors, and retailers by providing actionable insights, tracking orders, 
checking inventory, and facilitating new orders.

## Your Capabilities
You have access to the following tools:
- **get_distributors**: List all distributors
- **get_distributor_details**: Get info about a specific distributor  
- **get_distributor_inventory**: Check stock levels for a distributor
- **get_retailers**: List all retailers
- **get_retailer_details**: Get retailer info with credit status
- **get_order_status**: Get order history for a retailer
- **place_order**: Place a new order for a retailer
- **get_sales_insights**: Get aggregated sales analytics

## Multi-Step Reasoning Process
When answering queries, follow this structured approach:

1. **ANALYZE**: Carefully understand what the user is asking. Identify the key 
   entities (retailer IDs, distributor IDs, product names) and the type of 
   information needed.

2. **PLAN**: Determine which tools to call and in what order. For complex 
   queries, you may need to chain multiple tool calls (e.g., first check 
   inventory, then check credit, then place order).

3. **EXECUTE**: Call the necessary tools. If a tool returns data that informs 
   the next step, use that data to make the next call.

4. **SYNTHESIZE**: Combine all the gathered information into a clear, 
   actionable response. Include specific numbers, recommendations, and 
   next steps when appropriate.

## Response Style
- Be professional but approachable
- Use data from tool calls to back up your recommendations
- When presenting numbers, format them clearly (currency, percentages)
- If you need to make assumptions, state them explicitly
- Proactively suggest related insights or actions the user might find useful

## Important Notes
- Retailer IDs follow the format R001, R002, etc.
- Distributor IDs follow the format D001, D002, etc.
- Product IDs follow the format P001, P002, etc.
- Always verify credit availability before recommending order placement
- Flag any inventory items near their reorder level
"""

    def __init__(self):
        self.steps_log: list[dict] = []

    def get_system_prompt(self) -> str:
        """Return the system prompt that guides the LLM reasoning."""
        return self.SYSTEM_PROMPT

    def log_reasoning_step(self, phase: str, detail: str):
        """Record a reasoning step for auditability."""
        entry = {"phase": phase, "detail": detail}
        self.steps_log.append(entry)
        log_step(f"[{phase}]", detail)

    def analyze(self, user_message: str) -> str:
        """Log the analysis phase."""
        self.log_reasoning_step("ANALYZE", f"Processing query: '{user_message[:80]}...'")
        return user_message

    def plan(self, tool_calls: list) -> list:
        """Log the planning phase when the LLM decides on tool calls."""
        tool_names = [tc.function.name for tc in tool_calls]
        self.log_reasoning_step("PLAN", f"Tools selected: {', '.join(tool_names)}")
        return tool_calls

    def execute_logged(self, tool_name: str, result_summary: str):
        """Log each tool execution."""
        self.log_reasoning_step("EXECUTE", f"{tool_name} → {result_summary[:100]}")

    def synthesize(self, final_response: str):
        """Log the synthesis phase."""
        self.log_reasoning_step("SYNTHESIZE", "Composing final response with gathered data.")

    def get_reasoning_trace(self) -> list[dict]:
        """Return the full reasoning trace for this session."""
        return self.steps_log

    def reset(self):
        """Clear the reasoning log for a new query."""
        self.steps_log = []
