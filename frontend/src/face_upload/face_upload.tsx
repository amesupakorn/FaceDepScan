import { useState } from "react";

function FaceUpload() {
  const [selectedOption, setSelectedOption] = useState<"upload" | "camera" | null>(null);

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
        <VideoUpload onBack={() => setSelectedOption(null)} />
      ) : (
        <VideoCapture onBack={() => setSelectedOption(null)} />
      )}
    </div>
  );
}

const VideoUpload = ({ onBack }: { onBack: () => void }) => (
  <div className="flex flex-col items-center space-y-4">
    <h2 className="text-xl font-semibold">📂 อัปโหลดวิดีโอ</h2>
    <input type="file" accept="video/*" className="p-2 bg-gray-800 border border-gray-600" />
    <button className="px-4 py-2 border border-white bg-transparent hover:bg-white hover:text-black" onClick={onBack}>
      🔙 กลับ
    </button>
  </div>
);

const VideoCapture = ({ onBack }: { onBack: () => void }) => (
  <div className="flex flex-col items-center space-y-4">
    <h2 className="text-xl font-semibold">🎥 ถ่ายวิดีโอ</h2>
    <video className="w-64 h-48 bg-black" autoPlay></video>
    <button className="px-4 py-2 border border-white bg-transparent hover:bg-white hover:text-black" onClick={onBack}>
      🔙 กลับ
    </button>
  </div>
);

export default FaceUpload;