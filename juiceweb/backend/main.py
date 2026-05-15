from fastapi import FastAPI, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from database import engine, Base, SessionLocal
from database.models import Product, User
from api import products, orders, upload
from auth import hash_password
from auth.router import router as auth_router
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(title="JuicyNext", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])
app.include_router(auth_router)
app.include_router(upload.router)

BASE_DIR = os.path.dirname(__file__)
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")


@app.on_event("startup")
def seed_data():
    db = SessionLocal()
    if not db.query(User).first():
        db.add(User(
            username="admin",
            hashed_password=hash_password("juicynext123"),
            role="admin",
        ))
    existing = db.query(Product).first()
    if not existing:
        db.add_all([
            Product(
                name="Mango", slug="mango", category="Mango Series",
                series="Mango Series", flavor="Mango", price=60, stock=200,
                model3d="mango.glb", theme_color="#FFA500", glow_color="#FFD700",
                tagline="Original Fresh Mango",
                description="The original JuicyNext experience. Pure tropical mango taste.",
                status="active",
            ),
            Product(
                name="Mango Rush", slug="mango-rush", category="Mango Series",
                series="Mango Series", flavor="Mango", price=60, stock=0,
                model3d="mango-rush.glb", theme_color="#FFD700", glow_color="#FF8C00",
                tagline="Feel the Rush",
                description="Neon tropical energy. Fast-moving flavor. Coming soon.",
                status="coming_soon",
            ),
        ])
    db.commit()
    db.close()


@app.get("/api/health")
def health():
    return {"status": "ok", "brand": "JuicyNext"}


@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    db = SessionLocal()
    products = [
        {
            "id": p.id, "name": p.name, "slug": p.slug,
            "category": p.category, "series": p.series, "flavor": p.flavor,
            "price": p.price, "stock": p.stock, "model3d": p.model3d,
            "theme_color": p.theme_color, "glow_color": p.glow_color,
            "tagline": p.tagline, "description": p.description, "status": p.status,
        }
        for p in db.query(Product).all()
    ]
    db.close()
    future = [
        {"id": "falsa-fusion", "name": "Falsa Fusion", "emoji": "💜", "theme": "Purple cyber jungle", "color": "#8B00FF", "launch_date": "Coming Soon"},
        {"id": "berry-blast", "name": "Berry Blast", "emoji": "🍓", "theme": "Neon berry city", "color": "#FF1493", "launch_date": "Coming Soon"},
        {"id": "citrus-volt", "name": "Citrus Volt", "emoji": "🍊", "theme": "Electric orange storm", "color": "#FF5E00", "launch_date": "Coming Soon"},
        {"id": "mint-freeze", "name": "Mint Freeze", "emoji": "❄️", "theme": "Frozen futuristic mountains", "color": "#00E5FF", "launch_date": "Coming Soon"},
    ]
    news = [
        {"date": "May 2026", "title": "Mango Rush — Coming Soon", "description": "New high-energy mango flavor with a neon tropical kick.", "tag": "Coming Soon", "color": "#FFD700"},
        {"date": "April 2026", "title": "Pure Pakistani Mango — Farm to Bottle", "description": "Every bottle of JuicyNext uses handpicked Chaunsa mangoes from Punjab orchards.", "tag": "Craft", "color": "#22c55e"},
        {"date": "March 2026", "title": "JuicyNext — Now Available in Karachi", "description": "JuicyNext beverages are now available at select retail locations across Karachi.", "tag": "Availability", "color": "#FF6B00"},
        {"date": "February 2026", "title": "Zero Sugar Line — Coming This Summer", "description": "Stevia-sweetened, naturally flavored, zero compromise.", "tag": "Coming Soon", "color": "#8B00FF"},
        {"date": "December 2025", "title": "Flavor Lab — First Batch Approved", "description": "After 14 iterations, the JuicyNext R&D team finalized the signature Mango Blend.", "tag": "R&D", "color": "#06b6d4"},
    ]
    return templates.TemplateResponse(request, "index.html", {
        "products": products, "future": future, "news": news,
    })


@app.get("/buy", response_class=HTMLResponse)
def buy(request: Request):
    return templates.TemplateResponse(request, "buy.html")


@app.get("/track", response_class=HTMLResponse)
def track(request: Request, id: int = Query(None)):
    db = SessionLocal()
    order = None
    error = None
    if id:
        from database.models import Order as OrderModel
        from database.models import OrderItem
        o = db.query(OrderModel).filter(OrderModel.id == id).first()
        if not o:
            error = f"Order #{id} not found."
        else:
            items = db.query(OrderItem).filter(OrderItem.order_id == o.id).all()
            order = {
                "id": o.id, "customer_name": o.customer_name,
                "customer_phone": o.customer_phone, "customer_address": o.customer_address,
                "payment_method": o.payment_method, "total": o.total, "status": o.status,
                "created_at": o.created_at.isoformat() if o.created_at else None,
            }
    db.close()
    return templates.TemplateResponse(request, "track.html", {
        "order": order, "error": error, "order_id": id,
    })


@app.get("/admin", response_class=HTMLResponse)
def admin(request: Request):
    return templates.TemplateResponse(request, "admin.html")
