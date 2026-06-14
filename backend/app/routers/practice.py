from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/api/practice", tags=["Practice Module"])

@router.get("", response_model=List[schemas.PracticeResponse])
def read_practice_challenges(
    skill_id: Optional[int] = Query(None, description="Filter challenges by skill ID"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty: Easy, Medium, Hard"),
    platform: Optional[str] = Query(None, description="Filter by platform: LeetCode, HackerRank, W3Schools"),
    topic: Optional[str] = Query(None, description="Filter by topic / area"),
    db: Session = Depends(get_db)
):
    challenges = crud.get_practice_challenges(db)
    
    if skill_id is not None:
        challenges = [c for c in challenges if c.skill_id == skill_id]
    if difficulty:
        challenges = [c for c in challenges if c.difficulty.lower() == difficulty.lower()]
    if platform:
        challenges = [c for c in challenges if c.platform.lower() == platform.lower()]
    if topic:
        challenges = [c for c in challenges if topic.lower() in c.topic.lower()]
        
    return challenges
