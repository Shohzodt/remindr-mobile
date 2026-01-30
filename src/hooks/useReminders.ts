import { RemindersService, CreateReminderDto } from '@/services/reminders.service';
import { NotificationService } from '@/services/notifications.service';
import * as Haptics from 'expo-haptics';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const REMINDERS_QUERY_KEY = ['reminders'];

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
            console.error('Create reminder failed', err);
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
