export enum ServerEvents
{
  // General
  Pong = 'server.pong',

  // Lobby
  LobbyState = 'server.lobby.state',

  // Game
  GameStart = 'server.game.start',
  GameState = 'server.game.state',
  SensibilisationQuestion = 'server.game.sensibilisation_question',
  PracticeQuestion = 'server.game.practice_question',
}
