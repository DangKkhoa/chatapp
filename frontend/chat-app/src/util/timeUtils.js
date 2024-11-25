
export const calculateOfflineTime = (start, now = new Date()) => {
    if(!start) return "Dang hoat dong";
    const lastLogin = new Date(start);
    const offlineTime = now - lastLogin;
    console.log(lastLogin)
    const secs = Math.floor(offlineTime / 1000);
    const mins = Math.floor(secs / 60);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    console.log(`${days}:${hours}:${mins}:${secs}`)

    if(days > 0) return `Active ${days} ${days > 1 ? "days" : "day"} ago`;
    if(hours > 0) return `Active ${hours} ${hours > 1 ? "hours" : "hour"} ago`;
    if(mins > 0) return `Active ${mins} ${mins > 1 ? "minutes" : "minute"} ago`;
    if(secs >= 0) return "Active recently"; 
}