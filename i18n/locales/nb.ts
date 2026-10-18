import type { Messages } from '../types';

export const nb: Messages = {
  meta: {
    title: 'Kroppen innenfra',
    description: 'En interaktiv reise gjennom kroppen: organer og følelser.',
  },
  ui: {
    brand: 'Kroppen innenfra',
    modeLabel: 'Visning',
    organs: 'Organer',
    psyche: 'Psyke',
    scrollHint: 'Rull ned',
    languageLabel: 'Språk',
  },
  sections: {
    intro: {
      title: 'Slik føles det innenfra',
      text: 'Følelser er ikke bare tanker. De er også fysiske: puls, pust, muskler, mage. Rull ned for å gå gjennom kroppen.',
    },
    brain: {
      organ: {
        name: 'Hjernen',
        fact: 'Rundt 86 milliarder nerveceller. Den utgjør omtrent 2 % av kroppsvekten, men bruker rundt 20 % av energien. Her blir kroppens signaler til følelser.',
      },
      psyche: {
        emotion: 'Kappløpende tanker',
        text: 'Når tankene går rundt i ring, aktiveres hjernens hvilenettverk. Det er bakgrunnen som lar bekymringer vokse i stedet for å bli løst.',
      },
    },
    throat: {
      organ: {
        name: 'Halsen',
        fact: 'Strupehodet og stemmebåndene. Under stress spenner musklene i nakken og strupehodet seg, og stemmen blir høyere eller brekker.',
      },
      psyche: {
        emotion: 'Klump i halsen',
        text: 'Slik føles det å holde tilbake gråt eller noe usagt. Kroppen gjør seg klar til å gråte, du holder igjen, og musklene blir værende i krampe.',
      },
    },
    lungs: {
      organ: {
        name: 'Lungene',
        fact: 'Rundt 20 000 åndedrag i døgnet. Pusten er en av få funksjoner vi kan styre bevisst, og derfor fungerer den som en fjernkontroll for nervesystemet.',
      },
      psyche: {
        emotion: 'Tristhet og tyngde',
        text: 'Ved tristhet blir pusten grunn og langsom. Kroppen later til å spare energi, og brystet kjennes tungt.',
      },
    },
    heart: {
      organ: {
        name: 'Hjertet',
        fact: 'Slår rundt 100 000 ganger i døgnet. Frekvensen endres på brøkdeler av et sekund: adrenalin øker den, vagusnerven bremser den.',
      },
      psyche: {
        emotion: 'Kjærlighet og angst',
        text: 'Merkelig nok ligner fysiologien: høyere puls, fuktige håndflater, innsnevret oppmerksomhet. Det som skiller dem, er hvordan hjernen tolker det.',
      },
    },
    stomach: {
      organ: {
        name: 'Magesekken',
        fact: 'Veggene er fulle av nerveender som er koblet til hjernen via vagusnerven. Stress bremser fordøyelsen, og derfor «knyter» magen seg.',
      },
      psyche: {
        emotion: 'Sommerfugler i magen',
        text: 'Spenning flytter blodtilførselen fra fordøyelsen til musklene. Det er den kriblende følelsen før noe viktig.',
      },
    },
    intestines: {
      organ: {
        name: 'Tarmene',
        fact: 'De har hundrevis av millioner nerveceller: den «andre hjernen» (det enteriske nervesystemet). Mesteparten av kroppens serotonin lages her.',
      },
      psyche: {
        emotion: 'Magefølelse',
        text: 'Magefølelse er et reelt signal: tarmene sender hele tiden hjernen informasjon om kroppens tilstand og omgivelsene.',
      },
    },
    outro: {
      title: 'Alt dette er ett og samme du',
      text: 'Tanker, pust, puls og mage er ikke adskilte systemer, men ett nettverk. Når én ting endrer seg, reagerer resten.',
    },
  },
};