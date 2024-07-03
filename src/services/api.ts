// src/services/api.ts
export const fetchQuestion = async () => {
    const response = await fetch('https://opentdb.com/api.php?amount=1');
    const data = await response.json();
    return data.results[0];
  };
  