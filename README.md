# 👁️ VitalGaze

> **AI-powered facial health analysis web app** — captures a live webcam frame and analyzes skin condition, eye droopiness, and signs of intoxication using MediaPipe FaceMesh and OpenCV.

![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-Backend-000000?style=flat&logo=flask&logoColor=white)
![OpenCV](https://img.shields.io/badge/OpenCV-Computer%20Vision-5C3EE8?style=flat&logo=opencv&logoColor=white)
![MediaPipe](https://img.shields.io/badge/MediaPipe-Face%20Mesh-0097A7?style=flat)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat)

---

## 🧠 What is VitalGaze?

**VitalGaze** is a full-stack facial health analysis application. It captures a live webcam frame through the browser, runs it through a computer vision pipeline powered by **MediaPipe FaceMesh** and **OpenCV**, and returns a structured health report covering skin redness, pimple detection, eye droopiness, and intoxication indicators.

No cloud APIs. No deep learning models to download. Everything runs locally on your machine.

---

## ✨ Features

- 📸 **Live webcam capture** — grabs a frame directly from the browser via Base64 encoding
- 🗺️ **468-point face mesh** — MediaPipe FaceMesh maps precise facial landmarks on the image
- 🔴 **Skin redness analysis** — measures saturation levels in HSV colour space across the face region
- 🔵 **Pimple detection** — adaptive thresholding + contour circularity filter to identify acne
- 👁️ **Eye droopiness (EAR)** — calculates Eye Aspect Ratio for both eyes to detect drooping
- 🚨 **Intoxication detection** — flags combined high redness + low EAR as intoxication signal
- ⚠️ **Abnormality detection** — overall health flag based on multi-signal threshold logic
- 📊 **Structured JSON output** — results rendered cleanly on a dedicated output page
- 🌐 **Multi-page Flask UI** — Home, About, Docs, Login, Signup, Project pages

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML, CSS, JavaScript (Base64 webcam capture) |
| **Web Framework** | Flask |
| **Face Landmark Detection** | MediaPipe FaceMesh (468 landmarks) |
| **Computer Vision** | OpenCV (`cv2`) |
| **Numerical Processing** | NumPy |
| **Backend Communication** | Flask `subprocess.run` → Python script → JSON |

---

## 🔬 How It Works

```
Browser captures webcam frame
→ Encodes as Base64 string
→ POST to /results
        │
        ▼
Flask saves decoded image
to Backend/uploaded_img/
        │
        ▼
GET /output triggers
subprocess: python main.py <image_path>
        │
        ▼
FacialHealthAnalyzer.analyze_face()
        │
        ├── MediaPipe FaceMesh
        │   └── Extract 468 facial landmarks
        │
        ├── create_face_mask()
        │   └── Convex hull mask over face region
        │
        ├── analyze_skin()
        │   ├── HSV saturation → redness_level
        │   └── Adaptive threshold + circularity → pimples_detected
        │
        ├── analyze_eyes()
        │   └── Eye Aspect Ratio (EAR) → eye_ratio
        │
        ├── detect_toxication()
        │   └── redness > 180 AND eye_ratio < 0.2 → True/False
        │
        └── determine_abnormality()
            └── Any threshold breach → True/False
        │
        ▼
JSON result → rendered on output.html
```

---

## 📊 Analysis Thresholds

| Signal | Threshold | Meaning |
|---|---|---|
| `redness_level` | > 150 | Elevated skin redness |
| `redness_level` | > 180 | Intoxication indicator |
| `redness_level` | > 200 | Abnormal redness |
| `eye_ratio (EAR)` | < 0.25 | Eye droopiness |
| `eye_ratio (EAR)` | < 0.20 | Intoxication indicator |
| `eye_ratio (EAR)` | < 0.15 | Abnormal droopiness |
| `pimples_detected` | > 10 | Abnormal acne level |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Webcam

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Corerishi/VitalGaze.git
cd VitalGaze
```

### Backend Setup

```bash
cd Backend
pip install -r requirements.txt
```

### Run the App

```bash
cd Frontend
python app.py
```

Visit `http://localhost:5000` in your browser.

---

## 📁 Project Structure

```
VitalGaze/
├── Backend/
│   ├── main.py                    # FacialHealthAnalyzer — core CV + ML logic
│   ├── download_landmarks.py      # MediaPipe landmark utilities
│   ├── alcohol_detection_model.pkl
│   ├── dataset_features.joblib
│   ├── uploaded_img/              # Temp storage for captured frames
│   └── requirements.txt
│
├── Frontend/
│   ├── app.py                     # Flask app — routes + webcam frame handler
│   ├── templates/                 # HTML pages (index, about, docs, output, etc.)
│   └── static/                    # CSS, JS, assets
│
└── README.md
```

---

## 📋 API Endpoints

| Route | Method | Description |
|---|---|---|
| `/` | GET | Home page |
| `/about` | GET | About page |
| `/docs` | GET | Documentation page |
| `/project` | GET | Project overview page |
| `/results` | POST | Receives Base64 webcam frame, saves image |
| `/output` | GET | Runs analyzer, renders JSON results |

---

## 📚 Concepts Demonstrated

- **MediaPipe FaceMesh** — real-time 468-point 3D facial landmark detection
- **Eye Aspect Ratio (EAR)** — geometric measure of eye openness used in drowsiness detection
- **HSV colour analysis** — skin redness measurement using saturation channel
- **Adaptive thresholding** — pimple detection via contour shape and circularity
- **Flask full-stack architecture** — frontend-backend separation with subprocess communication
- **Base64 image transport** — browser webcam capture → server-side OpenCV processing

---

## 👨‍💻 Author

**Rishi Raj**  
MCA — CHRIST (Deemed to be University)  
[LinkedIn](https://linkedin.com/in/rishi-raj-9110a824a) · [GitHub](https://github.com/Corerishi)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
