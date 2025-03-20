from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.routes.face_detection.video_upload import router as VideoUploadRouter
from backend.routes.face_detection.video_capture import router as VideoCaptureRouter
from backend.routes.face_detection.face_detection import router as FaceDetectionRouter
import os

app = FastAPI(title="Face Detection API")

# ตั้งค่า CORS ให้ React (http://localhost:5173) สามารถเรียก API ได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # เปลี่ยนเป็น URL จริงตอน deploy
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ให้ FastAPI สามารถเสิร์ฟไฟล์รูปภาพที่ตรวจจับใบหน้าได้
if not os.path.exists("data/extracted_faces"):
    os.makedirs("data/extracted_faces")

app.mount("/static", StaticFiles(directory="data"), name="static")

# รวม API Routes
app.include_router(VideoUploadRouter, prefix="/api/videos", tags=["Videos"])
app.include_router(VideoCaptureRouter, prefix="/api/videos", tags=["Live Camera"])
app.include_router(FaceDetectionRouter, prefix="/api/faces", tags=["Face Detection"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Face Detection API"}