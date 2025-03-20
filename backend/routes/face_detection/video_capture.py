from fastapi import APIRouter
import cv2
import mediapipe as mp
import os

router = APIRouter()

mp_face_detection = mp.solutions.face_detection
face_detection = mp_face_detection.FaceDetection(min_detection_confidence=0.5)

CAPTURE_DIR = "data/captured_faces"
os.makedirs(CAPTURE_DIR, exist_ok=True)

@router.get("/capture/")
async def capture_from_camera():
    """ API สำหรับเปิดกล้องและตรวจจับใบหน้าสด """
    
    cap = cv2.VideoCapture(0)  # เปิดกล้อง
    frame_count = 0
    faces_saved = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_detection.process(frame_rgb)

        if results.detections:
            for i, detection in enumerate(results.detections):
                bboxC = detection.location_data.relative_bounding_box
                ih, iw, _ = frame.shape
                x, y, w, h = (
                    int(bboxC.xmin * iw),
                    int(bboxC.ymin * ih),
                    int(bboxC.width * iw),
                    int(bboxC.height * ih),
                )

                face = frame[y:y + h, x:x + w]
                face_filename = os.path.join(CAPTURE_DIR, f"live_frame_{frame_count}_{i}.jpg")
                cv2.imwrite(face_filename, face)
                faces_saved.append(face_filename)

        cv2.imshow("Live Face Detection", frame)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

        frame_count += 1

    cap.release()
    cv2.destroyAllWindows()
    return {"message": "Face detection complete!", "faces_detected": faces_saved}