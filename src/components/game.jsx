import React from "react";
import styled from "@emotion/styled";

import BlankState from "./blank-state";
import LoadingIndicator from "./loading-indicator";
import GameNotFound from "./game-not-found";
import Board from "./board";
import Scoreboard from "./scoreboard";
import MediaControls from "./mediaControls";
import Logo from "./logo";
import { breakpoints, colors, themes } from "../theme";

const PageWrapper = styled("div")`
  position: relative;
  height: 100%;
  width: 100%;
  background: ${({ theme }) =>
    theme === themes.dark ? colors.purple : "transparent"};
  background: ${({ theme }) =>
    theme === themes.dark
      ? `linear-gradient(30deg,hsl(280, 94%, 16%) 30%,hsl(269,99%,30%) 100%)`
      : "transparent"};
`;

const GameBoardWrapper = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  height: "100%",
  padding: "10px"
});

const BoardTitle = styled("div")(({ theme }) => ({
  fontSize: "2rem",
  fontWeight: "600",
  textAlign: "center",
  textTransform: "uppercase",
  color: theme === themes.dark ? colors.lightText : colors.darkText
}));

const HeaderWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0.5rem 0;
  text-align: center;

  @media (min-width: ${breakpoints.xxl}) {
    padding-top: 1rem;
    padding-bottom: 2rem;
  }
`;

const LogoWrapper = styled("div")`
  width: 100%;
  height: 5rem;

  @media (min-width: ${breakpoints.lg}) {
    height: 8rem;
  }

  @media (min-width: ${breakpoints.xxl}) {
    height: 16rem;
  }
`;

const TurnCount = styled("div")`
  font-size: 2rem;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ theme }) =>
    theme === themes.dark ? colors.lightText : colors.darkText};

  @media (min-width: ${breakpoints.xxl}) {
    font-size: 3rem;
  }
`;
const TurnCountValue = styled("span")`
  display: inline-block;
  width: 6rem;
`;

const BoardWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  @media (min-width: ${breakpoints.md}) {
    width: ${({ hideScoreboard }) => (hideScoreboard ? "100%" : "60vw")};
  }
`;

const ScoreboardWrapper = styled("div")`
  display: none;
  width: 40vw;
  padding: 0 2rem;

  @media (min-width: ${breakpoints.md}) {
    display: ${({ hide }) => (hide ? "none" : "block")};
  }
`;

const Ruleset = styled("p")`
  margin: 0.25rem;
  width: 100%;
  font-size: 1.2rem;
  text-align: center;
  color: #aaa;
  text-transform: capitalize;
`;

class Game extends React.Component {
  componentDidMount() {
    const { options } = this.props;

    if (options.boardTheme) {
      this.props.toggleTheme(options.boardTheme);
    }

    if (options.game && options.engine) {
      this.hideLogo = options.hideLogo === "true";
      this.hideScoreboard = options.hideScoreboard === "true";
      this.title = options.title && decodeURIComponent(options.title);
      this.props.setGameOptions(options);
      this.props.fetchFrames();
    } else {
      this.invalidArgs = true;
    }
  }

  render() {
    if (this.invalidArgs) {
      return <BlankState />;
    }

    if (this.props.gameNotFound) {
      return <GameNotFound />;
    }

    if (this.props.currentFrame) {
      return this.renderGame();
    }

    return <LoadingIndicator />;
  }

  renderGame() {
    const { currentFrame, options } = this.props;
    return (
      <PageWrapper theme={this.props.theme}>
        <GameBoardWrapper>
          <BoardWrapper hideScoreboard={this.hideScoreboard}>
            <BoardTitle theme={this.props.theme}>{this.title}</BoardTitle>
            <Board
              snakes={currentFrame.snakes}
              food={currentFrame.food}
              foodImage={options.foodImage}
              hazards={currentFrame.hazards}
              columns={this.props.grid.width}
              rows={this.props.grid.height}
              highlightedSnake={this.props.highlightedSnake}
              theme={this.props.theme}
              turn={currentFrame.turn}
            />
            <MediaControls
              currentFrame={currentFrame}
              hideControls={options.hideMediaControls === "true"}
              toggleTheme={this.props.toggleTheme}
              reloadGame={this.props.reloadGame}
              toggleGamePause={this.props.toggleGamePause}
              stepBackwardFrame={this.props.stepBackwardFrame}
              stepForwardFrame={this.props.stepForwardFrame}
              paused={this.props.paused}
              theme={this.props.theme}
            />
          </BoardWrapper>
          {!this.hideScoreboard && (
            <ScoreboardWrapper>
              <HeaderWrapper>
                {!this.hideLogo && (
                  <LogoWrapper>
                    <Logo theme={this.props.theme} />
                  </LogoWrapper>
                )}
                <TurnCount theme={this.props.theme}>
                  Turn <TurnCountValue>{currentFrame.turn}</TurnCountValue>
                </TurnCount>
              </HeaderWrapper>
              <Scoreboard
                turn={currentFrame.turn}
                snakes={currentFrame.snakes}
                food={currentFrame.food}
                highlightSnake={this.props.highlightSnake}
                theme={this.props.theme}
              />
              <Ruleset>Rules: {this.props.ruleset.name}</Ruleset>
            </ScoreboardWrapper>
          )}
        </GameBoardWrapper>
      </PageWrapper>
    );
  }
}

export default Game;
