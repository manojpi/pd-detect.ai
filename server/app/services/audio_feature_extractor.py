import ffmpeg
import librosa
import numpy as np
import scipy.stats


def extract_audio_from_webm(webm_file, output_wav):
    # Extract audio as a .wav file
    ffmpeg.input(webm_file).output(output_wav, acodec='pcm_s16le', ac=1, ar='44100').run(overwrite_output=True)


def extract_vocal_features(audio_path, sr=44100):
    y, _ = librosa.load(audio_path, sr=sr)

    features = {}

    # Extract Features
    features['MDVP:Fo(Hz)'] = np.mean(librosa.feature.spectral_centroid(y=y, sr=sr))
    features['MDVP:Fhi(Hz)'] = np.max(librosa.feature.spectral_centroid(y=y, sr=sr))
    features['MDVP:Flo(Hz)'] = np.min(librosa.feature.spectral_centroid(y=y, sr=sr))
    features['MDVP:Jitter(%)'] = np.std(librosa.effects.harmonic(y)) / np.mean(librosa.effects.harmonic(y))
    features['MDVP:Jitter(Abs)'] = np.mean(np.abs(librosa.effects.harmonic(y)))
    features['MDVP:RAP'] = np.mean(np.abs(librosa.effects.percussive(y)))
    features['MDVP:PPQ'] = np.mean(librosa.effects.harmonic(y))
    features['Jitter:DDP'] = np.mean(librosa.effects.percussive(y))
    features['MDVP:Shimmer'] = np.var(librosa.effects.harmonic(y))
    features['MDVP:Shimmer(dB)'] = np.mean(librosa.amplitude_to_db(np.abs(librosa.stft(y))))
    features['Shimmer:APQ3'] = scipy.stats.skew(librosa.feature.rms(y=y)[0])
    features['Shimmer:APQ5'] = scipy.stats.kurtosis(librosa.feature.rms(y=y)[0])
    features['MDVP:APQ'] = np.mean(librosa.feature.rms(y=y)[0])
    features['Shimmer:DDA'] = np.var(librosa.feature.rms(y=y)[0])
    features['NHR'] = np.mean(librosa.effects.harmonic(y) / (librosa.effects.percussive(y) + 1e-9))
    features['HNR'] = scipy.stats.kurtosis(librosa.effects.harmonic(y))
    features['RPDE'] = np.mean(librosa.feature.spectral_rolloff(y=y, sr=sr))
    features['DFA'] = np.var(librosa.feature.spectral_bandwidth(y=y, sr=sr))
    features['spread1'] = np.min(librosa.feature.spectral_bandwidth(y=y, sr=sr))
    features['spread2'] = np.max(librosa.feature.spectral_bandwidth(y=y, sr=sr))
    features['D2'] = np.std(librosa.feature.zero_crossing_rate(y)[0])
    features['PPE'] = np.mean(librosa.feature.zero_crossing_rate(y)[0])

    return features
