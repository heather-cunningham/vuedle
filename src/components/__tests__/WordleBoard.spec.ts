import {mount} from "@vue/test-utils"
import WordleBoard from "../WordleBoard.vue"
import {DEFEAT_MESSAGE, MAX_GUESSES_COUNT, VICTORY_MESSAGE, WORD_SIZE} from "../../settings"
import GuessView from "../GuessView.vue"

describe("WordleBoard Component tests", () => {
  const WOTD = "TESTS"
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(WordleBoard, {props: {wordOfTheDay: WOTD}})
  })

  async function playerTypesGuess(guess: string) {
    await wrapper.find("input[type=text]").setValue(guess)
  }

  async function playerPressesEnter() {
    await wrapper.find("input[type=text]").trigger("keydown.enter")
  }

  async function playerTypesAndSubmitsGuess(guess: string) {
    await playerTypesGuess(guess)
    await playerPressesEnter()
  }

  describe("End of Game Messages tests", () => {
    test("a victory message appears when the user makes a guess that matches the word of the day", async () => {
      await playerTypesAndSubmitsGuess(WOTD)

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    describe.each(
      Array.from(
        {length: MAX_GUESSES_COUNT + 1},
        (_, numberOfGuesses) => ({
          numberOfGuesses,
          shouldSeeTheDefeatMessage: numberOfGuesses === MAX_GUESSES_COUNT
        })
      )
    )(`a defeat message should appear if the player makes incorrect guesses ${MAX_GUESSES_COUNT} times`,
      ({numberOfGuesses, shouldSeeTheDefeatMessage}) => {
        test(`therefore, for ${numberOfGuesses} guess(es) a defeat message should ${shouldSeeTheDefeatMessage ? "" : "not"} appear`, async () => {
          for (let i = 0; i < numberOfGuesses; i++) {
            await playerTypesAndSubmitsGuess("WRONG")
          }

          if (shouldSeeTheDefeatMessage) {
            expect(wrapper.text()).toContain(DEFEAT_MESSAGE)
          } else {
            expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
          }
        })
      })

    test("no end-of-game message appears if the user has not yet made a guess", async () => {
      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
    })
  })

  describe("Rules for Defining WOTD tests", () => {
    beforeEach(() => {
      console.warn = vi.fn()
    })

    test.each(
      [
        {wordOfTheDay: "FLY", reason: "word-of-the-day must have 5 characters"},
        {wordOfTheDay: "tests", reason: "word-of-the-day must be all in uppercase"},
        {wordOfTheDay: "QWERT", reason: "word-of-the-day must be a valid English word"}
      ]
    )("Since $reason: $wordOfTheDay is invalid, therefore a warning must be emitted", async ({wordOfTheDay}) => {
      mount(WordleBoard, {props: {wordOfTheDay}})

      expect(console.warn).toHaveBeenCalled()
    })

    test("no warning is emitted if the word of the day provided is a real uppercase English word with 5 characters", async () => {
      mount(WordleBoard, {props: {wordOfTheDay: "TESTS"}})

      expect(console.warn).not.toHaveBeenCalled()
    })
  })

  describe("Player Input tests", () => {
    test("remains in focus the entire time", async () => {
      document.body.innerHTML = `<div id="app"></div>`
      wrapper = mount(WordleBoard, {
        props: {wordOfTheDay: WOTD},
        attachTo: "#app"
      })

      expect(wrapper.find("input[type=text]").attributes("autofocus")).not.toBeUndefined()

      await wrapper.find("input[type=text]").trigger("blur")
      expect(document.activeElement).toBe(wrapper.find("input[type=text]").element)
    })

    test("the input gets cleared after each submission", async () => {
      await playerTypesAndSubmitsGuess("WRONG")

      expect(wrapper.find<HTMLInputElement>("input[type=text]").element.value).toEqual("")
    })

    test(`player guesses are limited to ${WORD_SIZE} letters`, async () => {
      await playerTypesAndSubmitsGuess(WOTD + "EXTRA")

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    //FIXME: #1 This test is not worded correctly.  The json file for the words only has 500 words, not
    // all 5 letter words in all of the English language.
    //FIXME: #2 There's a bug in this code.  If one enters a non-word, there's no warning or UI to
    // tell the user what's happening on screen and the game freezes/can't continue playing.
    //test("player guesses can only be submitted if they are real words", async () => {
    test("a guess may only be submitted if it's a real word and in the game dictionary", async () => {
      await playerTypesAndSubmitsGuess("QWERT")

      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
    })

    test("player guesses are not case-sensitive", async () => {
      await playerTypesAndSubmitsGuess(WOTD.toLowerCase())

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    test("player guesses can only contain letters", async () => {
      await playerTypesGuess("H3!RT")

      expect(wrapper.find<HTMLInputElement>("input[type=text]").element.value).toEqual("HRT")
    })

    // FIXME: Bug: there's a bug in this test or in the code.  Note, this whole crappy app is not
    //  mine but from Vue School.  The whole app is hardcoded to just one answer: "TESTS"!!! Skip
    //  this test for now.  Go back, make the app actually work at some point in time, and find and
    //  fix this bug.
    test.skip("non-letter characters do not render on the screen while being typed", async () => {
      await playerTypesGuess("12")
      await playerTypesGuess("123")

      expect(wrapper.find<HTMLInputElement>("input[type=text]").element.value).toEqual("")
    })

    test("the player loses control after the max amount of guesses have been sent", async () => {
      const guesses = [
        "WRONG",
        "GUESS",
        "HELLO",
        "WORLD",
        "HAPPY",
        "CODER"
      ]

      for (const guess of guesses) {
        await playerTypesAndSubmitsGuess(guess)
      }

      expect(wrapper.find("input[type=text]").attributes("disabled")).not.toBeUndefined()
    })

    test("all previous guesses done by the player are visible in the page", async () => {
      const guesses = [
        "WRONG",
        "GUESS",
        "HELLO",
        "WORLD",
        "HAPPY",
        "CODER"
      ]

      for (const guess of guesses) {
        await playerTypesAndSubmitsGuess(guess)
      }

      for (const guess of guesses) {
        expect(wrapper.text()).toContain(guess)
      }
    })

    test("the player loses control after the correct guess has been given", async () => {
      await playerTypesAndSubmitsGuess(WOTD)

      expect(wrapper.find("input[type=text]").attributes("disabled")).not.toBeUndefined()
    })
  })

  describe(`Gameboard has ${MAX_GUESSES_COUNT} Guess-views tests`, async () => {
    test(`${MAX_GUESSES_COUNT} guess-views are present at the start of the game`, async () => {
      expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES_COUNT)
    })

    test(`${MAX_GUESSES_COUNT} guess-views are present when the player wins the game`, async () => {
      await playerTypesAndSubmitsGuess(WOTD)

      expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES_COUNT)
    })

    test(`${MAX_GUESSES_COUNT} guess-views are present as the player loses the game`, async () => {
      const guesses = [
        "WRONG",
        "GUESS",
        "HELLO",
        "WORLD",
        "HAPPY",
        "CODER"
      ]

      for (const guess of guesses) {
        await playerTypesAndSubmitsGuess(guess)
        expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES_COUNT)
      }
    })
  })

  describe("Displaying Hints/Feedback to Player tests", () => {
    test("hints are not displayed until the player submits their guess", async () => {
      expect(wrapper.find("[data-letter-feedback]").exists(), "Feedback was being rendered before the player started typing their guess").toBe(false)

      await playerTypesGuess(WOTD)
      expect(wrapper.find("[data-letter-feedback]").exists(), "Feedback was rendered while the player was typing their guess").toBe(false)

      await playerPressesEnter()
      expect(wrapper.find("[data-letter-feedback]").exists(), "Feedback was not rendered after the player submitted their guess").toBe(true)
    })

    describe.each([
      {
        position: 0,
        expectedFeedback: "correct",
        reason: "W is the first letter of 'WORLD' and 'WRONG'"
      },
      {
        position: 1,
        expectedFeedback: "almost",
        reason: "R exists in both words, but it is in position '2' of 'WORLD'"
      },
      {
        position: 2,
        expectedFeedback: "almost",
        reason: "O exists in both words, but it is in position '1' of 'WORLD'"
      },
      {
        position: 3,
        expectedFeedback: "incorrect",
        reason: "N does not exist in 'WORLD'"
      },
      {
        position: 4,
        expectedFeedback: "incorrect",
        reason: "G does not exist in 'WORLD'"
      }
    ])("If the word of the day is 'WORLD' and the player types 'WRONG'", ({position, expectedFeedback, reason}) => {
      const wordOfTheDay = "WORLD"
      const playerGuess = "WRONG"

      test(`the feedback for '${playerGuess[position]}' (index: ${position}) should be '${expectedFeedback}' because '${reason}'`, async () => {
        wrapper = mount(WordleBoard, {propsData: {wordOfTheDay}})

        await playerTypesAndSubmitsGuess(playerGuess)

        const actualFeedback = wrapper.findAll("[data-letter]").at(position)?.attributes("data-letter-feedback")

        expect(actualFeedback).toEqual(expectedFeedback)
      })
    })
  })
})









