import librosa
import numpy as np
import pandas as pd
import parselmouth
import noisereduce as nr

class AudioFeatureExtractor:
    def __init__(self, file_path):
        self.audio_timeseries, self.sampling_rate = librosa.load(file_path)
        self.reduced_noise = nr.reduce_noise(y=self.audio_timeseries, sr=self.sampling_rate)
    
    def get_audio__features(self, audio_file):

        # Load audio
        y, sr = librosa.load(audio_file, sr=None)
        
        # Pitch features (Fo, Fhi, Flo)
        f0 = librosa.yin(y, fmin=75, fmax=500)
        Fo = np.mean(f0)
        Fhi = np.max(f0)
        Flo = np.min(f0)

        # Extract jitter and shimmer using Praat (parselmouth)
        sound = parselmouth.Sound(audio_file)
        point_process = sound.to_point_process()
        jitter_local = sound.get_jitter('local')
        jitter_absolute = sound.get_jitter('local_absolute')
        jitter_rap = sound.get_jitter('rap')
        jitter_ddp = sound.get_jitter('ddp')
        shimmer_local = sound.get_shimmer('local')
        shimmer_local_db = sound.get_shimmer('local_db')
        shimmer_apq3 = sound.get_shimmer('apq3')
        shimmer_apq5 = sound.get_shimmer('apq5')
        shimmer_dda = sound.get_shimmer('dda')

        # HNR (Harmonics-to-Noise Ratio)
        hnr = sound.to_harmonicity().values.mean()

        # Other features (DFA, RPDE, spread1, spread2, D2, PPE) will require specific algorithms to calculate (will update later)
        
        features = {
            'MDVP:Fo(Hz)': Fo,
            'MDVP:Fhi(Hz)': Fhi,
            'MDVP:Flo(Hz)': Flo,
            'MDVP:Jitter(%)': jitter_local,
            'MDVP:Jitter(Abs)': jitter_absolute,
            'MDVP:RAP': jitter_rap,
            'Jitter:DDP': jitter_ddp,
            'MDVP:Shimmer': shimmer_local,
            'MDVP:Shimmer(dB)': shimmer_local_db,
            'Shimmer:APQ3': shimmer_apq3,
            'Shimmer:APQ5': shimmer_apq5,
            'Shimmer:DDA': shimmer_dda,
            'HNR': hnr,
            # Add other features here like NHR, RPDE, DFA, spread1, spread2, D2, PPE
        }

        return features
    