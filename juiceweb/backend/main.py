from flask import Flask, render_template, request as flask_request, jsonify
from flask_cors import CORS
from database import engine, Base, SessionLocal
from database.models import Product, User, Order as OrderModel, OrderItem
from auth import hash_password
import os
import json

Base.metadata.create_all(bind=engine)

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(__file__)


@app.template_filter("tojson")
def tojson_filter(obj):
    return json.dumps(obj)


@app.before_request
def seed_on_first_request():
    if not hasattr(app, "_seeded"):
        app._seeded = True
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


@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "brand": "JuicyNext"})


def get_products_dicts():
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
    return products


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


@app.route("/")
def home():
    return render_template("index.html", products=get_products_dicts(), future=future, news=news)


@app.route("/buy")
def buy():
    return render_template("buy.html")


@app.route("/track")
def track():
    order_id = flask_request.args.get("id", type=int)
    order = None
    error = None
    if order_id:
        db = SessionLocal()
        o = db.query(OrderModel).filter(OrderModel.id == order_id).first()
        if not o:
            error = f"Order #{order_id} not found."
        else:
            order = {
                "id": o.id, "customer_name": o.customer_name,
                "customer_phone": o.customer_phone, "customer_address": o.customer_address,
                "payment_method": o.payment_method, "total": o.total, "status": o.status,
                "created_at": o.created_at.isoformat() if o.created_at else None,
            }
        db.close()
    return render_template("track.html", order=order, error=error, order_id=order_id)


@app.route("/admin")
def admin():
    return render_template("admin.html")


# ===== API Routes =====
@app.route("/api/products", methods=["GET"])
def api_list_products():
    return jsonify(get_products_dicts())


@app.route("/api/products/<int:product_id>", methods=["GET"])
def api_get_product(product_id):
    db = SessionLocal()
    p = db.query(Product).filter(Product.id == product_id).first()
    db.close()
    if not p:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"id": p.id, "name": p.name, "slug": p.slug, "price": p.price, "stock": p.stock, "status": p.status})


def get_current_user():
    from auth import verify_password, create_access_token
    auth = flask_request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    from jose import JWTError, jwt
    from auth import SECRET_KEY, ALGORITHM
    try:
        payload = jwt.decode(auth[7:], SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not username:
            return None
        db = SessionLocal()
        user = db.query(User).filter(User.username == username).first()
        db.close()
        return user
    except JWTError:
        return None


@app.route("/api/auth/login", methods=["POST"])
def api_login():
    data = flask_request.get_json()
    if not data:
        return jsonify({"error": "Invalid request"}), 400
    from auth import verify_password, create_access_token
    db = SessionLocal()
    user = db.query(User).filter(User.username == data.get("username")).first()
    db.close()
    if not user or not verify_password(data.get("password", ""), user.hashed_password):
        return jsonify({"error": "Invalid credentials"}), 401
    token = create_access_token({"sub": user.username, "role": user.role})
    return jsonify({"access_token": token, "token_type": "bearer"})


@app.route("/api/auth/me", methods=["GET"])
def api_me():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify({"username": user.username, "role": user.role})


@app.route("/api/orders", methods=["GET"])
def api_list_orders():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    db = SessionLocal()
    orders = db.query(OrderModel).order_by(OrderModel.created_at.desc()).all()
    result = []
    for o in orders:
        items = db.query(OrderItem).filter(OrderItem.order_id == o.id).all()
        result.append({
            "id": o.id, "customer_name": o.customer_name, "customer_phone": o.customer_phone,
            "customer_address": o.customer_address, "payment_method": o.payment_method,
            "total": o.total, "status": o.status,
            "created_at": o.created_at.isoformat() if o.created_at else None,
            "items": [{"id": i.id, "product_id": i.product_id, "product_name": i.product_name,
                       "quantity": i.quantity, "size_ml": i.size_ml, "unit_price": i.unit_price} for i in items],
        })
    db.close()
    return jsonify(result)


@app.route("/api/orders", methods=["POST"])
def api_create_order():
    data = flask_request.get_json()
    if not data:
        return jsonify({"error": "Invalid request"}), 400
    total = sum(item["unit_price"] * item["quantity"] for item in data.get("items", []))
    db = SessionLocal()
    order = OrderModel(
        customer_name=data["customer_name"], customer_phone=data["customer_phone"],
        customer_address=data.get("customer_address", ""), payment_method=data["payment_method"],
        total=total, status="pending",
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    for item in data.get("items", []):
        db.add(OrderItem(
            order_id=order.id, product_id=item["product_id"],
            product_name=item["product_name"], quantity=item["quantity"],
            size_ml=item.get("size_ml"), unit_price=item["unit_price"],
        ))
    db.commit()
    db.close()
    return jsonify({"id": order.id, "status": "pending", "total": total}), 201


@app.route("/api/orders/<int:order_id>", methods=["GET"])
def api_get_order(order_id):
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    db = SessionLocal()
    o = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not o:
        db.close()
        return jsonify({"error": "Not found"}), 404
    items = db.query(OrderItem).filter(OrderItem.order_id == o.id).all()
    db.close()
    return jsonify({
        "id": o.id, "customer_name": o.customer_name, "customer_phone": o.customer_phone,
        "customer_address": o.customer_address, "payment_method": o.payment_method,
        "total": o.total, "status": o.status,
        "created_at": o.created_at.isoformat() if o.created_at else None,
        "items": [{"id": i.id, "product_id": i.product_id, "product_name": i.product_name,
                   "quantity": i.quantity, "size_ml": i.size_ml, "unit_price": i.unit_price} for i in items],
    })
