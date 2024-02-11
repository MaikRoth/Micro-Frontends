<template>
    <div class="game-card">
        <h2>Game Status</h2>
        <p><strong>Game ID:</strong> {{ gameData.gameId || 'N/A' }}</p>
        <p><strong>Status:</strong> {{ gameData.status || 'N/A' }}</p>
        <p v-if="gameData.status === 'started'"><strong>Round Number:</strong> {{ roundData.roundNumber || 'N/A' }}</p>

    </div>
</template>
  
<script>
export default {
    props: {
        gameData: Object,
        roundData: Object,
    },
};
</script>
  
<style scoped>
.game-card {
    background-color: #f7f7f7;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    max-width: 300px;
    margin: 0 auto;
    text-align: center;
}

h2 {
    font-size: 20px;
    color: #333;
    margin-bottom: 10px;
}

p {
    font-size: 16px;
    margin: 5px 0;
    color: #666;
}

strong {
    font-weight: bold;
    color: #444;
}

.game-card.created {
    background-color: #ffe7b3;
}

.game-card.started {
    background-color: #b3ffb3;
}

.game-card.ended {
    background-color: #ff9999;
}
</style>
