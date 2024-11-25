export const convert = (date: string | undefined) => {
  if (date) {
    const dateFormat = new Date(date);

    const formatted = dateFormat.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });

    return formatted;
  }
  return null; 
};
