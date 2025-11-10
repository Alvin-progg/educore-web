"""
Firebase Authentication Module
Handles Firebase Auth token verification and user UID extraction
"""
import os
from typing import Optional
from fastapi import Header, HTTPException, status
from firebase_admin import auth, credentials, initialize_app
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase Admin SDK
firebase_cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-credentials.json")

try:
    if os.path.exists(firebase_cred_path):
        cred = credentials.Certificate(firebase_cred_path)
        initialize_app(cred)
        print("✅ Firebase Admin SDK initialized successfully")
    else:
        print(f"⚠️  Firebase credentials file not found at: {firebase_cred_path}")
        print("⚠️  Place your Firebase Admin SDK JSON file in the backend folder")
except Exception as e:
    print(f"⚠️  Firebase initialization warning: {e}")


async def get_current_user_uid(authorization: Optional[str] = Header(None)) -> str:
    """
    Extract and verify Firebase user UID from Authorization header.
    
    Usage in endpoint:
        def my_endpoint(uid: str = Depends(get_current_user_uid)):
            # uid contains the Firebase user's UID
    
    Args:
        authorization: Authorization header with format "Bearer <firebase_token>"
    
    Returns:
        str: The verified Firebase user UID
    
    Raises:
        HTTPException: If token is missing, invalid, or expired
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing. Please login.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Extract token from "Bearer <token>" format
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Use: 'Bearer <token>'",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = parts[1]
    
    try:
        # Verify the Firebase ID token
        # Note: clock_skew_seconds=10 allows slight clock skew tolerance
        decoded_token = auth.verify_id_token(token, check_revoked=False, clock_skew_seconds=10)
        uid = decoded_token.get("uid")
        
        if not uid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: UID not found",
            )
        
        return uid
    
    except auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Firebase token",
        )
    except auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Firebase token expired. Please login again.",
        )
    except auth.RevokedIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Firebase token has been revoked",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {str(e)}",
        )
