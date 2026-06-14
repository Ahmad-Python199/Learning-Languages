import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=True)  # Nullable if registered with Google
    google_id = Column(String, unique=True, index=True, nullable=True)
    role = Column(String, default="student")  # "student" or "admin"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Progress & Streak analytics
    streak_count = Column(Integer, default=0)
    last_active_date = Column(String, nullable=True)  # YYYY-MM-DD
    badges_json = Column(Text, default="[]")  # List of earned badges: ["first_login", "python_novice"]
    goals_json = Column(Text, default="[]")  # Daily/weekly goals

    # Relationships
    progress_records = relationship("Progress", back_populates="user", cascade="all, delete-orphan")
    bookmarks = relationship("Bookmark", back_populates="user", cascade="all, delete-orphan")
    chat_histories = relationship("ChatHistory", back_populates="user", cascade="all, delete-orphan")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    category = Column(String, nullable=False)  # "Programming Languages", "Web Development", etc.
    description = Column(Text, nullable=False)
    
    # Stores beginner, intermediate, advanced roadmaps, and key concepts as a JSON object
    roadmap_json = Column(Text, nullable=False)

    # Relationships
    resources = relationship("Resource", back_populates="skill", cascade="all, delete-orphan")
    practice_tasks = relationship("Practice", back_populates="skill", cascade="all, delete-orphan")
    progress_records = relationship("Progress", back_populates="skill", cascade="all, delete-orphan")


class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    platform = Column(String, default="YouTube")  # YouTube, Coursera, etc.
    type = Column(String, default="Video")  # Video, Article
    language = Column(String, default="English")  # English, Urdu, Hindi
    url = Column(String, nullable=False)
    
    # Extra fields for premium video cards
    channel_name = Column(String, nullable=True)
    difficulty = Column(String, default="Beginner")  # Beginner, Intermediate, Advanced

    # Relationships
    skill = relationship("Skill", back_populates="resources")
    bookmarks = relationship("Bookmark", back_populates="resource", cascade="all, delete-orphan")


class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    completion_percentage = Column(Float, default=0.0)
    
    # Track which specific topics/nodes the user has checked off
    completed_nodes_json = Column(Text, default="[]")  # e.g., ["Variables", "Loops"]

    # Relationships
    user = relationship("User", back_populates="progress_records")
    skill = relationship("Skill", back_populates="progress_records")


class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resource_id = Column(Integer, ForeignKey("resources.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    user = relationship("User", back_populates="bookmarks")
    resource = relationship("Resource", back_populates="bookmarks")


class Practice(Base):
    __tablename__ = "practice"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    difficulty = Column(String, default="Easy")  # Easy, Medium, Hard
    url = Column(String, nullable=False)
    platform = Column(String, default="LeetCode")  # LeetCode, HackerRank, W3Schools
    topic = Column(String, default="General")  # e.g. Recursion, OOP

    # Relationships
    skill = relationship("Skill", back_populates="practice_tasks")


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    message = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="chat_histories")
