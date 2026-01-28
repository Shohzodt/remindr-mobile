type LogoutCallback = () => void;

class AuthEvents {
    private listeners: LogoutCallback[] = [];

    subscribe(callback: LogoutCallback): () => void {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    triggerLogout() {
        this.listeners.forEach(callback => callback());
    }
}

export const authEvents = new AuthEvents();
