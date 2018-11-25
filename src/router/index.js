import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Games from '@/components/Games';
import GameHistory from '@/components/GameHistory';
import Point from '@/components/Point';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: { name: 'Games' },
    },
    {
      path: '/games',
      name: 'Games',
      component: Games,
    },
    {
      path: '/point/:pointId',
      name: 'Point',
      component: Point,
      props: (route) => {
        const pointId = Number.parseFloat(route.params.pointId, 10);
        if (Number.isNaN(pointId)) {
          return 0;
        }
        return { pointId };
      },
    },
    {
      path: '/:gameId/game-history',
      name: 'GameHistory',
      component: GameHistory,
      props: (route) => {
        const gameId = Number.parseInt(route.params.gameId, 10);
        if (Number.isNaN(gameId)) {
          return 0;
        }
        return { gameId };
      },
    },
  ],
});
