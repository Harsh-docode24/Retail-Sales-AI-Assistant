"""
distributor_api.py — Simulated Distributor REST API.
Exposes endpoints for distributor info, inventory, and order data.
"""

from fastapi import FastAPI, HTTPException
from api.mock_data import DISTRIBUTORS, DISTRIBUTOR_INVENTORY, ORDERS

app = FastAPI(
    title="Distributor API",
    description="Simulated distributor service for the Retail Sales AI Assistant",
    version="1.0.0",
)


@app.get("/distributors", tags=["Distributors"])
def list_distributors():
    """Return a list of all distributors."""
    return {"distributors": list(DISTRIBUTORS.values())}


@app.get("/distributors/{distributor_id}", tags=["Distributors"])
def get_distributor(distributor_id: str):
    """Get detail for a specific distributor."""
    dist = DISTRIBUTORS.get(distributor_id)
    if not dist:
        raise HTTPException(status_code=404, detail=f"Distributor '{distributor_id}' not found")
    return dist


@app.get("/distributors/{distributor_id}/inventory", tags=["Inventory"])
def get_distributor_inventory(distributor_id: str):
    """Return current inventory/stock levels for a distributor."""
    if distributor_id not in DISTRIBUTORS:
        raise HTTPException(status_code=404, detail=f"Distributor '{distributor_id}' not found")
    inventory = DISTRIBUTOR_INVENTORY.get(distributor_id, [])
    return {"distributor_id": distributor_id, "inventory": inventory}


@app.get("/distributors/{distributor_id}/orders", tags=["Orders"])
def get_distributor_orders(distributor_id: str):
    """Return all orders placed with a specific distributor."""
    if distributor_id not in DISTRIBUTORS:
        raise HTTPException(status_code=404, detail=f"Distributor '{distributor_id}' not found")
    dist_orders = [o for o in ORDERS if o["distributor_id"] == distributor_id]
    return {"distributor_id": distributor_id, "orders": dist_orders}
