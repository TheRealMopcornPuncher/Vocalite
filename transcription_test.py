import speech_recognition as sr

def transcribe_audio():
    # Initialize the recognizer
    recognizer = sr.Recognizer()

    # Use the default microphone as the audio source
    mic = sr.Microphone()

    # Adjust for ambient noise to improve recognition accuracy
    with mic as source:
        print("Adjusting for ambient noise...")
        recognizer.adjust_for_ambient_noise(source)
        print("Listening... Speak now.")
        audio = recognizer.listen(source)

    # Transcribe the audio using Whisper model
    try:
        print("Transcribing...")
        text = recognizer.recognize_whisper(audio, model="base")
        print("You said:", text)
    except sr.UnknownValueError:
        print("Sorry, couldn't understand the audio.")
    except sr.RequestError as e:
        print(f"API error: {e}")

if __name__ == "__main__":
    transcribe_audio()