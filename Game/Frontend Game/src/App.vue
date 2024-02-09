<template>
    <div id="game-card">
        <GameCard :gameData="gameData" :roundData="roundData" />
    </div>
</template>
  
<script>
import GameCard from "./components/GameCard.vue";
import axios from "axios";

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
        };
    },
    created() {
        this.fetchGameData();
        this.fetchRoundData();
    },
    methods: {
        async fetchGameData() {
            try {
                const response = await axios.get("http://localhost:4000/topics/status");
                if (response.data && response.data.length > 0) {
                    const latestStatus = JSON.parse(response.data[response.data.length - 1]);
                    this.gameData = latestStatus;
                } else {
                    console.error("Response data is empty or undefined.");
                }
            } catch (error) {
                console.error("Error fetching game data:", error);
            }
        },
        async fetchRoundData() {
            try {
                const response = await axios.get("http://localhost:4000/topics/roundStatus");
                if (response.data && response.data.length > 0) {
                    const latestRoundStatus = JSON.parse(response.data[response.data.length - 1]);
                    this.roundData = latestRoundStatus;
                } else {
                    console.error("Response data is empty or undefined.");
                }
            } catch (error) {
                console.error("Error fetching round data:", error);
            }
        },
    },
};
</script>
  