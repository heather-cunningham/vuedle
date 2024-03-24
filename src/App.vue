<script setup lang="ts">
import WordleBoard from './components/WordleBoard.vue'
import words from '@/englishWordsWith5Letters.json'

function getRandomWotd() {
  const randomIndex: number = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

const WOTD: string = getRandomWotd();
</script>

<template>
  <p>This app and this Vue School online class sucked.  The "finished" app was hardcoded to one
    correct answer, and I can't seem to fix it.  Vue School is full of bs.</p>
  <p>{{ WOTD }}</p>
  <WordleBoard wordOfTheDay=WOTD />
</template>

