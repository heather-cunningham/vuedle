// Set this in globals:true in test obj in vitest.config.ts
// And, in tsconfig.vitest.json, added "vitest/globals" in "compilerOptions" obj in "types" List
// But can't get to work
import { describe, beforeEach, it, test, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import WordleBoard from '../WordleBoard.vue';


describe('WordleBoard component tests', () => {
  const WOTD: string = 'TESTS';
  const VICTORYMSG: string = 'You won!';
  let wrapper: any;


  beforeEach(()=>{
    wrapper = mount(WordleBoard, {
      props: {
          wordOfTheDay: WOTD,
          victoryMsg: VICTORYMSG
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
    expect(wrapper.text()).toContain("Better luck next time!");
  });

  test.todo('no end of game message appears if the user has not yet guessed', async () => {
    const guessInput = wrapper.find("input[type=text]");
;
    await guessInput.trigger("keydown.enter")
    expect(wrapper.text()).toContain(VICTORYMSG);
  });
})// end of test suite
