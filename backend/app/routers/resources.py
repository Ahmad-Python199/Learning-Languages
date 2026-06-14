from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from .. import crud, schemas, auth, models

router = APIRouter(prefix="/api/resources", tags=["Resources"])

@router.get("", response_model=List[schemas.ResourceResponse])
def read_resources(
    skill_id: Optional[int] = Query(None, description="Filter by skill ID"),
    language: Optional[str] = Query(None, description="Filter by language: English, Hindi, Urdu"),
    db: Session = Depends(get_db)
):
    resources = crud.get_resources(db)
    if skill_id is not None:
        resources = [r for r in resources if r.skill_id == skill_id]
    if language:
        resources = [r for r in resources if r.language.lower() == language.lower()]
    return resources

@router.get("/bookmarks", response_model=List[schemas.BookmarkResponse])
def get_my_bookmarks(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    return crud.get_user_bookmarks(db, user_id=current_user.id)

@router.post("/{resource_id}/bookmark", response_model=schemas.BookmarkResponse)
def bookmark_resource(
    resource_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    resource = crud.get_resource(db, resource_id=resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return crud.add_bookmark(db, user_id=current_user.id, resource_id=resource_id)

@router.delete("/{resource_id}/bookmark")
def unbookmark_resource(
    resource_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    success = crud.remove_bookmark(db, user_id=current_user.id, resource_id=resource_id)
    if not success:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    return {"message": "Bookmark removed successfully"}
