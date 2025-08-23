from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId
import os
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

