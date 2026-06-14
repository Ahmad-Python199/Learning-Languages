import json
import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from .. import crud, schemas, auth, models

router = APIRouter(prefix="/api/progress", tags=["Progress Tracking"])

@router.get("", response_model=List[schemas.ProgressResponse])
def read_my_progress(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    return crud.get_user_progress_records(db, user_id=current_user.id)

@router.get("/{skill_id}", response_model=schemas.ProgressResponse)
def read_skill_progress(
    skill_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    db_progress = crud.get_progress(db, user_id=current_user.id, skill_id=skill_id)
    if not db_progress:
        # Create new default progress in DB so it receives a valid auto-incremented ID
        db_progress = models.Progress(
            user_id=current_user.id,
            skill_id=skill_id,
            completion_percentage=0.0,
            completed_nodes_json="[]"
        )
        db.add(db_progress)
        db.commit()
        db.refresh(db_progress)
    return db_progress


@router.put("/{skill_id}", response_model=schemas.ProgressResponse)
def update_node_progress(
    skill_id: int,
    progress_update: schemas.ProgressUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    skill = crud.get_skill(db, skill_id=skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    # 1. Parse roadmap nodes to get total possible nodes
    try:
        roadmap = json.loads(skill.roadmap_json)
        # Combine all topics from beginner, intermediate, advanced roadmaps
        beginner_nodes = [n.get("title") for n in roadmap.get("beginner", []) if n.get("title")]
        intermediate_nodes = [n.get("title") for n in roadmap.get("intermediate", []) if n.get("title")]
        advanced_nodes = [n.get("title") for n in roadmap.get("advanced", []) if n.get("title")]
        all_nodes = list(set(beginner_nodes + intermediate_nodes + advanced_nodes))
    except Exception as e:
        print(f"Error parsing skill roadmap: {e}")
        all_nodes = []
        
    if not all_nodes:
        raise HTTPException(
            status_code=500, 
            detail="Skill roadmap structure is empty or invalid"
        )
        
    # 2. Fetch existing progress
    db_progress = crud.get_progress(db, user_id=current_user.id, skill_id=skill_id)
    completed_nodes = []
    if db_progress and db_progress.completed_nodes_json:
        try:
            completed_nodes = json.loads(db_progress.completed_nodes_json)
        except Exception:
            completed_nodes = []
            
    # 3. Update completed list
    node_name = progress_update.completed_node
    if progress_update.completed:
        if node_name not in completed_nodes:
            completed_nodes.append(node_name)
    else:
        if node_name in completed_nodes:
            completed_nodes.remove(node_name)
            
    # Keep only nodes that actually exist in the roadmap
    completed_nodes = [n for n in completed_nodes if n in all_nodes]
    
    # 4. Calculate percentage
    percentage = round((len(completed_nodes) / len(all_nodes)) * 100, 1) if all_nodes else 0.0
    
    # 5. Save progress
    updated_progress = crud.update_progress_percentage(
        db, 
        user_id=current_user.id, 
        skill_id=skill_id, 
        percentage=percentage, 
        completed_nodes=completed_nodes
    )
    
    # 6. Update user streak & active date
    today_str = datetime.date.today().isoformat()
    if current_user.last_active_date != today_str:
        # Check if user was active yesterday to continue streak
        yesterday_str = (datetime.date.today() - datetime.timedelta(days=1)).isoformat()
        if current_user.last_active_date == yesterday_str:
            current_user.streak_count += 1
        elif current_user.last_active_date is None or current_user.streak_count == 0:
            current_user.streak_count = 1
        else:
            # Streak broken, reset to 1
            current_user.streak_count = 1
            
        current_user.last_active_date = today_str
        
    # 7. Achievement badges logic
    user_badges = []
    if current_user.badges_json:
        try:
            user_badges = json.loads(current_user.badges_json)
        except Exception:
            user_badges = []
            
    # Award "first_step" badge if this is their first checked node
    if "First Step" not in user_badges:
        user_badges.append("First Step")
        
    # Award special badge if course completed 100%
    if percentage >= 100.0:
        badge_name = f"{skill.name} Master"
        if badge_name not in user_badges:
            user_badges.append(badge_name)
            
    # Streak badges
    if current_user.streak_count >= 3 and "3-Day Streak" not in user_badges:
        user_badges.append("3-Day Streak")
    if current_user.streak_count >= 7 and "7-Day Streak" not in user_badges:
        user_badges.append("7-Day Streak")
        
    current_user.badges_json = json.dumps(user_badges)
    db.commit()
    db.refresh(current_user)
    
    return updated_progress
