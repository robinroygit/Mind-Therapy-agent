import OpenAI from "openai";
import 'dotenv/config';
import path from 'path';
import fs from "fs"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({
  apiKey:process.env.OPEN_AI_KEY,
});

async function voiceChat(req,res) {
  try {

    //working on these TEMP:
    // const base64Audio = req.body.audioBase64;
    // const buffer = Buffer.from(base64Audio, 'base64');
    // const audioPath = path.join(__dirname, 'temp.webm');
    // fs.writeFileSync(audioPath, buffer);

    // // Transcribe
    // const transcript = await openai.audio.transcriptions.create({
    //   file: fs.createReadStream(audioPath),
    //   model: 'whisper-1'
    // });

    // const message = transcript.text;
    // console.log('User said:', message);

    // Generate therapy response
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        // { role: 'system', content: 'You are a calming subconscious mind therapist. Respond in a soothing tone' },
        { role: 'system', content: `Speak in a respectful and sincere tone. You are a student of Piyush sir from the GenAI cohort. Politely inform him that you're currently working on the Mind Therapist Agent application and need some extra time to complete it. Express that you're genuinely putting in the effort and just need a bit more time to finish it properly. Maintain a humble and dedicated tone throughout.

          Example:
          "Hello Piyush sir, I’m currently working on the Mind Therapist Agent project, and I’ve been making steady progress."
          "I kindly request a little more time to complete it, as I want to deliver a proper and complete version."
          ` },
        // { role: 'user', content: "" }
      ]
    });

    const reply = response.choices[0].message.content;

    // Convert to speech
    const speech = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'onyx',
      instructions:` Voice Affect: Calm, composed, and reassuring. Competent and in control, instilling trust.\n\nTone: Sincere, empathetic, with genuine concern for the customer and understanding of the situation.\n\nPacing: Slower during the apology to allow for clarity and processing. Faster when offering solutions to signal action and resolution.\n\nEmotions: Calm reassurance, empathy, and gratitude.\n\nPronunciation: Clear, precise: Ensures clarity, especially with key details. Focus on key words like \"refund\" and \"patience.\" \n\nPauses: Before and after the apology to give space for processing the apology. `,
      input: reply
    });

    const audioReply = Buffer.from(await speech.arrayBuffer());
    const audioBase64 = audioReply.toString('base64'); 

    // res.set({
    //   'Content-Type': 'audio/mpeg',
    //   'Content-Length': audioReply.length
    // });

    // res.send(audioReply);

    res.json({
      audio: audioBase64,
      text: reply,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong.');
  }

  
} 


  export {
    voiceChat
  }