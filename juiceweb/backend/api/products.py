from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from database.models import Product, User
from auth import get_current_user
from pydantic import BaseModel

router = APIRouter()


class ProductResponse(BaseModel):
    id: int
    name: str
    slug: str
    category: str | None
    series: str | None
    flavor: str | None
    price: float
    stock: int
    model3d: str | None
    theme_color: str | None
    glow_color: str | None
    tagline: str | None
    description: str | None
    status: str

    class Config:
        from_attributes = True


class ProductCreate(BaseModel):
    name: str
    slug: str
    category: str | None = None
    series: str | None = None
    flavor: str | None = None
    price: float
    stock: int = 0
    model3d: str | None = None
    theme_color: str | None = None
    glow_color: str | None = None
    tagline: str | None = None
    description: str | None = None
    status: str = "active"


@router.get("/", response_model=List[ProductResponse])
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).all()


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(404, "Product not found")
    return product


@router.post("/", response_model=ProductResponse)
def create_product(
    data: ProductCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    product = Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    data: ProductCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(404, "Product not found")
    for key, val in data.model_dump().items():
        setattr(product, key, val)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(404, "Product not found")
    db.delete(product)
    db.commit()
    return {"ok": True}
