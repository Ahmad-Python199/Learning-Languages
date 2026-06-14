import json
from sqlalchemy.orm import Session
from sqlalchemy import and_
from . import models, schemas, auth

# --- User CRUD ---
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_google_id(db: Session, google_id: str):
    return db.query(models.User).filter(models.User.google_id == google_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_google_user(db: Session, email: str, name: str, google_id: str):
    db_user = models.User(
        name=name,
        email=email,
        google_id=google_id,
        password=None  # No password for Google SSO
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, db_user: models.User, user_update: schemas.UserUpdate):
    for key, value in user_update.model_dump(exclude_unset=True).items():
        if key == "password" and value:
            setattr(db_user, "password", auth.get_password_hash(value))
        else:
            setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_all_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

# --- Skill CRUD ---
def get_skill(db: Session, skill_id: int):
    return db.query(models.Skill).filter(models.Skill.id == skill_id).first()

def get_skill_by_name(db: Session, name: str):
    return db.query(models.Skill).filter(models.Skill.name == name).first()

def get_skills(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Skill).offset(skip).limit(limit).all()

def create_skill(db: Session, skill: schemas.SkillCreate):
    db_skill = models.Skill(
        name=skill.name,
        category=skill.category,
        description=skill.description,
        roadmap_json=skill.roadmap_json
    )
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

def update_skill(db: Session, db_skill: models.Skill, skill_update: schemas.SkillCreate):
    db_skill.name = skill_update.name
    db_skill.category = skill_update.category
    db_skill.description = skill_update.description
    db_skill.roadmap_json = skill_update.roadmap_json
    db.commit()
    db.refresh(db_skill)
    return db_skill

def delete_skill(db: Session, skill_id: int):
    db_skill = db.query(models.Skill).filter(models.Skill.id == skill_id).first()
    if db_skill:
        db.delete(db_skill)
        db.commit()
        return True
    return False

# --- Resource CRUD ---
def get_resource(db: Session, resource_id: int):
    return db.query(models.Resource).filter(models.Resource.id == resource_id).first()

def create_resource(db: Session, resource: schemas.ResourceCreate):
    db_res = models.Resource(
        skill_id=resource.skill_id,
        title=resource.title,
        platform=resource.platform,
        type=resource.type,
        language=resource.language,
        url=resource.url,
        channel_name=resource.channel_name,
        difficulty=resource.difficulty
    )
    db.add(db_res)
    db.commit()
    db.refresh(db_res)
    return db_res

def get_resources(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Resource).offset(skip).limit(limit).all()

def delete_resource(db: Session, resource_id: int):
    db_res = db.query(models.Resource).filter(models.Resource.id == resource_id).first()
    if db_res:
        db.delete(db_res)
        db.commit()
        return True
    return False

# --- Progress CRUD ---
def get_progress(db: Session, user_id: int, skill_id: int):
    return db.query(models.Progress).filter(
        and_(models.Progress.user_id == user_id, models.Progress.skill_id == skill_id)
    ).first()

def get_user_progress_records(db: Session, user_id: int):
    return db.query(models.Progress).filter(models.Progress.user_id == user_id).all()

def update_progress_percentage(db: Session, user_id: int, skill_id: int, percentage: float, completed_nodes: list):
    db_progress = get_progress(db, user_id, skill_id)
    if not db_progress:
        db_progress = models.Progress(
            user_id=user_id,
            skill_id=skill_id,
            completion_percentage=percentage,
            completed_nodes_json=json.dumps(completed_nodes)
        )
        db.add(db_progress)
    else:
        db_progress.completion_percentage = percentage
        db_progress.completed_nodes_json = json.dumps(completed_nodes)
    db.commit()
    db.refresh(db_progress)
    return db_progress

# --- Bookmark CRUD ---
def get_bookmark(db: Session, user_id: int, resource_id: int):
    return db.query(models.Bookmark).filter(
        and_(models.Bookmark.user_id == user_id, models.Bookmark.resource_id == resource_id)
    ).first()

def get_user_bookmarks(db: Session, user_id: int):
    return db.query(models.Bookmark).filter(models.Bookmark.user_id == user_id).all()

def add_bookmark(db: Session, user_id: int, resource_id: int):
    existing = get_bookmark(db, user_id, resource_id)
    if existing:
        return existing
    db_bookmark = models.Bookmark(user_id=user_id, resource_id=resource_id)
    db.add(db_bookmark)
    db.commit()
    db.refresh(db_bookmark)
    return db_bookmark

def remove_bookmark(db: Session, user_id: int, resource_id: int):
    db_bookmark = get_bookmark(db, user_id, resource_id)
    if db_bookmark:
        db.delete(db_bookmark)
        db.commit()
        return True
    return False

# --- Practice CRUD ---
def get_practice(db: Session, practice_id: int):
    return db.query(models.Practice).filter(models.Practice.id == practice_id).first()

def create_practice(db: Session, practice: schemas.PracticeCreate):
    db_prac = models.Practice(
        skill_id=practice.skill_id,
        title=practice.title,
        difficulty=practice.difficulty,
        url=practice.url,
        platform=practice.platform,
        topic=practice.topic
    )
    db.add(db_prac)
    db.commit()
    db.refresh(db_prac)
    return db_prac

def get_practice_challenges(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Practice).offset(skip).limit(limit).all()

def delete_practice(db: Session, practice_id: int):
    db_prac = db.query(models.Practice).filter(models.Practice.id == practice_id).first()
    if db_prac:
        db.delete(db_prac)
        db.commit()
        return True
    return False

# --- Chat History CRUD ---
def create_chat_entry(db: Session, user_id: int, message: str, response: str):
    db_chat = models.ChatHistory(
        user_id=user_id,
        message=message,
        response=response
    )
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    return db_chat

def get_user_chat_history(db: Session, user_id: int, limit: int = 50):
    return db.query(models.ChatHistory).filter(
        models.ChatHistory.user_id == user_id
    ).order_by(models.ChatHistory.created_at.desc()).limit(limit).all()
