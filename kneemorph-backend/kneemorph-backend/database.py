"""
Database connection. Uses SQLite by default so you can run this
immediately with zero setup; swap DATABASE_URL for Postgres in production.
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.db_models import Base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./kneemorph.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
