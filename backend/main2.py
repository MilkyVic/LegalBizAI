import time
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import logging

from utils import make_async
from generation import vistral7b  # Ensure this import is correct

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

origins = ["http://127.0.0.1:8000/vistral"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm_call = {
    "legalbizai-vistral": make_async(vistral7b.generate_response),  # Ensure this function is correct
}

DEFAULT_MODEL = "legalbizai-vistral"


@app.post("/vistral")
async def stream_response(request: Request):
    logger.info("Received request at /vistral")
    body = await request.json()
    model = DEFAULT_MODEL
    prompt = body["contents"][0]["parts"][0]["text"]

    if not prompt:
        return JSONResponse({"error": "Prompt is required"}, status_code=400)

    start_time = time.time()
    result = await llm_call[model](prompt)
    execution_time = time.time() - start_time
    logger.info(f"Executed time: {execution_time:.4f} seconds")

    resp = {"candidates": [{"content": {"parts": [{"text": result}]}}]}
    return JSONResponse(resp)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
