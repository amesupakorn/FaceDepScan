from fastapi import FastAPI
from backend.routes.face_detection.video_upload import router as VideoUploadRouter
from backend.routes.face_detection.video_capture import router as VideoCaptureRouter
from backend.routes.face_detection.face_detection import router as FaceDetectionRouter

app = FastAPI(title="Face Detection API")

app.include_router(VideoUploadRouter, prefix="/api/videos", tags=["Videos"])
app.include_router(VideoCaptureRouter, prefix="/api/videos", tags=["Live Camera"])
app.include_router(FaceDetectionRouter, prefix="/api/faces", tags=["Face Detection"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Face Detection API"}