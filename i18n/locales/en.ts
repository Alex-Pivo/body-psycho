import type { Messages } from '../types';

export const en: Messages = {
  meta: {
    title: 'Body from the inside',
    description: 'An interactive journey through the body: organs and emotions.',
  },
  ui: {
    brand: 'Body from the inside',
    modeLabel: 'View',
    organs: 'Organs',
    psyche: 'Psyche',
    scrollHint: 'Scroll down',
    languageLabel: 'Language',
  },
  sections: {
    intro: {
      title: 'How you feel, from the inside',
      text: 'Emotions aren’t only thoughts. They’re physical too: pulse, breath, muscles, gut. Scroll down to walk through the body.',
    },
    brain: {
      organ: {
        name: 'Brain',
        fact: 'About 86 billion neurons. It weighs roughly 2% of your body but uses around 20% of its energy. This is where the body’s signals turn into feelings.',
      },
      psyche: {
        emotion: 'Racing thoughts',
        text: 'When your mind loops on the same thing, the default mode network kicks in. It’s the background that lets worry grow instead of getting solved.',
      },
    },
    throat: {
      organ: {
        name: 'Throat',
        fact: 'The larynx and vocal cords. Under stress, the muscles of the neck and larynx tighten, and the voice gets higher or breaks.',
      },
      psyche: {
        emotion: 'Lump in the throat',
        text: 'This is what held-back tears, or something left unsaid, feel like. The body gets ready to cry, you hold it back, and the muscles stay in spasm.',
      },
    },
    lungs: {
      organ: {
        name: 'Lungs',
        fact: 'About 20,000 breaths a day. Breathing is one of the few functions you can control consciously, which makes it a remote control for the nervous system.',
      },
      psyche: {
        emotion: 'Sadness and heaviness',
        text: 'In sadness, breathing becomes shallow and slow. The body seems to save energy, and your chest feels heavy.',
      },
    },
    heart: {
      organ: {
        name: 'Heart',
        fact: 'Beats about 100,000 times a day. The rate changes within fractions of a second: adrenaline speeds it up, the vagus nerve slows it down.',
      },
      psyche: {
        emotion: 'Love and anxiety',
        text: 'Oddly, their physiology is similar: faster pulse, damp palms, narrowed attention. What tells them apart is how the brain interprets it.',
      },
    },
    stomach: {
      organ: {
        name: 'Stomach',
        fact: 'Its walls are full of nerve endings linked to the brain by the vagus nerve. Stress slows digestion, which is why your stomach “clenches”.',
      },
      psyche: {
        emotion: 'Butterflies',
        text: 'Excitement redirects blood flow from digestion to the muscles. That’s the tickling feeling before something important.',
      },
    },
    intestines: {
      organ: {
        name: 'Intestines',
        fact: 'They contain hundreds of millions of neurons: the “second brain” (the enteric nervous system). Most of the body’s serotonin is made here.',
      },
      psyche: {
        emotion: 'Gut feeling',
        text: 'A gut feeling is a real signal: the intestines constantly send the brain information about the state of the body and its surroundings.',
      },
    },
    outro: {
      title: 'It’s all one you',
      text: 'Thoughts, breath, pulse and gut aren’t separate systems but one network. When one thing changes, the rest respond.',
    },
  },
};