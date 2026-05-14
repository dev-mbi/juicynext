from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from database.models import Product, User
from api import products, orders, upload
from auth import hash_password
from auth.router import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="JuicyNext API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://juicynext-1ob1.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])
app.include_router(auth_router)
app.include_router(upload.router)


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
                name="Mango",
                slug="mango",
                category="Mango Series",
                series="Mango Series",
                flavor="Mango",
                price=60,
                stock=200,
                model3d="mango.glb",
                theme_color="#FFA500",
                glow_color="#FFD700",
                tagline="Original Fresh Mango",
                description="The original JuicyNext experience. Pure tropical mango taste.",
                status="active",
            ),
            Product(
                name="Mango Rush",
                slug="mango-rush",
                category="Mango Series",
                series="Mango Series",
                flavor="Mango",
                price=60,
                stock=0,
                model3d="mango-rush.glb",
                theme_color="#FFD700",
                glow_color="#FF8C00",
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
