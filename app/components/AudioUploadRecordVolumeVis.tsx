'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Microphone, Play, Pause, Stop } from '@phosphor-icons/react';
import { createClient } from '@/utils/pocketbase/client';
import { useRouter } from 'next/navigation';
import { getReplicateMonoTranscript } from '@/app/lib/actions';
import clsx from 'clsx';
import { AMRPlayer, Player } from 'web-amr';
import { createNoteFromAudio } from '@/app/dashboard/newnote/audioAction';

interface AudioUploadRecordProps {
  patientId: string;
}

const AudioUploadRecordVolumeVis: React.FC<AudioUploadRecordProps> = ({
  patientId,
}) => {
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const [percentageUploaded, setPercentageUploaded] = useState(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const router = useRouter();
  const pb = createClient();
  const userIDRef = useRef<string | undefined>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAMR, setIsAMR] = useState<boolean>(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [elapsedRecordingTime, setElapsedRecordingTime] = useState<string>('');
  const [playbackTimeFormatted, setPlaybackTimeFormatted] = useState('0:00');
  const [totalDuration, setTotalDuration] = useState<string>('0:00');
  const [decibelArray, setDecibelArray] = useState<number[]>([]);

  const [status, setStatus] = useState<
    | 'initial'
    | 'recording'
    | 'audioAvailable'
    | 'playing'
    | 'uploading'
    | 'uploaded'
  >('initial');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const drawVisualRef = useRef<number | null>(null);

  // Get user ID from PocketBase auth
  useEffect(() => {
    if (pb.authStore.isValid && pb.authStore.model) {
      userIDRef.current = pb.authStore.model.id;
    }
  }, [pb]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (status !== 'initial') return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (status !== 'initial') return;
    setIsDragging(false);
  };

  const triggerFileInputClick = () => {
    if (status !== 'initial') return;
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      handleAudioFileInput(e.target.files[0]);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    if (status !== 'initial') return;
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (!files[0].type.startsWith('audio/')) return;
      handleAudioFileInput(files[0]);
    }
  };

  useEffect(() => {
    if (audioFile?.type !== 'audio/amr') return;

    let playerInstance: Player | null = null;

    const updateTimeHandler = () => {
      if (playerInstance !== null) {
        setPlaybackTimeFormatted(formatTime(playerInstance.currentTime));
      }
    };

    const checkAndLoadAudio = async () => {
      setIsAMR(true);
      const res = await fetch(audioUrl);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        playerInstance = AMRPlayer(buffer);
        setPlayer(playerInstance);

        setElapsedRecordingTime(formatTime(playerInstance.duration));

        playerInstance.addEventListener('timeupdate', updateTimeHandler);
      }
    };

    if (audioUrl) {
      checkAndLoadAudio();
    }

    return () => {
      if (playerInstance) {
        playerInstance.pause();
        playerInstance.removeEventListener('timeupdate', updateTimeHandler);
      }
    };
  }, [audioFile]);

  async function handleAudioFileInput(file: File) {
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setAudioFile(file);

    if (file.type !== 'audio/amr' && audioPlayerRef.current) {
      audioPlayerRef.current.addEventListener('loadedmetadata', () => {
        setElapsedRecordingTime(
          formatTime(audioPlayerRef.current?.duration || 0),
        );
      });
    }

    setStatus('audioAvailable');
  }

  async function handleUploadClick() {
    setStatus('uploading');

    try {
      if (audioBlob) {
        await handleAudioBlob(audioBlob);
      } else if (audioFile) {
        await handleAudioFile(audioFile);
      } else {
        throw new Error('No audio blob or file available to upload');
      }
      setStatus('uploaded');
    } catch (error) {
      console.error('Upload failed:', error);
      setStatus('audioAvailable');
    }
  }

  const handleAudioBlob = async (blob: Blob) => {
    if (!blob) return;
    try {
      const mimeType = blob.type || 'audio/wav';
      const extension = mimeType.split('/')[1] || 'wav';
      const fileName = `recording-${self.crypto.randomUUID()}.${extension}`;
      await createNoteWithAudio(blob, fileName, mimeType);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  async function handleAudioFile(file: File | null) {
    if (!file) return;
    try {
      // Read file as base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;
      
      await createNoteWithAudio(null, file.name, file.type, base64Data);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async function createNoteWithAudio(blob: Blob | null, fileName: string, mimeType: string, base64Data?: string) {
    try {
      let audioDataToSend: string | undefined;
      
      if (blob) {
        // Convert blob to base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
        reader.readAsDataURL(blob);
        audioDataToSend = await base64Promise;
      } else if (base64Data) {
        audioDataToSend = base64Data;
      }
      
      // Use server action to create note with audio
      const result = await createNoteFromAudio(patientId, audioDataToSend, fileName, mimeType);

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.success) {
        router.push(`/dashboard/notes`);
      }
    } catch (error) {
      console.error('Failed to create note:', error);
      throw error;
    }
  }

  // recorder functions
  const initializeMediaRecorder = useCallback(async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        streamRef.current = stream;
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.addEventListener(
          'dataavailable',
          handleDataAvailable,
        );
        mediaRecorderRef.current.addEventListener('stop', stopRecording);
      } catch (error) {
        console.error(`The following getUserMedia error occured: ${error}`);
      }
    } else {
      console.log('getUserMedia not supported on this browser.');
    }
  }, []);

  useEffect(() => {
    const audio = audioPlayerRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (audio) {
        setPlaybackTimeFormatted(formatPlaybackTime(audio.currentTime));

        if (
          audioPlayerRef.current?.currentTime ===
          audioPlayerRef.current?.duration
        ) {
          pauseRecording();
        }
      }
    };
    audio.addEventListener('timeupdate', updateTime);
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
    };
  }, []);

  function startRecording(event: React.MouseEvent) {
    event.stopPropagation();
    (async () => {
      if (!mediaRecorderRef.current) {
        await initializeMediaRecorder();
      }

      setElapsedRecordingTime('0:00');

      if (mediaRecorderRef.current) {
        const startTime = Date.now();

        intervalIdRef.current = setInterval(() => {
          const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
          setElapsedRecordingTime(formatTime(elapsedSeconds));
        }, 1000);

        audioChunksRef.current = [];
        mediaRecorderRef.current.start();
        setStatus('recording');

        await new Promise((resolve) => setTimeout(resolve, 100));

        const canvas = document.getElementById('visualizer');
        if (canvas) {
          visualize();
        } else {
          console.log('Canvas element not found');
        }
      }
    })();
  }

  function visualize() {
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;
    const analyser = audioContext.createAnalyser();
    analyser.minDecibels = -60;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.8;
    const sampleCount = 1024;
    analyser.fftSize = sampleCount;
    const dataArray = new Uint8Array(analyser.fftSize);

    if (!streamRef.current) {
      console.error('stream not found');
      return;
    }

    const microphone = audioContext.createMediaStreamSource(streamRef.current);
    microphone.connect(analyser);

    const canvas = document.getElementById('visualizer') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }
    let ctx = canvas.getContext('2d');
    let dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx?.scale(dpr, dpr);
    const barSpace = 12;

    let barArrayLength = Math.floor(canvas.width / barSpace);
    let barArray: number[] = new Array(barArrayLength).fill(0);

    const getBar = () => {
      analyser.getByteFrequencyData(dataArray);
      const volume = (Math.max(...dataArray) / 255) * 0.83;
      barArray.push(volume);
      if (barArray.length * barSpace > canvas.width) {
        barArray.shift();
      }
    };

    function draw() {
      getBar();
      if (ctx == null) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#f03';
      ctx.lineCap = 'round';
      ctx.lineWidth = dpr * 3;

      for (let i = 0; i < barArray.length; i++) {
        const barHeight = barArray[i] * canvas.height;
        ctx.beginPath();
        ctx.moveTo(i * barSpace, canvas.height * 0.25);
        ctx.lineTo(i * barSpace, canvas.height * 0.25 - barHeight * 0.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(i * barSpace, canvas.height * 0.25);
        ctx.lineTo(i * barSpace, canvas.height * 0.25 + barHeight * 0.5);
        ctx.stroke();
      }
    }

    function animate() {
      draw();
      drawVisualRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (drawVisualRef.current !== null) {
        cancelAnimationFrame(drawVisualRef.current);
      }
      audioContext.close();
    };
  }

  function handleDataAvailable(e: BlobEvent) {
    audioChunksRef.current.push(e.data);
  }

  function stopRecording() {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();

      const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      setAudioBlob(blob);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setTotalDuration(elapsedRecordingTime);
      setStatus('audioAvailable');
    }

    if (drawVisualRef.current) {
      cancelAnimationFrame(drawVisualRef.current);
      drawVisualRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }

  function playRecording() {
    if (isAMR) {
      player?.play();
      setStatus('playing');
    } else if (audioPlayerRef.current) {
      audioPlayerRef.current.play();
      setStatus('playing');
    }
  }

  function pauseRecording() {
    if (isAMR) {
      player?.pause();
      setStatus('audioAvailable');
    } else if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setStatus('audioAvailable');
    }
  }

  function deleteRecording() {
    setAudioUrl('');
    setAudioBlob(null);
    setAudioFile(null);
    setPlayer(null);
    setIsAMR(false);

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.removeEventListener(
        'dataavailable',
        handleDataAvailable,
      );
      mediaRecorderRef.current.removeEventListener('stop', stopRecording);
      mediaRecorderRef.current = null;
    }
    setStatus('initial');
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(1, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const formatPlaybackTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsFormatted = Math.floor(seconds % 60);
    const padZero = (num: number) => (num < 10 ? '0' + num : num);
    return `${String(minutes).padStart(1, '0')}:${padZero(secondsFormatted)}`;
  };

  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(event.target.value);

    if (isAMR) {
      if (player) {
        player.fastSeek(newTime);
        setPlaybackTimeFormatted(formatPlaybackTime(newTime));
      }
    } else if (audioPlayerRef.current) {
      audioPlayerRef.current.currentTime = newTime;
      setPlaybackTimeFormatted(formatPlaybackTime(newTime));
    }
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.removeEventListener(
          'dataavailable',
          handleDataAvailable,
        );
        mediaRecorderRef.current.removeEventListener('stop', stopRecording);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInputClick}
        tabIndex={0}
        className={clsx(
          `grid h-48 w-full max-w-prose grid-rows-4 justify-items-center rounded-md border-2 border-dotted bg-white p-4`,
          {
            'cursor-pointer': status === 'initial',
            'border-gray-300': !isDragging,
            'border-blue-600': isDragging,
          },
        )}
      >
        <div>
          {status === 'initial' ? (
            <>
              <div className="hidden text-sm font-medium text-gray-700 sm:block">
                Drag and drop or click in this area to upload an audio file.
              </div>
              <div className="text-sm font-medium text-gray-700 sm:hidden">
                Click in this area to upload an audio file.
              </div>
            </>
          ) : status === 'recording' ? (
            `${elapsedRecordingTime}`
          ) : status === 'audioAvailable' || status === 'playing' ? (
            `${playbackTimeFormatted} / ${elapsedRecordingTime}`
          ) : status === 'uploading' ? (
            <div className="loader"></div>
          ) : status === 'uploaded' ? (
            ''
          ) : (
            ''
          )}
        </div>
        <div className="w-5/6 text-center text-sm text-gray-500">
          {status === 'initial' ? (
            'Tap icon below to record new audio.'
          ) : status === 'recording' ? (
            <canvas
              id="visualizer"
              width={640}
              height={32}
              className="visualizer h-8 w-full"
            ></canvas>
          ) : status === 'audioAvailable' || status === 'playing' ? (
            <input
              type="range"
              min="0"
              max={isAMR ? (player?.duration || 0) : (audioPlayerRef.current?.duration || 0)}
              value={
                isAMR
                  ? (player?.currentTime || 0)
                  : (audioPlayerRef.current?.currentTime || 0)
              }
              onChange={handleRangeChange}
              className="w-full cursor-pointer accent-gray-600"
            />
          ) : status === 'uploading' ? (
            <div>Upload {percentageUploaded}% complete</div>
          ) : (
            'Redirecting...'
          )}
        </div>
        <div>
          {status === 'initial' && (
            <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-teal-600 p-2 shadow transition-all hover:bg-teal-500 active:bg-teal-600">
              <Microphone
                size={32}
                color="white"
                weight="duotone"
                onClick={startRecording}
              />
            </div>
          )}

          {status === 'recording' && (
            <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-red-600 p-2 shadow transition-all hover:bg-red-500 active:bg-red-600">
              <Stop
                size={30}
                color="white"
                weight="duotone"
                onClick={stopRecording}
              />
            </div>
          )}
          {status === 'audioAvailable' && (
            <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-teal-600 p-2 shadow transition-all hover:bg-teal-500">
              <Play
                size={32}
                color="white"
                weight="duotone"
                onClick={playRecording}
              />
            </div>
          )}

          {status === 'playing' && (
            <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-teal-600 p-2 shadow hover:bg-teal-500">
              <Pause
                size={32}
                color="white"
                weight="duotone"
                onClick={pauseRecording}
              />
            </div>
          )}
        </div>
        {status === 'audioAvailable' || status === 'playing' ? (
          <div className="grid w-full grid-cols-2 items-center justify-items-center text-center">
            <div
              className="mr-4 w-24 cursor-pointer rounded-lg border py-1 text-gray-700 transition-colors hover:bg-red-500 hover:text-white sm:mr-0"
              onClick={deleteRecording}
            >
              delete
            </div>
            <div
              className="ml-4 w-24 cursor-pointer rounded-lg border py-1 text-gray-700 transition-colors hover:bg-teal-500 hover:text-white sm:ml-0"
              onClick={handleUploadClick}
            >
              upload
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <input
        type="file"
        accept="audio/*"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />
      <audio ref={audioPlayerRef} src={audioUrl} hidden controls></audio>
    </>
  );
};

export default AudioUploadRecordVolumeVis;
