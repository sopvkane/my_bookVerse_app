# backend/app.py

import os
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from pathlib import Path
import logging

app = FastAPI()

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# CORS configuration
origins = [
    "http://localhost:4200",  # Angular app
    # Add other origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for simplicity
books_db = [
    {
        "id": 1,
        "title": "Book 1",
        "thumbnail": "assets/book1.jpg",
        "chapters": [
            {
                "id": 1,
                "title": "Chapter 1",
                "content": "This is the first chapter of Book 1.",
                "image": "assets/sample-illustration.jpg",
            }
        ],
    },
    {
        "id": 2,
        "title": "Book 2",
        "thumbnail": "assets/book2.jpg",
        "chapters": [],
    },
    {
        "id": 3,
        "title": "Book 3",
        "thumbnail": "assets/book3.jpg",
        "chapters": [],
    },
]

class Chapter(BaseModel):
    id: int
    title: str
    content: str
    image: Optional[str] = None

class Book(BaseModel):
    id: int
    title: str
    thumbnail: str
    chapters: List[Chapter]

@app.get("/api/books", response_model=List[Book])
def get_books():
    return books_db

@app.get("/api/books/{book_id}", response_model=Book)
def get_book(book_id: int):
    for book in books_db:
        if book["id"] == book_id:
            return book
    raise HTTPException(status_code=404, detail="Book not found")

@app.post("/api/books/{book_id}/chapters", response_model=Chapter)
def add_chapter(book_id: int, chapter: Chapter):
    for book in books_db:
        if book["id"] == book_id:
            book["chapters"].append(chapter.dict())
            return chapter
    raise HTTPException(status_code=404, detail="Book not found")

@app.post("/api/upload/image")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            logger.error(f"Invalid file type: {file.content_type}")
            raise HTTPException(status_code=400, detail="Invalid file type. Only images are allowed.")

        # Define absolute path for uploads directory
        current_dir = Path(__file__).parent.resolve()
        upload_dir = current_dir.parent / "frontend" / "src" / "assets" / "uploads"
        upload_dir.mkdir(parents=True, exist_ok=True)
        logger.info(f"Saving uploaded files to: {upload_dir}")

        # Secure the filename
        filename = Path(file.filename).name  # Prevent directory traversal
        file_path = upload_dir / filename

        # Save the file
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
        logger.info(f"Uploaded file saved to: {file_path}")

        # Return the relative path to be used by frontend
        relative_path = f"assets/uploads/{filename}"
        return {"filename": filename, "path": relative_path}

    except Exception as e:
        logger.error(f"Error uploading file: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error during file upload.")

# Add this block to run the server with 'python app.py'
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
