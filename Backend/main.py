import cv2
import numpy as np
import mediapipe as mp
from datetime import datetime
import json
import sys

class FacialHealthAnalyzer:
    def __init__(self):
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            static_image_mode=True,
            max_num_faces=1,
            min_detection_confidence=0.5
        )

        # Thresholds for conditions
        self.REDNESS_THRESHOLD = 150
        self.EYE_DROOPINESS_THRESHOLD = 0.25
        self.PIMPLE_THRESHOLD = 5
        self.TOXICATION_REDNESS_THRESHOLD = 180
        self.TOXICATION_EYE_THRESHOLD = 0.2
        self.ABNORMAL_REDNESS = 200
        self.ABNORMAL_EYE_DROOPINESS = 0.15
        self.ABNORMAL_PIMPLES = 10

    def analyze_face(self, image_path):
        frame = cv2.imread(image_path)
        if frame is None:
            return json.dumps({"status": "error", "message": "Image not found or invalid file path"}, indent=4)
        
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb_frame)

        if not results.multi_face_landmarks:
            return json.dumps({"status": "error", "message": "No face detected"}, indent=4)
        
        landmarks = results.multi_face_landmarks[0]
        mask = self.create_face_mask(frame, landmarks)
        
        skin_conditions = self.analyze_skin(frame, mask)
        eye_analysis = self.analyze_eyes(frame, landmarks)
        
        is_toxicated = self.detect_toxication(skin_conditions, eye_analysis)
        is_abnormal = self.determine_abnormality(skin_conditions, eye_analysis, is_toxicated)
        
        analysis_results = {
            "status": "success",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "analysis": {
                "skin_conditions": skin_conditions,
                "eye_analysis": eye_analysis,
                "is_toxicated": is_toxicated,
                "is_abnormal": is_abnormal
            }
        }
        
       # analysis_results["analysis"].update(self.detect_toxication(analysis_results["analysis"]))
       # analysis_results["analysis"].update(self.determine_abnormality(analysis_results["analysis"]))
        
        return json.dumps({"facial_health_analysis": analysis_results}, indent=4)
    
    def create_face_mask(self, frame, landmarks):
        mask = np.zeros(frame.shape[:2], dtype=np.uint8)
        points = [(int(l.x * frame.shape[1]), int(l.y * frame.shape[0])) for l in landmarks.landmark]
        hull = cv2.convexHull(np.array(points))
        cv2.fillConvexPoly(mask, hull, 255)
        return mask
    
    def analyze_skin(self, frame, mask):
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        skin_hsv = cv2.bitwise_and(hsv, hsv, mask=mask)
        redness = np.mean(skin_hsv[:, :, 1][mask > 0])
        
        pimples = self.detect_pimples(gray, mask)
        
        return {
            "redness_level": float(redness),
            "pimples_detected": len(pimples)
        }
    
    def detect_pimples(self, gray_img, mask):
        blurred = cv2.GaussianBlur(gray_img, (5, 5), 2)
        thresh = cv2.adaptiveThreshold(blurred, 255,
                                     cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                     cv2.THRESH_BINARY_INV, 11, 2)
        thresh = cv2.bitwise_and(thresh, thresh, mask=mask)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        pimples = []
        for contour in contours:
            area = cv2.contourArea(contour)
            if 20 < area < 100:
                circularity = 4 * np.pi * area / (cv2.arcLength(contour, True) ** 2)
                if circularity > 0.7:
                    pimples.append(contour)
        
        return pimples

    def analyze_eyes(self, frame, landmarks):
        left_eye = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]
        right_eye = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398]
        
        left_ear = self.calculate_eye_ratio(landmarks, left_eye)
        right_ear = self.calculate_eye_ratio(landmarks, right_eye)
        avg_ear = (left_ear + right_ear) / 2.0
        
        return {
            "eye_ratio": avg_ear
        }
    
    def calculate_eye_ratio(self, landmarks, eye_points):
        points = np.array([(landmarks.landmark[point].x, landmarks.landmark[point].y) for point in eye_points])
        vertical_dist = np.mean([
            np.linalg.norm(points[1] - points[5]),
            np.linalg.norm(points[2] - points[4])
        ])
        horizontal_dist = np.linalg.norm(points[0] - points[3])
        
        return 0 if horizontal_dist == 0 else vertical_dist / horizontal_dist
    
    def detect_toxication(self, skin_conditions, eye_analysis):
        return skin_conditions["redness_level"] > self.TOXICATION_REDNESS_THRESHOLD and eye_analysis["eye_ratio"] < self.TOXICATION_EYE_THRESHOLD
    
    def determine_abnormality(self, skin_conditions, eye_analysis, is_toxicated):
        return skin_conditions["redness_level"] > self.ABNORMAL_REDNESS or skin_conditions["pimples_detected"] > self.ABNORMAL_PIMPLES or eye_analysis["eye_ratio"] < self.ABNORMAL_EYE_DROOPINESS or is_toxicated

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"status": "error", "message": "Usage: python script.py <image_path>"}, indent=4))
    else:
        image_path = sys.argv[1]
        analyzer = FacialHealthAnalyzer()
        print(analyzer.analyze_face(image_path))