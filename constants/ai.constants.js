export const useAiConstants = () => {
  const getModels = () => {
    const models = [
      {
        name: "GPT 4.1 Flagship",
        codename: "gpt-4-1106-preview",
        default: false,
      },
      {
        name: "GPT 4.1 Mini",
        codename: "gpt-4-1106-mini",
        default: true,
      },
      {
        name: "GPT 4.1 Nano",
        codename: "gpt-4-1106-nano",
        default: false,
      },
    ];

    return models;
  };

  const getOptions = () => {
    return {
      temperature: 0.7,
      top_p: 1,
    };
  };

  return {
    getModels,
    getOptions,
  };
};
