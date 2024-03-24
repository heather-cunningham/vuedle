<script setup lang="ts">

import { ref } from 'vue'

defineProps<{
  wordOfTheDay: string
  victoryMsg: string
  defeatMsg: string
}>()

const guessInProgress = ref("")
const guessSubmitted = ref("")

</script>

<template>
    <input type="text" v-model="guessInProgress" @keydown.enter="guessSubmitted = guessInProgress" />
    <p v-if="guessSubmitted.length > 0"
    v-text="guessSubmitted === wordOfTheDay ? victoryMsg : defeatMsg">
    </p>
</template>


