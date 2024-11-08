from fastapi import APIRouter, UploadFile, File

router = APIRouter()


@router.post("/api/predict/audio/")
async def predict_audio(audio: UploadFile = File(...)):
    
    audio_content = await audio.read()

    with open(audio.filename, "wb") as file:
        print(audio_content)
        file.write(audio_content)
    
    return {"filename": audio.filename}

@router.get("/api/predict/test")
async def predict_audio():

    
    return {"result": "Manoj"}