/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import Head from "next/head";
import Script from "next/script";
import { useState, useEffect } from "react";
import { SvgDrawing } from "../components/Svg";

interface Props {
  isSpeaking: boolean;
}
const ShrinkGirl = ({ isSpeaking }: Props) => {
  localStorage.setItem("isSpeaking", isSpeaking.toString());
  console.log("isSpeaking", isSpeaking);
  return (
    <>
      <Script
        id="show-banner"
        onLoad={() => {
          console.log("on load of own script");
        }}
        strategy="lazyOnload"
      >{` 
gsap.registerPlugin();
 meTl = gsap.timeline({
  onComplete: addMouseEvent,
  delay: 0
});

gsap.set(".bg", { transformOrigin: "50% 50%" });
gsap.set(".ear-right", { transformOrigin: "0% 50%" });
gsap.set(".ear-left", { transformOrigin: "100% 50%" });
gsap.set(".me", { opacity: 1 });

meTl
  .from(
    ".me",
    {
      duration: 1,
      yPercent: 100,
      ease: "elastic.out(0.5, 0.4)"
    },
    0.5
  )
  .from(
    ".head , .hair , .shadow",
    {
      duration: 0.9,
      yPercent: 20,
      ease: "elastic.out(0.58, 0.25)"
    },
    0.6
  )
  .from(
    ".ear-right",
    {
      duration: 1,
      rotate: 40,
      yPercent: 10,
      ease: "elastic.out(0.5, 0.2)"
    },
    0.7
  )
  .from(
    ".ear-left",
    {
      duration: 1,
      rotate: -40,
      yPercent: 10,
      ease: "elastic.out(0.5, 0.2)"
    },
    0.7
  )
  .to(
    ".glasses",
    {
      duration: 1,
      keyframes: [{ yPercent: -10 }, { yPercent: -0 }],
      ease: "elastic.out(0.5, 0.2)"
    },
    0.75
  )
  .from(
    ".eyebrow-right , .eyebrow-left",
    {
      duration: 1,
      yPercent: 300,
      ease: "elastic.out(0.5, 0.2)"
    },
    0.7
  )
  .to(
    ".eye-right , .eye-left",
    {
      duration: 0.01,
      opacity: 1
    },
    0.85
  )
  .to(
    ".eye-right-2 , .eye-left-2",
    {
      duration: 0.01,
      opacity: 0
    },
    0.85
  );

const blink = gsap.timeline({
  repeat: -1,
  repeatDelay: 5,
  paused: true
});

blink
  .to(
    ".eye-right, .eye-left",
    {
      duration: 0.01,
      opacity: 0
    },
    0
  )
  .to(
    ".eye-right-2, .eye-left-2",
    {
      duration: 0.01,
      opacity: 1
    },
    0
  )
  .to(
    ".eye-right, .eye-left",
    {
      duration: 0.01,
      opacity: 1
    },
    0.15
  )
  .to(
    ".eye-right-2 , .eye-left-2",
    {
      duration: 0.01,
      opacity: 0
    },
    0.15
  );


const talky = gsap.timeline({
  paused: true,
  onComplete: () => {
    talking = false;
  }
});

talky
  .to(
    ".mouth",
    {
      duration: 0.01,
      opacity: 0
    },
    0
  )
  .to(
    ".oh",
    {
      duration: 0.01,
      opacity: 0.85
    },
    0
  )
  .to(
    ".oh",
    {
      duration: 0.01,
      opacity: 0
    },
    0.1
  )
  .to(
    ".mouth",
    {
      duration: 0.01,
      opacity: 1
    },
    0.2
  );

// end animation

// mouse coords stuff

let xPosition;
let yPosition;

let height;
let width;

function percentage(partialValue, totalValue) {
  return (100 * partialValue) / totalValue;
}

let talking;
function updateScreenCoords(event) {
  if (!talking) {
    xPosition = event.clientX;
    yPosition = event.clientY;
  }
  if (!talking && Math.abs(event.movementX) > 500) {
    talking = true;
    talky.restart();
  }
}

setInterval( () => {
  if ( localStorage.getItem('isSpeaking') == 'true') {
  talking = true;
  talky.restart();
  }
}, 400);


let storedXPosition = 0;
let storedYPosition = 0;

// gsap can use queryselector in the quick setter but this is better for performance as it touches the DOM less
const dom = {
  face: document.querySelector(".face"),
  eye: document.querySelectorAll(".eye"),
  innerFace: document.querySelector(".inner-face"),
  hairFront: document.querySelector(".hair-front"),
  hairBack: document.querySelector(".hair-back"),
  shadow: document.querySelectorAll(".shadow"),
  ear: document.querySelectorAll(".ear"),
  eyebrowLeft: document.querySelector(".eyebrow-left"),
  eyebrowRight: document.querySelector(".eyebrow-right")
};

function animateFace() {
  if (!xPosition) return;
  // important, only recalculating if the value changes
  if (storedXPosition === xPosition && storedYPosition === yPosition) return;

  // range from -50 to 50
  x = percentage(xPosition, width) - 50;
  y = percentage(yPosition, height) - 50;

  // range from -20 to 80
  yHigh = percentage(yPosition, height) - 20;
  // range from -80 to 20
  yLow = percentage(yPosition, height) - 80;

  gsap.to(dom.face, {
    yPercent: yLow / 30,
    xPercent: x / 30
  });
  gsap.to(dom.eye, {
    yPercent: yHigh / 3,
    xPercent: x / 2
  });
  gsap.to(dom.innerFace, {
    yPercent: y / 6,
    xPercent: x / 8
  });
  gsap.to(dom.hairFront, {
    yPercent: yHigh / 15,
    xPercent: x / 22
  });
  gsap.to([dom.hairBack, dom.shadow], {
    yPercent: (yLow / 20) * -1,
    xPercent: (x / 20) * -1
  });
  gsap.to(dom.ear, {
    yPercent: (y / 1.5) * -1,
    xPercent: (x / 10) * -1
  });
  gsap.to([dom.eyebrowLeft, dom.eyebrowRight], {
    yPercent: y * 2.5
  });

  storedXPosition = xPosition;
  storedYPosition = yPosition;
}

// function being called at the end of main timeline
function addMouseEvent() {
  const safeToAnimate = window.matchMedia(
    "(prefers-reduced-motion: no-preference)"
  ).matches;

  if (safeToAnimate) {
    window.addEventListener("mousemove", updateScreenCoords);

    // gsap's RAF, falls back to set timeout
    gsap.ticker.add(animateFace);

    blink.play();
  }
}

// update if browser resizes
function updateWindowSize() {
  height = window.innerHeight;
  width = window.innerWidth;
}
updateWindowSize();
window.addEventListener("resize", updateWindowSize);

function enableAutoTTS() {
  if (typeof window === 'undefined') {
    return;
  }
  const isiOS = navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  if (!isiOS) {
    return;
  }
  const simulateSpeech = () => {
    const lecture = new SpeechSynthesisUtterance('hello');
    lecture.volume = 0;
    speechSynthesis.speak(lecture);
    document.removeEventListener('click', simulateSpeech);
  };

  document.addEventListener('click', simulateSpeech);
}

enableAutoTTS();


          
         `}</Script>
      <SvgDrawing />
    </>
  );
};

export default ShrinkGirl;
