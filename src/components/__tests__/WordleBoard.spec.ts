//set this in globals:true in test obj in vitest.config.ts
//and, in tsconfig.vitest.json, added "vitest/globals" in "compilerOptions" obj in "types" List
import { describe, it, beforeEach, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'

describe('WordleBoard component tests', () => {
  const  WOTD = "TESTS"
  const VICTORYMSG = 'You won!'
  let wrapper: any;


  beforeEach(()=>{
    wrapper = mount(WordleBoard, {
      props: {
        wordOfTheDay: WOTD,
        victoryMsg: VICTORYMSG
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

    await  guessInput.setValue(WOTD);
    await  guessInput.trigger("keydown.enter");
    expect(wrapper.text()).toContain("Better luck next time");

  });


  it.todo("no end-of-game message appears if the user has not yet guessed", async () =>{
    const  guessInput = wrapper.find("input{[type=text]");

    await guessInput.trigger("keydown.enter")
    expect(wrapper.text()).toContain("Better luck next time")

  });



})
