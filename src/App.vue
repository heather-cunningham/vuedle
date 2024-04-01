<template>
	<VordleBoard :wordOfTheDay="WOTD" />
</template>

<script setup lang="ts">
import VordleBoard from './components/VordleBoard.vue'
import words from '@/assets/englishWordsWith5Letters.json'

function getRandomWotd() {
	const WOTD = words[Math.floor(Math.random() * words.length)]
	console.log(WOTD)
	return WOTD
}

const WOTD = getRandomWotd();

</script>

<style></style>


