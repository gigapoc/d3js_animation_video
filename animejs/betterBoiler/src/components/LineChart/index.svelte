<style src='./style.scss'></style>

<script lang="ts">
    import anime from "animejs";
    import * as d3 from 'd3';
    import { ScaleLinear, scaleLinear, scaleBand, ScaleBand, curveBasis} from "d3";
    import { onMount } from "svelte";
    
    //Props
    export let data: {key: string, value: number}[];
    export let width: number, height: number;
    export let color: string;
    export let title: string;
    export let description: string;


    let margin = {
        top:0,
        bottom: 100,
        left:50,
        right:50
    };


    let xScale: ScaleBand<string> = scaleBand()
                    .domain(data.map(d => d.key))
                    .range([margin.left, width - margin.right]) as ScaleBand<string>;

    let values = data.map(d => d.value);
    let yScale: ScaleLinear<number, number, number> = scaleLinear()
                    .domain([0, 200])
                    .range([height - margin.bottom, margin.top]);

    let accessorX: (d: {key: string, value: number}) => number = (d) => xScale(d.key) || 0;
    let accessorY: (d: {key: string, value: number}) => number = (d) => yScale(d.value);
    let path = d3.line<{key: string, value: number}>()
                .curve(curveBasis)
                .x(accessorX)
                .y(accessorY)

    let el: SVGElement;
    let circle: SVGElement;
    let lineEl: SVGElement;
    let text: SVGElement;
    let textValue = "0";
    onMount(() => {
        let path = anime.path(el);
        anime({
            targets: el,
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'easeOutSine',
            duration: 4000,
            delay: function(el, i) { return i * 250 },
        });
        anime({
            targets: circle,
            translateX: path('x'),
            translateY: path('y'),
            rotate: path('angle'),
            easing: 'easeOutSine',
            duration: 4000
        })
        anime({
            targets: lineEl,
            x1: path('x'),
            x2: path('x'),
            y2: path('y'),
            easing: 'easeOutSine',
            duration: 4000
        })
        anime({
            targets: text,
            x: path('x'),
            easing: 'easeOutSine',
            duration: 4000,
            update: (anim) => {
                textValue = yScale.invert(+(lineEl.getAttribute('y2') || 0)).toFixed(0)
                text.setAttribute('x', +(text.getAttribute('x') || 0) - text.getBoundingClientRect().width / 2 + "px")
            }
        })
        anime({
            targets: "#titleLine",
            opacity: [0, 1],
            duration: 2000
        })
        
    })
</script>

<div id="lineChartRoot">
    <div id="titleLine">{title}</div>
    <svg  transform="translate({margin.left}, {margin.top})" width={width} height={height}>
        <g>
            <path 
                bind:this={el}
                d="{path(data) || ""}"
                fill="none"
                stroke="{color}"
                stroke-width={5}
            />
            <line bind:this={lineEl} x1={0} x2={0} y1={height - margin.bottom} y2={0} stroke="#CECECE" stroke-width={3} />
            <circle bind:this={circle} cx={0} cy={0} r={10} fill="#1EBD92" />
            <text bind:this={text} x={0} y={height - margin.bottom + 30} font-family="Manrope" font-size="30" fill="#1EBD92" font-weight="bold">{textValue}</text>
        </g>
    </svg>
    <div id="desc">
        {description}
    </div>
</div>