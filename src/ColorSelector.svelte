<script>
export let r,g,b;
const backgroundColor = `background-color: rgb(${[r,g,b]});`;
</script>
<style>
#outer {
    display: block;
    height: 50px;
    padding: 5px;
}
#inner{
    border-width: 2px;
    border-radius: 5px;
    height: 100%;
    /*test*/
}
</style>
<div id="outer">
    <!-- <div id="inner" style="background-color: rgb({{ r, g, b }});"/> -->
    <div id="inner" style={backgroundColor}/>
</div>