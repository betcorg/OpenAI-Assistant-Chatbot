
let sessions = [
  {
      userId: '5212283619628',
      thread: {},
      messages: [
          {user: 'Hola'},
          {system: 'Hola'},
      ],
  },
  {
      userId: '5212283619623',
      thread: {},
      messages: [
          {user: 'Hola'},
          {system: 'Hola'},
      ],
  },
  {
      userId: '5212283619622',
      thread: {},
      messages: [
          {user: 'Hola'},
          {system: 'Hola'},
      ],
  },
];

const userId = '5212283619623';



const newSessions = sessions.filter(session => session.userId !== userId);

console.log(newSessions);



const msg = {
  ack: 1,
  hasMedia: false,
  body: 'Hola de nuevo',
  type: 'chat',
  timestamp: 1700375682,
  from: '5212283619624@c.us',
  to: '5219841563023@c.us',
  author: undefined,
  deviceType: 'android',
  isForwarded: false,
  forwardingScore: 0,
  isStatus: false,
  isStarred: false,
  broadcast: undefined,
  fromMe: false,
  hasQuotedMsg: false,
  hasReaction: false,
  duration: undefined,
  location: undefined,
  vCards: [],
  inviteV4: undefined,
  mentionedIds: [],
  orderId: undefined,
  token: undefined,
  isGif: false,
  isEphemeral: undefined,
  links: []
}
