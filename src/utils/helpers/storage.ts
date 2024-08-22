export const storage = {
  setItem: (name: string, item: any) => {
    console.log("setItem", name, item);
    localStorage.setItem(name, JSON.stringify(item));
  },
  getItem: (name: string) => {
    const item = localStorage.getItem(name);
    if (item) {
      return JSON.parse(item);
    }
  },
};

