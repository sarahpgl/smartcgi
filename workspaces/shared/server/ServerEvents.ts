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
  GetSensibilisationQuestion ='server.game.get_sensibilisation_question',
}
