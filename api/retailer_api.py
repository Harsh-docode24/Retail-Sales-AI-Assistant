"""
retailer_api.py — Simulated Retailer REST API.
Exposes endpoints for retailer info, order management, and sales insights.
"""

import uuid
from datetime import datetime

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from api.mock_data import RETAILERS, ORDERS, PRODUCTS, DISTRIBUTORS, get_sales_summary


app = FastAPI(
    title="Retailer API",
    description="Simulated retailer service for the Retail Sales AI Assistant",
    version="1.0.0",
)


# ─── Models ────────────────────────────────────────────────────────────────────

class OrderItem(BaseModel):
    product_id: str
    quantity: int


class NewOrderRequest(BaseModel):
    distributor_id: str
    items: list[OrderItem]


# ─── Retailer Endpoints ───────────────────────────────────────────────────────

@app.get("/retailers", tags=["Retailers"])
def list_retailers():
    """Return a list of all retailers."""
    return {"retailers": list(RETAILERS.values())}


@app.get("/retailers/{retailer_id}", tags=["Retailers"])
def get_retailer(retailer_id: str):
    """Get details for a specific retailer, including credit status."""
    ret = RETAILERS.get(retailer_id)
    if not ret:
        raise HTTPException(status_code=404, detail=f"Retailer '{retailer_id}' not found")
    info = dict(ret)
    info["available_credit"] = round(ret["credit_limit"] - ret["outstanding_balance"], 2)
    return info


# ─── Order Endpoints ──────────────────────────────────────────────────────────

@app.get("/retailers/{retailer_id}/orders", tags=["Orders"])
def get_retailer_orders(retailer_id: str):
    """Return order history for a specific retailer."""
    if retailer_id not in RETAILERS:
        raise HTTPException(status_code=404, detail=f"Retailer '{retailer_id}' not found")
    ret_orders = [o for o in ORDERS if o["retailer_id"] == retailer_id]
    return {"retailer_id": retailer_id, "orders": ret_orders}


@app.post("/retailers/{retailer_id}/orders", tags=["Orders"], status_code=201)
def place_order(retailer_id: str, order: NewOrderRequest):
    """Place a new order for a retailer."""
    if retailer_id not in RETAILERS:
        raise HTTPException(status_code=404, detail=f"Retailer '{retailer_id}' not found")
    if order.distributor_id not in DISTRIBUTORS:
        raise HTTPException(status_code=404, detail=f"Distributor '{order.distributor_id}' not found")

    # Build order items with pricing
    order_items = []
    total = 0.0
    for item in order.items:
        product = PRODUCTS.get(item.product_id)
        if not product:
            raise HTTPException(status_code=400, detail=f"Product '{item.product_id}' not found")
        line_total = product["unit_price"] * item.quantity
        total += line_total
        order_items.append({
            "product_id": item.product_id,
            "product_name": product["name"],
            "quantity": item.quantity,
            "unit_price": product["unit_price"],
        })

    # Check credit
    retailer = RETAILERS[retailer_id]
    available = retailer["credit_limit"] - retailer["outstanding_balance"]
    if total > available:
        raise HTTPException(
            status_code=400,
            detail=f"Order total ${total:.2f} exceeds available credit ${available:.2f}",
        )

    new_order = {
        "order_id": f"ORD-{uuid.uuid4().hex[:6].upper()}",
        "retailer_id": retailer_id,
        "distributor_id": order.distributor_id,
        "items": order_items,
        "total_amount": round(total, 2),
        "status": "Processing",
        "order_date": datetime.now().strftime("%Y-%m-%d"),
        "delivery_date": None,
    }
    ORDERS.append(new_order)
    return {"message": "Order placed successfully", "order": new_order}


# ─── Sales Insights ───────────────────────────────────────────────────────────

@app.get("/sales/insights", tags=["Analytics"])
def sales_insights():
    """Return aggregated sales metrics and insights."""
    return get_sales_summary()
