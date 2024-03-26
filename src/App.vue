<template>
	<WordleBoard :wordOfTheDay="WOTD" />
</template>

<script setup lang="ts">
import WordleBoard from './components/WordleBoard.vue'
import words from '@/assets/englishWordsWith5Letters.json'

function getRandomWotd() {
	const randomIndex: number = Math.floor(Math.random() * words.length)
	return words[randomIndex]
}

const WOTD = getRandomWotd();

</script>

<style></style>


