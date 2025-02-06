import React, { useState, useEffect, useRef } from 'react';
import { SkipForward, Mic, MicOff, XCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface VerseInputProps {
  onSubmit: (answer: string | null) => void;
  disabled?: boolean;
  attemptsLeft?: number;
}

export const VerseInput: React.FC<VerseInputProps> = ({ 
  onSubmit, 
  disabled,
  attemptsLeft
}) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const lastTranscript = useRef<string>(''); // Track the last transcribed word

  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current!.continuous = true;
      recognitionRef.current!.interimResults = true;
      recognitionRef.current!.lang = 'en-GB';

      recognitionRef.current!.onresult = (event: SpeechRecognitionEvent) => {
        let newTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            newTranscript += result;
          }
        }

        if (newTranscript.toLowerCase().includes('delete') || newTranscript.toLowerCase().includes('backspace')) {
          setInput((prevInput) => prevInput.trim().split(' ').slice(0, -1).join(' '));
        } else if (newTranscript !== lastTranscript.current) {
          setInput((prevInput) => (prevInput ? prevInput + ' ' : '') + newTranscript);
          lastTranscript.current = newTranscript;
        }
      };

      recognitionRef.current!.onerror = (event: { error: any }) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current!.onend = () => {
        if (isRecording) {
          try {
            recognitionRef.current?.start();
          } catch (error) {
            console.error("Error restarting speech recognition:", error);
          }
        }
      };
    } else {
      console.warn('SpeechRecognition is not supported in this browser.');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || attemptsLeft === 0) return;
    onSubmit(input);
  };

  const handleSkip = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop(); // Stop the mic when skipping
    }
    setInput(''); // Clear the text area
    onSubmit(null); // Notify that the user skipped
  };

  const handleClear = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop(); // Stop the mic when clearing input
    }
    setInput('');
  };
  

  const handleVoiceRecording = () => {
    if (!recognitionRef.current) return;
  
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
      }
    }
  
    setIsRecording((prev) => !prev);
  };

  const isDisabled = disabled || attemptsLeft === 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isDisabled}
          placeholder={isDisabled ? 'No more attempts remaining' : 'Type or speak the verse...'}
          className={`w-full p-4 border-2 rounded-lg form-input focus:ring focus:ring-indigo-200 focus:ring-opacity-50 resize-none h-32 ${
            isDisabled ? 'bg-gray-100 border-gray-200' : ''
          }`}
        />
        {attemptsLeft !== undefined && attemptsLeft > 0 && (
          <p className="mt-2 text-sm text-theme-secondary">
            {attemptsLeft} {attemptsLeft === 1 ? 'attempt' : 'attempts'} remaining
          </p>
        )}
      </div>
      <div className="flex space-x-4 items-center">
        <Button 
          type="submit" 
          disabled={isDisabled || !input.trim()}
          className="flex-1"
        >
          Submit Answer
        </Button>

        {/* Voice Recording Button */}
        <div
        onClick={handleVoiceRecording}
        className={`p-3 rounded-md cursor-pointer transition ${
          isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
      >
        {isRecording ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
    </div>
        {/* Clear Button */}
        <Button 
          type="button"
          variant="outline"
          onClick={handleClear}
          disabled={isDisabled || !input.trim()}
          className="flex items-center"
        >
          <XCircle className="w-4 h-4 mr-2 text-red-500" />
          Clear
        </Button>

        <Button 
          type="button"
          variant="outline"
          onClick={handleSkip}
          disabled={disabled}
          className="flex items-center"
        >
          <SkipForward className="w-4 h-4 mr-2" />
          Skip
        </Button>
      </div>
    </form>
  );
};
