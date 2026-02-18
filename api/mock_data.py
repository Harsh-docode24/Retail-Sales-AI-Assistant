"""
mock_data.py — Simulated datasets for distributors, retailers, orders, and products.
Provides realistic sample data for the Retail Sales AI Assistant demo.
"""

from datetime import datetime, timedelta
import random

# ─── Products Catalog ──────────────────────────────────────────────────────────

PRODUCTS = {
    "P001": {"id": "P001", "name": "Premium Basmati Rice 5kg",    "category": "Grains",     "unit_price": 12.99},
    "P002": {"id": "P002", "name": "Organic Olive Oil 1L",        "category": "Oils",       "unit_price": 8.49},
    "P003": {"id": "P003", "name": "Whole Wheat Flour 10kg",      "category": "Grains",     "unit_price": 7.99},
    "P004": {"id": "P004", "name": "Pure Honey 500g",             "category": "Sweeteners", "unit_price": 6.99},
    "P005": {"id": "P005", "name": "Green Tea Box (100 bags)",    "category": "Beverages",  "unit_price": 5.49},
    "P006": {"id": "P006", "name": "Dark Chocolate Bar 200g",     "category": "Snacks",     "unit_price": 3.99},
    "P007": {"id": "P007", "name": "Almond Butter 350g",          "category": "Spreads",    "unit_price": 9.99},
    "P008": {"id": "P008", "name": "Greek Yogurt 1kg",            "category": "Dairy",      "unit_price": 4.49},
    "P009": {"id": "P009", "name": "Sparkling Water (12-pack)",   "category": "Beverages",  "unit_price": 6.99},
    "P010": {"id": "P010", "name": "Organic Pasta 500g",          "category": "Grains",     "unit_price": 2.99},
}

# ─── Distributors ──────────────────────────────────────────────────────────────

DISTRIBUTORS = {
    "D001": {
        "id": "D001",
        "name": "NorthStar Distribution Co.",
        "region": "North",
        "contact_email": "ops@northstar-dist.com",
        "phone": "+1-555-0101",
        "rating": 4.7,
        "specialties": ["Grains", "Oils"],
    },
    "D002": {
        "id": "D002",
        "name": "SunBelt Wholesale",
        "region": "South",
        "contact_email": "orders@sunbelt-ws.com",
        "phone": "+1-555-0202",
        "rating": 4.5,
        "specialties": ["Beverages", "Snacks", "Sweeteners"],
    },
    "D003": {
        "id": "D003",
        "name": "PacificEdge Suppliers",
        "region": "West",
        "contact_email": "supply@pacificedge.com",
        "phone": "+1-555-0303",
        "rating": 4.8,
        "specialties": ["Dairy", "Spreads", "Grains"],
    },
    "D004": {
        "id": "D004",
        "name": "EastCoast FoodLink",
        "region": "East",
        "contact_email": "hello@eastcoastfl.com",
        "phone": "+1-555-0404",
        "rating": 4.3,
        "specialties": ["Beverages", "Oils", "Snacks"],
    },
}

# ─── Distributor Inventory ─────────────────────────────────────────────────────

DISTRIBUTOR_INVENTORY = {
    "D001": [
        {"product_id": "P001", "product_name": "Premium Basmati Rice 5kg",  "stock": 1200, "reorder_level": 200},
        {"product_id": "P002", "product_name": "Organic Olive Oil 1L",      "stock": 800,  "reorder_level": 150},
        {"product_id": "P003", "product_name": "Whole Wheat Flour 10kg",    "stock": 950,  "reorder_level": 180},
        {"product_id": "P010", "product_name": "Organic Pasta 500g",        "stock": 2200, "reorder_level": 400},
    ],
    "D002": [
        {"product_id": "P005", "product_name": "Green Tea Box (100 bags)", "stock": 600,  "reorder_level": 100},
        {"product_id": "P006", "product_name": "Dark Chocolate Bar 200g",  "stock": 1500, "reorder_level": 300},
        {"product_id": "P004", "product_name": "Pure Honey 500g",          "stock": 450,  "reorder_level": 80},
        {"product_id": "P009", "product_name": "Sparkling Water (12-pack)","stock": 1800, "reorder_level": 350},
    ],
    "D003": [
        {"product_id": "P008", "product_name": "Greek Yogurt 1kg",    "stock": 700,  "reorder_level": 120},
        {"product_id": "P007", "product_name": "Almond Butter 350g",  "stock": 350,  "reorder_level": 60},
        {"product_id": "P001", "product_name": "Premium Basmati Rice 5kg", "stock": 500,  "reorder_level": 100},
        {"product_id": "P010", "product_name": "Organic Pasta 500g",  "stock": 1100, "reorder_level": 200},
    ],
    "D004": [
        {"product_id": "P009", "product_name": "Sparkling Water (12-pack)", "stock": 2000, "reorder_level": 400},
        {"product_id": "P002", "product_name": "Organic Olive Oil 1L",      "stock": 600,  "reorder_level": 100},
        {"product_id": "P006", "product_name": "Dark Chocolate Bar 200g",   "stock": 900,  "reorder_level": 200},
        {"product_id": "P005", "product_name": "Green Tea Box (100 bags)",  "stock": 750,  "reorder_level": 130},
    ],
}

