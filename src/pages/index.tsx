/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import ShrinkGirl from "../components/avatars/Girl/ShrinkGirl";
import styled, { keyframes } from "styled-components";
import Script from "next/script";

const Home: NextPage = () => {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [agentType, setAgentType] = useState<"philosopher" | "psychologist">(
    "philosopher"
  );
  const [lastUserSentence, setLastUserSentence] = useState(
    agentType === "philosopher"
      ? "Let us discuss the nature of justice"
      : "hey  there. I am feeling overwhelmed."
  );

  const [userSentenceHistory, setUserSentenceHistory] = useState<string[]>([]);
  const [voiceList, setVoiceList] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const microphoneRef = useRef<HTMLDivElement>(null);
  const [hydrated, setHydrated] = useState(false);
  const [robotMood, setRobotMood] = useState<"friendly" | "moody" | "freudian">(
    "friendly"
  );
  const [botSpeaking, setBotSpeaking] = useState(false);

  const {
    data: robotAnswer,
    refetch,
    isLoading,
  } = api.openAI.getResponse.useQuery(
    {
      text: userSentenceHistory.join(" "),
      responseMood: robotMood,
      agentType: "philosopher",
    },
    { enabled: false }
  );

  useEffect(() => {
    if (agentType === "philosopher") {
      setLastUserSentence("Let us discuss the nature of justice");
    } else {
      setLastUserSentence("hey  there. I am feeling overwhelmed.");
    }
  }, [agentType]);

  useEffect(() => {
    // This forces a rerender, so the date is rendered
    // the second time but not the first
    setHydrated(true);
  }, []);

  const breatheAnimation = keyframes`
 0% { -webkit-transform: scale(0.9);
    -ms-transform: scale(0.9);
    transform: scale(0.9); }
 25% {   -webkit-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1); }
 60% {   -webkit-transform: scale(0.9);
    -ms-transform: scale(0.9);
    transform: scale(0.9);}
 100% {   -webkit-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
  }}`;

  const BreathingText = styled.div`
    width: 300px;
    color: #fff;
    -webkit-font-smoothing: antialiased;
    border-radius: 2px;
    text-align: center;
    animation-name: ${breatheAnimation};
    animation-duration: 8s;
    animation-iteration-count: infinite;
  `;

  useEffect(() => {
    if (robotAnswer && robotAnswer.response.length > 0) {
      setBotSpeaking(true);
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
            (v) => v.name === "Google UK English Female" || v.name === "Karen"
          ) as SpeechSynthesisVoice;
          msg.text = robotAnswer.response;
          speechSynthesis.speak(msg);
          msg.lang = "en-US";

          clearInterval(timer);
        }
      }, 200);

      const r = setInterval(function () {
        if (!speechSynthesis.speaking) {
          console.log("bot is not speaking");
          setBotSpeaking(false);
          clearInterval(r);
        } else {
          console.log("bot is speaking");
          setBotSpeaking(true);
          speechSynthesis.resume();
        }
      }, 1000);
    }
  }, [robotAnswer, robotAnswer?.response]);

  // if (hydrated && !SpeechRecognition.browserSupportsSpeechRecognition()) {
  //   return (
  //     <div className="mircophone-container">
  //       Browser is not Support Speech Recognition.
  //     </div>
  //   );
  // }

  const fetchAnswer = () => {
    if (lastUserSentence && lastUserSentence.length > 0) {
      setUserSentenceHistory([...userSentenceHistory, lastUserSentence]);
      setLastUserSentence("");
    } else {
      console.log("no new sentence");
    }
  };

  useEffect(() => {
    if (userSentenceHistory && userSentenceHistory.length > 0) {
      console.log(userSentenceHistory);
      refetch();
    }
  }, [refetch, userSentenceHistory]);

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
        <title>Geepies</title>
        <meta
          name="description"
          content="Geepies is a virtual buddy. Don't take it too seriously."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Gee<span className="text-[hsl(280,100%,70%)]">pies</span>
          </h1>
          <div className="w-12/12 flex	 flex-col items-center  gap-2 ">
            <ShrinkGirl isSpeaking={botSpeaking} />

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

            <>
              {isLoading && (
                <>
                  <BreathingText>
                    <p className="text-2l text-white">
                      Waiting for you to type something...
                    </p>
                  </BreathingText>{" "}
                </>
              )}
              <p className="text-2l text-white">
                {robotAnswer ? robotAnswer.response : ""}
              </p>
            </>

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

          <div className="flex w-full flex-row items-center justify-center">
            {/* tab to select either pscyhologist or philosopher agent*/}

            <div className="flex flex-row items-center justify-center gap-2">
              <button
                className={`${
                  agentType === "psychologist" ? "bg-white/20" : "bg-white/4"
                } mx-4 rounded-full px-4 py-1 font-semibold text-white no-underline transition hover:bg-white/20`}
                onClick={() => setAgentType("psychologist")}
              >
                Psychologist
              </button>
              <button
                className={`${
                  agentType === "philosopher" ? "bg-white/20" : "bg-white/4"
                } mx-4 rounded-full px-4 py-1 font-semibold text-white no-underline transition hover:bg-white/20`}
                onClick={() => setAgentType("philosopher")}
              >
                Philosopher
              </button>
            </div>
          </div>

          <div className="flex w-full flex-row items-center justify-center">
            {/* tab to select either pscyhologist or philosopher agent*/}

            {/* wide white input field  */}
            <input
              type="text"
              className="sm:text-md  w-full flex-col items-center rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:w-full lg:w-6/12"
              value={lastUserSentence}
              placeholder="Enter Text"
              onChange={(e) => setLastUserSentence(e.target.value)}
            />
            <button
              className="bg-white/4 mx-4 rounded-full px-4 py-1 font-semibold text-white no-underline transition hover:bg-white/20"
              onClick={fetchAnswer}
            >
              Say this
            </button>
          </div>
        </div>

        {/* 
        foooter showing made with <3 by me  - always absolute bottomg right
        */}
        {/* <div className="absolute bottom-0 right-0 p-8">
          <p className="text-center text-white">
            Made with <span className="text-[hsl(280,100%,70%)]">???</span> by{" "}
            <a
              className="text-[hsl(280,100%,70%)]"
              href="mailTo:leafblow@gmail.com"
            >
              some guy 
            </a>
            - absolutely not a real therapist - please dont take it too seriously
          </p>

        </div> */}
      </main>
    </>
  );
};

export default Home;
