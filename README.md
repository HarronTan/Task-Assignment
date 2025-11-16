
# Task Management System

A full-stack application for creating tasks with nested subtasks, assigning required skills, validating task dependencies, and optionally generating task skills using Google Generative AI.


## Features

- Create tasks with unlimited levels of nested subtasks
- Assign developer to tasks 
- Assign skills to tasks (case-insensitive matching)
- Auto-generate skills using Google Gemini
- PostgreSQL database with Knex migrations


## Tech Stack

**Client:** 
- React + TypeScript
- Vite

**Server:** 
- Node.js
- Express

**Database:**
- PostgreSQL

**Containerisation** 
- Docker
- Docker Compose
## Prerequisites
Ensure you have:
- Node.js ≥ 18
- Docker & Docker Compose
- npm or yarn
## Installation

Clone Repository

```bash
git clone https://github.com/HarronTan/Task-Assignment.git
cd Task-Assignment
```

Ensure you add the .env file to root directory

List of env names:
```bash
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
DATABASE_URL
VITE_API_BASE_URL
```


Start Containers (Backend, Frontend, Database)
```bash
docker compose up -d
```

Access Web Page on
```http
http://localhost:3000/
```
## API Reference
All backend API routes are prefixed with:

```bash
/api
```
So the actual paths are:

```bash
/api/developers
/api/skills
/api/tasks
```

Every response is in JSON format.

#### #Get Developers
Fetch all developers info and skills.
```http
  GET /api/developers
```

#### Response
```json
[
  {
    "id": 1,
    "name": "Alice",
    "skills": [
      { "id": 3, "name": "React" },
      { "id": 5, "name": "Node.js" }
    ]
  }
]

```

#### #Get Tasks
Fetch all tasks including nested subtasks, skills, status, and assignees.
```http
  GET /api/tasks
```

#### Response

```json
[
  {
    "id": 10,
    "title": "Build UI",
    "status": "To-do",
    "skills": [{ "id": 1, "name": "React" }],
    "assignees": [],
    "subTasks": [
      {
        "id": 11,
        "title": "Create Login Form",
        "status": "Done",
        "skills": [],
        "subTasks": []
      }
    ]
  }
]

```

#### #Create new tasks

```http
POST /api/tasks
```
Create a new task(s) with optional nested subtasks.

#### Request Body

```json
[{
  "title": "Build dashboard",
  "status": "To-do",
  "skills": ["React", "UX"],
  "subtasks": [
    {
      "title": "Design wireframes",
      "status": "To-do",
      "skills": ["UX"],
      "subtasks": []
    }
  ]
}]
```

#### Response
```json
{
    message: "Tasks created successfully",
    data: {
        taskIds: resultArray
    }
}
```

#### #Update Task status
```http
PUT /api/tasks/status
```

#### Request Body

```json
{
  "taskId": 10,
  "status": "Done"
}
```

#### Response

```json
{
    message: "Task status updated successfully",
    data: {
        taskId:result.id
    },
}
```

#### #Update Task assignment
```http
PUT /api/tasks/assignment
```

#### Request Body

```json
{
  "taskId": 10,
  "developerId": 1
}
```

#### Response

```json
{
    message: "Task assignment updated successfully",
    data: {
        taskId : result.task_id
    },
}
```



## Dependencies

```bash
"dependencies": {
    "@google/genai": "^1.29.1", // Google Gemini
    "axios": "^1.13.1", // HTTP fetch
    "cors": "^2.8.5", // enable cors
    "dotenv": "^17.2.3", // inject env variables
    "knex": "^3.1.0", // database migration and management
    "pg": "^8.16.3" // postgres library
}
```

