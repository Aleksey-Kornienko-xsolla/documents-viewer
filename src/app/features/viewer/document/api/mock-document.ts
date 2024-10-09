import { DocumentInterface } from './document.interface';

export const mockDocument: DocumentInterface = {
  name: 'test doc',
  pages: [
    {
      number: 1,
      imageUrl: 'pages/1.png',
    },
    {
      number: 2,
      imageUrl: 'pages/2.png',
    },
    {
      number: 3,
      imageUrl: 'pages/3.png',
    },
    {
      number: 4,
      imageUrl: 'pages/4.png',
    },
    {
      number: 5,
      imageUrl: 'pages/5.png',
    },
  ],
};
