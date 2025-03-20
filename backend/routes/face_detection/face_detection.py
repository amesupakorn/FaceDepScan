from fastapi import APIRouter
from backend.src.face_detection import detect_faces

router = APIRouter()

@router.post("/detect/")
async def detect_faces_from_video(video_path: str = None, use_camera: bool = False):
    """ API สำหรับตรวจจับใบหน้าจากวิดีโอที่อัปโหลด หรือ ใช้กล้องสด """
    
    if use_camera:
        return {"message": "Use /api/videos/capture/ to capture from camera."}
    
    if not video_path:
        return {"error": "Please provide a video path or use_camera=True"}

    faces = detect_faces(video_path, "data/extracted_faces")
    return {"message": "Face detection complete!", "faces_detected": faces}