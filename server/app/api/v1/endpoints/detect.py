from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse

router = APIRouter()

@router.post("/api/detect/audio/")
async def predict_audio(audio: UploadFile = File(...)):
    
    if audio.content_type not in ["audio/wav", "audio/mp3", "audio/webm"]:
            return JSONResponse(status_code=400, content={"message": "Invalid file type. Please upload a WAV or MP3 file."})
    
    audio_file_location = f"audios/{audio.filename}"

    with open(audio_file_location, "wb") as file:
         file.write( await audio.read())
    
    return {"message": f"File '{audio.filename}' uploaded successfully."}

@router.get("/api/detect/test")
async def predict_audio():

    
    return {"result": "Manoj"}