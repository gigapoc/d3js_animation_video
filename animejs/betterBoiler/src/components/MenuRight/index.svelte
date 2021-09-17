<script lang="ts">
    import anime from "animejs";
    import {interpolateString} from "d3-interpolate"
    import {onMount} from "svelte";

    export let title: string, 
                data: string, 
                dataCom: string,
                commentaire: string;
    export let width: string;
    
    let setup = () => {
        let tm = anime.timeline({
            autoplay: true,
            duration: 200,
            easing: "spring(1, 80, 10, 0)"
        });
        tm.add({
            targets: "#menuRight",
            right: 0,
            ease: "linear"
        })
        tm.add({
            targets: ["#title", "#band"],
            opacity: "70%"
        })
        tm.add({
            targets: ["#data", "#dataCom"],
            innerHtml: ["+0%", data],
            keyframes: [
                {top: 0, opacity: "70%"}
            ]
        }, "-=400");

        tm.add({
            targets: "#commentaire",
            top: "30%"
        })

        tm.add({
            targets: ["#title", "#band"],
            opacity: [0.7, 1],
            color: ["#fff"],
            borderColor: "#fff"
        })
        tm.add({
            targets: ["#title", "#band"],
            opacity: [1, 0.7],
            color: ["#F7D0A7"],
            borderColor: "#F7D0A7"
        })

        tm.add({
            targets: ["#data", "#dataCom"],
            opacity: [0.7, 1],
            color: ["#fff"]
        })
        tm.add({
            targets: ["#data", "#dataCom"],
            opacity: [1, 0.7],
            color: ["#F7D0A7"]
        })

        tm.add({
            targets: "#commentaire",
            opacity: [0.7, 1],
            color: ["#fff"]
        })
        tm.add({
            targets: "#commentaire",
            opacity: [1, 0.7],
            color: ["#F7D0A7"]
        })
    }

    onMount(setup)
    
    

</script>


<style src="./style.scss">

</style>

<div id="menuRight" style="width: {width}">
    <div id="title">
        {title}
    </div>
    <div id="band"/>
    <div id="data">
        {data}
    </div>
    <div id="dataCom">
        {dataCom}
    </div>
    <div id="commentaire">
        {commentaire}
    </div>
</div>