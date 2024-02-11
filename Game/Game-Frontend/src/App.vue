<template>
    <div id="game-card">
        <GameCard :gameData="gameData" :roundData="roundData" />
    </div>
</template>

<script>
import GameCard from './components/GameCard.vue';
export default {
    components: {
        GameCard,
    },
    data() {
        return {
            gameData: {
                gameId: "",
                status: "",
            },
            roundData: {
                roundNumber: 0,
            },
            ws: null, 
        };
    },
    created() {
        this.connectWebSocket();
    },
    methods: {
        connectWebSocket() {
            this.ws = new WebSocket('ws://localhost:4000');

            this.ws.onopen = () => {
                console.log('Game WebSocket Connected');
            };

            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log('Game WebSocket message:', data);
                if (data.type === 'status') {
                    this.gameData = data.message;
                } else if (data.type === 'roundStatus') {
                    this.roundData = data.message;
                }
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };

            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
            };
        },
    },
    beforeUnmount() {
        if (this.ws) {
            this.ws.close();
        }
    },
};
</script>
