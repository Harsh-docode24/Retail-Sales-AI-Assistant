"""
main.py — Entry point for the Retail Sales AI Assistant.
Starts the simulated REST APIs and launches the interactive CLI agent session.
"""

import os
import sys
import threading
import time

import uvicorn
from dotenv import load_dotenv

from utils.helpers import console, print_welcome, print_error, log_step


def start_api_server(app_import: str, port: int, name: str):
    """Start a FastAPI server in a background thread."""
    log_step("SERVER", f"Starting {name} on port {port}...")
    config = uvicorn.Config(
        app_import,
        host="127.0.0.1",
        port=port,
        log_level="warning",
    )
    server = uvicorn.Server(config)
    server.run()


def main():
    # Load environment variables
    load_dotenv()

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or api_key == "your-openai-api-key-here":
        print_error(
            "OPENAI_API_KEY not set. Copy .env.example to .env and add your key.\n"
            "  Get a key at: https://platform.openai.com/api-keys"
        )
        sys.exit(1)

    dist_port = int(os.getenv("DISTRIBUTOR_API_PORT", "8001"))
    ret_port = int(os.getenv("RETAILER_API_PORT", "8002"))

    # ── Start API Servers in Background ────────────────────────────────────
    distributor_thread = threading.Thread(
        target=start_api_server,
        args=("api.distributor_api:app", dist_port, "Distributor API"),
        daemon=True,
    )
    retailer_thread = threading.Thread(
        target=start_api_server,
        args=("api.retailer_api:app", ret_port, "Retailer API"),
        daemon=True,
    )

    distributor_thread.start()
    retailer_thread.start()

    # Wait for servers to be ready
    time.sleep(2)
    log_step("SERVER", f"✔ Distributor API running on http://127.0.0.1:{dist_port}")
    log_step("SERVER", f"✔ Retailer API running on http://127.0.0.1:{ret_port}")

    # ── Configure Agent Tool URLs ──────────────────────────────────────────
    from agent import tools
    tools.DISTRIBUTOR_API = f"http://127.0.0.1:{dist_port}"
    tools.RETAILER_API = f"http://127.0.0.1:{ret_port}"

    # ── Initialize AI Agent ────────────────────────────────────────────────
    from agent.sales_agent import SalesAgent
    agent = SalesAgent(api_key=api_key)

    # ── Interactive CLI Loop ───────────────────────────────────────────────
    print_welcome()

    while True:
        try:
            user_input = console.input("[bold bright_blue]You ▸ [/bold bright_blue]").strip()

            if not user_input:
                continue

            if user_input.lower() in ("quit", "exit", "q"):
                console.print("\n[dim]👋 Goodbye! Happy selling![/dim]\n")
                break

            if user_input.lower() == "reset":
                agent.reset_conversation()
                console.print("[dim]🔄 Conversation reset.[/dim]\n")
                continue

            if user_input.lower() == "trace":
                trace = agent.get_reasoning_trace()
                if trace:
                    console.print("\n[bold]📋 Reasoning Trace:[/bold]")
                    for step in trace:
                        console.print(f"  [{step['phase']}] {step['detail']}")
                    console.print()
                else:
                    console.print("[dim]No reasoning trace available yet.[/dim]\n")
                continue

            # Process the query
            agent.chat(user_input)

        except KeyboardInterrupt:
            console.print("\n[dim]👋 Session ended.[/dim]\n")
            break
        except Exception as e:
            print_error(f"An error occurred: {e}")
            console.print("[dim]Please try again or type 'quit' to exit.[/dim]\n")


if __name__ == "__main__":
    main()
