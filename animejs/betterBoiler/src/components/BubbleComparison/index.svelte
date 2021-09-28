<style src="./style.scss"></style>

<script lang="ts">
    import anime from "animejs";
    import * as d3 from "d3";
import type { SvelteComponent } from "svelte";
    import { onMount } from "svelte/internal";

    //Background fill
    export let backgroundFill: string;
    //Total width and height of graph
    export let width: number, height: number;
    //Min and max of yScale and bubble size domains
    export let min: number = 0, max: number;
    //in pixels
    export let maxBubbleSize: number;

    //Data
    export let data: {key: string, value: number}[];


    //Theme
    //Bubbles
    export let bubblesColor: string;
    //Text in bubbles
    export let textColor: string = bubblesColor;
    //Color & opacity of polygons behind bubbles
    export let polygonsColor: string = bubblesColor;
    export let polygonsOpacity: number = 0.5;

    //Décrit le texte à ajouter en dessous de la valeur, sous la bulle
    export let textDescription: string;

    //Décrit le comparatif entre 2 bulles (en %)
    //Si undefined: pas de comparatif
    export let bubbleIncrease: {
        color: string;
        opacity: number; //Bubble opacity, between 0 and 1
        textColor: string;
        size: number; //Bubble size : pixels
        type: 'rect' | 'circle'; //Type of background
        fontSize: number;
        fontWeight: number;
    }
    |
    undefined = undefined;

    export let fontKey: {
        size: number;
        weight: number;
        marginBottom: number;
        color: string;
    } = {size: 16, weight: 500, marginBottom: 10, color: '#000'};
    export let fontValue:{
        size: number;
        weight: number;
        marginTop: number;
        color: string;
    } = {size: 16, weight: 500, marginTop: 15, color: '#000'};
    export let fontDescription: {
        size: number;
        weight: number;
        marginTop: number;
        color: string;
    } = {size: 16, weight: 500, marginTop: 30, color: '#000'};


    //Animation parameters
    // export let animationEnd: 'allInOnePlace';

    //D3 scales
    let bubbleScale = d3.scaleLinear().domain([min, max]).range([0, maxBubbleSize]);
    let minBubbleSize = bubbleScale(Math.min(...data.map(b => b.value)));
    let yScale = d3.scaleLinear().domain([min, max]).range([height - minBubbleSize - (fontDescription.marginTop + fontDescription.size), maxBubbleSize + (fontKey.size + fontKey.marginBottom) ]);
    let xScale = d3.scaleBand().domain(data.map(b => b.key)).range([minBubbleSize, width - maxBubbleSize])
    

    //REFS
    let bubbles: SVGElement[] = data.map(b => 1 as any);
    let textValue: SVGElement[] = data.map(b => 1 as any);
    let textKey: SVGElement[] = data.map(b => 1 as any);
    let textDesc: SVGElement[] = data.map(b => 1 as any);
    let polygons: SVGElement[] = data.map(b => 1 as any);
    let bubblesPercent: SVGElement[] = data.map(() => 1 as any);
    let bubblesPercentText: SVGElement[] = data.map(() => 1 as any);
    let rectanglesPercent: SVGElement[] = data.map(() => 1 as any);

    //ACCESSORS
    let xAccessor = (i: number) => (xScale(data[i].key) || 0) + xScale.bandwidth() / 2,
        yAccessor = (i: number) => yScale(data[i].value)

    let pointsFirst = (i: number) => {
        if (data[i + 1]) {
            let x1 = width/2,
                y1 = height/2 - bubbleScale(data[i].value),
                x2 = width/2,
                y2 = height/2 - bubbleScale(data[i+1].value),
                x3 = x2,
                y3 = height/2 + bubbleScale(data[i+1].value),
                x4 = x1,
                y4 = height/2 + bubbleScale(data[i].value);

            
            return x1 + " " + y1 + " " + x2 + " " + y2 + " " + x3 + " " + y3 + " " + x4 + " " + y4
        }
        return  ""
    }

    let pointsOnlyX = (i: number) => {
        if (data[i + 1]) {
            let x1 = xAccessor(i),
                y1 = height/2 - bubbleScale(data[i].value),
                x2 = xAccessor(i +1),
                y2 = height/2 - bubbleScale(data[i+1].value),
                x3 = x2,
                y3 = height/2 + bubbleScale(data[i+1].value),
                x4 = x1,
                y4 = height/2 + bubbleScale(data[i].value);

            return x1 + " " + y1 + " " + x2 + " " + y2 + " " + x3 + " " + y3 + " " + x4 + " " + y4
        }
        return  ""
    }

    let pointsEnd = (i: number) => {
        if (data[i + 1]) {
            let x1 = xAccessor(i),
                y1 = yAccessor(i) - bubbleScale(data[i].value),
                x2 = xAccessor(i +1),
                y2 = yAccessor(i+1) - bubbleScale(data[i+1].value),
                x3 = x2,
                y3 = yAccessor(i+1) + bubbleScale(data[i+1].value),
                x4 = x1,
                y4 = yAccessor(i) + bubbleScale(data[i].value);

            
            return x1 + " " + y1 + " " + x2 + " " + y2 + " " + x3 + " " + y3 + " " + x4 + " " + y4
            

        }
        return  ""
    }

    let bubblesPercentValues = (i: number) => {
        if (data[i + 1]) {
            let val = ((data[i+1].value - data[i].value)/data[i].value) * 100;
            return (val < 0 ? "- " : "+ ") + Math.abs(val).toFixed() + "%";
        }
        return "";
    }

    let bubblesCenterX = (i: number) => {
        if (data[i + 1]) {
            return (xAccessor(i) + xAccessor(i + 1)) / 2
        }
        return 0;
    }

    let bubblesCenterY = (i: number) => {
        if (data[i + 1]) {
            return (yAccessor(i) + yAccessor(i + 1)) / 2
        }
        return 0;
    }

    let bubblesSize = (i: number) => {
        if (data[i + 1]) {
            return bubbleIncrease?.size || 0
        }
        return 0;
    }

    
    //ANIMEJS
    onMount(async () => {

        let tl = anime.timeline({
            easing: "easeInOutQuart",
            duration: 700
        })

        let tlEnd = anime.timeline({
            easing: 'easeInOutQuart',
            duration: 700,
            delay: 2000
        })

        //X
        await tl
        .add({
            targets: [bubbles],
            cx: (el: SVGCircleElement, i: number) => xAccessor(i)
        }, 100)
        .add({
            targets: [textKey],
            x: (el: SVGElement, i: number) => xAccessor(i),
            opacity: [0, 1]
        }, 100)
        .add({
            targets: [textValue],
            x: (el: SVGElement, i: number) => xAccessor(i),
            opacity: [0, 1]
        }, 100)
        .add({
            targets: [textDesc],
            x: (el: SVGElement, i: number) => xAccessor(i),
            opacity: [0, 1]
        }, 100)
        .add({
            targets: bubblesPercentText,
            x: (el: SVGElement, i: number) => bubblesCenterX(i)
        }, 100)
        .add({
            targets: bubblesPercent,
            cx: (el: SVGElement, i: number) => bubblesCenterX(i),
            // r: (el: SVGElement, i: number) => bubblesR(i)
        }, 100)
        .add({
            targets: rectanglesPercent,
            x: (el: SVGElement, i: number) => bubblesCenterX(i) - (bubbleIncrease?.size || 0),
            width: (el: SVGElement, i: number) => bubblesSize(i) * 2
        }, 100)
        .add({
            targets: polygons,
            points: (el: SVGElement, i: number) => pointsOnlyX(i),
        }, 100)

        .add({
            targets: bubbles,
            cy: (el: SVGCircleElement, i: number) => yAccessor(i)
        }, 900)
        .add({
            targets: [textKey],
            y: (el: SVGElement, i: number) => yAccessor(i) - bubbleScale(data[i].value) - fontKey.marginBottom
        }, 900)
        .add({
            targets: [textValue],
            y: (el: SVGElement, i: number) => yAccessor(i) + bubbleScale(data[i].value) + fontValue.marginTop
        }, 900)
        .add({
            targets: [textDesc],
            y: (el: SVGElement, i: number) => yAccessor(i) + bubbleScale(data[i].value) + fontDescription.marginTop
        }, 900)
        .add({
            targets: bubblesPercentText,
            y: (el: SVGElement, i: number) => bubblesCenterY(i) + (bubbleIncrease?.fontSize || 0 ) * 0.3
        }, 900)
        .add({
            targets: bubblesPercent,
            cy: (el: SVGElement, i: number) => bubblesCenterY(i)
        }, 900)
        .add({
            targets: rectanglesPercent,
            y: (el: SVGElement, i: number) => bubblesCenterY(i) - (bubbleIncrease?.size || 0) / 2
        }, 900)
        .add({
            targets: polygons,
            points: (el: SVGElement, i: number) => pointsEnd(i)
        }, 900)
        .finished
        .then(() => tl.reverse())

    //    tl.reverse();

    })
