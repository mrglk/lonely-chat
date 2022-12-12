export function generateId() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

export function getTimeForMessage(timestamp) {
    const time = new Date(timestamp);
    return `${time.getHours()}:${time.getMinutes()}`;
}