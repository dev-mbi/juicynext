from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from database import get_db
from database.models import User
from auth import get_current_user
import os

router = APIRouter()
MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "models")


@router.post("/api/upload/{slug}")
async def upload_model(
    slug: str,
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
):
    if not file.filename.endswith(".glb"):
        raise HTTPException(400, "Only .glb files accepted")

    os.makedirs(MODELS_DIR, exist_ok=True)
    file_path = os.path.join(MODELS_DIR, f"{slug}.glb")

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    return {"ok": True, "path": f"/models/{slug}.glb", "size_kb": round(len(content) / 1024, 1)}
