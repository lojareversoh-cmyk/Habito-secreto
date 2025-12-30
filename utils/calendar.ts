export const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
};

export const generateCalendarGrid = (month: number, year: number) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);

    const days = [];

    // Fill empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }

    // Fill actual days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    return days;
};

export const MONTH_NAMES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
