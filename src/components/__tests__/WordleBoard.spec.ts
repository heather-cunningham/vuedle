// Set this in globals:true in test obj in vitest.config.ts
// And, in tsconfig.vitest.json, added "vitest/globals" in "compilerOptions" obj in "types" List
// But can't get to work
import { describe, beforeEach, it, test, expect } from 'vitest';
import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue';

describe('WordleBoard component tests', () => {
  const WOTD: string = 'TESTS';
  const VICTORYMSG: string = 'You won!';
  const DEFEATMSG: string = "Better luck next time!";
  let wrapper: ReturnType<typeof mount>;

  beforeEach(()=>{
    wrapper = mount(WordleBoard, {
      props: {
          wordOfTheDay: WOTD,
          victoryMsg: VICTORYMSG,
          defeatMsg: DEFEATMSG
        }
    });
  });

  it('shows a victory message when the user guesses the correct answer', async () => {
    const guessInput = wrapper.find("input[type=text]");

    await guessInput.setValue(WOTD);
    await guessInput.trigger("keydown.enter");
    expect(wrapper.text()).toContain(VICTORYMSG);
  });

  it('shows a defeat message if the user guesses incorrectly', async () => {
    const guessInput = wrapper.find("input[type=text]");

    await guessInput.setValue("WRONG");
    await guessInput.trigger("keydown.enter");
    expect(wrapper.text()).toContain(DEFEATMSG);
  });

  test('no end of game message appears if the user has not yet guessed', async () => {
    expect(wrapper.text()).not.toContain(VICTORYMSG);
    expect(wrapper.text()).not.toContain(DEFEATMSG);
  });

  it('shows a warning if the submitted word is less than 5 characters', async () => {
    const guessInput = wrapper.find("input[type=text]");

    await guessInput.setValue("WRONG");
    await guessInput.trigger("keydown.enter");
    expect(wrapper.text()).toContain(DEFEATMSG);
  });
})// end of test suite
