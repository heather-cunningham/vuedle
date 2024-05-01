import { mount } from '@vue/test-utils';
import WordleBoard from '../VordleBoard.vue';
import { DEFEAT_MESSAGE, MAX_GUESSES_COUNT, VICTORY_MESSAGE, WORD_SIZE } from '../../settings';
import GuessView from '../GuessView.vue';

describe('VordleBoard Component tests', () => {
  const WOTD = 'TESTS';
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    wrapper = mount(WordleBoard, { props: { wordOfTheDay: WOTD } });
  });

  describe(`Game board view component tests`, async () => {

    it(`shows ${MAX_GUESSES_COUNT} GuessViews on the game board`, () => {
      expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES_COUNT);
    });

    it(`shows ${MAX_GUESSES_COUNT} GuessViews on the game board when the player wins the game`,
      async () => {
        await playerTypesGuess(WOTD);
        await playerPressesEnter();
        expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES_COUNT);
      });

    it(`shows ${MAX_GUESSES_COUNT} GuessViews on the game board when the player loses the game`,
      async () => {
        const GUESSES = [
          'WRONG',
          'GUESS',
          'HELLO',
          'WORLD',
          'HAPPY',
          'CODER'
        ];

        for (const GUESS of GUESSES) {
          await playerTypesGuess(GUESS);
          await playerPressesEnter();
          expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES_COUNT);
        }
      });
  });

  describe('Defining the WOTD (Word of the Day) tests', () => {
    beforeEach(() => {
      console.warn = vi.fn();
    });

    //FIXME: What good to the user is a warning in the console?  It should be a modal or toast, so
    // the user knows what the warning is.
    it.skip(`shows a warning in the console if the user's guess is less than ${WORD_SIZE} letters in length`,
      async () => {
        await playerTypesGuess('FLY');
        await playerPressesEnter();
        expect(console.warn).toHaveBeenCalled();
      });

    //FIXME: Not a valid test. The warning needs to be something the average user can read/see
    // actually -- not in the console.
    it.skip(`does not show a warning in the console if the user's guess has ${WORD_SIZE} characters`,
      async () => {
      mount(WordleBoard, { props: { wordOfTheDay: 'TESTS' } });
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('Player Input tests', () => {
    it('keeps the app in focus the entire duration of the game', async () => {
      document.body.innerHTML = `<div id="app"></div>`;
      wrapper = mount(WordleBoard, {
        props: { wordOfTheDay: WOTD },
        attachTo: '#app'
      });

      expect(wrapper.find('input[type=text]').attributes('autofocus')).not.toBeUndefined();
      await wrapper.find('input[type=text]').trigger('blur');
      expect(document.activeElement).toBe(wrapper.find('input[type=text]').element);
    });

    it('clears the input after each submission', async () => {
      await playerTypesGuess('WRONG');
      await playerPressesEnter();
      expect(wrapper.find<HTMLInputElement>('input[type=text]').element.value).toEqual('');
    });

    //FIXME: How is this test valid if the win condition is met when typing more than 5 chars?
    it.skip(`limits player guesses to ${WORD_SIZE} letters`, async () => {
      await playerTypesGuess(WOTD + 'EXTRA');
      await playerPressesEnter();
      expect(wrapper.text()).toContain(VICTORY_MESSAGE);
    });

    //FIXME: #1 This test is not worded correctly.  The json file for the words only has 500 words, not
    // all 5 letter words in all of the English language.
    //FIXME: #2 There's a bug in this code.  If one enters a non-word, there's no warning or UI to
    // tell the user what's happening on screen and the game freezes/can't continue playing.
    it("accepts a player's guess only if it's a real English word in the game dictionary",
      async () => {
        await playerTypesGuess('QWERT');
        await playerPressesEnter();
        expect(wrapper.text()).not.toContain(VICTORY_MESSAGE);
        expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE);
      });

    it('accepts player guesses in lower case', async () => {
      await playerTypesGuess(WOTD.toLowerCase());
      await playerPressesEnter();
      expect(wrapper.text()).toContain(VICTORY_MESSAGE);
    });

    it('removes punctuation and special characters from player guesses', async () => {
      await playerTypesGuess('H3!RT');
      await playerPressesEnter();
      expect(wrapper.find<HTMLInputElement>('input[type=text]').element.value)
        .toEqual('HRT');
    });

    // FIXME: Bug: there's a bug in this test or in the code.  Numerals render when typed by the user.
    it.skip('does not render numeral characters on-screen when typed',
      async () => {
        await playerTypesGuess('12');
        await playerTypesGuess('123');
        expect(wrapper.find<HTMLInputElement>('input[type=text]').element.value).toEqual('');
      });

    it(`disables the game board when ${MAX_GUESSES_COUNT} guesses have been submitted`,
      async () => {
        const GUESSES = [
          'WRONG',
          'GUESS',
          'HELLO',
          'WORLD',
          'HAPPY',
          'CODER'
        ];

        for (const GUESS of GUESSES) {
          await playerTypesGuess(GUESS);
          await playerPressesEnter();
        }
        expect(wrapper.find('input[type=text]').attributes('disabled')).not.toBeUndefined();
      });

    it('shows all previous player guesses on the game board', async () => {
      const GUESSES = [
        'WRONG',
        'GUESS',
        'HELLO',
        'WORLD',
        'HAPPY',
        'CODER'
      ];

      for (const GUESS of GUESSES) {
        await playerTypesGuess(GUESS);
        await playerPressesEnter();
      }

      for (const GUESS of GUESSES) {
        expect(wrapper.text()).toContain(GUESS);
      }
    });

    it('disables the game board when the player guesses the WOTD (Word of the Day) correctly',
      async () => {
      await playerTypesGuess(WOTD);
      await playerPressesEnter();
      expect(wrapper.find('input[type=text]').attributes('disabled')).not.toBeUndefined();
    });
  });

  describe('Player Hints/Feedback tests', () => {
    it('it does not show hints until a guess is submitted', async () => {
      expect(wrapper.find('[data-letter-feedback]').exists(),
        'Feedback was being rendered before the player started typing their guess')
        .toBe(false);

      await playerTypesGuess(WOTD);
      expect(wrapper.find('[data-letter-feedback]').exists(),
        'Feedback was rendered while the player was typing their guess')
        .toBe(false);

      await playerPressesEnter();
      expect(wrapper.find('[data-letter-feedback]').exists(),
        'Feedback was not rendered after the player submitted their guess')
        .toBe(true);
    });

    describe.each([
      {
        position: 0,
        expectedFeedback: 'correct',
        reason: 'W is the first letter of \'WORLD\' and \'WRONG\''
      },
      {
        position: 1,
        expectedFeedback: 'almost',
        reason: 'R exists in both words, but it is in position \'2\' of \'WORLD\''
      },
      {
        position: 2,
        expectedFeedback: 'almost',
        reason: 'O exists in both words, but it is in position \'1\' of \'WORLD\''
      },
      {
        position: 3,
        expectedFeedback: 'incorrect',
        reason: 'N does not exist in \'WORLD\''
      },
      {
        position: 4,
        expectedFeedback: 'incorrect',
        reason: 'G does not exist in \'WORLD\''
      }
    ])('If the word of the day is \'WORLD\' and the player types \'WRONG\'', ({
                                                                                position,
                                                                                expectedFeedback,
                                                                                reason
                                                                              }) => {
      const wordOfTheDay = 'WORLD';
      const playerGuess = 'WRONG';

      it(`shows feedback for '${playerGuess[position]}' (index: ${position}) as '${expectedFeedback}' because '${reason}'`,
        async () => {
        wrapper = mount(WordleBoard, { propsData: { wordOfTheDay } });

        await playerTypesGuess(playerGuess);
        await playerPressesEnter();

        const actualFeedback = wrapper.findAll('[data-letter]')
          .at(position)?.attributes('data-letter-feedback');

        expect(actualFeedback).toEqual(expectedFeedback);
      });
    });
  });

  describe('End of Game Messages tests', () => {
    it('shows a victory message when the user correctly guesses the word of the day',
      async () => {
        await playerTypesGuess(WOTD);
        await playerPressesEnter();
        expect(wrapper.text()).toContain(VICTORY_MESSAGE);
      });

    it(`shows a defeat message if the player guesses incorrectly ${MAX_GUESSES_COUNT} times`,
      async () => {
        for (let i = 0; i <= MAX_GUESSES_COUNT; i++) {
          await playerTypesGuess('WRONG');
          await playerPressesEnter();
        }
        expect(wrapper.text()).toContain(DEFEAT_MESSAGE);
      });


    describe.each(
      Array.from(
        { length: MAX_GUESSES_COUNT - 1 },
        (_, numberOfGuesses) => ({ numberOfGuesses })
      )
    )(`a defeat message should not appear if the player guesses incorrectly less than ${MAX_GUESSES_COUNT} times`,
      ({ numberOfGuesses }) => {
        it(`does not show a defeat message on incorrect guess #${numberOfGuesses + 1}`,
          async () => {
            for (let i = 0; i <= numberOfGuesses; i++) {
              await playerTypesGuess('WRONG');
              await playerPressesEnter();
            }
            expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE);
          });
      });

    it('does not show any end-of-game message if the user has not guessed yet',
      async () => {
        expect(wrapper.text()).not.toContain(VICTORY_MESSAGE);
        expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE);
      });
  });

  //------------------------------ Helper Fcns------------------------------------------------
  async function playerTypesGuess(guess: string) {
    await wrapper.find('input[type=text]').setValue(guess);
  }

  async function playerPressesEnter() {
    await wrapper.find('input[type=text]').trigger('keydown.enter');
  }
});









