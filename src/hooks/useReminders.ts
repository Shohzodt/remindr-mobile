import { RemindersService, CreateReminderDto } from '@/services/reminders.service';
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
        onSuccess: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
        onSuccess: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            queryClient.invalidateQueries({ queryKey: REMINDERS_QUERY_KEY });
        },
        onError: async (err: any) => {
            // 401s are handled freely by interceptor
            console.log('Update failed', err);
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

    return {
        reminders,
        isLoading: isInitialLoading, // Only true when no data is available
        isFetching, // True whenever a request is in flight
        isSaving: createMutation.isPending || updateMutation.isPending,
        error: (fetchError as any)?.message || (createMutation.error as any)?.response?.data?.message || null,
        createReminder,
        toggleReminder: (id: string, status: string) => updateMutation.mutate({ id, data: { status } }),
        refetch
    };
}
