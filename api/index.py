import tensorflow as tf
import numpy as np
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware # Import CORS
from PIL import Image
import io
import motor.motor_asyncio
from datetime import datetime

# --- FastAPI App Initialization ---
app = FastAPI()

# --- CORS Middleware Setup ---
# This allows your frontend (on localhost:3000) to communicate with this backend.
origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MongoDB Setup ---
MONGO_CONNECTION_STRING = "mongodb+srv://abhimansaharan:oyCUfGhDPtyVv5KD@mysports.3fpswh2.mongodb.net/?retryWrites=true&w=majority&appName=mysports"
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_CONNECTION_STRING)
db = client.sports_api_db

# --- Model and Class Names Loading ---
model = tf.keras.models.load_model('./sports_classifier.keras')
with open("./class_names.txt", "r") as f:
    class_names = [line.strip() for line in f.readlines()]

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"message": "Sports Classifier API is running!"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Read and preprocess the image
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    image = image.resize((224, 224))
    image_array = np.array(image)
    image_array = np.expand_dims(image_array, axis=0)

    # Make a prediction
    predictions = model.predict(image_array)
    score = tf.nn.softmax(predictions[0])
    
    # Get the top result
    predicted_sport = class_names[np.argmax(score)]
    confidence = float(100 * np.max(score))

    # Create a log entry for the database
    log_entry = {
        "filename": file.filename,
        "predicted_sport": predicted_sport,
        "confidence": confidence,
        "timestamp": datetime.now()
    }
    await db.predictions.insert_one(log_entry)

    # Return the prediction to the frontend
    return {
        "sport": predicted_sport,
        "confidence": f"{confidence:.2f}%"
    }