import { useCallback, useEffect, useState } from 'react';
import {
    RecordingPresets,
    requestRecordingPermissionsAsync,
    setAudioModeAsync,
    useAudioRecorder,
    useAudioRecorderState,
} from 'expo-audio';
import type { AnalyzeVoiceReminderAudioFile } from '@/services/reminder-voice.service';

const MICROPHONE_PERMISSION_ERROR = 'Microphone permission is needed to record a reminder.';
const VOICE_RECORDING_MIME_TYPE = 'audio/m4a';

const getVoiceRecordingName = () => `reminder-voice-${Date.now()}.m4a`;

export const useVoiceRecorder = () => {
    const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const recorderState = useAudioRecorderState(recorder, 250);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const requestPermission = useCallback(async () => {
        setErrorMessage(null);
        const permission = await requestRecordingPermissionsAsync();
        setHasPermission(permission.granted);

        if (!permission.granted) {
            setErrorMessage(MICROPHONE_PERMISSION_ERROR);
            return false;
        }

        return true;
    }, []);

    const startRecording = useCallback(async (maxDurationSeconds?: number) => {
        setErrorMessage(null);

        const granted = hasPermission === true || await requestPermission();
        if (!granted) {
            throw new Error(MICROPHONE_PERMISSION_ERROR);
        }

        await setAudioModeAsync({
            allowsRecording: true,
            playsInSilentMode: true,
        });
        await recorder.prepareToRecordAsync();
        recorder.record(maxDurationSeconds ? { forDuration: maxDurationSeconds } : undefined);
    }, [hasPermission, recorder, requestPermission]);

    const stopRecording = useCallback(async (): Promise<AnalyzeVoiceReminderAudioFile> => {
        setErrorMessage(null);

        await recorder.stop();
        const status = recorder.getStatus();
        const uri = status.url;

        await setAudioModeAsync({
            allowsRecording: false,
        });

        if (!uri) {
            throw new Error('Could not save this recording. Please try again.');
        }

        return {
            uri,
            name: getVoiceRecordingName(),
            type: VOICE_RECORDING_MIME_TYPE,
        };
    }, [recorder]);

    const cancelRecording = useCallback(async () => {
        setErrorMessage(null);

        await recorder.stop().catch(() => undefined);

        await setAudioModeAsync({
            allowsRecording: false,
        }).catch(() => undefined);
    }, [recorder]);

    useEffect(() => {
        return () => {
            recorder.stop().catch(() => undefined);
            setAudioModeAsync({
                allowsRecording: false,
            }).catch(() => undefined);
        };
    }, [recorder]);

    return {
        requestPermission,
        startRecording,
        stopRecording,
        cancelRecording,
        hasPermission,
        errorMessage,
        isRecording: recorderState.isRecording,
        elapsedSeconds: Math.floor(recorderState.durationMillis / 1000),
    };
};
