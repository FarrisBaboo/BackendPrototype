# Backend Prototype Setup Guide

## Prerequisites

- Node.js (https://nodejs.org/)
- Git (https://git-scm.com/)

## Clone Repository

```sh
git clone https://github.com/FarrisBaboo/BackendPrototype.git
cd BackendPrototype
```

## Install Dependencies

```sh
npm install express
```

## Set Up Environment Variables

Copy `.env.example` to `.env` and adjust file paths if needed:

```sh
cp .env.example .env
```

## Run the Server

```sh
node server.js
```

## Test Endpoints

- GET `/api/datasets` — Returns datasets
- GET `/api/devices` — Returns devices
- GET `/api/sensorstreams` — Returns sensor streams
- GET `/api/sensordata` — Returns sensor data

## Customization

- You can change data paths in `.env` for local development.

## Database Schema

- See `db/schema.sql` for the database schema (not yet integrated in code).

---

## Next Steps

- Integrate database access via repositories when ready.
- Expand endpoints as needed for your frontend/data science teams.