"""
SQLAlchemy models — one table per page of patient data.
Run `alembic` migrations in production; this is the schema definition only.
"""
from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Patient(Base):
    """Page 1 data: intake."""
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)  # "male" | "female" | "other"
    height_cm = Column(Float, nullable=False)
    weight_kg = Column(Float, nullable=False)
    bmi = Column(Float, nullable=False)

    scans = relationship("Scan", back_populates="patient")
    pain_entries = relationship("PainEntry", back_populates="patient")


class Scan(Base):
    """Page 2 data: uploaded X-ray/MRI, optional."""
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    file_path = Column(String, nullable=False)   # S3 key in production
    file_type = Column(String, nullable=False)   # "xray" | "mri" | "pdf"
    kl_grade = Column(Integer, nullable=True)     # filled in after DL analysis
    analysis_note = Column(String, nullable=True)

    patient = relationship("Patient", back_populates="scans")


class PainEntry(Base):
    """Page 3 data: pain history."""
    __tablename__ = "pain_entries"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    onset_date = Column(Date, nullable=False)
    cause = Column(String, nullable=False)         # sports | overweight | aging | genetic | injury
    severity = Column(Integer, nullable=False)      # 1-10
    mobility = Column(String, nullable=False)        # normal | limited | severe
    extra = Column(JSON, nullable=True)               # room for future structured fields

    patient = relationship("Patient", back_populates="pain_entries")
