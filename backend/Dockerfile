FROM python:3.10.14-slim

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"]