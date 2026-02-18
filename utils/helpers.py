"""
helpers.py — Shared utilities for logging, formatting, and display.
"""

import json
from datetime import datetime

from rich.console import Console
from rich.panel import Panel
from rich.markdown import Markdown
from rich.table import Table


console = Console()


def log_step(step_name: str, detail: str = ""):
    """Print a timestamped reasoning step to the console."""
    ts = datetime.now().strftime("%H:%M:%S")
    console.print(f"  [dim]{ts}[/dim]  [bold cyan]▸ {step_name}[/bold cyan]  {detail}")


def print_agent_response(text: str):
    """Render the agent's final response in a styled panel."""
    console.print()
    console.print(Panel(Markdown(text), title="🤖 Sales Agent", border_style="green", padding=(1, 2)))
    console.print()


def print_tool_call(tool_name: str, args: dict):
    """Log a tool invocation."""
    args_str = json.dumps(args, indent=2) if args else "{}"
    console.print(f"  [yellow]⚙ Calling tool:[/yellow] [bold]{tool_name}[/bold]")
    if args:
        console.print(f"    [dim]{args_str}[/dim]")


def print_tool_result(result: str, max_len: int = 500):
    """Log the result returned from a tool call (truncated)."""
    display = result[:max_len] + "..." if len(result) > max_len else result
    console.print(f"  [green]✔ Result:[/green] [dim]{display}[/dim]")


def print_error(message: str):
    """Display an error message."""
    console.print(f"  [bold red]✖ Error:[/bold red] {message}")


def print_welcome():
    """Display the welcome banner."""
    console.print()
    console.print(
        Panel(
            "[bold white]Retail Sales AI Assistant[/bold white]\n"
            "[dim]Powered by OpenAI GPT-4 with Tool Calling[/dim]\n\n"
            "Ask me about distributors, retailers, orders, inventory,\n"
            "sales insights, or place new orders!\n\n"
            "[dim italic]Type 'quit' or 'exit' to end the session.[/dim italic]",
            title="🛒",
            border_style="bright_blue",
            padding=(1, 3),
        )
    )
    console.print()


def format_table(title: str, columns: list[str], rows: list[list[str]]) -> Table:
    """Build a Rich table for display."""
    table = Table(title=title, show_lines=True)
    for col in columns:
        table.add_column(col, style="cyan")
    for row in rows:
        table.add_row(*row)
    return table
