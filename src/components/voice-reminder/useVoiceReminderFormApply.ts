import { useCallback } from 'react';
import type { Dispatch, RefObject, SetStateAction } from 'react';
import { Alert, TextInput } from 'react-native';
import type { VoiceReminderDraft } from './types';
import { parseVoiceDate, parseVoiceTime } from './utils';

interface UseVoiceReminderFormApplyParams {
    title: string;
    notes: string;
    date: Date;
    selectedCategory: string;
    notifyBefore: number;
    allowedNotifyBeforeValues: readonly number[];
    titleRef: RefObject<TextInput | null>;
    notesRef: RefObject<TextInput | null>;
    setTitle: Dispatch<SetStateAction<string>>;
    setNotes: Dispatch<SetStateAction<string>>;
    setSelectedCategory: Dispatch<SetStateAction<string>>;
    setNotifyBefore: Dispatch<SetStateAction<number>>;
    setDate: Dispatch<SetStateAction<Date>>;
    setShowDetails: Dispatch<SetStateAction<boolean>>;
    onApplied: () => void;
}

export const useVoiceReminderFormApply = ({
    title,
    notes,
    date,
    selectedCategory,
    notifyBefore,
    allowedNotifyBeforeValues,
    titleRef,
    notesRef,
    setTitle,
    setNotes,
    setSelectedCategory,
    setNotifyBefore,
    setDate,
    setShowDetails,
    onApplied,
}: UseVoiceReminderFormApplyParams) => {
    const isAllowedNotifyBefore = useCallback(
        (value?: number) => typeof value === 'number' && allowedNotifyBeforeValues.includes(value),
        [allowedNotifyBeforeValues]
    );

    const applyVoiceReminderToForm = useCallback((draft: VoiceReminderDraft, replaceExisting: boolean) => {
        const voiceDate = parseVoiceDate(draft.date);
        const voiceTime = parseVoiceTime(draft.time);
        const shouldApplyTitle = Boolean(draft.title) && (replaceExisting || !title.trim());
        const shouldApplyNotes = Boolean(draft.notes) && (replaceExisting || !notes.trim());
        const shouldApplyCategory = Boolean(draft.category) && (replaceExisting || !selectedCategory);
        const shouldApplyNotifyBefore = isAllowedNotifyBefore(draft.notifyBefore) && replaceExisting;
        const shouldApplyDate = Boolean(voiceDate) && replaceExisting;
        const shouldApplyTime = Boolean(voiceTime) && replaceExisting;

        if (shouldApplyTitle && draft.title) {
            setTitle(draft.title);
            titleRef.current?.setNativeProps({ text: draft.title });
        }

        if (shouldApplyNotes && draft.notes) {
            setNotes(draft.notes);
            notesRef.current?.setNativeProps({ text: draft.notes });
            setShowDetails(true);
        }

        if (shouldApplyCategory && draft.category) {
            setSelectedCategory(draft.category);
        }

        if (shouldApplyNotifyBefore && typeof draft.notifyBefore === 'number') {
            setNotifyBefore(draft.notifyBefore);
        }

        if (shouldApplyDate || shouldApplyTime) {
            setDate((currentDate) => {
                const nextDate = new Date(currentDate);

                if (shouldApplyDate && voiceDate) {
                    nextDate.setFullYear(voiceDate.year, voiceDate.month - 1, voiceDate.day);
                }

                if (shouldApplyTime && voiceTime) {
                    nextDate.setHours(voiceTime.hours, voiceTime.minutes, 0, 0);
                }

                return nextDate;
            });
        }

        onApplied();
    }, [
        isAllowedNotifyBefore,
        notes,
        notesRef,
        onApplied,
        selectedCategory,
        setDate,
        setNotes,
        setNotifyBefore,
        setSelectedCategory,
        setShowDetails,
        setTitle,
        title,
        titleRef,
    ]);

    return useCallback((draft: VoiceReminderDraft) => {
        const voiceDate = parseVoiceDate(draft.date);
        const voiceTime = parseVoiceTime(draft.time);
        const conflicts: string[] = [];

        if (draft.title && title.trim() && title.trim() !== draft.title) {
            conflicts.push('title');
        }

        if (draft.notes && notes.trim() && notes.trim() !== draft.notes) {
            conflicts.push('notes');
        }

        if (voiceDate) {
            const currentDateValue = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            if (currentDateValue !== draft.date) {
                conflicts.push('date');
            }
        }

        if (voiceTime) {
            const currentTimeValue = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            if (currentTimeValue !== draft.time) {
                conflicts.push('time');
            }
        }

        if (draft.category && selectedCategory && selectedCategory !== draft.category) {
            conflicts.push('category');
        }

        if (isAllowedNotifyBefore(draft.notifyBefore) && notifyBefore !== draft.notifyBefore) {
            conflicts.push('notification');
        }

        if (conflicts.length === 0) {
            applyVoiceReminderToForm(draft, false);
            return;
        }

        Alert.alert(
            'Apply voice reminder?',
            `Voice AI found ${conflicts.join(', ')} that differ from your current form.`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Keep existing',
                    onPress: () => applyVoiceReminderToForm(draft, false),
                },
                {
                    text: 'Replace with voice',
                    style: 'destructive',
                    onPress: () => applyVoiceReminderToForm(draft, true),
                },
            ]
        );
    }, [
        applyVoiceReminderToForm,
        date,
        isAllowedNotifyBefore,
        notes,
        notifyBefore,
        selectedCategory,
        title,
    ]);
};
