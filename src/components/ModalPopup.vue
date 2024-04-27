<template>
	
	<div class="modal" v-if="showModal">
		<div class="modal-content">
			<span class="close" @click="showModal = false">&times;</span>
			<p v-text="props.guessSubmitted.includes(props.wordOfTheDay)
				? VICTORY_MESSAGE
				: DEFEAT_MESSAGE">
			</p>
		</div>
	</div>
	
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { DEFEAT_MESSAGE, VICTORY_MESSAGE } from '@/settings';

const showModal = ref(true);

const props = defineProps({
	wordOfTheDay: {
		type: String,
		required: true
	},
	guessSubmitted: {
		type: String,
		required: true
	}
});

</script>

<style>

.modal {
	display: block;
	position: fixed;
	z-index: 1;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow: auto;
	background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
	width: 40%;
	height: auto;
	margin: 15% auto;
	padding: 20px;
	font-size: 18px;
	text-align: center;
	background-color: #fefefe;
	border: 1px solid #888;
	border-radius: 12px;
	animation: end-of-game-message-animation 700ms forwards;
	white-space: nowrap;
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

.close {
	color: #aaa;
	float: right;
	font-size: 28px;
	font-weight: bold;
}

.close:hover,
.close:focus {
	color: black;
	text-decoration: none;
	cursor: pointer;
}

</style>