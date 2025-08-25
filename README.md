# Flagrush: Unauthorized Billboard Detection & Management

---

## 1. Introduction & Problem Context

Unauthorized billboards pose significant challenges in urban areas, including traffic safety risks, violation of municipal regulations, and visual degradation of city aesthetics. Current enforcement systems are manual, inefficient, and costly, making real-time compliance monitoring difficult.

---

## 2. Project Objectives

Flagrush aims to provide a scalable, tech-enabled solution combining Artificial Intelligence (AI), Augmented Reality (AR), and citizen engagement. The system enables real-time detection, validation, and reporting of unauthorized billboards, supporting municipal compliance checks.

---

## 3. Solution Overview

The Flagrush system is designed as a full-stack solution:

- **Web Platform:** React + FastAPI + MongoDB-based dashboard for permit management and violation tracking.
- **AR Mobile App:** Flutter-based gamified app where users control a dragon avatar in AR to flag billboards.
- **AI Integration (Future Scope):** Roboflow + TFLite object detection models to automate billboard detection.
- **Unity Integration:** Unity project contains a dragon model asset used for AR visualization and interactive gamification.

---

## 4. System Architecture

The architecture follows an end-to-end flow:

1. **AR App:** Users scan billboards and interact with AR gamification.
2. **Backend:** FastAPI validates the report with municipal permit data.
3. **Database:** MongoDB stores permits, violations, and geospatial data.
4. **Dashboard:** React frontend displays analytics, violations, and permit status.
5. **Unity:** Provides 3D dragon avatar model with animations to enhance user engagement in AR.

---

## 5. Technology Stack & Rationale

| Technology       | Purpose                                            |
|------------------|----------------------------------------------------|
| Flutter          | Cross-platform AR mobile app development            |
| FastAPI          | Lightweight asynchronous backend API                |
| MongoDB          | Flexible NoSQL DB with geospatial query support    |
| React            | Responsive and dynamic web dashboard                 |
| Roboflow / TFLite| AI object detection for billboard detection          |
| Unity            | 3D Dragon avatar model for immersive AR gamification |

---

## 6. Key Features

- **Web Dashboard:** Permit CRUD, violation tracking, heatmaps.
- **Mobile App:** AR dragon avatar, gamification, GPS geotagging.
- **Backend APIs:** Secure, real-time validation logic.
- **Gamification:** Points, badges, leaderboards to motivate users.
- **Citizen Engagement:** Community validation of flagged billboards.
- **Unity Dragon Model:** 3D interactive dragon avatar integrated into AR experiences.

---

## 7. Unity Dragon Model Integration

- The Unity project includes a 3D dragon model asset located in `unity/Assets/UnityDragonModel`.
- This dragon avatar serves as a playful guide within the AR mobile app, providing interactive animations and feedback when users flag billboards.
- Unity scripts coordinate the dragon’s behavior with real-time detection results from the AI system.
- The dragon enhances user engagement by converting civic reporting into an enjoyable gamified experience.

---

## 8. Assumptions & Constraints

- Citizen participation is voluntary.
- Internet connectivity required for syncing data.
- Initial AI detection uses placeholder models; precision will improve over time.
- Enforcement depends on municipal policy integration.

---

## 9. Compliance & Privacy

- No facial recognition or public surveillance.
- Only billboard and geolocation data are collected.
- User identity remains anonymous.
- Data handling aligns with privacy and urban governance standards.

---

## 10. Project Usage & Setup

### Backend Setup

- Clone the repository and navigate to the `backend` folder.
- Install dependencies: 
