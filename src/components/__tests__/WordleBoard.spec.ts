//set this in globals:true in test obj in vitest.config.ts
//and, in tsconfig.vitest.json, added "vitest/globals" in "compilerOptions" obj in "types" List
import { describe, it, beforeEach, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'

describe('WordleBoard component tests', () => {
  const  WOTD = "TESTS"
  const VICTORYMSG = 'You won!'
  const DEFEATMSG = 'You lost congrats!'
  let wrapper: ReturnType<typeof mount>;


  beforeEach(()=>{
    wrapper = mount(WordleBoard, {
      props: {
        wordOfTheDay: WOTD,
        victoryMsg: VICTORYMSG,
        defeatMsg: DEFEATMSG
      }
    })

  })

  it('shows a victory message when the user guesses the correct answer', async() => {
    const guessInput = wrapper.find("input[type=text]");

    await guessInput.setValue(WOTD);
    await guessInput.trigger("keydown.enter");
    expect(wrapper.text()).toContain(VICTORYMSG);
  });

  it("a defeat message appears if the user makes a guess that is incorrect", async  () => {
    const guessInput = wrapper.find("input[type=text]");

    await  guessInput.setValue("WRONG");
    await  guessInput.trigger("keydown.enter");
    expect(wrapper.text()).toContain(DEFEATMSG);
  });


  it("no end-of-game message appears if the user has not yet guessed", async () =>{
    expect(wrapper.text()).not.toContain(VICTORYMSG);
    expect(wrapper.text()).not.toContain(DEFEATMSG);
  });

  it("If a word of the day provided does not have exactly 5 characters, a warning will appear", async() => {
    vi.spyOn(console, "warn")



  })



})
