import {useState} from 'react';

import {analyzeStory} from '../utils/analyzeStory';
import type {Message, MessageRole, ChatStage} from '../types';

const getCurrentMessageTime = () =>
  new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
  }).format(new Date());

const createMessage = (
  role: MessageRole,
  content: string,
  buttons?: Message['buttons'],
): Message => ({
  role,
  content,
  createdAt: getCurrentMessageTime(),
  createdAtIso: new Date().toISOString(),
  buttons,
});

const initialMessage: Message = {
  role: 'bot',
  content: '오늘 기분이 좋지 않아 보여... 무슨 일 있어?',
  createdAt: getCurrentMessageTime(),
  createdAtIso: new Date().toISOString(),
};

export const useChatDiary = () => {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [stage, setStage] = useState<ChatStage>('initial');
  const [userStory, setUserStory] = useState<string[]>([]);

  const handleSend = () => {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      return;
    }

    const nextStory = [...userStory, trimmedInput];
    const userMessage = createMessage('user', trimmedInput);

    setMessages(prev => [...prev, userMessage]);
    setUserStory(nextStory);
    setInput('');

    setTimeout(() => {
      let botResponse: Message;

      if (stage === 'initial' || stage === 'listening') {
        const responses = [
          '그랬구나! 더 이야기해 줄래??',
          '정말 힘들었겠다...',
          '응응, 그런 일이 있었구나. 또 무슨 일이 있었는지 알려 줘!',
        ];

        botResponse = createMessage(
          'bot',
          responses[Math.floor(Math.random() * responses.length)],
        );
        setStage('listening');
      } else {
        botResponse = createMessage('bot', '알겠어.');
      }

      setMessages(prev => [...prev, botResponse]);
    }, 500);

    if (nextStory.length >= 3 && stage === 'listening') {
      setTimeout(() => {
        const summaryOffer = createMessage(
          'bot',
          '오늘 하루 정말 힘들었겠다... 내가 오늘 하루를 정리해 줄게',
          [
            {label: '좋아', action: 'summarize_yes'},
            {label: '괜찮아', action: 'summarize_no'},
          ],
        );

        setMessages(prev => [...prev, summaryOffer]);
        setStage('summary_confirm');
      }, 1000);
    }
  };

  const handleButtonClick = (action: string) => {
    if (action === 'summarize_yes') {
      const analysis = analyzeStory(userStory);
      const summaryMessage = createMessage(
        'bot',
        `${analysis.summary}\n\n감정일기 키워드: ${analysis.keywords.join(
          ' ',
        )}`,
      );

      setMessages(prev => [...prev, summaryMessage]);
      setStage('summary_shown');

      setTimeout(() => {
        const solutionOffer = createMessage('bot', '해결책도 알려 줄까?', [
            {label: '좋아', action: 'solution_yes'},
            {label: '괜찮아', action: 'solution_no'},
          ]);

        setMessages(prev => [...prev, solutionOffer]);
        setStage('solution_confirm');
      }, 1000);
    } else if (action === 'summarize_no') {
      setMessages(prev => [
        ...prev,
        createMessage(
          'bot',
          '알겠어! 더 이야기하고 싶으면 언제든지 말해 줘.',
        ),
      ]);
    } else if (action === 'solution_yes') {
      const analysis = analyzeStory(userStory);
      const solutionMessages = analysis.solutions.map(solution =>
        createMessage('bot', solution),
      );

      setMessages(prev => [...prev, ...solutionMessages]);

      setTimeout(() => {
        const actionMessage = createMessage(
          'bot',
          '스트레스 완화를 위해 이런 활동들은 어때?',
          [
            {label: '편안한 우리집', action: 'home'},
            {label: '명상', action: 'meditation'},
            {label: '커뮤니티에 털어놓기', action: 'community'},
          ],
        );

        setMessages(prev => [...prev, actionMessage]);
        setStage('solution_shown');
      }, 1500);
    } else if (action === 'solution_no') {
      setMessages(prev => [
        ...prev,
        createMessage('bot', '알겠어! 오늘도 고생했어.'),
      ]);
    } else if (
      action === 'home' ||
      action === 'meditation' ||
      action === 'community'
    ) {
      const actionMessages: Record<string, string> = {
        home: '편안한 조명과 온도로 집안 분위기를 조성해 보자.',
        meditation: '명상 도우미를 실행할게.',
      };

      setMessages(prev => [
        ...prev,
        createMessage('bot', actionMessages[action]),
      ]);
    }
  };

  return {
    messages,
    input,
    setInput,
    handleSend,
    handleButtonClick,
  };
};
