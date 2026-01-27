import { Reminder, ReminderCategory, ReminderPriority, ReminderStatus } from '@/types';

const now = new Date();
const todayStr = now.toISOString().split('T')[0];

export const mockReminders: Reminder[] = [
    {
        id: '1',
        title: 'Quarterly Tax Filing',
        time: 'Due 14 days',
        date: todayStr,
        category: 'finances',
        priority: 'must',
        isGuardian: true,
        status: ReminderStatus.ACTIVE,
        location: 'IRS Portal',
        insight: 'Filing early prevents late penalties.',
    },
    {
        id: '2',
        title: 'Car Insurance Renewal',
        time: 'Due 3 days',
        date: todayStr,
        category: ReminderCategory.PERSONAL,
        priority: 'must',
        isGuardian: true,
        status: ReminderStatus.ACTIVE,
        insight: 'Renewal prevents 15% rate hike.',
    },
    {
        id: '3',
        title: 'Adobe Creative Cloud',
        time: 'Today',
        date: todayStr,
        category: ReminderCategory.WORK,
        priority: ReminderPriority.HIGH,
        decisionControl: {
            enabled: true,
            hardDeadline: { enabled: true },
            futureImpact: { enabled: true, message: 'Projects locked if unpaid.' }
        },
        status: ReminderStatus.ACTIVE,
        risk: 'High',
    },
    {
        id: '4',
        title: 'Apartment Lease',
        time: 'May 1st',
        date: todayStr,
        category: ReminderCategory.PERSONAL,
        priority: ReminderPriority.MEDIUM,
        risk: 'Medium',
        status: ReminderStatus.ACTIVE,
        color: 'text-amber-500',
        days: 12
    },
    {
        id: '5',
        title: 'Team Sync',
        time: '10:00 AM',
        date: todayStr,
        category: ReminderCategory.WORK,
        priority: ReminderPriority.MEDIUM,
        status: ReminderStatus.ACTIVE,
        location: 'Zoom',
    }
];

export const useRemindersMock = (date: string) => {
    return {
        reminders: mockReminders,
        isLoading: false,
    };
};
