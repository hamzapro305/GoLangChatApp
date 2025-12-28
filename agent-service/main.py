from fastapi import FastAPI
from app.api.endpoints import router as api_router

app = FastAPI(title="Agent Microservice")

@app.get("/")
async def root():
    return {"message": "Agent Microservice is running"}

app.include_router(api_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
