
export const calculateOfflineTime = (start, now = new Date()) => {
    if(!start) return NaN;
    const lastLogin = new Date(start);
    const offlineTime = now - lastLogin;

    const secs = Math.floor(offlineTime / 1000);
    const mins = Math.floor(secs / 60);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if(days > 0) return `${days} ngay truoc`;
    if(hours > 0) return `${hours} tieng truoc`;
    if(mins > 0) return `${mins} phut truoc`;
    if(secs > 0) return `${secs} giay truoc`;
}