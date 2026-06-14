from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from .. import crud, schemas, auth, models

router = APIRouter(prefix="/api/admin", tags=["Admin Panel"])

# Apply get_admin_user dependency to ensure only admins can use these endpoints
@router.post("/skills", response_model=schemas.SkillResponse)
def add_skill(
    skill: schemas.SkillCreate,
    current_admin: models.User = Depends(auth.get_admin_user),
    db: Session = Depends(get_db)
):
    existing = crud.get_skill_by_name(db, name=skill.name)
    if existing:
        raise HTTPException(status_code=400, detail="Skill name already exists")
    return crud.create_skill(db, skill)

@router.put("/skills/{skill_id}", response_model=schemas.SkillResponse)
def update_skill(
    skill_id: int,
    skill_update: schemas.SkillCreate,
    current_admin: models.User = Depends(auth.get_admin_user),
    db: Session = Depends(get_db)
):
    db_skill = crud.get_skill(db, skill_id=skill_id)
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return crud.update_skill(db, db_skill, skill_update)

@router.delete("/skills/{skill_id}")
def delete_skill(
    skill_id: int,
    current_admin: models.User = Depends(auth.get_admin_user),
    db: Session = Depends(get_db)
):
    success = crud.delete_skill(db, skill_id)
    if not success:
        raise HTTPException(status_code=404, detail="Skill not found")
    return {"message": "Skill deleted successfully"}

@router.post("/resources", response_model=schemas.ResourceResponse)
def add_resource(
    resource: schemas.ResourceCreate,
    current_admin: models.User = Depends(auth.get_admin_user),
    db: Session = Depends(get_db)
):
    # Verify skill exists
    skill = crud.get_skill(db, skill_id=resource.skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill ID not found")
    return crud.create_resource(db, resource)

@router.delete("/resources/{resource_id}")
def delete_resource(
    resource_id: int,
    current_admin: models.User = Depends(auth.get_admin_user),
    db: Session = Depends(get_db)
):
    success = crud.delete_resource(db, resource_id)
    if not success:
        raise HTTPException(status_code=404, detail="Resource not found")
    return {"message": "Resource deleted successfully"}

@router.post("/practice", response_model=schemas.PracticeResponse)
def add_practice(
    practice: schemas.PracticeCreate,
    current_admin: models.User = Depends(auth.get_admin_user),
    db: Session = Depends(get_db)
):
    # Verify skill exists
    skill = crud.get_skill(db, skill_id=practice.skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill ID not found")
    return crud.create_practice(db, practice)

@router.delete("/practice/{practice_id}")
def delete_practice(
    practice_id: int,
    current_admin: models.User = Depends(auth.get_admin_user),
    db: Session = Depends(get_db)
):
    success = crud.delete_practice(db, practice_id)
    if not success:
        raise HTTPException(status_code=404, detail="Practice challenge not found")
    return {"message": "Practice challenge deleted successfully"}

@router.get("/users", response_model=List[schemas.UserResponse])
def get_users(
    current_admin: models.User = Depends(auth.get_admin_user),
    db: Session = Depends(get_db)
):
    return crud.get_all_users(db)

@router.put("/users/{user_id}/role", response_model=schemas.UserResponse)
def update_user_role(
    user_id: int,
    role: str,
    current_admin: models.User = Depends(auth.get_admin_user),
    db: Session = Depends(get_db)
):
    if role not in ["student", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role type. Must be 'student' or 'admin'")
        
    db_user = crud.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user_update = schemas.UserUpdate(role=role)
    # Perform update
    db_user.role = role
    db.commit()
    db.refresh(db_user)
    return db_user
