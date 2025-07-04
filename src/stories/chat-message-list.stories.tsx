import { Message } from '@ably/chat';
import { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { action } from 'storybook/actions';

import { AvatarProvider } from '../context';
import { ChatMessageList } from '../components/molecules/chat-message-list.tsx';
import { createMockMessage, emptyMessageReactions } from '../../.storybook/mocks/mock-ably-chat';

const messages = [
  createMockMessage({
    serial: 'msg_1',
    clientId: 'user1',
    text: 'Hey, how are you doing today?',
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5),
    isUpdated: false,
    isDeleted: false,
    reactions: emptyMessageReactions(),
  }),
  createMockMessage({
    serial: 'msg_2',
    clientId: 'user2',
    text: "I'm good, thanks! Working on the new chat UI.",
    createdAt: new Date(Date.now() - 1000 * 60 * 4),
    updatedAt: new Date(Date.now() - 1000 * 60 * 4),
    isUpdated: false,
    isDeleted: false,
    reactions: {
      distinct: {
        '😊': { total: 2, clientIds: ['user1', 'user2'] },
      },
      unique: {},
      multiple: {},
    },
  }),
  createMockMessage({
    serial: 'msg_3',
    clientId: 'user3',
    text: 'Nice! Looking forward to seeing it.',
    createdAt: new Date(Date.now() - 1000 * 60 * 3),
    updatedAt: new Date(Date.now() - 1000 * 60 * 3),
    isUpdated: false,
    isDeleted: false,
    reactions: emptyMessageReactions(),
  }),
] as unknown as Message[];

