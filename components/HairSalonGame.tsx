import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const GRAVITY = 2;
const FLAP_VELOCITY = -20;
const OBSTACLE_WIDTH = 60;
const OBSTACLE_GAP = 180;
const OBSTACLE_SPEED = 5;
const INTERVAL = 50;

const MIN_HEIGHT = 80;
const NUM_OBSTACLES = 2;
const GAME_HEIGHT = 500;

type Props = {
  onWin: () => void;
};

export default function HairSalonGame({ onWin }: Props) {
  const MAX_HEIGHT = GAME_HEIGHT - 200;

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

  const intervalRef = useRef<NodeJS.Timer | null>(null);

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
            scissorY >= obs.topHeight &&
            scissorY <= obs.topHeight + OBSTACLE_GAP;

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
  }, [velocity]);

  useEffect(() => {
    for (const obs of obstacles) {
      const inXRange = obs.x < 90 && obs.x + OBSTACLE_WIDTH > 60;
      const inYRange =
        scissorY < obs.topHeight || scissorY > obs.topHeight + OBSTACLE_GAP;

      if (inXRange && inYRange) {
        setGameOver(true);
        clearInterval(intervalRef.current!);
      }
    }
    if (score >= 10) {
      clearInterval(intervalRef.current!);
      onWin();
    }
  }, [obstacles, scissorY]);

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Snips: {score}</Text>

      <View style={styles.gameArea}>
        <TouchableOpacity
          onPress={flap}
          style={styles.touchArea}
          activeOpacity={1}
        >
          {obstacles.map((obs, idx) => {
            const isCut = obs.cut;
            const gapColor = isCut ? "transparent" : "#cda4f3";

            return (
              <React.Fragment key={idx}>
                <View
                  style={[
                    styles.obstacle,
                    {
                      height: obs.topHeight,
                      left: obs.x,
                      top: 0,
                      backgroundColor: "#ffb6c1",
                    },
                  ]}
                />
                <View
                  style={[
                    styles.obstacle,
                    {
                      height: GAME_HEIGHT - obs.topHeight - OBSTACLE_GAP,
                      top: obs.topHeight + OBSTACLE_GAP,
                      left: obs.x,
                      backgroundColor: "#ffb6c1",
                    },
                  ]}
                />
                <View
                  style={{
                    position: "absolute",
                    top: obs.topHeight,
                    height: OBSTACLE_GAP,
                    left: obs.x,
                    width: OBSTACLE_WIDTH,
                    backgroundColor: gapColor,
                  }}
                />
              </React.Fragment>
            );
          })}

          <View
            style={{
              position: "absolute",
              top: scissorY,
              left: 60,
              width: 30,
              height: 30,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#333",
              borderRadius: 4,
            }}
          >
            <Text style={{ fontSize: 24 }}>✂️</Text>
          </View>
        </TouchableOpacity>
      </View>

      {gameOver && (
        <>
          <Text style={styles.gameOver}>💇‍♀️ You snipped too hard!</Text>
          <TouchableOpacity style={styles.reset} onPress={resetGame}>
            <Text style={styles.resetText}>Try Again</Text>
          </TouchableOpacity>
        </>
      )}
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
    backgroundColor: "#d0f0eb",
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
  gameOver: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#a33",
    textAlign: "center",
    marginTop: 20,
  },
  reset: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#444",
    borderRadius: 8,
  },
  resetText: {
    color: "white",
    fontWeight: "bold",
  },
});