# ─── Retailers ─────────────────────────────────────────────────────────────────

RETAILERS = {
    "R001": {
        "id": "R001",
        "name": "FreshMart SuperStore",
        "store_type": "Supermarket",
        "location": "New York, NY",
        "credit_limit": 50000.00,
        "outstanding_balance": 12340.50,
        "loyalty_tier": "Platinum",
    },
    "R002": {
        "id": "R002",
        "name": "QuickStop Convenience",
        "store_type": "Convenience Store",
        "location": "Los Angeles, CA",
        "credit_limit": 15000.00,
        "outstanding_balance": 3200.00,
        "loyalty_tier": "Gold",
    },
    "R003": {
        "id": "R003",
        "name": "GreenLeaf Organics",
        "store_type": "Specialty Store",
        "location": "Portland, OR",
        "credit_limit": 30000.00,
        "outstanding_balance": 8750.25,
        "loyalty_tier": "Platinum",
    },
    "R004": {
        "id": "R004",
        "name": "ValuePlus Grocers",
        "store_type": "Discount Store",
        "location": "Chicago, IL",
        "credit_limit": 25000.00,
        "outstanding_balance": 18900.00,
        "loyalty_tier": "Silver",
    },
    "R005": {
        "id": "R005",
        "name": "UrbanBites Deli",
        "store_type": "Deli & Cafe",
        "location": "Austin, TX",
        "credit_limit": 10000.00,
        "outstanding_balance": 1500.00,
        "loyalty_tier": "Gold",
    },
}

# ─── Orders ────────────────────────────────────────────────────────────────────

def _date(days_ago: int) -> str:
    return (datetime.now() - timedelta(days=days_ago)).strftime("%Y-%m-%d")


