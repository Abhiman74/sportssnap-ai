import tensorflow as tf
import numpy as np
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import motor.motor_asyncio
from datetime import datetime
import os # <-- Import the 'os' module

# --- FastAPI App Initialization ---
app = FastAPI()

# --- CORS Middleware Setup ---
origins = ["*"] # Allow all origins for simplicity on Vercel

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MongoDB Setup ---
MONGO_CONNECTION_STRING = os.environ.get('MONGO_CONNECTION_STRING')
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_CONNECTION_STRING)
db = client.sports_api_db

# --- START: Corrected File Paths ---
# Get the directory of the current script (which is in /api)
api_dir = os.path.dirname(__file__)
# Get the root directory by going one level up
root_dir = os.path.dirname(api_dir)

# Construct the full paths to your model and class names files
model_path = os.path.join(root_dir, 'sports_classifier.keras')
classes_path = os.path.join(root_dir, 'class_names.txt')

# --- Model and Class Names Loading ---
model = tf.keras.models.load_model(model_path)
with open(classes_path, "r") as f:
    class_names = [line.strip() for line in f.readlines()]
# --- END: Corrected File Paths ---


# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"message": "Sports Classifier API is running!"}
    
@app.get("/api")
def read_api_root():
    return {"message": "Sports Classifier API is running!"}


@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    # ... (The rest of your predict function remains exactly the same)
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    image = image.resize((224, 224))
    image_array = np.array(image)
    image_array = np.expand_dims(image_array, axis=0)

    predictions = model.predict(image_array)
    score = tf.nn.softmax(predictions[0])
    
    predicted_sport = class_names[np.argmax(score)]
    confidence = float(100 * np.max(score))

    log_entry = {
        "filename": file.filename,
        "predicted_sport": predicted_sport,
        "confidence": confidence,
        "timestamp": datetime.now()
    }
    await db.predictions.insert_one(log_entry)

    return {
        "sport": predicted_sport,
        "confidence": f"{confidence:.2f}%"
    }