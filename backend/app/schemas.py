from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- Token & Authentication Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class GoogleAuthRequest(BaseModel):
    id_token: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    temp_code: str
    new_password: str

# --- User Schemas ---
class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    streak_count: Optional[int] = None
    last_active_date: Optional[str] = None
    badges_json: Optional[str] = None
    goals_json: Optional[str] = None

class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime
    streak_count: int
    last_active_date: Optional[str] = None
    badges_json: str
    goals_json: str

    class Config:
        from_attributes = True

# --- Resource Schemas ---
class ResourceBase(BaseModel):
    title: str
    platform: str
    type: str
    language: str
    url: str
    channel_name: Optional[str] = None
    difficulty: str

class ResourceCreate(ResourceBase):
    skill_id: int

class ResourceResponse(ResourceBase):
    id: int
    skill_id: int

    class Config:
        from_attributes = True

# --- Bookmark Schemas ---
class BookmarkBase(BaseModel):
    resource_id: int

class BookmarkCreate(BookmarkBase):
    pass

class BookmarkResponse(BaseModel):
    id: int
    user_id: int
    resource_id: int
    resource: ResourceResponse

    class Config:
        from_attributes = True

# --- Practice Schemas ---
class PracticeBase(BaseModel):
    title: str
    difficulty: str
    url: str
    platform: str
    topic: str

class PracticeCreate(PracticeBase):
    skill_id: int

class PracticeResponse(PracticeBase):
    id: int
    skill_id: int

    class Config:
        from_attributes = True

# --- Skill Schemas ---
class SkillBase(BaseModel):
    name: str
    category: str
    description: str
    roadmap_json: str  # Contains structured introduction, beginner, intermediate, advanced roadmaps, and key concepts

class SkillCreate(SkillBase):
    pass

class SkillResponse(SkillBase):
    id: int
    resources: List[ResourceResponse] = []
    practice_tasks: List[PracticeResponse] = []

    class Config:
        from_attributes = True

# --- Progress Schemas ---
class ProgressBase(BaseModel):
    skill_id: int
    completion_percentage: float
    completed_nodes_json: str

class ProgressCreate(ProgressBase):
    user_id: int

class ProgressUpdate(BaseModel):
    completed_node: str  # The topic node that was checked or unchecked
    completed: bool      # True for checked, False for unchecked

class ProgressResponse(BaseModel):
    id: int
    user_id: int
    skill_id: int
    completion_percentage: float
    completed_nodes_json: str

    class Config:
        from_attributes = True

# --- ChatHistory Schemas ---
class ChatHistoryBase(BaseModel):
    message: str
    response: str

class ChatHistoryCreate(ChatHistoryBase):
    pass

class ChatHistoryResponse(ChatHistoryBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- AI Integration Schemas ---
class AIAssistantRequest(BaseModel):
    message: str
    context_skill_id: Optional[int] = None

class AICodeRequest(BaseModel):
    code: str
    language: str
    query_type: str = "debug"  # "debug", "explain", "refactor"

class AIRecommendationRequest(BaseModel):
    current_skill_ids: List[int]
