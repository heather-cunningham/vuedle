<template>
	<VordleBoard :wordOfTheDay="WOTD" />
</template>

<script setup lang="ts">
import VordleBoard from './components/VordleBoard.vue'

function getRandomWotd() {
	// const WOTD = words[Math.floor(Math.random() * words.length)].toUpperCase()
	const WOTD = "SHUSH";
	//TODO: remove when done with entire game
	console.log(WOTD)
	return WOTD
}

const WOTD = getRandomWotd();
// const WOTD = "ERROR";

</script>

<style></style>


