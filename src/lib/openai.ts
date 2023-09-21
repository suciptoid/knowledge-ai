import { env } from '$env/dynamic/private';
import { OpenAI } from 'openai';

// const configuration = new Configuration({ apiKey: env.OPENAI_KEY });
export const openAi = new OpenAI({ apiKey: env.OPENAI_KEY });
