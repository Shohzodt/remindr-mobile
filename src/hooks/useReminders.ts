import { RemindersService, CreateReminderDto, FixTimingPayload, FixTimingResponse } from '@/services/reminders.service';
import { NotificationService } from '@/services/notifications.service';
import * as Haptics from 'expo-haptics';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { HttpStatusCode } from '@/constants/http';

export const REMINDERS_QUERY_KEY = ['reminders'];
export const CALENDAR_META_QUERY_KEY = [...REMINDERS_QUERY_KEY, 'calendar-meta'];

export function useReminders() {
    const queryClient = useQueryClient();

    // 1. Fetch Reminders
    const {
        data: reminders = [],
        isLoading: isInitialLoading,
        isFetching,
        error: fetchError,
        refetch
    } = useQuery({
        queryKey: REMINDERS_QUERY_KEY,
        queryFn: () => RemindersService.getAll(),
    });


    const createMutation = useMutation({
        mutationFn: (data: CreateReminderDto) => RemindersService.create(data),
        onSuccess: async (data: any) => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Schedule local notification
            const hasPermission = await NotificationService.requestPermissions();
            if (hasPermission) {
                await NotificationService.scheduleReminder(data);
            }

            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: REMINDERS_QUERY_KEY });
        },
        onError: async (err: any) => {
            const responseMessage = err.response?.data?.message;
            const errorText = Array.isArray(responseMessage) ? responseMessage.join(' ') : responseMessage;

            console.error('Create reminder failed', {
                status: err.response?.status,
                data: err.response?.data,
                url: err.config?.baseURL + err.config?.url,
                payload: err.config?.data,
            });

            if (err.response?.status === HttpStatusCode.FORBIDDEN) {
                Alert.alert('Reminder Guardian', 'Reminder Guardian is a Pro feature.');
            } else if (typeof errorText === 'string' && errorText.toLowerCase().includes('deadlineat')) {
                Alert.alert('Reminder Guardian', 'Set a deadline first to use Reminder Guardian.');
            }

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    });

    // 3. Toggle/Update Mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateReminderDto> }) => RemindersService.update(id, data),
        onSuccess: async (data: any) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            // Reschedule if date/time changed (simplified logic)
            // In real app we might check if relevant fields changed
            // For now, if full reminder data comes back, reschedule
            if (data && data.date && data.time) {
                await NotificationService.scheduleReminder(data);
            }

            queryClient.invalidateQueries({ queryKey: REMINDERS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ['reminder'] });
        },
        onError: async (err: any) => {
            // 401s are handled freely by interceptor
            console.log('Update failed', err);
        }
    });

    // 4. Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: (id: string) => RemindersService.delete(id),
        onSuccess: (data, variables) => {
            const id = variables; // mutationFn argument
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Cancel notification
            NotificationService.cancelReminder(id);

            queryClient.invalidateQueries({ queryKey: REMINDERS_QUERY_KEY });
        },
        onError: async (err: any) => {
            console.error('Delete failed', err);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    });

    const createReminder = async (data: CreateReminderDto): Promise<boolean> => {
        try {
            await createMutation.mutateAsync(data);
            return true;
        } catch (error) {
            return false;
        }
    };

    const deleteReminder = async (id: string): Promise<boolean> => {
        try {
            await deleteMutation.mutateAsync(id);
            return true;
        } catch (error) {
            return false;
        }
    };

    return {
        reminders,
        isLoading: isInitialLoading, // Only true when no data is available
        isFetching, // True whenever a request is in flight
        isSaving: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
        error: (fetchError as any)?.message || (createMutation.error as any)?.response?.data?.message || (deleteMutation.error as any)?.response?.data?.message || null,
        createReminder,
        deleteReminder,
        toggleReminder: (id: string, status: string) => updateMutation.mutateAsync({ id, data: { status } }),
        refetch
    };
};


export function useReminder(id?: string) {
    return useQuery({
        queryKey: ['reminder', id],
        queryFn: () => RemindersService.getOne(id!),
        enabled: !!id,
    });
}

export function useCalendarMeta(from: string, to: string, enabled = true) {
    return useQuery({
        queryKey: [...CALENDAR_META_QUERY_KEY, from, to],
        queryFn: async () => {
            const response = await RemindersService.getCalendarMeta(from, to);
            return response.days.reduce((acc, day) => {
                acc[day.date] = day.count;
                return acc;
            }, {} as Record<string, number>);
        },
        enabled: enabled && Boolean(from) && Boolean(to),
    });
}

export function useGuardianReminders(enabled = true) {
    return useQuery({
        queryKey: [...REMINDERS_QUERY_KEY, 'guardian'],
        queryFn: () => RemindersService.getGuardianTimeline(),
        enabled,
    });
}

export function useReminderGuardian(id?: string, enabled = true) {
    return useQuery({
        queryKey: ['reminder', id, 'guardian'],
        queryFn: () => RemindersService.getGuardianDetail(id!),
        enabled: !!id && enabled,
    });
}

export function useFixReminderTiming(id?: string) {
    const queryClient = useQueryClient();

    return useMutation<FixTimingResponse, any, FixTimingPayload>({
        mutationFn: (payload) => RemindersService.fixTiming(id!, payload),
        onSuccess: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            queryClient.invalidateQueries({ queryKey: REMINDERS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ['reminder', id] });
        },
        onError: async (err: any) => {
            console.error('Fix timing failed', err);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    });
}
