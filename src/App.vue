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
  <p>{{ WOTD }}</p>
  <WordleBoard wordOfTheDay="{{WOTD}}" />
</template>

