<script lang="ts">
  import Tailwind from './Tailwind.svelte';
  import MenuRight from './components/MenuRight/index.svelte';
  import LineChart from './components/LineChart/index.svelte';
  import LayoutMenuOnRight from './components/LayoutMenuOnRight/index.svelte';
  import data from './services/data';
  import {windowSize} from "./store/stores";

  windowSize.update(() => {return {width: window.innerWidth, height: window.innerHeight}});
</script>

<Tailwind />

<div class="bg-gray-50 h-screen">
  <LayoutMenuOnRight>
    <LineChart color="#1EBD92" data={data} height={$windowSize.height * 0.7} width={0.7 * $windowSize.width} title="Progress" description="Orci, donec fames dolor non mi suspendisse quam id elementum sit non interdum massa quam hendrerit"/>
    <MenuRight title="Achats" data="+30%" dataCom="en 2021" commentaire="Orci, donec fames dolor non mi suspendisse quam id elementum sit non interdum massa quam hendrerit" width="30%"/>
  </LayoutMenuOnRight>
  
</div>

<style>
  :root {
    --svelte-rgb: 255, 62, 0;
  }
</style>