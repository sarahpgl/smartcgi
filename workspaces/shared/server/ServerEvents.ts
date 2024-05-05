export enum ServerEvents {
  // General
  Pong = 'server.pong',

  // Lobby
  LobbyJoined = 'server.lobby.joined',
  LobbyState = 'server.lobby.state',

  // Game
  GameStart = 'server.game.start',
  GameState = 'server.game.state',
  PracticeQuestion = 'server.game.practice_question',
  CardPlayed = 'server.game.card_played',
  SensibilisationQuestion ='server.game.sensibilisation_question',
  PlayerPassed = 'server.game.player_passed',
}
