export enum ClientEvents
{
  // General
  Ping = 'client.ping',

  // Lobby
  LobbyCreate = 'client.lobby.create',
  LobbyJoin = 'client.lobby.join',
  LobbyLeave = 'client.lobby.leave',
  LobbyStartGame = 'client.lobby.start',

  // Game
  PracticeQuestion = 'client.game.practice_question',
}
