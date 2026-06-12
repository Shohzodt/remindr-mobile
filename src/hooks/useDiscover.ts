import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DiscoverService, type AddDiscoverReminderPayload } from '@/services/discover.service';
import { CALENDAR_META_QUERY_KEY, REMINDERS_QUERY_KEY } from '@/hooks/useReminders';
import type { DiscoverCategoryKey } from '@/types/discover';

export const DISCOVER_QUERY_KEY = ['discover'];

export function useDiscoverFeaturedItems() {
    return useQuery({
        queryKey: [...DISCOVER_QUERY_KEY, 'featured'],
        queryFn: () => DiscoverService.getAll(),
    });
}

export function useDiscoverCategoryItems(categoryKey: Exclude<DiscoverCategoryKey, 'all'>, enabled = true) {
    return useQuery({
        queryKey: [...DISCOVER_QUERY_KEY, 'category', categoryKey],
        queryFn: () => DiscoverService.getByCategory(categoryKey),
        enabled,
    });
}

export function useDiscoverItem(id?: string, enabled = true) {
    return useQuery({
        queryKey: [...DISCOVER_QUERY_KEY, 'detail', id],
        queryFn: () => DiscoverService.getOne(id!),
        enabled: enabled && Boolean(id),
    });
}

export function useAddDiscoverReminder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: AddDiscoverReminderPayload }) =>
            DiscoverService.addReminder(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DISCOVER_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: REMINDERS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: CALENDAR_META_QUERY_KEY });
        },
    });
}