</script>


<div id="container">
    <svg width={width} height={height} style={"background-color: "+ backgroundFill+ ";"}>
        {#each data as {key, value}, i}
            <text bind:this={textKey[i]} y={height/2 - bubbleScale(value) / 2 - 10} x={width/2} text-anchor="middle" fill={fontKey.color} style={"font-weight: " + fontKey.weight + "; font-size:" + fontKey.size + "px"}> {key} </text>
            <text bind:this={textValue[i]} y={height/2 - bubbleScale(value) / 2 + 10} x={width/2} text-anchor="middle" fill={fontValue.color} style={"font-weight: " + fontValue.weight + "; font-size:" + fontValue.size + "px"}>{value}</text>
            <text bind:this={textDesc[i]} y={height/2 - bubbleScale(value) / 2 + 20} x={width/2} text-anchor="middle" fill={fontDescription.color} style={"font-weight: " + fontDescription.weight + "; font-size:" + fontDescription.size + "px"}>{textDescription}</text>
            <polygon bind:this={polygons[i]} fill={polygonsColor} opacity={polygonsOpacity} points={pointsFirst(i)} />

            {#if bubbleIncrease}
                <g>
                    
                    {#if bubbleIncrease.type === "circle"}
                        <circle bind:this={bubblesPercent[i]} cx={width/2} cy={height/2} r={bubbleIncrease.size} fill={bubbleIncrease.color} opacity={bubbleIncrease.opacity}/>
                    {:else}
                        <rect bind:this={rectanglesPercent[i]} x={width/2} y={height/2 - bubbleIncrease.size / 2} width={bubblesSize(i) * 2} height={bubblesSize(i)} fill={bubbleIncrease.color} />
                    {/if}
                    <text 
                        bind:this={bubblesPercentText[i]} 
                        x={width/2} 
                        y={height/2 + 5} 
                        text-anchor="middle" 
                        fill={bubbleIncrease.textColor} 
                        style={"font-weight: " + bubbleIncrease.fontWeight + "; font-size:" + bubbleIncrease.fontSize + "px"}>

                        {bubblesPercentValues(i)}

                    </text>
                </g>
            {/if}
            
            
            <circle cx={width/2} cy={height/2} r={bubbleScale(value)} fill={bubblesColor} bind:this={bubbles[i]} />
        {/each}
    </svg>
</div>