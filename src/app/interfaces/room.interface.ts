export interface Room {
  id: string
  firstPlayer: Player
  secondPlayer: Player
  mode: string
  currentGame: Game 
}

export interface Player {
  id: string,
  name: string,
  playerState: string
}

export interface Game {
  gameNumber: number
  state: string
  winnerName: string
  scoreFirstPlayer: number
  scoreSecondPlayer: number
  lastRound: Round
}

export interface Round {
  roundNumber: number
  state: string
  playerIsWaiting: boolean
  winnerName: string
  tie: boolean
  roundTurns: RoundTurn[]
}

export interface RoundTurn {
  playerId: string
  choice: string
}

export interface GameMode {
  value: string
  text: string
  icon: string
}
