import random
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, schemas, auth, models

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# In-memory store for password resets (simulating email send codes)
reset_codes = {}

@router.post("/signup", response_model=schemas.UserResponse)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    return crud.create_user(db=db, user=user)

@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=form_data.username)
    if not db_user or not db_user.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not auth.verify_password(form_data.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate JWT
    access_token_expires = timedelta(minutes=auth.settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": db_user.email, "role": db_user.role}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login-json", response_model=schemas.Token)
def login_json(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user_credentials.email)
    if not db_user or not db_user.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not auth.verify_password(user_credentials.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate JWT
    access_token_expires = timedelta(minutes=auth.settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": db_user.email, "role": db_user.role}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/google", response_model=schemas.Token)
def google_auth(req: schemas.GoogleAuthRequest, db: Session = Depends(get_db)):
    # Verify token
    user_info = auth.verify_google_id_token(req.id_token)
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google OAuth token"
        )
    
    email = user_info.get("email")
    name = user_info.get("name", email.split("@")[0])
    google_id = user_info.get("sub")
    
    # Check if user already exists
    db_user = crud.get_user_by_email(db, email=email)
    if not db_user:
        # Create Google User
        db_user = crud.create_google_user(db, email=email, name=name, google_id=google_id)
    elif not db_user.google_id:
        # Link Google login to existing email account
        db_user.google_id = google_id
        db.commit()
        db.refresh(db_user)
        
    access_token_expires = timedelta(minutes=auth.settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": db_user.email, "role": db_user.role}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/forgot-password")
def forgot_password(req: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=req.email)
    if not db_user:
        # For security, we don't disclose if the email exists, but since this is a learning
        # platform, let's provide a descriptive error or simulated code so developers can test it easily.
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email address not found"
        )
    
    # Generate 6-digit random code
    code = f"{random.randint(100000, 999999)}"
    reset_codes[req.email] = code
    
    # Simulated email sending
    print(f"====================================================")
    print(f"SIMULATED EMAIL DISPATCH TO {req.email}")
    print(f"Your SkillSphere Password Reset Code is: {code}")
    print(f"====================================================")
    
    return {"message": "Reset code sent successfully. Check console output/logs.", "temp_code_for_demo": code}

@router.post("/reset-password")
def reset_password(req: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    if req.email not in reset_codes or reset_codes[req.email] != req.temp_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email or password reset code"
        )
    
    db_user = crud.get_user_by_email(db, email=req.email)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    user_update = schemas.UserUpdate(password=req.new_password)
    crud.update_user(db, db_user, user_update)
    
    # Remove code from memory
    del reset_codes[req.email]
    
    return {"message": "Password reset successfully. You can now login with your new password."}

@router.get("/profile", response_model=schemas.UserResponse)
def get_profile(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@router.put("/profile", response_model=schemas.UserResponse)
def update_profile(user_update: schemas.UserUpdate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    # Check email unique constraint if changing email
    if user_update.email and user_update.email != current_user.email:
        existing = crud.get_user_by_email(db, email=user_update.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use"
            )
    return crud.update_user(db, current_user, user_update)
