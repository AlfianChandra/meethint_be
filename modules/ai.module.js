import OpenAI from "openai";
import dotenv from "dotenv";
import { useAiConstants } from "../constants/ai.constants";
import { EventEmitter } from "events";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const useAiModule = () => {
  const aiBasicCompletionCompose = (payload) => {
    let defaultOptions = {
      model: useAiConstants()
        .getModels()
        .find((model) => model.default).codename,
      temperature: useAiConstants().getOptions().temperature,
      top_p: useAiConstants().getOptions().top_p,
    };
  };
};
