# Flagrush

Flagrush is a web platform for streamlined billboard permit and flagged report management. It enables users to add, view, and manage billboard permits and violation reports with a modern, full-stack approach.

## Features

- Add and manage billboard permits with all required details.
- List, filter, and view permits from a user-friendly dashboard.
- Submit and review flagged billboard reports with complete data.
- Powerful backend with FastAPI and MongoDB.
- Modern frontend with React/Next.js.
- API endpoints for permit and report CRUD operations.

## Tech Stack

- **Backend:** FastAPI (Python), Motor (MongoDB async driver), MongoDB
- **Frontend:** React / Next.js, Axios, Tailwind CSS (for styling)
- **DevOps:** Git, GitHub

## Getting Started

### Prerequisites

- Python 3.8+ and `pip`
- Node.js and npm
- [MongoDB](https://www.mongodb.com/try/download/community) running locally or MongoDB Atlas
- Git

### Backend Setup

1. Clone the repo:
    ```
    git clone https://github.com/mirthikagiri/Flagrush.git
    cd Flagrush/backend
    ```

2. Install backend dependencies:
    ```
    pip install -r requirements.txt
    # or if requirements.txt is missing:
    pip install fastapi uvicorn motor
    ```

3. Start MongoDB (if local) and then run the backend:
    ```
    uvicorn main:app --reload --port 8001
    ```

4. Access API docs at: [http://localhost:8001/docs](http://localhost:8001/docs)

### Frontend Setup

1. Open a new terminal, go to the frontend directory:
    ```
    cd ../frontend
    ```

2. Install frontend dependencies:
    ```
    npm install
    # or if using yarn: yarn
    ```

3. Start the frontend dev server:
    ```
    npm run dev
    # or yarn dev
    ```

4. Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Configuration

- Backend expects MongoDB running at `mongodb://localhost:27017` by default, or set `MONGO_URI` environment variable in backend.
- CORS is configured for `http://localhost:3000` for dev.

## API Endpoints

- `POST /permits/` - Add a new permit
- `GET /permits/` - List all permits
- `GET /permits/{permit_id}` - Get single permit by ID
- Similar endpoints for reports (`/reports/`)

## Contribution

1. Fork the repo and create your branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -m 'Add some feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Open a Pull Request

## License

[MIT](LICENSE)  
(C) 2025 mirthikagiri

---

**Questions?**  
Open an issue or contact the maintainer.
