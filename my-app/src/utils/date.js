export const formatDate = date => {
    const year = `${date.getFullYear()}`.slice(-2);
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);

    return `${year}-${month}-${day}`;
};

export const formatDays = time => {
    return Math.floor(time / 1000 / 60 / 60 / 24);
};