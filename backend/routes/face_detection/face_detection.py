from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.src.face_detection import detect_faces
import os

router = APIRouter()

class VideoInput(BaseModel):
    video_path: str = None
    use_camera: bool = False

@router.post("/detect/")
async def detect_faces_from_video(input_data: VideoInput):
    """ API สำหรับตรวจจับใบหน้าจากวิดีโอที่อัปโหลด หรือ ใช้กล้องสด """
    print(input_data)
    
    if input_data.use_camera:
        return {"message": "Use /api/videos/capture/ to capture from camera."}
    
    if not input_data.video_path:
        raise HTTPException(status_code=400, detail="Please provide a video path or set use_camera=True")

    print("[DEBUG] กำลังโหลดวิดีโอจาก:", input_data.video_path)

    faces = detect_faces(input_data.video_path)

    if not faces:
        return {"message": "No faces detected", "faces_detected": []}

    face_urls = [f"/static/extracted_faces/{os.path.basename(face)}" for face in faces]

    return {"message": "Face detection complete!", "faces_detected": face_urls}