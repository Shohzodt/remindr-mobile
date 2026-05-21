export const getReminderDateTime = (date: string, time: string) => {
    return new Date(`${date}T${time}:00`);
};

export const isPastReminder = (date: string, time: string) => {
    return getReminderDateTime(date, time) < new Date();
};

export const formatGuardianDueLabel = (deadlineAt?: string | null) => {
    if (!deadlineAt) return 'Protected reminder';

    const deadline = new Date(deadlineAt);
    if (Number.isNaN(deadline.getTime())) return 'Protected reminder';

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfDeadline = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
    const diffDays = Math.round((startOfDeadline.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
};
