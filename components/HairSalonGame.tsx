//flappy bird style hair theme!
//Idea behind this: player is asked by hairdresser to take over for a little bit
//You are cutting hair. The "pipes" are hair, and the different colored hair pieces
//are "dead hair" that you are cutting. Cut 10 to win (will likely reduce this down to 6-8)

import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import chopped from "../assets/images/hairassets/chopped.png";
import deadHair from "../assets/images/hairassets/dead.png";
import healthyEnd from "../assets/images/hairassets/healthyend.png";
import healthyTop from "../assets/images/hairassets/healthytop.png";
import background from "../assets/images/hairassets/hsmobile.png";
import scissorsImg from "../assets/images/hairassets/hss.png";
import topcut from "../assets/images/hairassets/topcut.png";

import happySalon from "../assets/images/shopowners/happysalon.png";
import sadSalon from "../assets/images/shopowners/sadsalon.png";
import GamePopupModal from "./GamePopUpModal";

const SCREEN_WIDTH = Dimensions.get("window").width;
const GAME_HEIGHT = 500;

const GRAVITY = 2;
const FLAP_VELOCITY = -20;
const OBSTACLE_WIDTH = 60;
const OBSTACLE_GAP = 180;
const OBSTACLE_SPEED = 5;
const INTERVAL = 50;
const MIN_HEIGHT = 80;
const NUM_OBSTACLES = 2;
const SCISSOR_HITBOX_OFFSET = 10;

type Props = {
  onWin: () => void;
  onFail: () => void;
};

