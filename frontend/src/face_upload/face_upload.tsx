import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";


function FaceUpload() {
  const [selectedOption, setSelectedOption] = useState<"upload" | "camera" | null>(null);
  const [uploadedFilePath, setUploadedFilePath] = useState<string | null>(null);
  const [detectedFaces, setDetectedFaces] = useState<string[]>([]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
      {!selectedOption ? (
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-2xl font-bold">เลือกวิธีนำเข้าวิดีโอ</h1>
          <button
            className="px-6 py-3 border border-white bg-transparent hover:bg-white hover:text-black transition"
            onClick={() => setSelectedOption("upload")}
          >
            📂 อัปโหลดวิดีโอ
          </button>
          <button
            className="px-6 py-3 border border-white bg-transparent hover:bg-white hover:text-black transition"
            onClick={() => setSelectedOption("camera")}
          >
            🎥 ถ่ายวิดีโอ
          </button>
        </div>
      ) : selectedOption === "upload" ? (
        <VideoUpload onBack={() => setSelectedOption(null)} setUploadedFilePath={setUploadedFilePath} />
      ) : (
        <VideoCapture onBack={() => setSelectedOption(null)} />
      )}

      {/* แสดงปุ่มตรวจจับใบหน้าเมื่อมีไฟล์วิดีโอ */}
      {uploadedFilePath && (
        <div className="absolute bottom-10">
          <button
            className="px-6 py-3 border border-white bg-transparent hover:bg-white hover:text-black transition"
            onClick={() => detectFaces(uploadedFilePath, setDetectedFaces)}
          >
            🔍 ตรวจจับใบหน้า
          </button>
        </div>
      )}

      {/* แสดงผลใบหน้าที่ตรวจจับได้ */}
      {detectedFaces.length > 0 && (
        <div className="absolute bottom-20 w-full max-w-xl px-4 mb-4">
            <h2 className="text-lg font-semibold text-center mb-2">🎭 ผลลัพธ์ใบหน้าที่ตรวจจับได้</h2>
            
            {/* ✅ ใช้ flex และ overflow-x-auto เพื่อให้เลื่อนได้ */}
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide p-2 border border-gray-700 rounded-lg">
            {detectedFaces.map((face, index) => (
                <img key={index} src={face} alt={`Face ${index}`} className="w-24 h-24 border border-white rounded-lg shrink-0" />
            ))}
            </div>
        </div>
        )}
    </div>
  );
}

const VideoUpload = ({ onBack, setUploadedFilePath }: { onBack: () => void; setUploadedFilePath: (path: string) => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/videos/upload/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setMessage(data.message);
      setUploadedFilePath(data.file_path);
    } catch (error) {
      setMessage("Upload failed");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-xl font-semibold">📂 อัปโหลดวิดีโอ</h2>
      <input type="file" accept="video/*" className="p-2 bg-gray-800 border border-gray-600" onChange={handleFileChange} />
      <button className="px-4 py-2 border border-white bg-transparent hover:bg-white hover:text-black" onClick={handleUpload}>
        📤 อัปโหลด
      </button>
      <p>{message}</p>
      <button className="px-4 py-2 border border-white bg-transparent hover:bg-white hover:text-black" onClick={onBack}>
        🔙 กลับ
      </button>
    </div>
  );
};

const VideoCapture = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-xl font-semibold">🎥 ถ่ายวิดีโอ</h2>
      <p>🚧 ฟีเจอร์นี้กำลังพัฒนา 🚧</p>
      <button className="px-4 py-2 border border-white bg-transparent hover:bg-white hover:text-black" onClick={onBack}>
        🔙 กลับ
      </button>
    </div>
  );
};

// ฟังก์ชันเรียก API ตรวจจับใบหน้า
const detectFaces = async (videoPath: string, setDetectedFaces: (faces: string[]) => void) => {
    console.log("[DEBUG] กำลังส่ง video_path ไปยัง API:", videoPath);

    try {
    
      const response = await fetch("http://127.0.0.1:8000/api/faces/detect/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video_path: videoPath }),
      });
      const data = await response.json();
      if (data.faces_detected) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fullUrls = data.faces_detected.map((face: any) => `http://127.0.0.1:8000${face}`);
        setDetectedFaces(fullUrls);
      }
    } catch (error) {
      console.error("Error detecting faces:", error);
    }
  };

export default FaceUpload;