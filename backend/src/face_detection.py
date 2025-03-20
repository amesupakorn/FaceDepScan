import cv2
import mediapipe as mp
import os

mp_face_detection = mp.solutions.face_detection
face_detection = mp_face_detection.FaceDetection(min_detection_confidence=0.5)

def detect_faces(video_path, output_folder="data/extracted_faces"):
    """ ตรวจจับใบหน้าจากวิดีโอและบันทึกเป็นภาพ """
    
    os.makedirs(output_folder, exist_ok=True)  # ✅ สร้างโฟลเดอร์ถ้ายังไม่มี
    cap = cv2.VideoCapture(video_path) 
    frame_count = 0
    faces_saved = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print(f"[DEBUG] วิดีโอจบแล้ว หรืออ่านเฟรมไม่ได้")
            break

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_detection.process(frame_rgb)

        if results.detections:
            print(f"[DEBUG] พบใบหน้า {len(results.detections)} รายการในเฟรมที่ {frame_count}")
            for i, detection in enumerate(results.detections):
                bboxC = detection.location_data.relative_bounding_box
                ih, iw, _ = frame.shape
                x, y, w, h = (
                    int(bboxC.xmin * iw),
                    int(bboxC.ymin * ih),
                    int(bboxC.width * iw),
                    int(bboxC.height * ih),
                )

                if x < 0 or y < 0 or w <= 0 or h <= 0:
                    print("[DEBUG] ค่า Bounding Box ผิดพลาด ข้ามเฟรมนี้")
                    continue

                face = frame[y:y + h, x:x + w] 
                face_filename = os.path.join(output_folder, f"frame_{frame_count}_{i}.jpg")
                cv2.imwrite(face_filename, face)
                print(f"[DEBUG] บันทึกภาพใบหน้า: {face_filename}")
                faces_saved.append(face_filename)

        else:
            print(f"[DEBUG] ไม่พบใบหน้าในเฟรมที่ {frame_count}")

        frame_count += 1

    cap.release()
    return faces_saved