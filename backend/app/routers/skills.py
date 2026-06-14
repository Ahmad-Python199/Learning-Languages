from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/api/skills", tags=["Skills"])

@router.get("", response_model=List[schemas.SkillResponse])
def read_skills(
    category: Optional[str] = Query(None, description="Filter skills by category"),
    db: Session = Depends(get_db)
):
    skills = crud.get_skills(db)
    if category:
        skills = [s for s in skills if s.category.lower() == category.lower()]
    return skills

@router.get("/{skill_id}", response_model=schemas.SkillResponse)
def read_skill(skill_id: int, db: Session = Depends(get_db)):
    db_skill = crud.get_skill(db, skill_id=skill_id)
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return db_skill
