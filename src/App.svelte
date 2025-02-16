<script>
  import {Container} from '@sveltestrap/sveltestrap'
  import { route, Router } from "@mateothegreat/svelte5-router";
  import Home from './lib/Home.svelte'
  import Err from './lib/Err.svelte'

  const routes = [
    // Exact path
    {path: '/', component: Home},

    // Catch-all
    // This is optional, but if present it must be the last
    {path: '.*', component: Err},
]
</script>

<Container fluid>
  <Router {routes}/>
</Container>

<style>
  /* .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  } */
</style>
