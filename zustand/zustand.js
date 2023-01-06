import create from "zustand";

const useStore = create((set) => ({
    reminders: [],

    setReminders: (newReminders) =>
        set((state) => ({
            reminders: newReminders,
        })),

    pastReminders: [],

    setPastReminders: (newPastReminders) =>
        set((state) => ({
            pastReminders: newPastReminders,
        })),
}));

export default useStore;