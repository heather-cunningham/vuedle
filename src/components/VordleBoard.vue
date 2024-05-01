<template>
	
	<main>
		<div class="gameboard">
			<ul>
				<li v-for="(guess, index) in guessesSubmitted" :key="`${index}-${guess}`">
					<GuessView :answer="wordOfTheDay" :guess="guess" />
				</li>
				<li>
					<GuessInput :disabled="IS_GAME_OVER"
											@guess-submitted="(guess: string) => guessesSubmitted.push(guess)"
					/>
				</li>
				<li v-for="i in countOfEmptyGuesses" :key="`remaining-guess-${i}`">
					<GuessView guess="" />
				</li>
			</ul>
		</div>
		
		<div class="game-buttons">
				<GenericButton id="submitBtn" class="game-button" label="Submit" />
				<GenericButton id="resetBtn" class="game-button" label="Reset" />
		</div>
		
		<div>
			<ModalPopup :wordOfTheDay="wordOfTheDay"
									:guessSubmitted="guessesSubmitted[guessesSubmitted.length - 1]"
									v-if="IS_GAME_OVER" />
		</div>
	</main>
	
</template>


<script lang="ts" setup>
import { computed, ref } from 'vue';
import { MAX_GUESSES_COUNT } from '@/settings';
import englishWords from '@/assets/englishWordsWith5Letters.json';
import GuessInput from '@/components/GuessInput.vue';
import GuessView from '@/components/GuessView.vue';
import GenericButton from '@/components/GenericButton.vue';
import ModalPopup from '@/components/ModalPopup.vue';

const props = defineProps({
	wordOfTheDay: {
		type: String,
		required: true,
		validator: (wordGiven: string) => englishWords.includes(wordGiven)
	}
});

// `ref` is used to make primitive data types and values reactive
const guessesSubmitted = ref<string[]>([]);

const IS_GAME_OVER = computed(() => {
		return guessesSubmitted.value.length === MAX_GUESSES_COUNT
			|| guessesSubmitted.value.includes(props.wordOfTheDay);
	}
);

const countOfEmptyGuesses = computed(() => {
	const guessesRemaining = MAX_GUESSES_COUNT - guessesSubmitted.value.length;
	return IS_GAME_OVER.value ? guessesRemaining : guessesRemaining - 1;
});
</script>

<style scoped>
main {
	margin: 6%;
	display: flex;
	flex-direction: column;
	align-items: center;
	font-family: Roboto, Tahoma, Verdana, sans-serif;
}

.gameboard {
	/*margin: 0 3% 0 0;*/
	/*float: left;*/
	display: inherit;
	/*flex-direction: column;*/
}

ul {
	list-style: none;
	margin: 0;
	padding: 0;
}

li {
	margin-bottom: 0.25rem;
}

.game-buttons {
	margin: 6px 0 0 0;
	/*float: right;
	clear: both;*/
	display: inherit;
	/*flex-direction: column;*/
}

.game-button {
	margin: 0 3px 0 3px;
	width: 120px;
}

</style>