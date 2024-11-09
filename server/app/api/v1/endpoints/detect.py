from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from ....services.audio_feature_extractor import *
import pickle

router = APIRouter()

linear_model_file = "../models/linear_model.pkl"
with open(linear_model_file, 'rb') as model_file:
    linear_model = pickle.load(model_file)

@router.post("/api/detect/audio/")
async def predict_audio(audio: UploadFile = File(...)):
    
    if audio.content_type not in ["audio/wav", "audio/mp3", "audio/webm"]:
            return JSONResponse(status_code=400, content={"message": "Invalid file type. Please upload a WAV or MP3 file."})
    
    audio_file_location = f"audios/webm/{audio.filename}"

    with open(audio_file_location, "wb") as file:
        file.write( await audio.read())
    
    # converting to wav format supported by librosa
    output_wav = f"audios/wav/{audio.filename.split('.')[0]}.wav"
    extract_audio_from_webm(audio_file_location, output_wav)
    features = extract_vocal_features(output_wav)
    
    features = np.array(list(features.values())).reshape(1, -1)
    pd_result = linear_model.predict(features)


    return {"message": f"Tested {"Positive" if pd_result[0] == 1 else "Negative"} for Parkinson Disease"}

