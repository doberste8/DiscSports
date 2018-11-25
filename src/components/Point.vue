<template>
  <div class="point">
    <button type="button"
      class="btn btn-secondary btn-sm"
      @click="backToGames(gameId)">Back to Game History</button>
    <div class="text-right">
      <span v-for="(value, key) in scores" :key="key">
        <span class="name name-sm align-bottom">{{ key }}</span>: {{ value }}&nbsp;&nbsp;&nbsp;&nbsp;
      </span>
    </div>
    <div v-for="team in gameData.teams" :key="team.id" class="text-center tb-margin">
      <h2 :style="{color: team.color}">{{ team.name }}</h2>
      <div>
        <toggle-button v-for="player in team.roster" :key="player.id" :label="player.firstName + ' ' + player.lastName"
          @click.native="enroll(team, player.id)"
          ref="btns"
          :disabled="team.playing.length >= 5 && team.playing.indexOf(player.id) === -1">
        </toggle-button>
      </div>
    </div>
    <div class="text-center tb-margin">
      <h2>Which Team Scored?</h2>
      <button v-for="team in gameData.teams" :key="team.id"
        class="btn btn-primary" @click="recordPoint(team.id)">
        <h2 class="name name-lg" :style="{color: team.color}">{{ team.name }}</h2>
      </button>
    </div>
  </div>
</template>

<script>
import gStore from '@/services/gStore';
import ToggleButton from '@/components/base/ToggleButton';

export default {
  name: 'Point',
  props: {
    pointId: {
      type: Number,
      required: true,
    },
  },
  components: {
    ToggleButton,
  },
  computed: {
    scores: function calcScores() {
      let v = {};
      if (this.gameData.points) {
        this.gameData.teams.map(el => el.name).forEach((el) => { v[el] = 0; });
        const t = this.gameData.points.map(el => el.scored_by.name);
        v = t.reduce((acc, curr) => {
          if (typeof acc[curr] === 'undefined') {
            acc[curr] = 1;
          } else {
            acc[curr] += 1;
          }
          return acc;
        }, v);
      }
      return v;
    },
    gameId: function parseGameId() {
      return Math.floor(this.pointId);
    }
  },
  data() {
    return {
      gameData: {},
    };
  },
  mounted() {
    this.getRosters(this.pointId);
  },
  methods: {
    enroll(team, pId) {
      const i = team.playing.indexOf(pId);
      if (i === -1) {
        team.playing.push(pId);
        gStore.enrollPoint(this.pointId, pId);
      } else {
        team.playing.splice(i, 1);
        gStore.unEnrollPoint(this.pointId, pId);
      }
      this.$forceUpdate();
    },
    backToGames(gameId) {
      this.$router.push({
        name: 'GameHistory',
        params: {
          gameId,
        },
      });
    },
    async getRosters(pointId) {
      try {
        const response = await gStore.fetchRosters(pointId);
        this.gameData = response.data.data.Point[0].game;
        let points = [];
        this.gameData.points.forEach(p => {
          if (p.scored_by) points.push(p);
          });
        this.gameData.points = points;
        this.gameData.teams[0].playing = [];
        this.gameData.teams[1].playing = [];
        this.gameData.teams[0].roster.sort((a, b) => {
          if (a.gender < b.gender) return -1;
          if (a.gender > b.gender) return 1;
          if (a.lastName < b.lastName) return -1;
          if (a.lastName > b.lastName) return 1;
          if (a.firstName < b.firstName) return -1;
          if (a.firstName > b.firstName) return 1;
          return 0;
        });
        this.gameData.teams[1].roster.sort((a, b) => {
          if (a.gender < b.gender) return -1;
          if (a.gender > b.gender) return 1;
          if (a.lastName < b.lastName) return -1;
          if (a.lastName > b.lastName) return 1;
          if (a.firstName < b.firstName) return -1;
          if (a.firstName > b.firstName) return 1;
          return 0;
        });
      } catch (e) {
        // console.error(e);
      }
    },
    async recordPoint(teamId) {
      try {
        await gStore.updatePoint(this.pointId, teamId);
        this.$refs.btns.forEach(i => i.reset());
        this.getRosters(this.gameId);
      } catch (e) {
        // console.error(e);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.toggled {
  background-image: -webkit-gradient(linear, left top, left bottom,
  from(#101112), color-stop(40%, #17191b), to(#1b1e20));
  background-image: linear-gradient(#101112, #17191b 40%, #1b1e20);
  background-repeat: no-repeat;
  -webkit-filter: none;
          filter: none;
}
.name-lg{
  width: 300px;
}
.name-sm{
  max-width: 140px;
  display: inline-block;
}
.tb-margin{
  margin-top: 20px;
  margin-bottom: 40px;
}
</style>
