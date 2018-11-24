<!-- client/src/components/GameHistory.vue -->

<template>
  <div class="game-history">
    <button type="button"
      class="btn btn-secondary btn-sm"
      @click="backToGames">Back to Games</button>
    <div class="bs-component">
      <div>
        <span>Pulling to Start:</span>
        <div class="btn-group btn-group-toggle" data-toggle="buttons">
          <label class="btn btn-sm btn-secondary name" :class="{active: pullingToStart === teams[0].id}">
            <input type="radio" :value="teams[0].id" v-model="pullingToStart"> {{ teams[0].name }}
          </label>
          <label class="btn btn-sm btn-secondary name" :class="{active: pullingToStart === teams[1].id}">
            <input type="radio" :value="teams[1].id" v-model="pullingToStart"> {{ teams[1].name }}
          </label>
        </div>
      </div>
      <ul class="list-group">
        <li v-for="(point, index) in points" :key="point.id" class="list-group-item">
          <p class="d-flex justify-content-start align-items-center">
          <span :style="{color: point.scored_by.color}"><span class="name">{{ point.scored_by.name }}</span> {{ holds[index] ? 'Hold' : 'Break' }}</span>
          <span class="badge badge-pill ml-auto"
          :class="{'badge-primary': holds[index], 'badge-secondary': !holds[index]}">
            <span v-for="(value, key, index) in score[index]" :key="key">
              <span v-if="index === 0">{{ key }}&nbsp;</span>
              <span>{{ value }}</span>
              <span v-if="index === 0">&nbsp;-&nbsp;</span>
              <span v-if="index === 1">&nbsp;{{ key }}</span>
            </span>
          </span>
          </p>
          <small v-for="(team, index) in teams" :key="team.id">
            <span>{{ team.name }}:&nbsp;</span>
          <span v-for="(player, index) in point.players[team.id]" :key="player.id">
            <span>{{ player.lastName }}</span><span v-if="index+1 < point.players[team.id].length">,&nbsp;</span>
          </span>
          <span v-if="index+1 < teams.length">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          </small>
        </li>
        <li class="list-group-item" @click="routeToPoint(gameId)">+ (new point)</li>
      </ul>
    </div>
  </div>
</template>

<script>
import gStore from '@/services/gStore';
import ToggleButton from '@/components/base/ToggleButton';

export default {
  name: 'GameHistory',
  props: {
    gameId: {
      type: Number,
      required: true,
      default: () => 881417,
    },
  },
  components: {
    ToggleButton,
  },
  data() {
    return {
      teams: [],
      points: [],
      pullingToStart: 0,
    };
  },
  computed: {
    holds: function calcHolds() {
      let h = [];
      this.points.forEach((point, index) => {
        const defenseId = index === 0 ? this.pullingToStart : this.points[index-1].scored_by.id;
        h.push(defenseId === point.scored_by.id ? 0 : 1);
      });
      return h;
    },
    score: function calcScore() {
      let s = [];
      let acc = {};
      acc[this.teams[0].name] = 0;
      acc[this.teams[1].name] = 0;
      this.points.forEach((point) => {
        if (typeof acc[point.scored_by.name] === 'undefined') {
          acc[point.scored_by.name] = 1;
        } else {
          acc[point.scored_by.name] += 1;
        }
        s.push(Object.assign({}, acc));
      });
      return s;
    },
  },
  watch: {
    pullingToStart: function() { this.updatePulling(this.gameId, this.pullingToStart); },
  },
  mounted() {
    this.getGameHistory(this.gameId);
  },
  methods: {
    backToGames() {
      this.$router.push({
        name: 'Games',
      });
    },
    routeToPoint(gameId) {
      this.$router.push({
        name: 'Point',
        params: {
          gameId,
        },
      });
    },
    async getGameHistory(gameId) {
      try {
        const response = await gStore.fetchGameHistory(gameId);
        this.teams = response.data.data.Game[0].teams;
        const pullingToStart = response.data.data.Game[0].pullingId;
        this.pullingToStart = pullingToStart ? pullingToStart : 0;
        let points = response.data.data.Game[0].points;
        points.sort((a, b) => a.id - b.id);
        points = points.map((point) => {
          let t = {};
          this.teams.forEach((team) => {
            let playerArray = [];
            point.players.forEach((player) => {
              if (player.teams.map(pTeam => pTeam.id).indexOf(team.id) >= 0) {
                playerArray.push(player);
              }
            t[team.id] = playerArray;
            });
          });
          point.players = t;
          return point;
        });
        this.points = points;
      } catch (e) {
        // console.error(e);
      }
    },
    async updatePulling(gameId, pullingId) {
      try {
        await gStore.updatePulling(gameId, pullingId);
      } catch (e) {
        // console.error(e);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
