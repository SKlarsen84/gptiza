/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { api } from "../utils/api";
import { useState, useRef, useEffect } from "react";
import { SvgDrawing } from "../components/Svg";
import ShrinkGirl from "../components/ShrinkGirl";
import Script from "next/script";
import gsap from "gsap";
import Link from "next/link";
const Home: NextPage = () => {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [lastUserSentence, setLastUserSentence] = useState(
    "hey  there. I am feeling overwhelmed."
  );
  const [voiceList, setVoiceList] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const microphoneRef = useRef<HTMLDivElement>(null);
  const [hydrated, setHydrated] = useState(false);
  const [robotMood, setRobotMood] = useState<"friendly" | "moody" | "freudian">(
    "friendly"
  );

  const {
    data: robotAnswer,
    refetch,
    isLoading,
  } = api.openAI.getResponse.useQuery(
    {
      text: lastUserSentence,
      responseMood: robotMood,
    },
    { enabled: false }
  );

  useEffect(() => {
    // This forces a rerender, so the date is rendered
    // the second time but not the first
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (robotAnswer && robotAnswer.response.length > 0) {
      let voices;
      speechSynthesis.cancel();
      const timer = setInterval(function () {
        voices = speechSynthesis.getVoices();
        console.log(voices);
        if (voices.length !== 0) {
          const msg = new SpeechSynthesisUtterance();
          setVoiceList(voices.map((v) => v.name));
          console.log(voiceList);
          msg.voice = voices.find(
            (v) => v.name === "Google UK English Female"
          ) as SpeechSynthesisVoice;
          msg.text = robotAnswer.response;
          speechSynthesis.speak(msg);
          msg.lang = "en-US";
          clearInterval(timer);
          const r = setInterval(function () {
            console.log(speechSynthesis.speaking);
            if (!speechSynthesis.speaking) clearInterval(r);
            else speechSynthesis.resume();
          }, 1000);
        }
        robotAnswer.response = "";
      }, 200);
    }
  }, [robotAnswer, robotAnswer?.response]);

  if (hydrated && !SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className="mircophone-container">
        Browser is not Support Speech Recognition.
      </div>
    );
  }

  const login = () => {
    console.log("log in");
  };

  const handleListing = () => {
    if (microphoneRef && microphoneRef.current) {
      setIsListening(true);

      SpeechRecognition.startListening({
        continuous: true,
      });
    }
  };
  const stopHandle = () => {
    setIsListening(false);

    SpeechRecognition.stopListening();
  };
  const handleReset = () => {
    stopHandle();
    resetTranscript();
  };

  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {/* upper right corner login button */}
        <div className="absolute top-4 right-4">
          <button
            className="inline-flex items-center rounded-md border border-transparent bg-[#2e026d] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#15162c] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            onClick={() => {
              login();
            }}
          >
            Login
          </button>
        </div>

        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Robo<span className="text-[hsl(280,100%,70%)]">Shrink</span>
          </h1>
          <div className="w-12/12 flex	 flex-col items-center  gap-2 ">
            <ShrinkGirl />
            {/* <select
              className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              onChange={(e) => setRobotMood(e.target.value as any)}
            >
              <option value="friendly">Friendly therapist</option>
              <option value="moody">Moody therapist</option>
              <option value="freudian">Freudian therapist</option>
            </select> */}
          </div>
          <div className="flex flex-col items-center gap-2 ">
            {/*select dropdown with the available robot moods */}

            <p className="text-2l text-white">
              {isLoading ? "Waiting for you to type something..." : ""}
              {robotAnswer ? robotAnswer.response : ""}
              {JSON.stringify(voiceList)}
            </p>

            {/* <AuthShowcase /> */}
          </div>

          {/* <div className="microphone-wrapper">
          <div className="mircophone-container">
            <div
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              ref={microphoneRef}
              onClick={handleListing}
            >
              click
            </div>
            <div className="microphone-status">
              {isListening ? "Listening........." : "Click to start Listening"}
            </div>
            {isListening && (
              <button className="microphone-stop btn" onClick={stopHandle}>
                Stop
              </button>
            )}
          </div>
          {hydrated && transcript && (
            <div className="microphone-result-container">
              <div className="microphone-result-text">{transcript}</div>
              <button className="microphone-reset btn" onClick={handleReset}>
                Reset
              </button>
            </div>
          )}
        </div> */}

          <div className="flex w-full flex-row items-center  gap-2 ">
            {/* wide white input field  */}
            <input
              type="text"
              className="sm:text-md w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              value={lastUserSentence}
              placeholder="Enter Text"
              onChange={(e) => setLastUserSentence(e.target.value)}
            />
            <button
              className="bg-white/4 rounded-full px-4 py-1 font-semibold text-white no-underline transition hover:bg-white/20"
              onClick={() => void refetch()}
            >
              Say this
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
