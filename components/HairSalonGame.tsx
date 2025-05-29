//flappy bird style hair theme!
//Idea behind this: player is asked by hairdresser to take over for a little bit
//You are cutting hair. The "pipes" are hair, and the different colored hair pieces
//are "dead hair" that you are cutting. Cut 10 to win (will likely reduce this down to 6-8)

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

import hairLoss from "../assets/images/hairassets/hairloss.png";
import hairWin from "../assets/images/hairassets/hairwin.png";
import intro1 from "../assets/images/hairassets/intro.png";
import intro2 from "../assets/images/hairassets/intro2.png";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const GRAVITY = 2;
const FLAP_VELOCITY = -20;
const OBSTACLE_WIDTH = 60;
const OBSTACLE_GAP = 180;
const OBSTACLE_SPEED = 5;
const INTERVAL = 50;

const MIN_HEIGHT = 80;
const NUM_OBSTACLES = 2;
const GAME_HEIGHT = 500;
const SCISSOR_HITBOX_OFFSET = 10;

type Props = {
  onWin: () => void;
  onFail: () => void;
};

export default function HairSalonGame({ onWin, onFail }: Props) {
  const MAX_HEIGHT = GAME_HEIGHT - 200;

  const [screenIndex, setScreenIndex] = useState<
    "intro1" | "intro2" | "game" | "win" | "loss"
  >("intro1");

  const [scissorY, setScissorY] = useState(GAME_HEIGHT / 2);
  const [velocity, setVelocity] = useState(0);
  const [obstacles, setObstacles] = useState(
    Array.from({ length: NUM_OBSTACLES }).map((_, i) => {
      const topHeight = Math.floor(
        MIN_HEIGHT + Math.random() * (MAX_HEIGHT - OBSTACLE_GAP - MIN_HEIGHT)
      );
      return {
        x: SCREEN_WIDTH + i * 250,
        topHeight,
        cut: false,
      };
    })
  );
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const flap = () => {
    setVelocity(FLAP_VELOCITY);
  };

  const resetGame = () => {
    setScissorY(GAME_HEIGHT / 2);
    setVelocity(0);
    setScore(0);
    setGameOver(false);
    setObstacles(
      Array.from({ length: NUM_OBSTACLES }).map((_, i) => {
        const topHeight = Math.floor(
          MIN_HEIGHT + Math.random() * (MAX_HEIGHT - OBSTACLE_GAP - MIN_HEIGHT)
        );
        return {
          x: SCREEN_WIDTH + i * 250,
          topHeight,
          cut: false,
        };
      })
    );
  };

  useEffect(() => {
    if (screenIndex !== "game") return;

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
  }, [velocity, screenIndex]);

  useEffect(() => {
    if (screenIndex !== "game") return;

    for (const obs of obstacles) {
      const inXRange = obs.x < 90 && obs.x + OBSTACLE_WIDTH > 60;
      const inYRange =
        scissorY + SCISSOR_HITBOX_OFFSET < obs.topHeight ||
        scissorY - SCISSOR_HITBOX_OFFSET > obs.topHeight + OBSTACLE_GAP;

      if (inXRange && inYRange) {
        setGameOver(true);
        clearInterval(intervalRef.current!);
        setScreenIndex("loss");
      }
    }

    if (score >= 10) {
      clearInterval(intervalRef.current!);
      setScreenIndex("win");
    }
  }, [obstacles, scissorY, screenIndex]);

  const renderOverlayScreen = (
    img: any,
    nextAction?: () => void,
    buttonLabel?: string
  ) => (
    <View style={styles.overlayScreen}>
      <Image source={img} style={styles.overlayImage} />
      {nextAction && buttonLabel ? (
        <TouchableOpacity style={styles.startButton} onPress={nextAction}>
          <Text style={styles.startButtonText}>{buttonLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  if (screenIndex === "intro1")
    return renderOverlayScreen(intro1, () => setScreenIndex("intro2"), "NEXT");
  if (screenIndex === "intro2")
    return renderOverlayScreen(
      intro2,
      () => setScreenIndex("game"),
      "I'M READY!"
    );
  if (screenIndex === "win") return renderOverlayScreen(hairWin);
  if (screenIndex === "loss") return renderOverlayScreen(hairLoss);

  return (
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
                      height: GAME_HEIGHT - obs.topHeight - OBSTACLE_GAP + 20,
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
  overlayScreen: {
    width: "90%",
    height: GAME_HEIGHT,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "black",
    overflow: "hidden",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    marginTop: 20,
  },
  overlayImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  startButton: {
    backgroundColor: "#FFA726",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 28,
    marginBottom: 16,
    zIndex: 2,
  },
  startButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
