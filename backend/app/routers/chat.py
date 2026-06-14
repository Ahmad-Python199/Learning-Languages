import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from .. import crud, schemas, auth, models, ai

router = APIRouter(prefix="/api/chat", tags=["AI Assistant"])

@router.get("/history", response_model=List[schemas.ChatHistoryResponse])
def get_history(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    return crud.get_user_chat_history(db, user_id=current_user.id)

@router.post("", response_model=schemas.ChatHistoryResponse)
async def ask_assistant(
    req: schemas.AIAssistantRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Fetch skill context if any
    skill_context = None
    if req.context_skill_id:
        skill = crud.get_skill(db, skill_id=req.context_skill_id)
        if skill:
            skill_context = skill.name

    # 2. Get past chat history for context
    db_history = crud.get_user_chat_history(db, user_id=current_user.id, limit=6)
    chat_history = []
    # Reverse history to chronological order for AI context
    for h in reversed(db_history):
        chat_history.append({"message": h.message, "response": h.response})

    # 3. Call AI
    ai_response = await ai.generate_chat_response(
        user_message=req.message,
        chat_history=chat_history,
        skill_context=skill_context
    )

    # 4. Save to DB
    chat_entry = crud.create_chat_entry(
        db, 
        user_id=current_user.id, 
        message=req.message, 
        response=ai_response
    )
    return chat_entry

@router.post("/code")
async def debug_code(
    req: schemas.AICodeRequest,
    current_user: models.User = Depends(auth.get_current_user)
):
    ai_response = await ai.generate_code_response(
        code=req.code,
        language=req.language,
        query_type=req.query_type
    )
    return {"response": ai_response}

@router.get("/recommendations")
async def get_recommendations(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Gathers completed skills (progress = 100%)
    progress_records = crud.get_user_progress_records(db, user_id=current_user.id)
    completed_skills = []
    for r in progress_records:
        if r.completion_percentage >= 100.0:
            skill = crud.get_skill(db, skill_id=r.skill_id)
            if skill:
                completed_skills.append(skill.name)

    # Gathers bookmark titles
    bookmarks = crud.get_user_bookmarks(db, user_id=current_user.id)
    bookmarked_titles = [b.resource.title for b in bookmarks if b.resource]

    # Call AI
    recommendation = await ai.generate_recommendation(
        user_name=current_user.name,
        completed_skills=completed_skills,
        bookmarked_titles=bookmarked_titles
    )
    return {"recommendation": recommendation}
