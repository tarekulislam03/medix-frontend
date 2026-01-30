export const speak = (text: string) => {
    if (!window.speechSynthesis) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find a good English voice
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Female'))) || voices[0];

    if (voice) utterance.voice = voice;
    utterance.rate = 1.0;

    window.speechSynthesis.speak(utterance);
};