ORDERS = [
    {
        "order_id": "ORD-1001",
        "retailer_id": "R001",
        "distributor_id": "D001",
        "items": [
            {"product_id": "P001", "product_name": "Premium Basmati Rice 5kg", "quantity": 200, "unit_price": 12.99},
            {"product_id": "P003", "product_name": "Whole Wheat Flour 10kg",   "quantity": 150, "unit_price": 7.99},
        ],
        "total_amount": 3796.50,
        "status": "Delivered",
        "order_date": _date(30),
        "delivery_date": _date(27),
    },
    {
        "order_id": "ORD-1002",
        "retailer_id": "R002",
        "distributor_id": "D002",
        "items": [
            {"product_id": "P005", "product_name": "Green Tea Box (100 bags)", "quantity": 80,  "unit_price": 5.49},
            {"product_id": "P006", "product_name": "Dark Chocolate Bar 200g",  "quantity": 300, "unit_price": 3.99},
        ],
        "total_amount": 1636.20,
        "status": "Delivered",
        "order_date": _date(25),
        "delivery_date": _date(22),
    },
    {
        "order_id": "ORD-1003",
        "retailer_id": "R003",
        "distributor_id": "D003",
        "items": [
            {"product_id": "P008", "product_name": "Greek Yogurt 1kg",   "quantity": 100, "unit_price": 4.49},
            {"product_id": "P007", "product_name": "Almond Butter 350g", "quantity": 50,  "unit_price": 9.99},
        ],
        "total_amount": 948.50,
        "status": "In Transit",
        "order_date": _date(5),
        "delivery_date": None,
    },
    {
        "order_id": "ORD-1004",
        "retailer_id": "R001",
        "distributor_id": "D003",
        "items": [
            {"product_id": "P010", "product_name": "Organic Pasta 500g", "quantity": 500, "unit_price": 2.99},
        ],
        "total_amount": 1495.00,
        "status": "Processing",
        "order_date": _date(2),
        "delivery_date": None,
    },
    {
        "order_id": "ORD-1005",
        "retailer_id": "R004",
        "distributor_id": "D004",
        "items": [
            {"product_id": "P009", "product_name": "Sparkling Water (12-pack)", "quantity": 400, "unit_price": 6.99},
            {"product_id": "P002", "product_name": "Organic Olive Oil 1L",      "quantity": 100, "unit_price": 8.49},
        ],
        "total_amount": 3645.00,
        "status": "Delivered",
        "order_date": _date(18),
        "delivery_date": _date(15),
    },
    {
        "order_id": "ORD-1006",
        "retailer_id": "R005",
        "distributor_id": "D002",
        "items": [
            {"product_id": "P004", "product_name": "Pure Honey 500g",          "quantity": 60,  "unit_price": 6.99},
            {"product_id": "P006", "product_name": "Dark Chocolate Bar 200g",  "quantity": 120, "unit_price": 3.99},
        ],
        "total_amount": 898.20,
        "status": "In Transit",
        "order_date": _date(3),
        "delivery_date": None,
    },
    {
        "order_id": "ORD-1007",
        "retailer_id": "R002",
        "distributor_id": "D001",
        "items": [
            {"product_id": "P001", "product_name": "Premium Basmati Rice 5kg", "quantity": 50,  "unit_price": 12.99},
        ],
        "total_amount": 649.50,
        "status": "Delivered",
        "order_date": _date(40),
        "delivery_date": _date(37),
    },
    {
        "order_id": "ORD-1008",
        "retailer_id": "R003",
        "distributor_id": "D001",
        "items": [
            {"product_id": "P001", "product_name": "Premium Basmati Rice 5kg", "quantity": 100, "unit_price": 12.99},
            {"product_id": "P002", "product_name": "Organic Olive Oil 1L",     "quantity": 75,  "unit_price": 8.49},
        ],
        "total_amount": 1935.75,
        "status": "Pending Approval",
        "order_date": _date(1),
        "delivery_date": None,
    },
]


def get_sales_summary() -> dict:
    """Compute aggregated sales insights from the order data."""
    total_revenue = sum(o["total_amount"] for o in ORDERS if o["status"] == "Delivered")
    total_orders = len(ORDERS)
    delivered = sum(1 for o in ORDERS if o["status"] == "Delivered")
    in_transit = sum(1 for o in ORDERS if o["status"] == "In Transit")
    processing = sum(1 for o in ORDERS if o["status"] in ("Processing", "Pending Approval"))

    # Top products by quantity sold
    product_qty: dict[str, int] = {}
    for order in ORDERS:
        for item in order["items"]:
            product_qty[item["product_name"]] = product_qty.get(item["product_name"], 0) + item["quantity"]
    top_products = sorted(product_qty.items(), key=lambda x: x[1], reverse=True)[:5]

    # Revenue by region
    region_revenue: dict[str, float] = {}
    for order in ORDERS:
        if order["status"] == "Delivered":
            dist = DISTRIBUTORS.get(order["distributor_id"], {})
            region = dist.get("region", "Unknown")
            region_revenue[region] = region_revenue.get(region, 0) + order["total_amount"]

    # Revenue by retailer
    retailer_revenue: dict[str, float] = {}
    for order in ORDERS:
        if order["status"] == "Delivered":
            ret = RETAILERS.get(order["retailer_id"], {})
            retailer_revenue[ret.get("name", order["retailer_id"])] = (
                retailer_revenue.get(ret.get("name", order["retailer_id"]), 0) + order["total_amount"]
            )

    return {
        "total_revenue": round(total_revenue, 2),
        "total_orders": total_orders,
        "orders_delivered": delivered,
        "orders_in_transit": in_transit,
        "orders_processing": processing,
        "top_products_by_quantity": [{"product": p, "quantity_sold": q} for p, q in top_products],
        "revenue_by_region": {k: round(v, 2) for k, v in region_revenue.items()},
        "revenue_by_retailer": {k: round(v, 2) for k, v in retailer_revenue.items()},
    }
