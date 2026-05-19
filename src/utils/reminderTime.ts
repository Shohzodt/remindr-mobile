export const getReminderDateTime = (date: string, time: string) => {
    return new Date(`${date}T${time}:00`);
};

export const isPastReminder = (date: string, time: string) => {
    return getReminderDateTime(date, time) < new Date();
};
