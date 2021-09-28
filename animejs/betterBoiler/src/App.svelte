<script lang="ts">
  import Tailwind from './Tailwind.svelte';
  import MenuRight from './components/MenuRight/index.svelte';
  import LineChart from './components/LineChart/index.svelte';
  import BubbleComparison from './components/BubbleComparison/index.svelte';
  import LayoutMenuOnRight from './components/LayoutMenuOnRight/index.svelte';
  import data, {dataProgressLinear} from './services/data';
  import {windowSize} from "./store/stores";
import { map, max } from 'd3-array';
import { stratify } from 'd3-hierarchy';

  windowSize.update(() => {return {width: window.innerWidth, height: window.innerHeight}});
</script>

<Tailwind />

<div class="h-screen" background-color="#0B173D">
  <!-- <LayoutMenuOnRight>
    <LineChart color="#1EBD92" data={data} height={$windowSize.height * 0.7} width={0.7 * $windowSize.width} title="Progress" description="Orci, donec fames dolor non mi suspendisse quam id elementum sit non interdum massa quam hendrerit"/>
    <MenuRight title="Achats" data="+30%" dataCom="en 2021" commentaire="Orci, donec fames dolor non mi suspendisse quam id elementum sit non interdum massa quam hendrerit" width="30%"/>
  </LayoutMenuOnRight> -->
  
  <BubbleComparison backgroundFill="#0B173D"
                    height={$windowSize.height}
                    width={ $windowSize.width} 
                    bubblesColor="#F0E8DC" 
                    data={dataProgressLinear} 
                    min={0} 
                    max={Math.max(...dataProgressLinear.map(d => d.value))} 
                    maxBubbleSize={100} 
                    textDescription="inscrits"
                    polygonsOpacity={.2}
                    bubbleIncrease={{
                      opacity: .5,
                      color: "#E0B852",
                      textColor: "#F0E8DC9a",
                      size: 50,
                      type: "rect",
                      fontSize: 25,
                      fontWeight: 700
                    }}
                    fontKey={{
                      marginBottom: 30,
                      size: 50,
                      weight: 700,
                      color: '#F0E8DC8a'
                    }}
                    fontValue={{
                      color: "#F0E8DC",
                      size: 80,
                      weight: 700,
                      marginTop: 100
                    }}
                    fontDescription={{
                      color: "#F0E8DC8a",
                      size: 50,
                      weight: 500,
                      marginTop: 150
                    }}
                    />
  
</div>

<style>
  :root {
    --svelte-rgb: 255, 62, 0;
  }
</style>