const meta: Meta<typeof ChatMessageList> = {
  title: 'Molecules/ChatMessageList',
  component: ChatMessageList,
  decorators: [
    (Story) => (
      <AvatarProvider>
        <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-950">
          <div className="h-full max-w-xl w-full border rounded-md overflow-hidden bg-white dark:bg-gray-900 flex flex-col">
            <Story />
          </div>
        </div>
      </AvatarProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    messages,
    currentClientId: 'user1',
    onEdit: action('edit'),
    onDelete: action('delete'),
    onReactionAdd: action('reaction-add'),
    onReactionRemove: action('reaction-remove'),
    onLoadMoreHistory: action('load-more-history'),
    onMessageInView: action('message-in-view'),
    onViewLatest: action('view-latest'),
    hasMoreHistory: true,
    isLoading: false,
    enableTypingIndicators: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;


export const Default: Story = {
  args: {
    messages: Array.from({ length: 25 }, (_, i) =>
      createMockMessage({
        serial: `msg_${i + 1}`,
        clientId: i % 4 === 0 ? 'user1' : `user${(i % 3) + 2}`,
        text: i % 5 === 0
          ? `This is a much longer message to test text wrapping and layout. Message number ${i + 1} with lots of content to see how it displays in the chat interface.`
          : `Message ${i + 1}`,
        createdAt: new Date(Date.now() - 1000 * 60 * (25 - i)),
        updatedAt: new Date(Date.now() - 1000 * 60 * (25 - i)),
        reactions: emptyMessageReactions(),
      })
    ) as unknown as Message[],
  },
};

export const WithReactions: Story = {
  args: {
    messages: [
      createMockMessage({
        serial: 'msg_1',
        clientId: 'user2',
        text: 'Check out this awesome feature! 🚀',
        createdAt: new Date(Date.now() - 1000 * 60 * 10),
        reactions: {
          distinct: {
            '🚀': { total: 3, clientIds: ['user1', 'user3', 'user4'] },
            '👍': { total: 5, clientIds: ['user1', 'user2', 'user3', 'user4', 'user5'] },
            '❤️': { total: 2, clientIds: ['user1', 'user3'] },
            '😍': { total: 1, clientIds: ['user4'] },
          },
          unique: {},
          multiple: {},
        },
      }),
      ...messages.slice(1),
    ] as unknown as Message[],
  },
};

export const WithEditedMessages: Story = {
  args: {
    messages: [
      createMockMessage({
        serial: 'msg_1',
        clientId: 'user1',
        text: 'This message has been edited to fix a typo.',
        createdAt: new Date(Date.now() - 1000 * 60 * 10),
        updatedAt: new Date(Date.now() - 1000 * 60 * 5),
        isUpdated: true,
      }),
      ...messages.slice(1),
    ] as unknown as Message[],
  },
};

export const WithDeletedMessages: Story = {
  args: {
    messages: [
      createMockMessage({
        serial: 'msg_1',
        clientId: 'user1',
        text: 'This message has been edited to fix a typo.',
        createdAt: new Date(Date.now() - 1000 * 60 * 10),
        updatedAt: new Date(Date.now() - 1000 * 60 * 5),
        isUpdated: false,
        isDeleted: true,
      }),
      ...messages.slice(1),
    ] as unknown as Message[],
  },
};

export const LoadingHistory: Story = {
  args: {
    isLoading: true,
    hasMoreHistory: true,
  },
};

export const NoMoreHistory: Story = {
  args: {
    hasMoreHistory: false,
    isLoading: false,
  },
};

export const WithTypingIndicators: Story = {
  args: {
    enableTypingIndicators: true,
  },
};

export const AutoScrollComparison: Story = {
  decorators: [
    (Story, context) => {
      const [messages, setMessages] = React.useState(() =>
        Array.from({ length: 8 }, (_, i) =>
          createMockMessage({
            serial: `msg_${i + 1}`,
            clientId: i % 2 === 0 ? 'user1' : 'user2',
            text: `Initial message ${i + 1}`,
            createdAt: new Date(Date.now() - 1000 * 60 * (8 - i)),
          })
        ) as unknown as Message[]
      );

      const [isRunning, setIsRunning] = React.useState(true);
      const messageCountRef = React.useRef(8);

      React.useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
          messageCountRef.current += 1;
          const newMessage = createMockMessage({
            serial: `msg_${messageCountRef.current}`,
            clientId: messageCountRef.current % 3 === 0 ? 'user1' : messageCountRef.current % 2 === 0 ? 'user2' : 'user3',
            text: `Message ${messageCountRef.current} - ${new Date().toLocaleTimeString()}`,
            createdAt: new Date(),
          }) as unknown as Message;

          setMessages(prev => [...prev, newMessage]);
        }, 1500);

        return () => clearInterval(interval);
      }, [isRunning]);

      return (
        <AvatarProvider>
          <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
            <div className="w-full max-w-5xl">
              <div className="mb-4 text-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Auto-Scroll Comparison
                </h2>
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`px-4 py-2 rounded font-medium ${
                    isRunning
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isRunning ? 'Stop Messages' : 'Start Messages'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="h-[500px] border rounded-md overflow-hidden bg-white dark:bg-gray-900 flex flex-col">
                  <div className="p-3 border-b bg-green-50 dark:bg-green-900/20">
                    <h3 className="font-medium text-green-800 dark:text-green-200">
                      ✅ Auto-Scroll Enabled
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Stays at bottom automatically
                    </p>
                  </div>
                  <ChatMessageList
                    messages={messages}
                    currentClientId="user1"
                    autoScroll={true}
                    onEdit={action('edit')}
                    onDelete={action('delete')}
                    onReactionAdd={action('reaction-add')}
                    onReactionRemove={action('reaction-remove')}
                  />
                </div>

                <div className="h-[500px] border rounded-md overflow-hidden bg-white dark:bg-gray-900 flex flex-col">
                  <div className="p-3 border-b bg-red-50 dark:bg-red-900/20">
                    <h3 className="font-medium text-red-800 dark:text-red-200">
                      ❌ Auto-Scroll Disabled
                    </h3>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Scroll position remains fixed
                    </p>
                  </div>
                  <ChatMessageList
                    messages={messages}
                    currentClientId="user1"
                    autoScroll={false}
                    onEdit={action('edit')}
                    onDelete={action('delete')}
                    onReactionAdd={action('reaction-add')}
                    onReactionRemove={action('reaction-remove')}
                  />
                </div>
              </div>
            </div>
          </div>
        </AvatarProvider>
      );
    },
  ],
};