export default function HairSalonGame({ onWin, onFail }: Props) {
  const router = useRouter();
  const MAX_HEIGHT = GAME_HEIGHT - 200;

  const [step, setStep] = useState<"intro" | "rules" | "game" | "done">(
    "intro"
  );
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [scissorY, setScissorY] = useState(GAME_HEIGHT / 2);
  const [velocity, setVelocity] = useState(0);
  const [score, setScore] = useState(0);
  const [obstacles, setObstacles] = useState(generateObstacles());

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function generateObstacles() {
    return Array.from({ length: NUM_OBSTACLES }).map((_, i) => {
      const topHeight = Math.floor(
        MIN_HEIGHT + Math.random() * (MAX_HEIGHT - OBSTACLE_GAP - MIN_HEIGHT)
      );
      return {
        x: SCREEN_WIDTH + i * 250,
        topHeight,
        cut: false,
      };
    });
  }

  const flap = () => {
    setVelocity(FLAP_VELOCITY);
  };

  useEffect(() => {
    if (step !== "game") return;

    intervalRef.current = setInterval(() => {
      setVelocity((v) => v + GRAVITY);
      setScissorY((y) => Math.min(GAME_HEIGHT - 100, y + velocity));

      setObstacles((prev) =>
        prev.map((obs) => {
          let newX = obs.x - OBSTACLE_SPEED;
          let newTopHeight = obs.topHeight;
          let wasCut = obs.cut;

          const isOverlapping =
            newX < 90 &&
            newX + OBSTACLE_WIDTH > 60 &&
            scissorY + SCISSOR_HITBOX_OFFSET >= obs.topHeight &&
            scissorY - SCISSOR_HITBOX_OFFSET <= obs.topHeight + OBSTACLE_GAP;

          if (newX < -OBSTACLE_WIDTH) {
            newX = SCREEN_WIDTH;
            newTopHeight = Math.floor(
              MIN_HEIGHT +
                Math.random() * (MAX_HEIGHT - OBSTACLE_GAP - MIN_HEIGHT)
            );
            setScore((s) => s + 1);
            wasCut = false;
          }

          return {
            x: newX,
            topHeight: newTopHeight,
            cut: wasCut || isOverlapping,
          };
        })
      );
    }, INTERVAL);

    return () => clearInterval(intervalRef.current!);
  }, [velocity, step]);

  useEffect(() => {
    if (step !== "game") return;

    for (const obs of obstacles) {
      const inXRange = obs.x < 90 && obs.x + OBSTACLE_WIDTH > 60;
      const inYRange =
        scissorY + SCISSOR_HITBOX_OFFSET < obs.topHeight ||
        scissorY - SCISSOR_HITBOX_OFFSET > obs.topHeight + OBSTACLE_GAP;

      if (inXRange && inYRange) {
        clearInterval(intervalRef.current!);
        setIsCorrect(false);
        setStep("done");
        return;
      }
    }

    if (score >= 10) {
      clearInterval(intervalRef.current!);
      setIsCorrect(true);
      setStep("done");
    }
  }, [obstacles, scissorY]);

  const handleBackToMap = () => {
    if (isCorrect) {
      onWin();
    } else {
      onFail();
    }
    router.back();
  };

  return (
    <>
      {/* Intro modal */}
      <GamePopupModal
        visible={step === "intro"}
        imageSrc={happySalon}
        message={
          "Girl, this hairstylist needs a break!\n\n Care to lend a hand with split ends and bad dye jobs? \n"
        }
        onClose={() => setStep("rules")}
        buttonText="Next"
      />

      {/* Rules modal */}
      <GamePopupModal
        visible={step === "rules"}
        imageSrc={happySalon}
        message={
          "Every tap makes your scissors jump.\n\n Cut through the dead hair: gray and stringy sections. \n\n Avoid golden, healthy hair, go through 10 clean snips to win!"
        }
        onClose={() => setStep("game")}
        buttonText="Start Game"
      />

      {/* End modal */}
      <GamePopupModal
        visible={step === "done"}
        imageSrc={isCorrect ? happySalon : sadSalon}
        message={
          isCorrect
            ? "💇‍♀️ Fabulous work, stylist! The salon is saved!"
            : "✂️ Yikes! That cut went wrong. Try again, stylist."
        }
        onClose={handleBackToMap}
        buttonText="Back to Map"
      />

      {/* Game screen */}
      {step === "game" && (
        <View style={styles.container}>
          <Text style={styles.score}>Snips: {score}</Text>
          <View style={styles.gameArea}>
            <Image source={background} style={StyleSheet.absoluteFill} />

            <TouchableOpacity
              onPress={flap}
              style={styles.touchArea}
              activeOpacity={1}
            >
              {obstacles.map((obs, idx) => {
                const isCut = obs.cut;

                return (
                  <React.Fragment key={idx}>
                    <Image
                      source={isCut ? topcut : healthyTop}
                      style={[
                        styles.obstacle,
                        {
                          height: obs.topHeight + 20,
                          top: -20,
                          left: obs.x,
                          resizeMode: "stretch",
                        },
                      ]}
                    />
                    <Image
                      source={isCut ? chopped : healthyEnd}
                      style={[
                        styles.obstacle,
                        {
                          height:
                            GAME_HEIGHT - obs.topHeight - OBSTACLE_GAP + 20,
                          top: obs.topHeight + OBSTACLE_GAP,
                          left: obs.x,
                          resizeMode: "stretch",
                        },
                      ]}
                    />
                    {!isCut && (
                      <Image
                        source={deadHair}
                        style={{
                          position: "absolute",
                          top: obs.topHeight,
                          height: OBSTACLE_GAP,
                          left: obs.x - 1.5,
                          width: OBSTACLE_WIDTH,
                          resizeMode: "stretch",
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}

              <View
                style={{
                  position: "absolute",
                  top: scissorY + 5,
                  left: 65,
                  width: 20,
                  height: 20,
                  borderWidth: 1,
                  borderColor: "gray",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={scissorsImg}
                  style={{
                    width: 40,
                    height: 40,
                    resizeMode: "contain",
                    position: "absolute",
                    top: -10,
                    left: -10,
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d0f0eb",
    alignItems: "center",
    paddingTop: 20,
  },
  gameArea: {
    width: "90%",
    height: GAME_HEIGHT,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  touchArea: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  obstacle: {
    position: "absolute",
    width: OBSTACLE_WIDTH,
  },
  score: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#004c3f",
    marginBottom: 12,
  },
});
