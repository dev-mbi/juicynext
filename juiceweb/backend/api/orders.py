from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from database import get_db
from database.models import Order, OrderItem, User
from auth import get_current_user
from pydantic import BaseModel

router = APIRouter()


class OrderItemSchema(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    size_ml: int | None = None
    unit_price: float


class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_address: str | None = None
    payment_method: str
    items: List[OrderItemSchema]


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    quantity: int
    size_ml: int | None
    unit_price: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    customer_name: str
    customer_phone: str
    customer_address: str | None
    payment_method: str
    total: float
    status: str
    created_at: datetime | None
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True


@router.get("/", response_model=List[OrderResponse])
def list_orders(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    result = []
    for o in orders:
        items = db.query(OrderItem).filter(OrderItem.order_id == o.id).all()
        orsp = OrderResponse.model_validate(o)
        orsp.items = [OrderItemResponse.model_validate(i) for i in items]
        result.append(orsp)
    return result


@router.post("/", response_model=OrderResponse)
def create_order(data: OrderCreate, db: Session = Depends(get_db)):
    total = sum(item.unit_price * item.quantity for item in data.items)

    order = Order(
        customer_name=data.customer_name,
        customer_phone=data.customer_phone,
        customer_address=data.customer_address,
        payment_method=data.payment_method,
        total=total,
        status="pending",
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    for item in data.items:
        oi = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            product_name=item.product_name,
            quantity=item.quantity,
            size_ml=item.size_ml,
            unit_price=item.unit_price,
        )
        db.add(oi)
    db.commit()

    items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    orsp = OrderResponse.model_validate(order)
    orsp.items = [OrderItemResponse.model_validate(i) for i in items]
    return orsp


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(404, "Order not found")
    items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    orsp = OrderResponse.model_validate(order)
    orsp.items = [OrderItemResponse.model_validate(i) for i in items]
    return orsp
