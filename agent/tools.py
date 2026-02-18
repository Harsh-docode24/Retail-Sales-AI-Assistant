"""
tools.py — Tool definitions and execution for OpenAI function-calling.
Each tool maps to a REST API endpoint on the simulated distributor/retailer services.
"""

import json
import httpx

from utils.helpers import print_tool_call, print_tool_result, print_error

# Base URLs for the simulated APIs (overridden in main.py if needed)
DISTRIBUTOR_API = "http://127.0.0.1:8001"
RETAILER_API = "http://127.0.0.1:8002"


# ─── OpenAI Tool Schemas ──────────────────────────────────────────────────────

TOOL_DEFINITIONS = [
    {
        "type": "function",
        "function": {
            "name": "get_distributors",
            "description": "List all distributors with their details, regions, and specialties.",
            "parameters": {"type": "object", "properties": {}, "required": []},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_distributor_details",
            "description": "Get detailed information about a specific distributor by ID.",
            "parameters": {
                "type": "object",
                "properties": {
                    "distributor_id": {
                        "type": "string",
                        "description": "The distributor ID, e.g. 'D001'",
                    }
                },
                "required": ["distributor_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_distributor_inventory",
            "description": "Check current stock/inventory levels for a specific distributor.",
            "parameters": {
                "type": "object",
                "properties": {
                    "distributor_id": {
                        "type": "string",
                        "description": "The distributor ID, e.g. 'D001'",
                    }
                },
                "required": ["distributor_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_retailers",
            "description": "List all retailers with their store info, credit limits, and loyalty tiers.",
            "parameters": {"type": "object", "properties": {}, "required": []},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_retailer_details",
            "description": "Get detailed info about a specific retailer including credit status.",
            "parameters": {
                "type": "object",
                "properties": {
                    "retailer_id": {
                        "type": "string",
                        "description": "The retailer ID, e.g. 'R001'",
                    }
                },
                "required": ["retailer_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_order_status",
            "description": "Get all orders for a specific retailer, including order status and details.",
            "parameters": {
                "type": "object",
                "properties": {
                    "retailer_id": {
                        "type": "string",
                        "description": "The retailer ID, e.g. 'R001'",
                    }
                },
                "required": ["retailer_id"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "place_order",
            "description": "Place a new order for a retailer from a specific distributor.",
            "parameters": {
                "type": "object",
                "properties": {
                    "retailer_id": {
                        "type": "string",
                        "description": "The retailer ID placing the order, e.g. 'R001'",
                    },
                    "distributor_id": {
                        "type": "string",
                        "description": "The distributor ID to order from, e.g. 'D001'",
                    },
                    "items": {
                        "type": "array",
                        "description": "List of items to order",
                        "items": {
                            "type": "object",
                            "properties": {
                                "product_id": {
                                    "type": "string",
                                    "description": "Product ID, e.g. 'P001'",
                                },
                                "quantity": {
                                    "type": "integer",
                                    "description": "Number of units to order",
                                },
                            },
                            "required": ["product_id", "quantity"],
                        },
                    },
                },
                "required": ["retailer_id", "distributor_id", "items"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_sales_insights",
            "description": "Get aggregated sales analytics: total revenue, top products, revenue by region and retailer.",
            "parameters": {"type": "object", "properties": {}, "required": []},
        },
    },
]


# ─── Tool Execution ───────────────────────────────────────────────────────────

def execute_tool(tool_name: str, arguments: dict) -> str:
    """
    Execute a tool by calling the corresponding REST API endpoint.
    Returns the JSON result as a string for the LLM.
    """
    print_tool_call(tool_name, arguments)

    try:
        result = _dispatch_tool(tool_name, arguments)
        result_str = json.dumps(result, indent=2)
        print_tool_result(result_str)
        return result_str
    except httpx.HTTPStatusError as e:
        error_msg = f"API error {e.response.status_code}: {e.response.text}"
        print_error(error_msg)
        return json.dumps({"error": error_msg})
    except Exception as e:
        error_msg = f"Tool execution failed: {str(e)}"
        print_error(error_msg)
        return json.dumps({"error": error_msg})


def _dispatch_tool(tool_name: str, args: dict) -> dict:
    """Route tool calls to the correct API endpoint."""
    client = httpx.Client(timeout=10)

    if tool_name == "get_distributors":
        resp = client.get(f"{DISTRIBUTOR_API}/distributors")
        resp.raise_for_status()
        return resp.json()

    elif tool_name == "get_distributor_details":
        resp = client.get(f"{DISTRIBUTOR_API}/distributors/{args['distributor_id']}")
        resp.raise_for_status()
        return resp.json()

    elif tool_name == "get_distributor_inventory":
        resp = client.get(f"{DISTRIBUTOR_API}/distributors/{args['distributor_id']}/inventory")
        resp.raise_for_status()
        return resp.json()

    elif tool_name == "get_retailers":
        resp = client.get(f"{RETAILER_API}/retailers")
        resp.raise_for_status()
        return resp.json()

    elif tool_name == "get_retailer_details":
        resp = client.get(f"{RETAILER_API}/retailers/{args['retailer_id']}")
        resp.raise_for_status()
        return resp.json()

    elif tool_name == "get_order_status":
        resp = client.get(f"{RETAILER_API}/retailers/{args['retailer_id']}/orders")
        resp.raise_for_status()
        return resp.json()

    elif tool_name == "place_order":
        payload = {
            "distributor_id": args["distributor_id"],
            "items": args["items"],
        }
        resp = client.post(f"{RETAILER_API}/retailers/{args['retailer_id']}/orders", json=payload)
        resp.raise_for_status()
        return resp.json()

    elif tool_name == "get_sales_insights":
        resp = client.get(f"{RETAILER_API}/sales/insights")
        resp.raise_for_status()
        return resp.json()

    else:
        return {"error": f"Unknown tool: {tool_name}"}
