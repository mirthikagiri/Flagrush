from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId
import os
from fastapi import FastAPI, UploadFile, File, Form
import shutil


from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Or ["*"] for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# MongoDB connection
MONGO_DETAILS = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.flagrush
permit_collection = database.get_collection("permits")

# Helper sto convert ObjectId to string
def permit_helper(permit) -> dict:
    return {
        "id": str(permit["_id"]),
        "permit_id": permit["permit_id"],
        "billboard_id": permit["billboard_id"],
        "location": permit["location"],
        "zone": permit["zone"],
        "permit_issue_date": permit["permit_issue_date"],
        "permit_expiry_date": permit["permit_expiry_date"],
        "max_width_meters": permit["max_width_meters"],
        "max_height_meters": permit["max_height_meters"],
        "permit_status": permit["permit_status"],
        "license_number": permit["license_number"],
    }
report_collection = database.get_collection("reports")

def report_helper(report) -> dict:
    return {
        "id": str(report["_id"]),
        "billboard_id": report["billboard_id"],
        "report_id": report["report_id"],
        "location": report["location"],
        "date": report["date"],
        "reason": report["reason"],
        "status": report["status"],
        "image_path": report.get("image_path"),  # store image path if uploaded
    }
class ReportModel(BaseModel):
    billboard_id: str = Field(...)
    report_id: str = Field(...)
    location: str = Field(...)
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    reason: str = Field(...)
    status: str = Field(...)
    image_path: str = Field(None, description="Path or URL to the uploaded image")
    # Add any other fields your frontend expects

# Pydantic model for input validation
class PermitModel(BaseModel):
    permit_id: str = Field(...)
    billboard_id: str = Field(...)
    location: str = Field(...)
    zone: str = Field(...)
    permit_issue_date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")  # ISO date yyyy-mm-dd
    permit_expiry_date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    max_width_meters: float = Field(...)
    max_height_meters: float = Field(...)
    permit_status: str = Field(...)
    license_number: str = Field(...)

@app.post("/permits/", response_description="Add new permit")
async def add_permit(permit: PermitModel):
    permit_dict = permit.dict()
    result = await permit_collection.insert_one(permit_dict)
    new_permit = await permit_collection.find_one({"_id": result.inserted_id})
    return permit_helper(new_permit)

@app.get("/permits/", response_description="List all permits")
async def list_permits():
    permits = []
    async for permit in permit_collection.find():
        permits.append(permit_helper(permit))
    return permits

@app.get("/permits/{permit_id}", response_description="Get a single permit")
async def get_permit(permit_id: str):
    permit = await permit_collection.find_one({"permit_id": permit_id})
    if permit:
        return permit_helper(permit)
    raise HTTPException(status_code=404, detail=f"Permit {permit_id} not found")

# Comments throughout for clarity and maintainability
# All code blocks are properly indented and use async/await
# Add update/delete endpoints as needed

@app.post("/reports/", response_description="Add a flagged report")
async def add_report(
    billboard_id: str = Form(...),
    report_id: str = Form(...),
    location: str = Form(...),
    date: str = Form(...),
    reason: str = Form(...),
    status: str = Form(...),
    image: Optional[UploadFile] = File(None)
):
    # Handle image upload
    image_path = None
    if image:
        upload_dir = "uploads/"
        os.makedirs(upload_dir, exist_ok=True)
        file_location = os.path.join(upload_dir, image.filename)
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_path = file_location

    report_dict = {
        "billboard_id": billboard_id,
        "report_id": report_id,
        "location": location,
        "date": date,
        "reason": reason,
        "status": status,
        "image_path": image_path
    }

    result = await report_collection.insert_one(report_dict)
    new_report = await report_collection.find_one({"_id": result.inserted_id})
    return report_helper(new_report)
@app.get("/reports/", response_description="List all reports")
async def list_reports():
    reports = []
    async for report in report_collection.find():
        reports.append(report_helper(report))
    return reports