<template>
  <main>
    <ul>
      <li v-for="(guess, index) in guessesSubmitted" :key="`${index}-${guess}`">
        <GuessView :answer="wordOfTheDay" :guess="guess"/>
      </li>
      <li>
        <!-- Added datatype "string" here: `"(guess: string) =>...` to resolve the use of any TS datatype error. -->
        <GuessInput :disabled="IS_GAME_OVER" @guess-submitted="(guess: string) => guessesSubmitted.push(guess)"/>
      </li>
      <li v-for="i in countOfEmptyGuesses" :key="`remaining-guess-${i}`">
        <GuessView guess=""/>
      </li>
    </ul>

    <p v-if="IS_GAME_OVER"
       class="end-of-game-message"
       v-text="guessesSubmitted.includes(wordOfTheDay) ? VICTORY_MESSAGE : DEFEAT_MESSAGE">
    </p>
  </main>
</template>


<script lang="ts" setup>
import { computed, ref } from 'vue'
import { DEFEAT_MESSAGE, MAX_GUESSES_COUNT, VICTORY_MESSAGE } from '@/settings'
import englishWords from '@/assets/englishWordsWith5Letters.json'
import GuessInput from '@/components/GuessInput.vue'
import GuessView from '@/components/GuessView.vue'


const props = defineProps({
	wordOfTheDay: {
		type: String,
		required: true,
		validator: (wordGiven: string) => englishWords.includes(wordGiven)
	}
})

// `ref` is used to make primitive data types and values reactive
const guessesSubmitted = ref<string[]>([])

const IS_GAME_OVER = computed(() => {
		return guessesSubmitted.value.length === MAX_GUESSES_COUNT
			|| guessesSubmitted.value.includes(props.wordOfTheDay)
	}
)

const countOfEmptyGuesses = computed(() => {
	const guessesRemaining = MAX_GUESSES_COUNT - guessesSubmitted.value.length
	return IS_GAME_OVER.value ? guessesRemaining : guessesRemaining - 1
})
</script>

<style scoped>
main {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 3rem;
}

.end-of-game-message {
	font-size: 14px;
	animation: end-of-game-message-animation 700ms forwards;
	white-space: nowrap;
	text-align: center;
}

ul {
	list-style: none;
	margin: 0;
	padding: 0;
}

li {
	margin-bottom: 0.25rem;
}

@keyframes end-of-game-message-animation {
	0% {
		opacity: 0;
		transform: rotateZ(0);
	}
	100% {
		opacity: 1;
		transform: translateY(2rem);
	}
}
</style>